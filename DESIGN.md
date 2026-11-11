---
name: plompy-engine
description: An animated connection with a playful Plompy fish mascot.
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
typography:
  display:
    fontFamily: "Sora, sans-serif"
    fontSize: "clamp(3.5rem, 6.7vw, 6rem)"
    fontWeight: 600
    lineHeight: 1.07
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
  demo: "14px"
  engine: "16px"
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
  demo-panel:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.paper}"
    rounded: "{rounded.demo}"
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

Depth comes from tonal surfaces, hairline borders and the server illustration’s restrained perspective. Motion explains the path between Discord, the user’s machine and tools. English and Polish share the same system, with responsive type and direct controls preserving the experience on small screens.

**Key Characteristics:**
- Graphite surfaces, warm paper and one orange accent.
- Large balanced headlines beside compact technical detail.
- Visible routes, thin rules and restrained rounded panels.
- Scroll-driven illustration with direct controls and reduced-motion support.

## Colors

The upstream orange and graphite identity is softened with warm paper and neutral gray supporting text. Frontmatter values are the normative palette; CSS custom properties in `dist/style.css` are the implementation source.

### Primary
- **Signal orange:** primary actions, route progress, active tab rules, selected integration titles and small status marks. The closing invitation uses an orange field with graphite content.
- **Orange hover:** the brighter primary-button hover treatment.

### Neutral
- **Graphite:** page background and text on orange or paper.
- **Panel:** inset demonstrations, editor and installation block.
- **Warm paper:** primary text on graphite and the customization section background.
- **Muted gray:** supporting copy and inactive controls on dark surfaces.
- **Paper muted:** secondary prose on the light section.
- **Line gray:** rules, panel edges and inactive routes.
- **Dark hover:** hover fill for the dark button on orange.

**The Contrast Rule.** Orange fields carry graphite text. The paper section uses graphite and paper-muted text; dark-surface muted text is not reused there.

## Typography

Sora is locally served for headings and prose, with regular and semibold faces. IBM Plex Mono is locally served under the CSS family name `Plex` for commands, filenames, line numbers and technical labels. Both use system fallbacks and `font-display: swap`.

Display and section headings use semibold weight, tight tracking and balanced wrapping. The hero uses the display token; story step titles are 40px on desktop and 27px on phones. Section headings become 34px on phones. The closing invitation has its own larger display treatment.

Reading copy is generally 13–15px, with a 16px desktop hero introduction and a 14px mobile introduction. Line height is spacious (1.8–1.9). Main explanatory columns stay around 340–410px wide. Labels and code are normally 11px; selected mobile metadata, file tabs and preformatted commands use 9–10px. These compact exceptions are not a body-text scale.

Below 600px, the English hero uses `clamp(2.1rem, 9.9vw, 3.8rem)` and Polish uses `clamp(2rem, 8.8vw, 3.2rem)` to accommodate its longer lines.

## Layout

The outer container is 1408px including desktop gutters, leaving a maximum 1280px content width. Gutters are 64px, then 40px at 1150px, 24px at 600px and 18px at 360px. Main section spacing steps from 130px to 90px at 850px and 70px at 600px.

Desktop layouts pair a large heading or narrative with an explanatory column or panel. The hero splits at a 1.2:1 ratio; the story and editor use 1:1.2. Integrations pair a two-column grid of ten tool selectors with one stable preview area. The preview contains the selected tool’s description, setup guide and copyable command; selecting another tool does not expand the page. At 850px the main navigation hides, the hero stacks, and customization and setup become single-column layouts. At 600px the tool grid sits above the preview while retaining two selector columns, and the network places Discord and the server above a row of three tool categories. FAQ answers are always visible: question and answer share a desktop row and stack on phones.

The desktop story scene is sticky beside three successive narrative steps. On phones it becomes a normal in-flow demonstration; its buttons select the matching narrative step. Preformatted installation commands scroll within their own block. Decorative orbits must remain inside the viewport.

## Elevation & Depth

