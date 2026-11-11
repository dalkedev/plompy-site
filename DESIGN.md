---
name: plompy-engine
description: A fish-led ocean journey from Discord through Plompy to connected tools.
colors:
  graphite: "#111315"
  panel: "#191c1e"
  paper: "#f3f0e8"
  muted: "#a7aaa6"
  orange: "#ff6b35"
  line: "#373b3c"
  orange-hover: "#ff875b"
  dark-hover: "#292c2e"
  paper-muted: "#565c59"
  aqua: "#9cded3"
  sea: "#152225"
  ocean-line: "#35494a"
typography:
  display:
    fontFamily: "Sora, sans-serif"
    fontSize: "clamp(3.5rem, 6.8vw, 6rem)"
    fontWeight: 600
    lineHeight: 1.04
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Sora, sans-serif"
    fontSize: "clamp(2.5rem, 4.5vw, 4rem)"
    fontWeight: 600
    lineHeight: 1.12
    letterSpacing: "-0.04em"
  title:
    fontFamily: "Sora, sans-serif"
    fontSize: "16px"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.025em"
  body:
    fontFamily: "Sora, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.8
  label:
    fontFamily: "Sora, sans-serif"
    fontSize: "11px"
    fontWeight: 400
  button:
    fontFamily: "Sora, sans-serif"
    fontSize: "13px"
    fontWeight: 600
  code:
    fontFamily: "Plex, monospace"
    fontSize: "11px"
    fontWeight: 400
    lineHeight: 2.2
rounded:
  badge: "3px"
  control: "6px"
  panel: "12px"
  preview: "14px"
  host: "13px"
spacing:
  icon-gap: "8px"
  compact: "12px"
  control-inset: "22px"
  mobile-gutter: "24px"
  tablet-gutter: "40px"
  desktop-gutter: "64px"
  section-mobile: "70px"
  section-tablet: "90px"
  section-desktop: "130px"
components:
  button-primary:
    backgroundColor: "{colors.orange}"
    textColor: "{colors.graphite}"
    typography: "{typography.button}"
    rounded: "{rounded.control}"
    padding: "0 22px"
  button-primary-hover:
    backgroundColor: "{colors.orange-hover}"
  button-dark:
    backgroundColor: "{colors.graphite}"
    textColor: "{colors.paper}"
    typography: "{typography.button}"
    rounded: "{rounded.control}"
    padding: "0 22px"
  button-dark-hover:
    backgroundColor: "{colors.dark-hover}"
  navigation:
    textColor: "{colors.muted}"
    padding: "14px 0"
  runner-badge:
    textColor: "{colors.muted}"
    rounded: "{rounded.badge}"
    typography: "{typography.label}"
    padding: "4px 5px"
  integration-preview:
    backgroundColor: "{colors.sea}"
    textColor: "{colors.paper}"
    rounded: "{rounded.preview}"
  editor:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.paper}"
    rounded: "{rounded.panel}"
  file-tab:
    textColor: "{colors.muted}"
    padding: "17px 12px"
---

# Design System: plompy-engine

## Overview

**Creative North Star: "An animated connection"**

An animated connection built around Plompy’s playful fish identity: graphite, warm paper and a precise orange signal. Large Sora headings give the page its voice; compact Plex commands, filenames and route labels make the technical detail legible. The Plompy mascot is the visual anchor.

The fish swims through an open ocean diagram linking Discord, Plompy on the user’s machine, coding agents, tools and Markdown memory. Aqua lines, drifting bubbles and wave-shaped section boundaries extend the ocean motif. A three-stage journey follows a request from Discord through the host and back to its saved result. English and Polish share the same system, with responsive type and direct controls preserving the experience on small screens.

**Key Characteristics:**
- Graphite surfaces, warm paper, orange actions and supporting aqua ocean details.
- Large balanced headlines beside compact technical detail.
- Visible routes, thin rules and restrained rounded panels.
- Scroll-driven illustration with direct controls and reduced-motion support.

## Colors

The upstream orange and graphite identity is softened with warm paper, neutral gray and aqua supporting detail. Frontmatter values describe the shared palette. `dist/style.css` and `dist/catalog.css` provide the base; `dist/ocean-hero.css`, `dist/journey.css` and `dist/reef.css` provide the final ocean treatments and responsive overrides.

### Primary
- **Signal orange:** primary actions, route progress, active tab rules, selected integration titles and small status marks. The closing invitation uses an orange field with graphite content.
- **Orange hover:** the brighter primary-button hover treatment.
- **Aqua:** supporting routes, connected-tool icons, motion detail and hover feedback. It complements orange without replacing primary action color.

