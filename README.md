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

| Componente        | O que é                                                                                                                                  |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `Card`            | painel com header (título/descrição) e conteúdo; API composta `Card.Header`/`Title`/`Description`/`Content`/`Footer`                     |
| `TabCard`         | painel "aba de arquivo" (chrome de página)                                                                                               |
| `Table`           | tabela com `columns`/`rows`, snippet `cell`, sort, filtro global, selection, loading/skeleton, empty e paginação (com `pageSizeOptions`) |
| `Badge`           | tag de texto pequena — variantes `default` / `secondary` / `outline`                                                                     |
| `Button`          | variantes `default` / `primary` / `ghost` / `danger` / `outline`, `size` (default/sm/lg/icon-sm), `href`, `loading`; `buttonVariants()`  |
| `Panel`           | contêiner com `focused` → borda accent; `toggleable` colapsável                                                                          |
| `Status`          | semântico `success` / `warning` / `error` / `info`, com `icon` opcional                                                                  |
| `Input`           | campo de texto (`password`, `file` com `bind:files`, ...), `invalid`                                                                     |
| `Textarea`        | área de texto multi-linha (`bind:value`, `rows`, `resize: vertical`, `invalid`)                                                          |
| `Label`           | rótulo mono 13px                                                                                                                         |
| `Radio`           | opção única: input oculto + indicador circular (accent no checked, foco por `:has()`)                                                    |
| `Checkbox`        | opção múltipla: input oculto + quadrado com `✓`                                                                                          |
| `Toggle`          | switch on/off (hidden checkbox + role `switch`, `invalid`)                                                                               |
| `Select`          | listbox custom com `options`, `bind:value`, `name`, navegação por teclado e `filter`                                                     |
| `MultiSelect`     | seleção múltipla em popover com checkboxes, `filter`, hidden input com `name`                                                            |
| `Listbox`         | lista de opções visível (single/múltipla), `filter`, `checkmark`                                                                         |
| `DatePicker`      | seletor de data/mês com popover calendário, `bind:value`, `min`/`max`, `locale`                                                          |
| `Toaster`         | renderiza toasts + store `toast`; `position` configurável                                                                                |
| `Timeline`        | linha do tempo (`TimelineItem`s com trilho, dot, skills)                                                                                 |
| `RuleCard`        | cartão com borda-superior, ícone e prosa serif                                                                                           |
| `Nav`             | navbar: logo + links em breadcrumb com `/`                                                                                               |
| `ThemeToggle`     | alterna `data-theme`/`.dark` + `localStorage`                                                                                            |
| `Dropdown`        | menu com sombra impressa; fecha por fora/Esc                                                                                             |
| `Divider`         | linha horizontal/vertical, `solid`/`dashed`, label central                                                                               |
| `Eyebrow`         | label de seção mono uppercase                                                                                                            |
| `BracketLink`     | link mono `[ label ]`, colchetes acendem no hover                                                                                        |
| `Message`         | alerta inline `info`/`success`/`warn`/`error`, `closable`, `life` (auto-dismiss)                                                         |
| `ProgressBar`     | barra de progresso determinada/indeterminada com label                                                                                   |
| `Skeleton`        | shimmer placeholder (`width`/`height`/`rounded`)                                                                                         |
| `Tooltip`         | tooltip CSS via `data-tooltip` (`top`/`bottom`/`left`/`right`)                                                                           |
| `Dialog`          | modal com overlay, `aria-modal`, Esc/outside pra fechar, `footer` snippet                                                                |
| `Sidebar`         | painel lateral (`left`/`right`/`top`/`bottom`) com overlay                                                                               |
| `Tabs`            | barra de abas com `value` bindable, `disabled`, navegação por teclado                                                                    |
| `Accordion`       | painéis colapsáveis (`multiple`, `value` bindable)                                                                                       |
| `Stepper`         | indicador de passos (onboarding) com `value` bindable                                                                                    |
| `Carousel`        | carrossel com `page` bindable, dots e arrows                                                                                             |
| `Rating`          | estrelas (`max`, `readonly`, `cancel`)                                                                                                   |
| `StatusPill`      | pill fixa estilo toast (`position`, `closable`, `visible` bindable)                                                                      |
| `LandingHero`     | hero de landing: eyebrow, `title` (string ou snippet), `lead`, `actions`/`note`                                                          |
| `SectionHeading`  | título de seção: eyebrow + h2 + lead                                                                                                     |
| `LandingSteps`    | grid de passos numerados com cor                                                                                                         |
| `LandingFeatures` | grid de cards com ícone (snippet) + título + body                                                                                        |
| `LandingRoadmap`  | badges "no radar" com ícone (snippet) + label                                                                                            |
| `LandingFooter`   | rodapé: nome, licença, botão "Ver o código"                                                                                              |
| `TerminalWindow`  | janela de terminal: barra de dots + `title` + conteúdo (`children`)                                                                      |

## Tokens

O tema expõe custom properties `--twui-*`:

- Semânticos: `--twui-paper`, `--twui-paper-raised`, `--twui-ink`,
  `--twui-ink-soft`, `--twui-ink-faint`, `--twui-rule`, `--twui-accent`,
  `--twui-accent-soft`, `--twui-signal`, `--twui-signal-soft`, `--twui-danger`
- Fontes: `--twui-font-mono`, `--twui-font-serif`
- Sombra: `--twui-shadow-offset` (hard offset 3px)
- Paleta por flavor ativo: `--twui-base`, `--twui-surface0`, `--twui-text`,
  `--twui-red`, `--twui-green`, `--twui-mauve`, ... (via `--twui-<color>`)
- Cores cruas por flavor: `--twui-latte-*`, `--twui-frappe-*`, `--twui-macchiato-*`
  e `--twui-mocha-*` (escala completa — neutros + 14 acentos do Catppuccin)

## Temas (flavors do Catppuccin)

O tema expõe 4 flavors do Catppuccin, cada um ativado pelo `data-theme`:

| `data-theme`               | Flavor    | Tom                   |
| -------------------------- | --------- | --------------------- |
| (ausente) / `light`        | Latte     | claro                 |
| `frappe`                   | Frappé    | escuro (mais azulado) |
| `macchiato`                | Macchiato | escuro                |
| `dark` (ou classe `.dark`) | Mocha     | escuro (default)      |

O `ThemeToggle` alterna um par (`lightTheme`/`darkTheme`, default `light`/`dark`)
— um app pode usar outro flavor escuro, ex. `<ThemeToggle darkTheme="frappe" />`.
O tema aplica defaults de `body` (fundo, cor, fonte serif) e respeita
`prefers-reduced-motion`.