The interface uses no box shadows. Tonal panels, one-pixel rules, nested server outlines and orbit rings create depth. The server illustration uses a slight perspective transform, returning to a straight view on hover. The editor is flat in the final implementation. Avoid adding ambient glow or a new shadow vocabulary.

## Shapes

Controls use compact rounded corners; larger functional panels have restrained 12–14px radii. The server uses 16px corners on desktop. Status marks and the server’s orbit rings are circular. Navigation, question-and-answer rows and tab strips remain predominantly linear, with thin dividers instead of pill containers.

## Components

### Buttons and text links

Primary buttons use orange with graphite text; the closing dark variant uses graphite with paper text. Desktop buttons have a 52px minimum height, 22px horizontal padding and an inline arrow. Hover brightens the fill and moves the button upward by 2px over 0.2 seconds. Underlined text links offer a lighter action treatment.

Focus is a visible 2px orange outline with 6px offset; the orange section uses a graphite outline. File tabs draw their outline inward to remain visible inside the clipped editor.

### Navigation and language

The header combines the Plompy logo, text navigation, EN/PL controls and a GitHub link. The selected language has an orange inset tile with graphite text, driven by `aria-current="page"`. EN and PL are native links to `/` and `/pl/`, each served as generated static HTML. Unselected language links and GitHub reveal a charcoal surface with an orange border on hover or keyboard focus. The GitHub icon tips slightly on pointer hover. The GitHub text label hides on phones while its accessible icon link remains.

Header navigation and every footer link, including the wordmark, turn orange and reveal an underline from left to right on hover or keyboard focus. Pointer hover raises them by 2px; pressing moves them down 1px and scales to 0.96. GitHub and language presses fill orange with graphite text. Transitions use 160–260ms ease-out, shortened to 70ms on press. Feedback preserves the existing layout footprint; footer links have 44px hit areas. Hover motion is limited to fine pointers and respects the global motion control. Focus retains the visible orange outline. A link's pressed state is momentary; only the language selector represents a persistent selection.

### Tool catalog and runner preview

Ten integration tabs remain visible in a compact two-column selector grid. The active tool has an orange border, icon and directional mark. Hover strengthens the border and fill; press gives a small immediate response. Keyboard arrows, Home and End move through the tool tabs, with one active tab in the tab order and its associated panel exposed beside the grid.

The stable preview panel shows the tool’s name, connection type, explanation, upstream setup guide, command and setup requirements. A separate runner selector previews commands for Codex, Claude Code or OpenCode; default and experimental labels remain visible. The selector changes a command preview only and does not configure an agent. Commands include the selected runner and have a copy action with accessible completion feedback. Custom MCP opens the integration menu because its own configuration is required.

FAQ content uses always-visible editorial rows with a small orange index, a question heading and its answer. No disclosure interaction is required to read it.

### Thread demonstration

The graphite panel contains a header, route line, three direct scene controls, synthetic chat content and status footer. The current route and tab underline use orange; the panel is explicitly labeled as illustrative. Desktop scrolling advances the scene and route progress. Direct scene controls remain available on every breakpoint.

### Markdown editor and installation block

The editor uses a dark panel against warm paper. Its four filename tabs have a selected orange underline, and the selected panel shows numbered Markdown with orange headings. Arrow keys, Home and End move among the tabs. The installation block shares the dark bordered container, with a separate header and copy action that reports completion accessibly.

### Motion

The hero repeats a complete ten-second route: orange request into the engine, sequential tool branches and a paper-colored reply back to Discord. Rack lights acknowledge tool activity. On phones a packet crosses the compact connector and tool icons acknowledge the sequence. The network’s loop pauses outside the viewport or while the document is hidden; cursor blinking remains finite. Scene changes use a 0.42-second entrance and the server uses a 0.7-second eased perspective transition. The global motion toggle disables animations, transitions and smooth scrolling, and removes decorative transforms. The initial setting honors `prefers-reduced-motion`; the explicit toggle can enable or pause motion. Demo navigation and content remain available with motion disabled.

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
- Don't let decorative orbits or preformatted commands widen the page on small screens.
- Don't shrink general reading copy to the diagram’s compact metadata scale.