### Neutral
- **Graphite:** page background and text on orange or paper.
- **Panel:** editor and installation block.
- **Sea:** the integration preview, with related dark teal surfaces in the journey.
- **Ocean line:** supporting ocean borders and decorative outlines.
- **Warm paper:** primary text on graphite and the customization section background.
- **Muted gray:** supporting copy and inactive controls on dark surfaces.
- **Paper muted:** secondary prose on the light section.
- **Line gray:** rules, panel edges and inactive routes.
- **Dark hover:** hover fill for the dark button on orange.

**The Contrast Rule.** Orange fields carry graphite text. The paper section uses graphite and paper-muted text; dark-surface muted text is not reused there.

## Typography

Sora is locally served for headings and prose, with regular and semibold faces. IBM Plex Mono is locally served under the CSS family name `Plex` for commands, filenames, line numbers and technical labels. Both use system fallbacks and `font-display: swap`.

Display and section headings use semibold weight, tight tracking and balanced wrapping. The ocean hero uses the display token. Journey headings use `clamp(2.4rem, 4.1vw, 3.7rem)` on larger screens, with a compact 2.8rem treatment for horizontal layouts up to 800px high and `clamp(2rem, 8vw, 2.8rem)` on phones. General section headings become 34px on phones. The closing invitation has its own larger display treatment.

Reading copy is generally 13–15px, with a 15px desktop hero introduction and a 14px mobile introduction (13px at the narrowest breakpoint). Line height is spacious (1.8–1.9). Main explanatory columns stay around 340–440px wide. New ocean and journey diagram labels, integration selector captions and runner badges stay at least 11px, including on narrow phones; wrapping and added space keep them readable. Existing mobile file tabs, footer metadata and installation commands retain a few 9–10px exceptions. These compact exceptions are not a body-text scale.

At 600px and below, the English ocean hero uses `clamp(3.25rem, 14vw, 4.8rem)` and Polish uses `clamp(2rem, 10.5vw, 3.5rem)` to accommodate its longer lines. At 360px and below these become 3.05rem and 10.5vw respectively.

## Layout

The outer container is 1408px including desktop gutters, leaving a maximum 1280px content width. Gutters are 64px, then 40px at 1150px, 24px at 600px and 18px at 360px. Main section spacing steps from 130px to 90px at 850px and 70px at 600px.

Desktop layouts pair a large heading or narrative with an explanatory column or panel. The ocean hero splits at a .85:1.15 ratio, becoming .9:1.1 at 1150px. Journey stages use a .9:1.1 text-to-visual ratio. Integrations pair two columns of ten open, ruled tool selectors with one stable preview area containing the selected tool’s description, setup guide and copyable command. At 850px the main navigation hides, the hero map moves below a two-column introduction, and customization and setup become single-column layouts. At 600px the introduction becomes one column and the tool grid sits above the preview while retaining two selector columns. The mobile ocean map keeps Discord at left, the fish and host in the center, and three destinations at right; its height increases to 490px, then 510px at 360px, to preserve readable labels. FAQ answers are always visible: question and answer share a desktop row and stack on phones.

The journey becomes a horizontal panorama only when the viewport is at least 1000px wide and 650px high, the pointer is fine, and motion is enabled. A sticky, full-height window moves three full-width stages horizontally as the document scrolls vertically; no wheel or touch events are intercepted. At smaller sizes, with a coarse pointer, or with motion paused, all three stages remain in normal vertical document flow. Stages stack text above the illustration at 650px. Direct Send, Work and Return controls scroll to the matching stage in either layout. Preformatted installation commands scroll within their own block. Decorative circles and bubbles must remain inside the viewport.

## Elevation & Depth

The interface uses no box shadows. Tonal ocean surfaces, one-pixel route lines, outlined bubbles and layered message sheets create depth. The fish remains the central hero illustration; the result sheet and follow-up message use small opposing rotations. The editor is flat. Wave silhouettes transition into the warm paper customization section and orange closing invitation. Avoid adding ambient glow or a new shadow vocabulary.

## Shapes

Controls use compact rounded corners; larger functional panels have restrained 12–14px radii. The journey host has 13px corners, while chat messages use asymmetric corners. Bubbles, tool icons and supporting diagram marks are circular. Navigation, integration selectors, question-and-answer rows and tab strips remain predominantly linear, with thin dividers instead of pill containers.

## Components

### Buttons and text links

Primary buttons use orange with graphite text; the closing dark variant uses graphite with paper text. Desktop buttons have a 52px minimum height, 22px horizontal padding and an inline arrow. Hover brightens the fill and moves the button upward by 2px over 0.2 seconds. Underlined text links offer a lighter action treatment.

Focus is a visible 2px orange outline with 6px offset; the orange section uses a graphite outline. File tabs draw their outline inward to remain visible inside the clipped editor.

