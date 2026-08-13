# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.20.1]

### Fixed

- `AppShell` sidebar: the theme toggle now aligns left with the rest of the
  footer (perfil / tema / sair) instead of centering its content. The footer
  override lost the cascade to `ThemeToggle`'s own `justify-content: center`
  (equal specificity, later source order); the selector now pins the footer
  context so `flex-start` + `width: 100%` always win, matching the nav items.

## [0.20.0]

### Fixed

- `Timeline` keyed `{#each}` no longer crashes on duplicate `item.title`
  (Svelte `each_key_duplicate` during hydration). Items can now provide an
  optional stable unique `key` (`Timeline.ItemProps.key`); when omitted it
  falls back to the item index. Fixes blank `teaching` section in the
  portfolio, which has two entries titled `Math Teacher`.

## [0.19.0]

### Added

- `AppShell`: authenticated app shell as one compound export —
  `AppShell.Sidebar` (desktop: brand wordmark + nav with icons + theme toggle
  with label + logout form), `AppShell.BottomNav` (mobile), `AppShell.Content`
  (`max-w-6xl` container with responsive padding). Responsive at `lg`
  (1024px). Request: `requests/20260812-app-shell.md`.
- `Wordmark`: renders `Tabela` in the text color plus a `suffix` in accent,
  inheriting the context font/size — used in the shell and standalone (auth,
  marketing, hero). Request: `requests/20260812-app-shell.md`.
- `ThemeToggle` gains optional `showLabel` + `label` props for a visible
  "Tema claro"/"Tema escuro" text next to the icon (same
  `data-theme`/`.dark` + `localStorage` mechanism).

## [0.18.0]

### Breaking

- Landing components are exported as a single compound `Landing`:
  `Landing.Hero`/`Landing.Steps`/`Landing.Features`/`Landing.Roadmap`/
  `Landing.Footer`. The flat exports (`LandingHero`, `LandingSteps`,
  `LandingFeatures`, `LandingRoadmap`, `LandingFooter`) no longer exist.
  Request: `requests/20260811-landing-compound-export.md`.

### Added

- `LandingSteps` now renders each step as a `Card` with the number in a coloured
  box, matching `LandingFeatures` visual model (API unchanged).
  Request: `requests/20260811-landing-steps-card.md`.
- `LandingFooter` gains optional `tagline` prop (name + tagline + license,
  without repo link). Request: `requests/20260811-landing-footer-tagline.md`.
- `FileUpload`: file picker with drag-and-drop (`basic`/`advanced`), validation
  of `accept`/`maxFileSize`/`fileLimit`, per-file progress driven by the
  consumer, and the `customUpload` + `uploadHandler` pattern — the library
  performs no upload of its own. Request: `requests/20260811-file-upload.md`.

## [0.17.0]

### Breaking

- `Card` keeps only the composed API: `Card.Header`/`Card.Title`/`Card.Description`/`Card.Content`/`Card.Footer`.
  The simple props (`title`, `description`, `header`) are removed, and the standalone exports
  (`CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`) no longer exist —
  a single `Card` export is now the whole module.
- `TimelineItem` is no longer exported standalone; use `Timeline.Item`.

### Changed

- `Divider` no longer applies a default `margin` — spacing around a separator is
  the layout's job, so the primitive ships margin-free and consumers opt in via
  `class`.
- `src/lib/components/` is reorganized by domain: `card/`, `timeline/`, `table/`, `forms/`,
  `choice/`, `actions/`, `feedback/`, `overlay/`, `navigation/`, `layout/`, `landing/`, `chat/`.
  The public exports are unchanged apart from the two breaking items above.
- The MCP catalog parser follows the new paths and exposes the composed sub-parts
  (`Card.Header`, `Timeline.Item`).

## [0.16.1]

### Changed

- `LandingFooter`: `repoUrl` is now optional — the "view the code" link is hidden
  when omitted, so closed-source products can use the footer without a repo link.
  Request: `requests/20260811-landing-footer-sem-repo.md`.

## [0.15.1]

> From this entry on the changelog is written in English, per the language
> convention now carried by tabelascaffold. Earlier entries are left as the
> historical record rather than retranslated.

### Changed

- README and CONTRIBUTING are bilingual: English is canonical (it is what GitHub
  and the npm package page render) with a `.pt-BR.md` half beside each and a
  selector at the top. The README also documents the `requests/` flow, which
  existed but was only discoverable by finding the directory.

## [0.15.0]

### Adicionado

- Suíte de testes de componente (Vitest + Testing Library): 18 testes cobrindo
  `Tooltip`, `Select` e `Table` — render, navegação por teclado e o contrato de
  props que o MCP anuncia. A lib estava publicada no npm e consumida por cinco
  apps sem nenhum teste.
- Rota de showcase (`bun run dev`): todos os componentes numa página só, com
  toggle de tema, pra conferir claro e escuro lado a lado. Não vai pro pacote —
  o build é `svelte-package`, que só empacota `src/lib`.
- O CI passou a rodar os testes da lib e os do sub-pacote `mcp/`. O teste do MCP
  já existia e nenhum workflow o executava.

### Corrigido

- `Tooltip`: o label vivia num `::after` alimentado por `attr(data-tooltip)`,
  que não entra na árvore de acessibilidade — era invisível pra leitor de tela.
  Agora é um elemento real com `role="tooltip"`, ligado por `aria-describedby`,
  dispensável com `Esc` (WCAG 1.4.13) e com quebra de linha em vez de
  `white-space: nowrap`, que estourava a viewport com label longo.
- MCP: o parser do index exigia aspas duplas, então rodar o prettier com
  `singleQuote` faria a lista de componentes vir vazia — sem erro, sem aviso.
  Passou a aceitar os dois estilos e a falhar alto quando não reconhece o index.

### Interno

- `.tabelascaffoldignore` marcando `ci.yml` e `release.yml` como divergência
  intencional: o `tabelascaffold setup` sobrescreveria o workflow que publica no
  npm pelo genérico.

## [0.14.2]

### Corrigido

- `Select`: escondida a scrollbar nativa do dropdown (`scrollbar-width: none`
  - `::-webkit-scrollbar { display: none }`) — o scroll continua por teclado/
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
  `+error.svelte` em apps SvelteKit.

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

## [0.8.0]

### Adicionado

- `FloatingActionPill` — pill flutuante clicável (estilo `StatusPill`, mas `<button>`):
  `position` (canto fixo), `label`/`expandedLabel` → `aria-label`, `expanded` →
  `aria-expanded`, sombra `--twui-shadow-offset` com press no clique (offset some).
  Pro extraída do TabelaFin (acesso ao chat de IA).

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
