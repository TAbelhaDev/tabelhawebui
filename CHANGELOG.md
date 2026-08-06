# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Adicionado

- `Table`: paginação client-side via `pageSize` — slices das linhas, janela de
  páginas no rodapé, `aria-current` no ativo e `labels` configuráveis (i18n).

### Corrigido

- `Table`: `style` de coluna agora emite `width: <valor>` em vez do valor cru
- `LandingFeatures`/`LandingRoadmap`: `icon` agora é **snippet-only** (`() => <Icon/>`).
  O discriminador `typeof icon === 'function'` era inválido — no Svelte 5 componente
  também é função, o que quebrava o SSR (500) quando um componente era passado como
  ícone. Não existe marcador runtime (`___snippet` é só AST do compiler); a API
  dual é impossível de discriminar com segurança.

### Adicionado

- Seções de landing: `LandingHero`, `SectionHeading`, `LandingSteps`,
  `LandingFeatures`, `LandingRoadmap`, `LandingFooter`, `TerminalWindow` — para
  generalizar as landings duplicadas dos apps da família (tokens `--twui-*`,
  `class` pass-through, ícone como snippet).
- `Table`: colunas aceitam `{ key, label?, width? }` e prop `widths` (proporções
  relativas → `table-layout: fixed`).

## [0.2.0]

### Adicionado

- `DatePicker`: seletor de data/mês com popover calendário (`bind:value`, `min`/`max`,
  `locale`, `mode: 'date' | 'month'`, hidden input com `name`).
- Popovers (`Select`, `DatePicker`, `Dropdown`) usam a sombra impressa
  `--twui-shadow-offset` (hard offset 3px).

### Alterado

- **BREAKING — `Select`**: de `<select>` nativo (children `<option>`) para listbox
  custom com prop `options: { value, label, disabled? }[]`, `bind:value`, `name`,
  navegação por teclado (↑/↓/Enter/Esc) e `aria-label`/`label`.
- `DatePicker`/`Select`: strings visíveis configuráveis por prop (`placeholder`,
  `prevLabel`/`nextLabel`, `locale`) — i18n-neutro.

## [0.1.2]

### Adicionado

- Tema: fontes `--twui-font-mono`/`--twui-font-serif`, sombra `--twui-shadow-offset`,
  defaults de `body`, guarda `prefers-reduced-motion`, neutros Catppuccin
  (Latte/Mocha: base/mantle/crust/surface0-2/overlay0-2/subtext0-1/text) e aliases
  por flavor ativo (`--twui-base`, `--twui-surface0`, `--twui-text`, ...).
- Componentes de formulário: `Input` (incl. `type="password"`/`file`), `Label`,
  `Select`, `Toaster` + store `toast` (compatível com svelte-sonner no uso do TabelaFin).
- Componentes de chrome (portfolio): `TabCard`, `Timeline` + `TimelineItem`,
  `RuleCard`, `Nav`, `ThemeToggle`, `Dropdown`.
- Utilitários: `Divider`, `Eyebrow`, `BracketLink`.
- `Button`: `size` (default/sm/lg/icon-sm), `href` (renderiza `<a>`), variante
  `outline`, e `buttonVariants()` exportado.
- `Card`: API composta `Card.Header`/`Title`/`Description`/`Content`/`Footer`
  (mantendo a API simples de `title`/`description`).
- `Badge`: variantes `secondary` e `outline`.
- `prepublishOnly: bun run build` no package.json.