### Navigation and language

The header combines the Plompy logo, text navigation, EN/PL controls and a GitHub link. The selected language has an orange inset tile with graphite text, driven by `aria-current="page"`. EN and PL are native links to `/` and `/pl/`, each served as generated static HTML. Unselected language links and GitHub reveal a charcoal surface with an orange border on hover or keyboard focus. The GitHub icon tips slightly on pointer hover. The GitHub text label hides on phones while its accessible icon link remains.

Header navigation and every footer link, including the wordmark, turn orange and reveal an underline from left to right on hover or keyboard focus. Pointer hover raises them by 2px; pressing moves them down 1px and scales to 0.96. GitHub and language presses fill orange with graphite text. Transitions use 160–260ms ease-out, shortened to 70ms on press. Feedback preserves the existing layout footprint; footer links have 44px hit areas. Hover motion is limited to fine pointers and respects the global motion control. Focus retains the visible orange outline. A link's pressed state is momentary; only the language selector represents a persistent selection.

### Tool catalog and runner preview

Ten integration tabs remain visible as open rows in a two-column selector grid, separated by bottom rules rather than enclosing cards. The active tool has an orange rule, circular icon outline and directional mark. Fine-pointer hover uses aqua on the rule and icon and lifts the icon slightly; press gives a small immediate response. Keyboard arrows, Home and End move through the tool tabs, with one active tab in the tab order and its associated panel exposed beside the grid.

The stable sea-colored preview panel has a restrained decorative circle and shows the tool’s name, connection type, explanation, upstream setup guide, command and setup requirements. A separate runner selector previews commands for Codex, Claude Code or OpenCode; default and experimental labels remain visible. The selector changes a command preview only and does not configure an agent. Commands include the selected runner and have a copy action with accessible completion feedback. Custom MCP opens the integration menu because its own configuration is required.

FAQ content uses always-visible editorial rows with a question heading and its answer. Index numbers are hidden in the final design. No disclosure interaction is required to read it.

### Ocean hero and request journey

The open hero map connects Discord to the Plompy fish on the user’s host and onward to coding agents, tools and Markdown memory. A dashed return route reinforces the reply path. Diagram destinations link to the relevant page sections. The fish is a keyboard-accessible button that displays a brief localized greeting. Its hover hint and greeting remain available with motion paused.

The journey has three complete illustrations: a Discord request saved to the queue, the selected runner working through Plompy on the Linux host, and a saved result followed by another request. Synthetic conversation examples are labeled as illustrative. The lower current line and swimming fish track horizontal scroll progress. Send, Work and Return buttons expose the selected stage through `aria-pressed`; Left/Right arrows, Home and End navigate them. Focusing a link in a later horizontal stage reveals that stage automatically. Every stage and its content remain available in the vertical fallback.

### Markdown editor and installation block

The editor uses a dark panel against warm paper. Its four filename tabs have a selected orange underline, and the selected panel shows numbered Markdown with orange headings. Arrow keys, Home and End move among the tabs. The installation block shares the dark bordered container, with a separate header and copy action that reports completion accessibly.

### Motion

Continuous ambient motion uses independently timed loops: the hero fish gently swims over 6.4 seconds, bubbles drift over seven seconds, and staggered orange and aqua route packets repeat over eight seconds. The journey has a five-second packet loop, six-second bubble drift and a 2.4-second fish animation; horizontal movement and route progress follow native document scrolling.

The hero and journey each pause their ambient animations when outside the viewport or while the document is hidden. The hero and journey motion buttons control the same global state and keep their labels, icons and `aria-pressed` values synchronized. The initial setting honors `prefers-reduced-motion`, and the explicit controls can enable or pause motion. Pausing disables animation, transitions and smooth scrolling, hides hero packets, and changes the journey to vertical flow. If paused during the horizontal journey, the nearest current stage is brought into view. Direct navigation, readable diagrams, integration selection and the fish greeting remain available.

## Do's and Don'ts

### Do:
- Do use the Plompy mascot and retain the graphite, paper and orange identity.
- Do use dark text on orange and dark body copy on paper.
- Do keep commands and filenames in Plex and explanatory prose in Sora.
- Do keep integration tabs, runner choices, file tabs and scene controls usable with a keyboard.
- Do preserve the illustrative-demo label and explicit motion control.

### Don't:
- Don't turn every content group into an elevated card; use the existing ruled rows and open layouts.
- Don't rely on scrolling or animation as the only way to reach a demonstration state.
- Don't let decorative bubbles, circles or preformatted commands widen the page on small screens.
- Don't shrink new diagram labels below 11px to fit a narrow viewport; give them room to wrap.
- Don't shrink general reading copy to the diagram’s compact metadata scale.
