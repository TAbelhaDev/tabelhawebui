# tabelawebui

Tema + chrome compartilhado dos apps web do ianptkcs — Catppuccin (Latte/Mocha)
com a estética "reading someone's source file": mono leva a estrutura, bordas
afiadas, accent nunca azul.

Equivalente web do [`tabelatuiui`](https://github.com/TabelaDev/tabelatuiui)
(os TUIs Bubble Tea): cada app mantém só o negócio dele; a lib cuida do tema e
dos componentes que todo mundo desenhava do zero.

## Instalação

Requer Svelte 5.

```bash
bun add tabelawebui
```

## Uso

Importe o tema uma vez no app e use os componentes:

```svelte
<script>
	import { Card, Table, Badge, Button, Status } from 'tabelawebui';
</script>

<Card title="Resumo" description="mês atual">
	<Status kind="success">configurado</Status>
	<Button variant="primary">+ Nova transação</Button>
	<Table columns={['Data', 'Descrição']} rows={[{ Data: '01/08', Descrição: 'Mercado' }]} />
</Card>
```

No CSS do app (uma vez):

```css
@import "tabelawebui/theme.css";
```

## Componentes

| Componente    | O que é                                                                                                                                          |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `Card`        | painel com header (título/descrição) e conteúdo; API composta `Card.Header`/`Title`/`Description`/`Content`/`Footer`                             |
| `TabCard`     | painel "aba de arquivo" (chrome de página)                                                                                                       |
| `Table`       | tabela com `columns`/`rows` e snippet `cell` custom                                                                                              |
| `Badge`       | tag de texto pequena — variantes `default` / `secondary` / `outline`                                                                             |
| `Button`      | variantes `default` / `primary` / `ghost` / `danger` / `outline`, `size` (default/sm/lg/icon-sm), `href`; `buttonVariants()` pra classes avulsas |
| `Panel`       | contêiner com `focused` → borda accent                                                                                                           |
| `Status`      | semântico `success` / `warning` / `error` / `info`                                                                                               |
| `Input`       | campo de texto (`password`, `file` com `bind:files`, ...)                                                                                        |
| `Label`       | rótulo mono 13px                                                                                                                                 |
| `Select`      | listbox custom com `options` (`{ value, label, disabled? }`), `bind:value`, `name`, navegação por teclado                                        |
| `DatePicker`  | seletor de data/mês com popover calendário, `bind:value`, `min`/`max`, `locale`                                                                  |
| `Toaster`     | renderiza toasts + store `toast` (`success`/`error`/`info`/`warning`, `action`)                                                                  |
| `Timeline`    | linha do tempo (`TimelineItem`s com trilho, dot, skills)                                                                                         |
| `RuleCard`    | cartão com borda-superior, ícone e prosa serif                                                                                                   |
| `Nav`         | navbar: logo + links em breadcrumb com `/`                                                                                                       |
| `ThemeToggle` | alterna `data-theme`/`.dark` + `localStorage`                                                                                                    |
| `Dropdown`    | menu via `<details>` com sombra impressa                                                                                                         |
| `Divider`     | divisor `// ---`                                                                                                                                 |
| `Eyebrow`     | label de seção mono uppercase                                                                                                                    |
| `BracketLink` | link mono `[ label ]`, colchetes acendem no hover                                                                                                |

## Tokens

O tema expõe custom properties `--twui-*`:

- Semânticos: `--twui-paper`, `--twui-paper-raised`, `--twui-ink`,
  `--twui-ink-soft`, `--twui-ink-faint`, `--twui-rule`, `--twui-accent`,
  `--twui-accent-soft`, `--twui-signal`, `--twui-signal-soft`, `--twui-danger`
- Fontes: `--twui-font-mono`, `--twui-font-serif`
- Sombra: `--twui-shadow-offset` (hard offset 3px)
- Paleta por flavor ativo: `--twui-base`, `--twui-surface0`, `--twui-text`,
  `--twui-red`, `--twui-green`, `--twui-mauve`, ... (via `--twui-<color>`)
- Cores cruas por flavor: `--twui-latte-*` e `--twui-mocha-*` (escala completa
  — neutros + 14 acentos do Catppuccin)

Tema escuro via `[data-theme="dark"]` **ou** classe `.dark` no `<html>`. O
tema aplica defaults de `body` (fundo, cor, fonte serif) e respeita
`prefers-reduced-motion`.
