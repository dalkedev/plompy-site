# plompy-engine website

A portable, bilingual English/Polish presentation of [plompy-engine](https://github.com/dalkedev/plompy-engine). Static HTML, CSS and JavaScript, with a dependency-free Node build for localized pages and SEO metadata. Website source: [dalkedev/plompy-site](https://github.com/dalkedev/plompy-site).

## Run

```sh
npm run build
npm run dev
```

Open [the English preview](http://127.0.0.1:4173/) or [the Polish preview](http://127.0.0.1:4173/pl/). `npm run check` checks JavaScript syntax. `npm run build` generates static language pages, canonical/hreflang metadata, structured data, robots.txt and sitemap.xml; rerun after source edits. Set `SITE_URL` to the final origin before building for a custom domain. See [SEO.md](SEO.md). Deploy the contents of `dist/` to any static hosting provider. The included Sites manifest selects `dist/`.

## Features

- Static English `/` and Polish `/pl/` pages, selected through native links with `aria-current`.
- Discord → self-hosted engine → tools → reply diagram with a continuous ten-second signal loop, mobile feedback and offscreen pause.
- Scroll-controlled, three-step synthetic conversation; direct step controls on all devices.
- Ten keyboard-accessible integration tabs with a stable preview panel, runner-specific command previews and copy controls.
- Always-visible answers about hosting, supported runners and recovery.
- Keyboard-accessible Markdown context tabs.
- Copyable offline quick start and links to complete upstream setup.
- Reduced-motion support and explicit motion control.
- Self-hosted fonts and artwork; no analytics or external runtime requests.

## Editing

`dist/index.html`: English copy, page structure and links. `dist/app.js`: Polish copy, interactive scenes, integration descriptions and file examples. `dist/style.css`: core layout, approved navbar/footer interactions and responsive styles. `dist/catalog.css`: tool catalog and visible FAQ layout. `dist/motion.css`: repeating signal animation. `dist/assets/`: local fonts, artwork and licenses. `scripts/build-pages.mjs`: static language pages and SEO output. Edit the English source and Polish dictionary, then rebuild; do not hand-edit generated `dist/pl/index.html`.

Product claims were checked against upstream v0.12.0 and documentation on 2026-11-11. Update the release link and installation command together when the supported version changes. Examples are synthetic and no real model, Discord account or VPS is connected to the page.

Plompy's mascot logo and social preview live in `dist/assets/`; the corresponding engine brand assets live in `dalkedev/plompy-engine/assets/brand/`. Keep these synchronized when the identity changes. Sora and IBM Plex Mono are distributed with their OFL licenses in `dist/assets/`.

Both language routes include a native footer link to [Buy Me a Coffee](https://buymeacoffee.com/dalkedev), without a third-party widget or tracking script.

## Domain

The selected project name is plompy-engine. The user purchased `plompy.dev`; the public website is live at https://plompy.dev on Vercel. DNS is managed at OVH, HTTPS is active, and `www` redirects to the apex domain. Google Search Console ownership is verified and https://plompy.dev/sitemap.xml successfully processed both language pages on 2026-11-12. `SITE_URL` defaults to the production origin.

## Preview access

The Sites deployment remains an owner-private preview at https://plompy-engine.violet-quail-2164.chatgpt.site. The Vercel custom domain is public.

## Ocean walkthrough

The hero uses the existing Plompy mascot and SVG connection paths. `ocean-hero.js` handles the greeting and visibility-based animation pause. `journey.js` maps native vertical scroll to a horizontal three-stage walkthrough on fine-pointer viewports at least 1000 × 650 px; mobile, touch and paused motion use normal vertical document flow. Stage controls are keyboard accessible. Both motion controls synchronize through `plompy:motion-toggle` and the document motion attribute. The global motion preference honors the operating system.

The hero's `plompy-eyes-base.png` is an image-generated derivative of the original mascot with only its pupils removed. Two SVG pupils preserve the original neutral expression and look toward a hovered, keyboard-focused or touched diagram control. Gaze is bounded inside each eye and returns to neutral after interaction; paused or reduced motion uses an immediate pose change. The original `logo.png` remains the shared static brand asset.

Production origin: `https://plompy.dev`. Vercel serves the static `dist` output; the existing Sites deployment remains an owner-private preview. Rebuild metadata before publishing when the origin changes.

## Local MCP documentation preview

The new `/docs/` field guide is generated from the engine repository's canonical
`docs/local/` Markdown. Edit that source, then rebuild this site with an explicit
source path:

```sh
npm run build -- --docs-source ../plompy-engine/docs/local
npm run check
npm run test:docs
npm run dev
```

`PLOMPY_DOCS_SOURCE` is an alternative to the flag. The generated HTML and search
index are portable static output in `dist/docs/`. There is no second manually
maintained Markdown copy in the website. `dist/docs/manifest.json` records the
source path within the engine, per-page source hashes and generated-page hashes.
It contains no local absolute paths or credentials.

A normal `npm run build` preserves and verifies the generated documentation so a
standalone site checkout can be deployed without checking out the engine beside
it. Direct edits to generated HTML fail the hash check. Content updates require
rebuilding from canonical Markdown. Changing `SITE_URL` also requires the source
path so existing documentation canonical URLs cannot silently remain on the old origin. `npm run check` verifies page metadata,
headings, internal routes and fragments, assets, search-index coverage and sitemap
coverage. The build's small Markdown renderer escapes raw HTML and rejects unknown
relative document links. An exact `<br>` inside the H1 supports intentional heading
line breaks; other raw HTML and embeds remain escaped.

Documentation source is English, following the engine contribution instructions.
The landing remains bilingual and links both languages to the English guide.
Documentation search runs entirely in the browser against a local static JSON
index. It performs no analytics, vendor calls or localhost MCP connections and
never requests API keys.

The guide includes client-neutral Docker setup, Codex, Claude Code, explicit
OpenCode V1/V2 configuration and Ollama as an optional model provider. Its
compatibility page records actual clients separately from deterministic model
fixtures and paid provider access.

The local gateway is a source-build preview on the engine's `main` branch.
Publishing this website does not publish a container image or a new engine
release. The guide separates existing released Discord mode, local source builds
and verification levels. Update its compatibility page from actual acceptance
evidence before a release; do not infer provider support from offline fixtures.

## Production deployment

The Vercel project is `plompy-engine` in `sculpttechprojects-projects` and owns
`plompy.dev`. Build and verify the site, commit both source changes and generated
documentation, then deploy this repository with `npm run build` and output
directory `dist`. Preserve the existing domain configuration. Verify `/docs/`,
client guides, search assets, `/pl/` and `sitemap.xml` on the production domain
after deployment. GitHub source and a Vercel READY deployment are separate checks.
