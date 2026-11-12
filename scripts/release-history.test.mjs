import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createReleaseHistory, releaseMarkdown, releaseIndexHtml } from './release-history.mjs';
import { buildDocs } from './build-docs.mjs';

const entry = (version, extra = {}) => ({ tag: `v${version}`, title: `Release ${version}`, publishedAt: version === '0.13.0' ? '2026-11-12T16:45:24Z' : '2026-11-11T22:43:20Z', prerelease: false, url: `https://github.com/dalkedev/plompy-engine/releases/tag/v${version}`, assets: [], ...extra });
const catalog = { schema: 1, repository: 'dalkedev/plompy-engine', checkedAt: '2026-11-12T17:00:00Z', latestStableTag: 'v0.13.0', releases: [entry('0.13.0'), entry('0.12.0')] };
const changelog = '# Changelog\n\n## Unreleased\n\n- Private development wording.\n\n## 0.14.0 (2026-11-13)\n\n- Not published yet.\n\n## 0.13.0 (2026-11-12): Local tools\n\n- Add local tools and durable artifacts.\n\n## 0.12.0 (2026-11-11): Plompy identity\n\n- Read the [migration guide](docs/migration-plompy.md).\n';

test('publication catalog gates changelog entries and latest stable status', () => {
  const history = createReleaseHistory(changelog, catalog);
  assert.deepEqual(history.releases.map(release => release.version), ['0.13.0', '0.12.0']);
  assert.equal(history.current.version, '0.13.0');
  assert.doesNotMatch(releaseIndexHtml(history), /0\.14\.0|Private development/);
  const prerelease = entry('0.14.0-rc.1', { prerelease: true, publishedAt: '2026-11-13T00:00:00Z' });
  const withPrerelease = createReleaseHistory(changelog + '\n## 0.14.0-rc.1\n\n- Candidate.\n', { ...catalog, releases: [...catalog.releases, prerelease] });
  assert.equal(withPrerelease.current.version, '0.13.0');
  assert.match(releaseIndexHtml(withPrerelease), />Prerelease</);
});

test('historical pages pin source links and explain their version boundary', () => {
  const history = createReleaseHistory(changelog, catalog);
  const markdown = releaseMarkdown(history.releases[1], history);
  assert.match(markdown, /historical release/);
  assert.match(markdown, /predates Plompy Local/);
  assert.match(markdown, /blob\/v0\.12\.0\/docs\/migration-plompy\.md/);
  assert.match(markdown, /\/docs\/releases\/0\.13\.0\//);
  assert.doesNotMatch(markdown, /0\.14\.0|Not published yet/);
});

test('fails closed for mismatched publication metadata and unsafe source links', () => {
  assert.throws(() => createReleaseHistory(changelog, { ...catalog, releases: [entry('0.99.0')] }), /no changelog entry/);
  assert.throws(() => createReleaseHistory(changelog, { ...catalog, latestStableTag: 'v0.99.0' }), /Latest stable/);
  assert.throws(() => createReleaseHistory(changelog, { ...catalog, releases: [entry('0.13.0', { draft: true })] }), /Draft/);
  assert.throws(() => createReleaseHistory(changelog, { ...catalog, releases: [entry('0.13.0', { assets: [{ name: 'kit', url: 'https://example.com/kit', size: 2 }] })] }), /asset URL/);
  const history = createReleaseHistory(changelog.replace('docs/migration-plompy.md', '../private.md'), catalog);
  assert.throws(() => releaseMarkdown(history.releases[1], history), /escapes repository/);
});

test('generates all version pages with metadata, search, source hashes and intact heading breaks', async t => {
  const root = await mkdtemp(join(tmpdir(), 'plompy-release-docs-')); t.after(() => rm(root, { recursive: true, force: true }));
  const engine = join(root, 'engine'), source = join(engine, 'docs/local'), dist = join(root, 'dist');
  await mkdir(source, { recursive: true }); await mkdir(join(engine, 'docs/releases'));
  const pages = [
    { slug: '', source: 'introduction.md', title: 'Introduction', description: 'Start here', group: 'Start' },
    { slug: 'releases', source: 'releases.md', title: 'Release history', description: 'Published releases', group: 'Start', kind: 'release-index' },
    ...['quickstart', 'other-clients', 'compatibility'].map(slug => ({ slug, source: `${slug}.md`, title: slug, description: slug, group: 'Start' })),
  ];
  await writeFile(join(source, 'navigation.json'), JSON.stringify({ version: 'Test', updated: '2026-11-12', releaseHistory: true, pages }));
  for (const page of pages) await writeFile(join(source, page.source), page.slug === '' ? '# Your agent.<br>A\u00a0little more reach.\n' : `# ${page.title}\n`);
  await writeFile(join(engine, 'CHANGELOG.md'), changelog); await writeFile(join(engine, 'docs/releases/catalog.json'), JSON.stringify(catalog));
  const result = await buildDocs({ sourceDir: source, distDir: dist });
  assert.equal(result.pages.length, 7); assert(result.releaseSources.changelog.hash); assert(result.releaseSources.catalog.hash);
  const html = await readFile(join(dist, 'docs/releases/0.13.0/index.html'), 'utf8');
  assert.match(html, /rel="canonical" href="https:\/\/plompy.dev\/docs\/releases\/0\.13\.0\/"/);
  assert.match(html, /"datePublished":"2026-11-12T16:45:24Z"/); assert.match(html, />Latest stable</);
  assert.match(html, /aria-label="Adjacent releases"/); assert.match(html, /Earlier release/);
  const search = JSON.parse(await readFile(join(dist, 'docs/search-index.json'), 'utf8'));
  assert(search.some(page => page.url === '/docs/releases/0.12.0/' && page.text.includes('migration guide')));
  assert(!search.some(page => page.url.includes('0.14.0')));
  const intro = await readFile(join(dist, 'docs/index.html'), 'utf8'); assert.match(intro, /Your agent\.<br>A\u00a0little more reach\./);
  const index = await readFile(join(dist, 'docs/releases/index.html'), 'utf8'); assert.match(index, /class="release-timeline"/); assert.match(index, /2 releases/);
});
