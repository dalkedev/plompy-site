import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { runInNewContext } from 'node:vm';

const projectDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const defaultOrigin = 'https://plompy.dev';
const repository = 'https://github.com/dalkedev/plompy-engine';
const voidTags = new Set('area base br col embed hr img input link meta param source track wbr'.split(' '));
const rawTextTags = new Set(['script', 'style', 'textarea', 'title']);
const escapeHTML = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);

// Offset-preserving parser for this explicitly closed static HTML template.
// Unlike a tag-pair regexp, the stack handles nested elements with the same tag.
// Attribute quotes, comments, raw-text elements and SVG self-closing tags are kept intact.
function parseHTML(html) {
  const nodes = [], stack = [];
  let cursor = 0;
  while (cursor < html.length) {
    const parent = stack.at(-1);
    if (parent && rawTextTags.has(parent.tag)) {
      const close = new RegExp(`</${parent.tag}\\s*>`, 'ig');
      close.lastIndex = cursor;
      const match = close.exec(html);
      if (!match) throw new Error(`Unclosed <${parent.tag}>`);
      parent.closeStart = match.index;
      parent.end = close.lastIndex;
      stack.pop();
      cursor = close.lastIndex;
      continue;
    }
    const start = html.indexOf('<', cursor);
    if (start === -1) break;
    if (html.startsWith('<!--', start)) {
      const end = html.indexOf('-->', start + 4);
      if (end === -1) throw new Error('Unclosed HTML comment');
      cursor = end + 3;
      continue;
    }
    let quote = null, end = start + 1;
    for (; end < html.length; end++) {
      const char = html[end];
      if (quote) { if (char === quote) quote = null; }
      else if (char === '"' || char === "'") quote = char;
      else if (char === '>') break;
    }
    if (end === html.length) throw new Error('Unclosed HTML tag');
    const opening = html.slice(start, end + 1);
    cursor = end + 1;
    if (/^<!|^<\?/.test(opening)) continue;
    const tagMatch = /^<(\/?)\s*([a-z][a-z0-9:-]*)\b/i.exec(opening);
    if (!tagMatch) continue;
    const tag = tagMatch[2].toLowerCase();
    if (tagMatch[1]) {
      const node = stack.pop();
      if (!node || node.tag !== tag) throw new Error(`Unexpected </${tag}>; expected </${node?.tag ?? 'none'}>`);
      node.closeStart = start;
      node.end = cursor;
      continue;
    }
    const attrs = Object.create(null);
    const attributeText = opening.slice(tagMatch[0].length, -1).replace(/\/\s*$/, '');
    const attrPattern = /([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g;
    for (const attr of attributeText.matchAll(attrPattern)) attrs[attr[1].toLowerCase()] = attr[2] ?? attr[3] ?? attr[4] ?? '';
    const node = { tag, attrs, start, openEnd: cursor, closeStart: cursor, end: cursor, parent: parent ?? null };
    nodes.push(node);
    if (!voidTags.has(tag) && !/\/\s*>$/.test(opening)) stack.push(node);
  }
  if (stack.length) throw new Error(`Unclosed <${stack.at(-1).tag}>`);
  return nodes;
}

function editHTML(html, edits) {
  const sorted = edits.sort((a, b) => b.start - a.start);
  let boundary = html.length;
  for (const edit of sorted) {
    if (edit.end > boundary) throw new Error('Overlapping HTML edits; do not nest data-i18n elements');
    html = html.slice(0, edit.start) + edit.value + html.slice(edit.end);
    boundary = edit.start;
  }
  return html;
}

function setAttribute(opening, name, value) {
  const pattern = new RegExp(`\\s+${name}(?:\\s*=\\s*(?:"[^"]*"|'[^']*'|[^\\s>]+))?`, 'i');
  const clean = opening.replace(pattern, '');
  return value === null ? clean : clean.replace(/\s*(\/?>)$/, ` ${name}="${escapeHTML(value)}"$1`);
}

const polishLabels = new Map([
  ['plompy-engine home', 'plompy-engine — strona główna'],
  ['plompy-engine on GitHub', 'plompy-engine na GitHubie'],
  ['Main navigation', 'Nawigacja główna'],
  ['Journey steps', 'Etapy podróży'],
  ['Discord, Plompy on your server, and your connected tools', 'Discord, Plompy na Twoim serwerze i podłączone narzędzia'],
  ['Say hello to Plompy', 'Przywitaj się z Plompy'],
  ['Language', 'Język'],
  ['Discord connects to plompy-engine on your Linux VPS, then to your chosen coding runner and tools.', 'Discord łączy się z plompy-engine na Twoim VPS z Linuksem, a następnie z wybranym agentem i narzędziami.'],
  ['Demonstration steps', 'Kroki demonstracji'],
  ['Coding runner', 'Agent do kodu'],
  ['Choose an integration', 'Wybierz integrację'],
  ['Agent context files', 'Pliki kontekstu agenta'],
]);

function setPageLanguage(html, language) {
  const edits = [];
  for (const node of parseHTML(html)) {
    let opening = html.slice(node.start, node.openEnd);
    if (node.tag === 'html') opening = setAttribute(opening, 'lang', language);
    if (language === 'pl' && polishLabels.has(node.attrs['aria-label'])) {
      opening = setAttribute(opening, 'aria-label', polishLabels.get(node.attrs['aria-label']));
    }
    if (node.attrs['data-lang']) {
      const selected = node.attrs['data-lang'] === language;
      if (node.tag === 'a') opening = setAttribute(opening, 'aria-current', selected ? 'page' : null);
      if ('aria-pressed' in node.attrs) opening = setAttribute(opening, 'aria-pressed', String(selected));
    }
    if (opening !== html.slice(node.start, node.openEnd)) edits.push({ start: node.start, end: node.openEnd, value: opening });
  }
  return editHTML(html, edits);
}

function readPolishDictionary(appSource) {
  const start = appSource.search(/(?:^|\n)const pl\s*=/);
  const tail = start < 0 ? '' : appSource.slice(start);
  const end = tail.search(/(?:^|\n)const integrations\s*=/);
  if (start < 0 || end < 0) throw new Error('Expected a standalone const pl dictionary before const integrations in dist/app.js');
  // Evaluate only the checked-in dictionary, never the browser application.
  // The isolated context has no browser, filesystem, process or module APIs.
  const json = runInNewContext(`${tail.slice(0, end)}\n; JSON.stringify(pl)`, Object.create(null), {
    timeout: 1000,
    contextCodeGeneration: { strings: false, wasm: false },
  });
  const dictionary = JSON.parse(json);
  if (!dictionary || Array.isArray(dictionary) || typeof dictionary !== 'object') throw new Error('Polish dictionary must be an object');
  return dictionary;
}

function translatePage(html, dictionary) {
  const nodes = parseHTML(html).filter(node => 'data-i18n' in node.attrs);
  const edits = nodes.map(node => {
    const key = node.attrs['data-i18n'];
    if (!Object.hasOwn(dictionary, key) || typeof dictionary[key] !== 'string') throw new Error(`Missing Polish translation: ${key}`);
    if (voidTags.has(node.tag)) throw new Error(`data-i18n cannot replace the contents of <${node.tag}>`);
    return { start: node.openEnd, end: node.closeStart, value: dictionary[key] };
  });
  const translated = editHTML(html, edits);
  parseHTML(translated); // Catch malformed markup in a translation before writing any files.
  return { html: translated, count: nodes.length };
}

const metadata = {
  en: {
    title: 'plompy-engine — Self-hosted Discord AI agent engine',
    description: 'Run AI coding agents from Discord on your own Linux server. Persistent sessions, Markdown context and tools you choose. Open-source TypeScript engine.',
    locale: 'en_US', alternateLocale: 'pl_PL',
    imageAlt: 'plompy-engine — Your agents. Your machine. Your rules.',
  },
  pl: {
    title: 'plompy-engine — Agenci AI na Discordzie, na Twoim serwerze',
    description: 'Uruchamiaj agentów AI z Discorda na własnym serwerze Linux. Trwałe sesje, kontekst w Markdown i wybrane narzędzia. Otwarty kod w TypeScript na licencji MIT.',
    locale: 'pl_PL', alternateLocale: 'en_US',
    imageAlt: 'plompy-engine — Twoi agenci. Twoja maszyna. Twoje zasady.',
  },
};

function replaceMetadata(html, language, origin) {
  const nodes = parseHTML(html), head = nodes.find(node => node.tag === 'head');
  if (!head) throw new Error('Missing <head>');
  const seoNodes = nodes.filter(node => node.parent === head && (
    node.tag === 'title' ||
    (node.tag === 'meta' && (['description', 'robots', 'googlebot'].includes(node.attrs.name?.toLowerCase()) || /^(og:|twitter:)/i.test(node.attrs.name ?? node.attrs.property ?? ''))) ||
    (node.tag === 'link' && (node.attrs.rel?.toLowerCase() === 'canonical' || (node.attrs.rel?.toLowerCase() === 'alternate' && 'hreflang' in node.attrs))) ||
    (node.tag === 'script' && node.attrs.id === 'site-structured-data')
  ));
  const retained = editHTML(html.slice(head.openEnd, head.closeStart), seoNodes.map(node => ({ start: node.start - head.openEnd, end: node.end - head.openEnd, value: '' })))
    .split('\n').filter(line => line.trim()).map(line => line.trimEnd()).join('\n');
  const meta = metadata[language];
  const rootURL = `${origin}/`, pageURL = language === 'pl' ? `${origin}/pl/` : rootURL;
  const imageURL = `${origin}/assets/social-preview.jpg`;
  const structured = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'WebSite', '@id': `${rootURL}#website`, name: 'plompy-engine', url: rootURL, inLanguage: ['en', 'pl'] },
      { '@type': 'SoftwareSourceCode', '@id': `${rootURL}#software`, name: 'plompy-engine', description: meta.description, url: pageURL,
        codeRepository: repository, license: `${repository}/blob/main/LICENSE`, programmingLanguage: 'TypeScript', runtimePlatform: 'Node.js on Linux' },
    ],
  };
  const json = JSON.stringify(structured, null, 2).replace(/</g, '\\u003c');
  const block = [
    `  <title>${escapeHTML(meta.title)}</title>`,
    `  <meta name="description" content="${escapeHTML(meta.description)}">`,
    '  <meta name="robots" content="index, follow, max-image-preview:large">',
    `  <link rel="canonical" href="${escapeHTML(pageURL)}">`,
    `  <link rel="alternate" hreflang="en" href="${escapeHTML(rootURL)}">`,
    `  <link rel="alternate" hreflang="pl" href="${escapeHTML(`${origin}/pl/`)}">`,
    `  <link rel="alternate" hreflang="x-default" href="${escapeHTML(rootURL)}">`,
    ...Object.entries({ type: 'website', site_name: 'plompy-engine', title: meta.title, description: meta.description, url: pageURL, locale: meta.locale, 'locale:alternate': meta.alternateLocale, image: imageURL, 'image:alt': meta.imageAlt }).map(([key, value]) => `  <meta property="og:${key}" content="${escapeHTML(value)}">`),
    ...Object.entries({ card: 'summary_large_image', title: meta.title, description: meta.description, image: imageURL, 'image:alt': meta.imageAlt }).map(([key, value]) => `  <meta name="twitter:${key}" content="${escapeHTML(value)}">`),
    `  <script type="application/ld+json" id="site-structured-data">\n${json}\n  </script>`,
  ].join('\n');
  return html.slice(0, head.openEnd) + '\n' + retained + '\n' + block + '\n' + html.slice(head.closeStart);
}

