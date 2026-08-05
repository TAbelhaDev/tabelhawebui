<div align="center">

# tabelawebui

**Tema + chrome compartilhado dos apps web do ianptkcs (Catppuccin + estética
"reading someone's source file").**

[![npm version](https://img.shields.io/npm/v/tabelawebui?style=flat-square&color=CB3837)](https://www.npmjs.com/package/tabelawebui)
[![License: AGPL-3.0](https://img.shields.io/badge/license-AGPL--3.0-blue?style=flat-square)](LICENSE)
[![Built with Svelte](https://img.shields.io/badge/built%20with-Svelte-FF3E00?style=flat-square)](https://svelte.dev)

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/ianptkcs)

</div>

---

## O que é

O tema Catppuccin com a estética "reading someone's source file" — mono leva
a estrutura, bordas afiadas, accent nunca azul — e os componentes base em
Svelte 5 (Card, Table, Badge, Button, Panel, Status) usados nos apps web do
ianptkcs. O mesmo design system do [tabelatuiui](https://github.com/TabelaDev/tabelatuiui),
só que pra web.

## Instalação

```bash
npm install tabelawebui
# ou
bun add tabelawebui
```

## Uso

Importe o tema uma vez no app:

```css
@import "tabelawebui/theme.css";
```

E use os componentes:

```svelte
<script>
  import { Card, Table, Badge, Button } from 'tabelawebui';
</script>

<Button variant="primary">Salvar</Button>
```

O accent é sobrescrevível por app via CSS var `--twui-accent` (ou herdando do
seu próprio `[data-theme='dark']`).

## Desenvolvimento

```bash
bun install
bun run check   # typecheck (svelte-check)
bun run lint    # prettier
bun run build   # svelte-package → dist/
```

## Licença

[GNU AGPL-3.0](LICENSE).
