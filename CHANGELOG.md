# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