export async function buildPages({ distDir = resolve(projectDir, 'dist'), siteUrl = process.env.SITE_URL || defaultOrigin, write = true } = {}) {
  const url = new URL(siteUrl);
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.search || url.hash || url.pathname !== '/') {
    throw new Error('SITE_URL must be an http(s) origin without credentials, path, query or fragment');
  }
  const origin = url.origin;
  const [source, appSource] = await Promise.all([readFile(resolve(distDir, 'index.html'), 'utf8'), readFile(resolve(distDir, 'app.js'), 'utf8')]);
  const dictionary = readPolishDictionary(appSource);
  const translated = translatePage(source, dictionary);
  const pages = {
    'index.html': replaceMetadata(setPageLanguage(source, 'en'), 'en', origin),
    'pl/index.html': replaceMetadata(setPageLanguage(translated.html, 'pl'), 'pl', origin),
    'sitemap.xml': `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${escapeHTML(`${origin}/`)}</loc></url>\n  <url><loc>${escapeHTML(`${origin}/pl/`)}</loc></url>\n</urlset>\n`,
    'robots.txt': `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`,
  };
  if (write) {
    await mkdir(resolve(distDir, 'pl'), { recursive: true });
    for (const [path, content] of Object.entries(pages)) await writeFile(resolve(distDir, path), content);
  }
  return { pages, translatedElements: translated.count, origin };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const result = await buildPages();
  console.log(`Built English / and Polish /pl/ (${result.translatedElements} translated elements), sitemap.xml and robots.txt for ${result.origin}`);
}
