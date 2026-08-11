<div align="center">

# TabelaWebUI

**Shared theme and chrome for ianptkcs's web apps — Catppuccin (Latte/Mocha)
with a "reading someone's source file" aesthetic: mono carries the structure,
sharp borders, configurable accent.**

**English** · [Português](README.pt-BR.md)

[![SvelteKit](https://img.shields.io/badge/SvelteKit-Svelte-ff3e00?style=flat-square&logo=svelte&logoColor=white)](https://kit.svelte.dev)
[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-orange?style=flat-square&logo=cloudflare&logoColor=white)](https://workers.cloudflare.com)
[![License: AGPL-3.0](https://img.shields.io/badge/license-AGPL--3.0-blue?style=flat-square)](LICENSE)

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/ianptkcs)

</div>

---

## What it is

The web counterpart of [`tabelatuiui`](https://github.com/TabelaDev/tabelatuiui)
(the Bubble Tea TUIs): each app keeps only its own business logic, and the
library takes care of the theme and of the components everyone was redrawing
from scratch.

## Installation

Requires Svelte 5.

```bash
bun add @tabeladev/tabelawebui
```

## Usage

Import the theme once in the app and use the components:

```svelte
<script>
	import { Card, Table, Badge, Button, Status } from '@tabeladev/tabelawebui';
</script>

<Card title="Resumo" description="mês atual">
	<Status kind="success">configurado</Status>
	<Button variant="primary">+ Nova transação</Button>
	<Table columns={['Data', 'Descrição']} rows={[{ Data: '01/08', Descrição: 'Mercado' }]} />
</Card>
```

In the app's CSS (once):

```css
@import "@tabeladev/tabelawebui/theme.css";
```

## Components

| Component            | What it is                                                                                                                                                                                 |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `Card`               | panel with header (title/description) and content; composed API `Card.Header`/`Title`/`Description`/`Content`/`Footer`                                                                     |
| `TabCard`            | "file tab" panel (page chrome)                                                                                                                                                             |
| `Table`              | table with `columns`/`rows`, `cell` snippet, sort, global filter, selection, loading/skeleton, empty and pagination (with `pageSizeOptions`; `pageSize={0}` shows every row unpaginated)   |
| `Badge`              | small text tag — `default` / `secondary` / `outline` variants                                                                                                                              |
| `Button`             | `default` / `primary` / `ghost` / `danger` / `outline` variants, `size` (default/sm/lg/icon-sm), `href`, `loading`; `buttonVariants()`                                                     |
| `Panel`              | container with `focused` → accent border; `toggleable` collapsible                                                                                                                         |
| `Status`             | semantic `success` / `warning` / `error` / `info`, with optional `icon`                                                                                                                    |
| `Input`              | text field (`password`, `file` with `bind:files`, ...), `invalid`                                                                                                                          |
| `Textarea`           | multi-line text area (`bind:value`, `rows`, `resize: vertical`, `invalid`)                                                                                                                 |
| `Label`              | 13px mono label                                                                                                                                                                            |
| `Field`              | form wrapper: label + children (input/textarea/select) + optional error message                                                                                                            |
| `Radio`              | single choice: hidden input + circular indicator (accent when checked, focus via `:has()`)                                                                                                 |
| `Checkbox`           | multiple choice: hidden input + square with `✓`                                                                                                                                            |
| `Toggle`             | on/off switch (hidden checkbox + `switch` role, `invalid`)                                                                                                                                 |
| `Select`             | custom listbox with `options`, `bind:value`, `name`, keyboard navigation and `filter`                                                                                                      |
| `MultiSelect`        | multiple selection in a popover with checkboxes, `filter`, hidden input with `name`                                                                                                        |
| `Listbox`            | visible option list (single/multiple), `filter`, `checkmark`                                                                                                                               |
| `DatePicker`         | date/month picker with a calendar popover, `bind:value`, `min`/`max`, `locale`                                                                                                             |
| `Toaster`            | renders toasts + the `toast` store; configurable `position`                                                                                                                                |
| `Timeline`           | timeline (`TimelineItem`s with rail, dot, skills)                                                                                                                                          |
| `RuleCard`           | card with a top border, icon and serif prose                                                                                                                                               |
| `Nav`                | navbar: logo + breadcrumb links separated by `/`                                                                                                                                           |
| `ThemeToggle`        | toggles `data-theme`/`.dark` + `localStorage`                                                                                                                                              |
| `Dropdown`           | menu with a printed shadow; closes on outside click/Esc                                                                                                                                    |
| `Divider`            | horizontal/vertical line, `solid`/`dashed`, centered label                                                                                                                                 |
| `Eyebrow`            | uppercase mono section label                                                                                                                                                               |
| `BracketLink`        | mono `[ label ]` link, brackets light up on hover                                                                                                                                          |
| `Message`            | inline `info`/`success`/`warn`/`error` alert, `closable`, `life` (auto-dismiss)                                                                                                            |
| `ProgressBar`        | determinate/indeterminate progress bar with a label                                                                                                                                        |
| `ErrorPage`          | error page display (`status` in mono/accent, `title`, `description`, `homeHref`/`homeLabel`, `actions` snippet) — used inside `+error.svelte`                                              |
| `Skeleton`           | shimmer placeholder (`width`/`height`/`rounded`)                                                                                                                                           |
| `Tooltip`            | CSS tooltip via `data-tooltip` (`top`/`bottom`/`left`/`right`)                                                                                                                             |
| `Dialog`             | modal with overlay, `aria-modal`, Esc/outside to close, `footer` snippet                                                                                                                   |
| `Sidebar`            | side/`top`/`bottom` panel; `mode` overlay (drawer) or `push` (static, desktop), `collapsible`+`collapsed`, `overlay` off, breakpoint 768 (becomes a full-width drawer on mobile), animated |
| `Tabs`               | tab bar with bindable `value`, `disabled`, keyboard navigation                                                                                                                             |
| `Accordion`          | collapsible panels (`multiple`, bindable `value`)                                                                                                                                          |
| `Stepper`            | step indicator (onboarding) with bindable `value`                                                                                                                                          |
| `Carousel`           | carousel with bindable `page`, dots and arrows                                                                                                                                             |
| `Rating`             | stars (`max`, `readonly`, `cancel`)                                                                                                                                                        |
| `StatusPill`         | fixed toast-style pill (`position`, `closable`, bindable `visible`)                                                                                                                        |
| `FloatingActionPill` | clickable floating pill (`position`, `label`, `expanded` → `aria-expanded`) — StatusPill's styling, but a `<button>` that opens a panel/dialog                                             |
| `ChatMessage`        | chat bubble (`role` user/assistant, `content`, `name`, `streaming` → pulsing ellipsis) — presentational render, no SSE logic                                                               |
| `LandingHero`        | landing hero: eyebrow, `title` (string or snippet), `lead`, `actions`/`note`                                                                                                               |
| `SectionHeading`     | section title: eyebrow + h2 + lead                                                                                                                                                         |
| `LandingSteps`       | grid of numbered, coloured steps                                                                                                                                                           |
| `LandingFeatures`    | grid of cards with icon (snippet) + title + body                                                                                                                                           |
| `LandingRoadmap`     | "on the radar" badges with icon (snippet) + label                                                                                                                                          |
| `LandingFooter`      | footer: name, license, optional "view the code" link (`repoUrl` omitted → link hidden)                                                                                                     |
| `TerminalWindow`     | terminal window: dot bar + `title` + content (`children`)                                                                                                                                  |

## Tokens

The theme exposes `--twui-*` custom properties:

- Semantic: `--twui-paper`, `--twui-paper-raised`, `--twui-ink`,
  `--twui-ink-soft`, `--twui-ink-faint`, `--twui-rule`, `--twui-accent`,
  `--twui-accent-soft`, `--twui-signal`, `--twui-signal-soft`, `--twui-danger`
- Fonts: `--twui-font-mono`, `--twui-font-serif`
- Shadow: `--twui-shadow-offset` (hard 3px offset)
- Palette for the active flavour: `--twui-base`, `--twui-surface0`,
  `--twui-text`, `--twui-red`, `--twui-green`, `--twui-mauve`, ... (via
  `--twui-<color>`)
- Raw colours per flavour: `--twui-latte-*` and `--twui-mocha-*` (the full scale
  — neutrals + Catppuccin's 14 accents)

Dark theme via `[data-theme="dark"]` **or** a `.dark` class on `<html>`. The
theme applies `body` defaults (background, colour, serif font) and respects
`prefers-reduced-motion`.

## Per-app custom accent

The default accent is maroon (light) / pink (dark). Each app can have its own by
**picking a name** through `data-accent` on `<html>` — the library resolves the
Latte/Mocha pair automatically:

```html
<html data-accent="teal"></html>
```

`--twui-accent-soft` derives on its own (via `color-mix`); the semantic
`--twui-signal`/`--twui-danger` and the neutrals do not change. Available
accents:

| Accent             | Latte (light) | Mocha (dark) |
| ------------------ | ------------- | ------------ |
| `maroon` (default) | `#e64553`     | `#eba0ac`    |
| `mauve`            | `#8839ef`     | `#cba6f7`    |
| `pink`             | `#ea76cb`     | `#f5c2e7`    |
| `red`              | `#d20f39`     | `#f38ba8`    |
| `peach`            | `#fe640b`     | `#fab387`    |
| `yellow`           | `#df8e1d`     | `#f9e2af`    |
| `green`            | `#40a02b`     | `#a6e3a1`    |
| `teal`             | `#179299`     | `#94e2d5`    |
| `lavender`         | `#7287fd`     | `#b4befe`    |
| `rosewater`        | `#dc8a78`     | `#f5e0dc`    |
| `flamingo`         | `#dd7878`     | `#f2cdcd`    |
| `blue`             | `#1e66f5`     | `#89b4fa`    |
| `sky`              | `#04a5e5`     | `#89dceb`    |
| `sapphire`         | `#209fb5`     | `#74c7ec`    |

(Escape hatch: anyone needing a colour outside the list can override
`--twui-accent` directly in `layout.css`, in both themes.)

## Development

Stack: Svelte 5 + SvelteKit, Bun as the package manager.

```sh
bun install
bun run check   # typecheck (svelte-kit sync + svelte-check)
bun run lint    # prettier
bun run build   # svelte-package (dist)
```

The package is published to npm as `@tabeladev/tabelawebui`; versions follow
`CHANGELOG.md` and the convention in `CONTRIBUTING.md`.

## Tooling

- **MCP server** (`mcp/`): exposes components, tokens and accents as MCP tools
  for coding agents (props with types, light/dark `--twui-*`, `data-accent`).
  See `mcp/README.md` to install and run it.

## Requesting a component

Feature requests from other agents live in `requests/` as markdown files — see
`requests/README.md` for the flow, and `requests/_template.md` for what to fill
in. From outside this repo, open a feature request issue instead.

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for the version history.

## Support the project

- **Global**: [ko-fi.com/ianptkcs](https://ko-fi.com/ianptkcs)
- **Brazil (Pix)**: scan the QR below or copy the code

  <img src="pix-qr.png" alt="Pix QR" width="200" />

  <details><summary>Pix code (copy)</summary>

  ```
  00020126580014BR.GOV.BCB.PIX01365ad933b0-dcdc-4525-a736-0759902aeec65204000053039865802BR5925Ian Patrick da Costa Soar6009SAO PAULO62140510tQA85x6Dov63041FB6
  ```

  </details>

## License

[AGPL-3.0](LICENSE) — strong copyleft: you may use, modify and even host
TabelaWebUI commercially, but any modified version, including one running as a
network service (SaaS), has to stay open source under the same license.
