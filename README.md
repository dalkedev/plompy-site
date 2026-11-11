# plompy-engine website

A portable, bilingual English/Polish presentation of [plompy-engine](https://github.com/dalkedev/plompy-engine). Static HTML, CSS and JavaScript, with a dependency-free Node build for localized pages and SEO metadata.

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

Production origin: `https://plompy.dev`. Vercel serves the static `dist` output; the existing Sites deployment remains an owner-private preview. Rebuild metadata before publishing when the origin changes.
