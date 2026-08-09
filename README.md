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

| Componente           | O que é                                                                                                                                   |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `Card`               | painel com header (título/descrição) e conteúdo; API composta `Card.Header`/`Title`/`Description`/`Content`/`Footer`                      |
| `TabCard`            | painel "aba de arquivo" (chrome de página)                                                                                                |
| `Table`              | tabela com `columns`/`rows`, snippet `cell`, sort, filtro global, selection, loading/skeleton, empty e paginação (com `pageSizeOptions`)  |
| `Badge`              | tag de texto pequena — variantes `default` / `secondary` / `outline`                                                                      |
| `Button`             | variantes `default` / `primary` / `ghost` / `danger` / `outline`, `size` (default/sm/lg/icon-sm), `href`, `loading`; `buttonVariants()`   |
| `Panel`              | contêiner com `focused` → borda accent; `toggleable` colapsável                                                                           |
| `Status`             | semântico `success` / `warning` / `error` / `info`, com `icon` opcional                                                                   |
| `Input`              | campo de texto (`password`, `file` com `bind:files`, ...), `invalid`                                                                      |
| `Textarea`           | área de texto multi-linha (`bind:value`, `rows`, `resize: vertical`, `invalid`)                                                           |
| `Label`              | rótulo mono 13px                                                                                                                          |
| `Field`              | wrapper de form: label + children (input/textarea/select) + mensagem de erro opcional                                                     |
| `Radio`              | opção única: input oculto + indicador circular (accent no checked, foco por `:has()`)                                                     |
| `Checkbox`           | opção múltipla: input oculto + quadrado com `✓`                                                                                           |
| `Toggle`             | switch on/off (hidden checkbox + role `switch`, `invalid`)                                                                                |
| `Select`             | listbox custom com `options`, `bind:value`, `name`, navegação por teclado e `filter`                                                      |
| `MultiSelect`        | seleção múltipla em popover com checkboxes, `filter`, hidden input com `name`                                                             |
| `Listbox`            | lista de opções visível (single/múltipla), `filter`, `checkmark`                                                                          |
| `DatePicker`         | seletor de data/mês com popover calendário, `bind:value`, `min`/`max`, `locale`                                                           |
| `Toaster`            | renderiza toasts + store `toast`; `position` configurável                                                                                 |
| `Timeline`           | linha do tempo (`TimelineItem`s com trilho, dot, skills)                                                                                  |
| `RuleCard`           | cartão com borda-superior, ícone e prosa serif                                                                                            |
| `Nav`                | navbar: logo + links em breadcrumb com `/`                                                                                                |
| `ThemeToggle`        | alterna `data-theme`/`.dark` + `localStorage`                                                                                             |
| `Dropdown`           | menu com sombra impressa; fecha por fora/Esc                                                                                              |
| `Divider`            | linha horizontal/vertical, `solid`/`dashed`, label central                                                                                |
| `Eyebrow`            | label de seção mono uppercase                                                                                                             |
| `BracketLink`        | link mono `[ label ]`, colchetes acendem no hover                                                                                         |
| `Message`            | alerta inline `info`/`success`/`warn`/`error`, `closable`, `life` (auto-dismiss)                                                          |
| `ProgressBar`        | barra de progresso determinada/indeterminada com label                                                                                    |
| `Skeleton`           | shimmer placeholder (`width`/`height`/`rounded`)                                                                                          |
| `Tooltip`            | tooltip CSS via `data-tooltip` (`top`/`bottom`/`left`/`right`)                                                                            |
| `Dialog`             | modal com overlay, `aria-modal`, Esc/outside pra fechar, `footer` snippet                                                                 |
| `Sidebar`            | painel lateral (`left`/`right`/`top`/`bottom`) com overlay                                                                                |
| `Tabs`               | barra de abas com `value` bindable, `disabled`, navegação por teclado                                                                     |
| `Accordion`          | painéis colapsáveis (`multiple`, `value` bindable)                                                                                        |
| `Stepper`            | indicador de passos (onboarding) com `value` bindable                                                                                     |
| `Carousel`           | carrossel com `page` bindable, dots e arrows                                                                                              |
| `Rating`             | estrelas (`max`, `readonly`, `cancel`)                                                                                                    |
| `StatusPill`         | pill fixa estilo toast (`position`, `closable`, `visible` bindable)                                                                       |
| `FloatingActionPill` | pill flutuante clicável (`position`, `label`, `expanded` → `aria-expanded`) — estilo do StatusPill, mas `<button>` que abre painel/dialog |
| `LandingHero`        | hero de landing: eyebrow, `title` (string ou snippet), `lead`, `actions`/`note`                                                           |
| `SectionHeading`     | título de seção: eyebrow + h2 + lead                                                                                                      |
| `LandingSteps`       | grid de passos numerados com cor                                                                                                          |
| `LandingFeatures`    | grid de cards com ícone (snippet) + título + body                                                                                         |
| `LandingRoadmap`     | badges "no radar" com ícone (snippet) + label                                                                                             |
| `LandingFooter`      | rodapé: nome, licença, botão "Ver o código"                                                                                               |
| `TerminalWindow`     | janela de terminal: barra de dots + `title` + conteúdo (`children`)                                                                       |

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

## Accent custom por app

O accent padrão é o marrom (claro) / pink (escuro). Cada app pode ter o seu
**escolhendo um nome** via `data-accent` no `<html>` — a lib resolve o par
Latte/Mocha automaticamente:

```html
<html data-accent="teal"></html>
```

O `--twui-accent-soft` deriva sozinho (via `color-mix`); os semânticos
`--twui-signal`/`--twui-danger` e os neutros não mudam. Acentos disponíveis
(seguindo a regra da família "nunca azul"):

| Accent             | Latte (claro) | Mocha (escuro) |
| ------------------ | ------------- | -------------- |
| `maroon` (default) | `#e64553`     | `#eba0ac`      |
| `mauve`            | `#8839ef`     | `#cba6f7`      |
| `pink`             | `#ea76cb`     | `#f5c2e7`      |
| `red`              | `#d20f39`     | `#f38ba8`      |
| `peach`            | `#fe640b`     | `#fab387`      |
| `yellow`           | `#df8e1d`     | `#f9e2af`      |
| `green`            | `#40a02b`     | `#a6e3a1`      |
| `teal`             | `#179299`     | `#94e2d5`      |
| `lavender`         | `#7287fd`     | `#b4befe`      |
| `rosewater`        | `#dc8a78`     | `#f5e0dc`      |
| `flamingo`         | `#dd7878`     | `#f2cdcd`      |

(Escape hatch: quem precisar de uma cor fora da lista pode sobrescrever
`--twui-accent` direto no `layout.css`, nos dois temas.)
