# szpont-engine website

A portable, bilingual English/Polish presentation of [szpont-engine](https://github.com/dalkedev/szpont-engine). Static HTML, CSS and JavaScript, with a dependency-free Node build for localized pages and SEO metadata.

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

Product claims were checked against upstream v0.11.1 and documentation on 2026-11-11. Update the release link and installation command together when the supported version changes. Examples are synthetic and no real model, Discord account or VPS is connected to the page.

The repository logo is used without redrawing. Source artwork and social preview: `dalkedev/szpont-engine/assets/brand/`, under its included MIT license. Sora and IBM Plex Mono are distributed with their OFL licenses in `dist/assets/`.

## Domain

No domain has been chosen, purchased or connected. Naming clearance is pending. Once the name and domain are settled, set `SITE_URL` and rebuild before deployment.

## Preview access

The initial Sites deployment is owner-private. A public release and custom-domain connection can be performed when the owner chooses the final domain.
