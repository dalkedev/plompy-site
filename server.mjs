import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';
import { docsRoute, isReleaseSlug } from './scripts/doc-routes.mjs';
const root = resolve('dist');
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.ttf': 'font/ttf', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.webp': 'image/webp', '.mp4': 'video/mp4', '.txt': 'text/plain', '.xml': 'application/xml' };
const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost');
    const pathname = decodeURIComponent(url.pathname);
    const slug = pathname.startsWith('/docs/') ? pathname.slice('/docs/'.length).replace(/\/$/, '') : '';
    const releasePage = isReleaseSlug(slug);
    if (releasePage && pathname.endsWith('/')) {
      res.writeHead(308, { Location: docsRoute(slug) + url.search }).end();
      return;
    }
    if (pathname === '/pl' || (pathname.startsWith('/docs') && !pathname.endsWith('/') && !extname(pathname))) { res.writeHead(308, { Location: pathname + '/' }).end(); return; }
    const file = resolve(root, '.' + (releasePage ? pathname + '/index.html' : pathname.endsWith('/') ? pathname + 'index.html' : pathname));
    if (!file.startsWith(root + sep)) { res.writeHead(403).end(); return; }
    const body = await readFile(file);
    res.writeHead(200, { 'Content-Type': types[extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-cache' }).end(body);
  } catch { res.writeHead(404).end('Not found'); }
});
const port = Number(process.env.PORT || 4173);
server.listen(port, '127.0.0.1', () => process.stdout.write(`Local: http://127.0.0.1:${port}\n`));
