# Search and language setup

The site has two static language URLs: English at `/` and Polish at `/pl/`. Polish text is present in the HTML response, including elements marked `data-i18n`; it does not depend on JavaScript or a stored language preference. Each page has its own title, description, canonical URL, Open Graph and Twitter metadata, and `lang` value. Reciprocal `en`, `pl` and `x-default` links identify the language alternatives. English is the default.

The generator also writes a two-page XML sitemap, a crawl-permitting `robots.txt`, and JSON-LD describing the website and its MIT-licensed TypeScript source code. It adds no claims about ratings, customers or pricing. These technical signals do not guarantee indexing or a particular ranking.

## Build

From this directory, run:

```sh
node scripts/build-pages.mjs
```

The build reads `dist/index.html` as the English source and the standalone `const pl` dictionary in `dist/app.js`. Keep that dictionary before `const integrations`. Edit English copy and Polish translations in those sources, then rebuild; do not edit `dist/pl/index.html` directly. The build fails if a `data-i18n` element has no Polish translation. Do not nest elements carrying `data-i18n` inside other translated elements.

The parser preserves the original HTML and replaces complete element contents using tag offsets and a nesting stack. It supports quoted attributes, comments, raw script/style text, HTML void tags and SVG self-closing tags. This template uses explicit closing tags; malformed or implicitly closed nesting is rejected instead of silently producing broken pages. Only the local translation dictionary is evaluated in an isolated Node context; the browser application is not executed.

The build is idempotent: it replaces existing SEO metadata rather than appending duplicates. No npm dependencies are needed. `buildPages({ distDir, siteUrl, write: false })` can also be imported for checks without changing files.

The production origin defaults to `https://plompy.dev`, matching the public Vercel deployment. The owner-private Sites preview remains at `https://plompy-engine.violet-quail-2164.chatgpt.site`. A different deployment origin can be supplied at build time:

```sh
SITE_URL=https://example.com node scripts/build-pages.mjs
```

`SITE_URL` must be an origin, with no subdirectory, query, fragment or credentials. The generator uses it consistently for canonical links, language alternatives, social images, structured data, the sitemap and the robots sitemap location. The purchased `plompy.dev` domain is connected, HTTPS is active, and `www` redirects to the apex domain. When changing domains, configure the domain and redirects at the hosting layer, rebuild, and verify the live responses; setting `SITE_URL` alone does not connect a domain.

## Publication and verification

The Vercel deployment at `https://plompy.dev` is public. The separate Sites preview is private and is not the canonical destination. Search engines cannot crawl login-protected previews; `index, follow` and `Allow: /` do not override hosting access controls.

After each deployment, verify that `/`, `/pl/`, `/sitemap.xml`, `/robots.txt` and `/assets/social-preview.jpg` return the intended content to an unauthenticated request. Confirm that the host sends no `X-Robots-Tag: noindex` header. Language links must be ordinary links to `/` and `/pl/`; page language must follow the URL, without redirecting visitors based on browser settings or local storage. Inspect both pages with JavaScript disabled to confirm the core content remains present.

Google Search Console ownership was verified and `/sitemap.xml` processed both language pages on 2026-11-12. After domain changes, verify the new property, submit its sitemap, and inspect both language URLs. Check the rendered content, selected canonical and crawl access. Indexing can take time and is not guaranteed. Keep release requirements and integration support aligned with the project documentation when updating the page.

## References

- [Google: managing multilingual sites](https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites) — separate language URLs, consistent visible language and user-selected language links.
- [Google: localized page versions](https://developers.google.com/search/docs/specialty/international/localized-versions) — reciprocal, absolute `hreflang` links and `x-default`.
- [Google: technical requirements](https://developers.google.com/search/docs/essentials/technical) — public crawler access, successful HTTP responses and indexable content.
- [Google: crawling and indexing FAQ](https://developers.google.com/search/help/crawling-index-faq) — a sitemap does not guarantee indexing or improve rankings by itself.
