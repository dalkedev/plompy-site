import assert from 'node:assert/strict';
import { posix } from 'node:path';

const repository = 'dalkedev/plompy-engine';
const github = `https://github.com/${repository}`;
const versionPattern = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/;
const escape = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
export const releaseRoute = version => `/docs/releases/${version}/`;
const dateLabel = date => new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
const sentence = text => text.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').replace(/[`*]/g, '').trim();
const excerpt = text => text.length > 210 ? text.slice(0, 207).replace(/\s+\S*$/, '') + '…' : text;

export function parseChangelog(markdown) {
  const headings = [...markdown.matchAll(/^## (.+)$/gm)];
  const entries = new Map();
  for (let index = 0; index < headings.length; index++) {
    const heading = headings[index];
    const match = /^(\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?)(?: \((\d{4}-\d{2}-\d{2})\))?(?:: (.+))?$/.exec(heading[1]);
    if (!match) continue; // Unreleased and other development sections are not releases.
    assert(!entries.has(match[1]), 'Duplicate changelog version.');
    const notes = markdown.slice(heading.index + heading[0].length, headings[index + 1]?.index ?? markdown.length).trim();
    assert(notes, `Empty changelog entry: ${match[1]}`);
    entries.set(match[1], { title: match[3], notes });
  }
  return entries;
}

export function createReleaseHistory(changelog, catalog) {
  assert.equal(catalog.schema, 1, 'Unsupported release catalog schema.');
  assert.equal(catalog.repository, repository, 'Unexpected release repository.');
  assert(Array.isArray(catalog.releases) && catalog.releases.length, 'No published releases.');
  const notes = parseChangelog(changelog), seen = new Set();
  const releases = catalog.releases.map(release => {
    const version = release.tag?.slice(1);
    assert(release.tag?.startsWith('v') && versionPattern.test(version), 'Unsafe release version.');
    assert(!seen.has(version), 'Duplicate published version.'); seen.add(version);
    assert.equal(release.url, `${github}/releases/tag/${release.tag}`, 'Unexpected release URL.');
    assert(Number.isFinite(Date.parse(release.publishedAt)), 'Invalid release date.');
    assert.equal(typeof release.prerelease, 'boolean', 'Release needs an explicit prerelease flag.');
    assert(!release.draft, 'Draft releases cannot enter the public history.');
    const entry = notes.get(version); assert(entry, `Published ${release.tag} has no changelog entry.`);
    const rawTitle = entry.title || release.title || `Release ${version}`;
    const title = rawTitle.charAt(0).toUpperCase() + rawTitle.slice(1);
    assert(!title.includes('\u2014'), 'Em dash in release title.');
    const assets = release.assets.map(asset => {
      assert(asset.url.startsWith(`${github}/releases/download/${release.tag}/`), 'Unexpected release asset URL.');
      assert(Number.isSafeInteger(asset.size) && asset.size >= 0, 'Invalid release asset size.');
      return asset;
    });
    const firstBullet = entry.notes.match(/^- (.+)$/m)?.[1] || title;
    return { ...release, assets, version, title, notes: entry.notes, summary: excerpt(sentence(firstBullet)), current: release.tag === catalog.latestStableTag };
  }).sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  const current = releases.find(release => release.current);
  assert(current && !current.prerelease, 'Latest stable release must be published and stable.');
  return { releases, current, checkedAt: catalog.checkedAt };
}

function pinChangelogLinks(notes, tag) {
  return notes.replace(/\[([^\]\n]+)\]\(([^\s)]+)\)/g, (original, label, href) => {
    if (/^https?:\/\//.test(href)) return original;
    if (href.startsWith('#')) return `[${label}](${github}/blob/${tag}/CHANGELOG.md${href})`;
    assert(!/^[a-z]+:/i.test(href), 'Unsupported changelog link scheme.');
    const path = posix.normalize(href.replace(/^\//, ''));
    assert(!path.startsWith('../'), 'Changelog link escapes repository.');
    return `[${label}](${github}/blob/${tag}/${path})`;
  });
}

export function releaseMarkdown(release, history) {
  const historical = release.current ? '' : `This is a ${release.prerelease ? 'prerelease' : 'historical release'}. Its notes describe this version, not the current setup. [See the latest stable release](${releaseRoute(history.current.version)}) before starting a new installation.\n\n`;
  const olderThanLocal = /^0\.(\d+)\./.exec(release.version)?.[1] < 13;
  const boundary = olderThanLocal ? 'This version predates Plompy Local. It covers the Discord engine; the separate local MCP gateway and starter kit arrive in 0.13.0.\n\n' : '';
  const oldName = /^0\.(\d+)\./.exec(release.version)?.[1] < 12 ? 'GitHub notes and assets for this version may use the earlier Szpont name. Historical filenames and source links are preserved.\n\n' : '';
  const downloads = release.assets.length ? release.assets.map(asset => `- [${asset.name}](${asset.url}) (${asset.size.toLocaleString('en-US')} bytes)`).join('\n') : 'This GitHub release has no separately uploaded download assets. Its source and published distribution details are linked from the release page.';
  return `# Plompy ${release.version}\n\n${release.title}\n\n${historical}${boundary}${oldName}## What changed\n\n${pinChangelogLinks(release.notes, release.tag)}\n\n## Downloads and source\n\n${downloads}\n\n[Original GitHub release](${release.url}) · [Source at ${release.tag}](${github}/tree/${release.tag}) · [Changelog at this tag](${github}/blob/${release.tag}/CHANGELOG.md)\n\n## Before you upgrade\n\nBack up private state and credentials, review the version's migration boundaries, and retain a compatible rollback snapshot. A release does not update an existing deployment automatically.\n\n${release.current ? '[Run locally with Docker](/docs/quickstart/) · [Connect your agent](/docs/other-clients/) · [Verification and limits](/docs/compatibility/)\n\n' : ''}[Full release history](/docs/releases/) · [Upgrade and rollback guide](${github}/blob/main/docs/releases.md#upgrade-and-rollback)\n`;
}

export function releaseMetadataHtml(release, history) {
  return `<div class="release-meta"><span class="release-badge${release.current ? ' is-current' : ''}">${release.current ? 'Latest stable' : release.prerelease ? 'Prerelease' : 'Historical release'}</span><time datetime="${escape(release.publishedAt)}">Published ${escape(dateLabel(release.publishedAt))}</time><a href="/docs/releases/">All ${history.releases.length} releases ↗</a></div>`;
}

export function releaseIndexHtml(history) {
  const latest = history.current;
  const kit = latest.assets.find(asset => asset.name === `plompy-local-${latest.version}.tar.gz`);
  return `<section class="release-feature" aria-labelledby="latest-release"><div class="release-feature-top"><span class="release-badge is-current">Latest stable</span><time datetime="${escape(latest.publishedAt)}">${escape(dateLabel(latest.publishedAt))}</time></div><span class="release-number" aria-hidden="true">${escape(latest.version)}</span><h2 id="latest-release">${escape(latest.title)}<span class="sr-only">, version ${escape(latest.version)}</span></h2><p>${escape(latest.summary)}</p><div class="release-actions"><a class="release-primary" href="${releaseRoute(latest.version)}">What’s new in ${escape(latest.version)} <span aria-hidden="true">↗</span></a>${kit ? `<a href="${escape(kit.url)}">Download Local starter kit ↓</a><a href="/docs/quickstart/">Run locally ↗</a>` : `<a href="${escape(latest.url)}">View on GitHub ↗</a>`}</div></section><section class="release-archive" aria-labelledby="published-versions"><div class="release-archive-heading"><h2 id="published-versions">Published versions</h2><span>${history.releases.length} releases</span></div><ol class="release-timeline">${history.releases.map(release => `<li><div class="release-timeline-date"><span class="release-version">${escape(release.version)}</span><time datetime="${escape(release.publishedAt)}">${escape(dateLabel(release.publishedAt))}</time>${release.current ? '<span class="release-badge is-current">Latest</span>' : release.prerelease ? '<span class="release-badge">Prerelease</span>' : ''}</div><div class="release-timeline-body"><h3><a href="${releaseRoute(release.version)}">${escape(release.title)}<span aria-hidden="true"> ↗</span><span class="sr-only">, version ${escape(release.version)}</span></a></h3><p>${escape(release.summary)}</p></div></li>`).join('')}</ol></section><section class="release-footnote" aria-labelledby="history-sources"><h2 id="history-sources">A record of what shipped</h2><p>Changes come from the engine changelog. Publication dates, download assets and the latest-stable label come from GitHub releases. Development-only entries stay out of this list.</p><a href="${github}/blob/main/CHANGELOG.md">Read the source changelog ↗</a></section>`;
}
