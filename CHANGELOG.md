# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.14.2]

### Corrigido

- `Select`: escondida a scrollbar nativa do dropdown (`scrollbar-width: none`
  + `::-webkit-scrollbar { display: none }`) — o scroll continua por teclado/
  roda, sem a barra feia no visual mono. (Ficou de fora do 0.14.1 publicado.)

## [0.14.1]

### Corrigido

- `Table`: `pageSize={0}` (intenção: "sem paginação, mostra todas as linhas")
  zerava a lista — `slice((p-1)*0, p*0)` retornava `[]`. Agora `pageSize<=0`
  renderiza todas as linhas sem controles de paginação.

## [0.14.0]

### Corrigido

- `Nav`: o container `trailing` não tinha layout — dois ou mais controles
  (ex.: seletor de locale + toggle de tema) empilhavam verticalmente. Agora é
  `flex` com `gap`, ficam lado a lado.
- `TimelineItem`: o `dot` é um `<span>` inline, então `width`/`height` eram
  ignorados e `margin: auto` não centrava — renderizava como barra vertical
  fora do trilho. `display: block` corrige o círculo e o alinhamento com a
  linha.

### Alterado

- `RuleCard`: trocado o `border-top` (só a regra de cima) por borda completa
  `1px solid var(--twui-rule)` + `padding: 24px` + `background` elevado, no
  mesmo padrão dos cards da home (`TabCard`).

## [0.13.0]

### Melhorado (a11y)

- `Dialog`: focus trap (WCAG 2.4.3) — Tab circula dentro do modal sem escapar
  pro conteúdo atrás do overlay; foco inicial vai pro primeiro elemento
  focável do painel.
- `Stepper`: `aria-label` nos botões de passo (`Passo N de M: label`).

## [0.12.0]

### Adicionado

- `ErrorPage` — display de página de erro (`status` em mono/accent, `title`,
  `description`, botão `homeHref`/`homeLabel`, `actions` snippet) pra montar
  `+error.svelte` em apps SvelteKit. Ver `requests/20260809-error-page.md`.

## [0.11.0]

### Adicionado

- Accents `data-accent`: `blue`, `sky` e `sapphire` entram na lista
  selecionável — a regra da família "nunca azul" foi relaxada (o azul é uma
  opção como as demais).
- `Stepper`: `aria-current="step"` no passo atual (a11y).

## [0.10.0]

### Adicionado

- `ChatMessage` — bubble de mensagem de chat (`role` user/assistant, `content`,
  `name` com default por role, `streaming` → ellipsis pulsante quando sem
  conteúdo). Presentacional, sem lógica de API/SSE — extraído do TabelaFin.
  Ver `requests/20260808-chat-message.md`.

## [0.9.0]

### Adicionado

- `Sidebar` — responsiva + colapsável + overlay/animados:
  - `mode: 'overlay' | 'push'` — `push` entra no fluxo do layout (desktop) ≥
    768px e no mobile vira drawer overlay full-width (breakpoint fixo).
  - `collapsible` + `collapsed` bindable → rail (width `--twui-sidebar-width-collapsed`,
    default 48px), botão com `aria-expanded`.
  - `overlay={false}` remove o backdrop; animação fade+slide respeitando
    `prefers-reduced-motion`; largura via CSS vars
    (`--twui-sidebar-width`/`-collapsed`/`-mobile`).
  - Ver `requests/20260808-sidebar-responsive.md`.

## [0.8.0]

### Adicionado

- `FloatingActionPill` — pill flutuante clicável (estilo `StatusPill`, mas `<button>`):
  `position` (canto fixo), `label`/`expandedLabel` → `aria-label`, `expanded` →
  `aria-expanded`, sombra `--twui-shadow-offset` com press no clique (offset some).
  Pro extraída do TabelaFin (acesso ao chat de IA) — ver
  `requests/20260808-floating-action-pill.md`.

## [0.7.0]

### Adicionado

- `Field` — wrapper de formulário com `label` + children (input/textarea/select)
  - mensagem de erro opcional, usando os tokens do tema (`--twui-ink`/
    `--twui-danger`). Elimina o boilerplate repetido nas 8+ páginas de form do apps/site.

## [0.6.0]

### Adicionado

- Presets de accent por app: `data-accent="<nome>"` no `<html>` escolhe o par
  Latte/Mocha automaticamente (maroon, mauve, pink, red, peach, yellow, green,
  teal, lavender, rosewater, flamingo) — sem sobrescrever hex manual.

## [0.5.0]

### Adicionado

- `StatusPill` — pill fixa estilo toast (canto configurável, `closable`, `visible`
  bindable, `style`/`class` pra offset custom) extraída do TabelaFin.
- Primitivos de formulário: `Radio`/`Checkbox` (hidden input + indicador) e
  `Textarea` (espelha o `Input`).
- Absorção inspirada no PrimeNG (`docs/archive/ABSORCAO-PRIMENG.md`):
  - **Table v2** — sort por coluna (`aria-sort`), filtro global com `filterFields`,
    seleção de linha (`single`/`multiple`), loading com skeleton, estado vazio,
    paginação com `pageSizeOptions` (dropdown), `pageReport` com placeholders
    (`{first}`/`{last}`/`{totalRecords}`/`{currentPage}`/`{totalPages}`) e
    botões `«`/`»` (`showFirstLast`).
  - Tier 1: `Tabs` (teclado), `Toggle` (switch), `Dialog` (aria-modal, Esc/outside),
    `Tooltip` (CSS), `Skeleton`, `ProgressBar`.
  - Tier 2: `Message`, `Accordion`, `Rating`, `Sidebar`, `Stepper`, `Carousel`,
    `MultiSelect`, `Listbox`.
- Melhorias nos existentes: `Dropdown` fecha por fora/Esc; `Input`/`Textarea` com
  `invalid` (`aria-invalid`); `Button` com `loading`; `Panel` colapsável
  (`toggleable`); `Toaster` com `position`; `Divider` com `layout`/`type`/`label`;
  `Status` com `icon`; `Select` com `filter`.

### Corrigido

- `Table`: `style` de coluna agora emite `width: <valor>` em vez do valor cru
- `LandingFeatures`/`LandingRoadmap`: `icon` agora é **snippet-only** (`() => <Icon/>`).
  O discriminador `typeof icon === 'function'` era inválido — no Svelte 5 componente
  também é função, o que quebrava o SSR (500) quando um componente era passado como
  ícone. Não existe marcador runtime (`___snippet` é só AST do compiler); a API
  dual é impossível de discriminar com segurança.

## [0.3.0]

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
