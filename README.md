# szpont-engine website

A portable, bilingual English/Polish presentation of [szpont-engine](https://github.com/dalkedev/szpont-engine). Static HTML, CSS and JavaScript, no framework dependencies or build step.

## Run

```sh
npm run dev
```

Open http://127.0.0.1:4173. `npm run check` checks JavaScript syntax. Deploy the contents of `dist/` to any static hosting provider. The included Sites manifest selects `dist/`.

## Features

- English and Polish, selected with `?lang=en` / `?lang=pl` and persisted locally.
- Discord → self-hosted engine → tools architecture diagram.
- Scroll-controlled, three-step synthetic conversation; direct step controls on all devices.
- Ten integration disclosures with setup commands.
- Keyboard-accessible Markdown context tabs.
- Copyable offline quick start and links to complete upstream setup.
- Reduced-motion support and explicit motion control.
- Self-hosted fonts and artwork; no analytics or external runtime requests.

## Editing

`dist/index.html`: English copy, page structure and links. `dist/app.js`: Polish copy, interactive scenes, integration descriptions and file examples. `dist/style.css`: layout, motion and responsive styles.

Product claims were checked against upstream v0.11.1 and documentation on 2026-11-11. Update the release link and installation command together when the supported version changes. Examples are synthetic and no real model, Discord account or VPS is connected to the page.

The repository logo is used without redrawing. Source artwork and social preview: `dalkedev/szpont-engine/assets/brand/`, under its included MIT license. Sora and IBM Plex Mono are distributed with their OFL licenses in `dist/assets/`.

## Domain

No domain has been purchased or connected. Recommended: `szpont.dev`. On 2026-11-11 Vercel quoted 13 USD registration and annual renewal. `szpont-engine.com` and `szpontengine.com` were also available at 12.03 USD registration and annual renewal. Recheck before purchase. Replace absolute social-image metadata with the final origin when assigning a custom domain.

## Preview access

The initial Sites deployment is owner-private. A public release and custom-domain connection can be performed when the owner chooses the final domain.
