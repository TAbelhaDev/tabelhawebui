# Cobertura da UI do portfolio no tabelhawebui — relatório de gaps

> **Fonte da verdade:** o repo `portfolio` (este). A UI/UX dele é a base; o
> `tabelhawebui` é a abstração. Este relatório lista exatamente o que o
> portfolio usa que a lib ainda **não** cobre, pra você implementar.
>
> **Regra de divergência:** o portfolio é o principal. Se houver qualquer
> ponto em que o que está na lib diverge do portfolio, **segue o portfolio**.

---

## 1. Verdicto rápido

- **O que a lib tem hoje e o portfolio usa:** só o **tema** (tokens
  `--twui-*`, `::selection`, `:focus-visible`, `.dark`/`[data-theme=dark]`).
  Está correto e bate com `src/routes/layout.css`.
- **O que a lib tem e o portfolio NÃO usa (não é bug — são pros apps tipo
  TAbelhaFin):** `Card`, `Table`, `Badge`, `Button`, `Panel`, `Status`,
  `Input`, `Label`, `Select`, `Toaster`/`toast`. Manter.
- **O que o portfolio usa que a lib NÃO tem (é isso que falta):** 6
  componentes signature + 1 bloco de tema/base + 2 utilitários. Detalhado
  abaixo.

O tema do portfolio tem **duas vozes tipográficas** (mono = estrutura, serif =
prosa). A lib hoje só entrega o mono. Metade da estética está faltando.

---

## 2. Gaps de tema/base (arquivo: `src/lib/theme/theme.css`)

### 2.1. Fonte serif + defaults de `body`

O portfolio aplica serif na prosa (frase "reading someone's source file" é
mono levando estrutura, serif levando texto corrido). Falta na lib:

```css
:root {
  --twui-font-serif: "Newsreader", ui-serif, Georgia, serif;
}
```

E, na camada base (junto do `::selection`/`:focus-visible` que já existem):

```css
html {
  background-color: var(--twui-paper);
  color-scheme: light;
}
html[data-theme="dark"] {
  color-scheme: dark;
}
body {
  background-color: var(--twui-paper);
  color: var(--twui-ink);
  font-family: var(--twui-font-serif);
  transition:
    background-color 0.15s ease,
    color 0.15s ease;
}
```

Referência do portfolio: `src/routes/layout.css` linhas 12-13 e 51-67.
Nota: o import das fontes (JetBrains Mono + Newsreader via Google Fonts)
continua responsabilidade do app; a lib só expõe o token e o default.

### 2.2. Guarda `prefers-reduced-motion`

O portfolio tem e a lib não:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

Referência: `src/routes/layout.css` linhas 42-49.

### 2.3. Token de sombra "impressa" (hard offset shadow)

A assinatura visual do portfolio é **sombra dura com offset de 3px**, usada no
dropdown e que deve ser a sombra padrão de qualquer popover/toast. Falta como
token:

```css
--twui-shadow-offset: 3px 3px 0 0 var(--twui-rule);
```

(Nome à sua escolha — o importante é existir um token único pra esse
"printed paper shadow".)

---

## 3. Componentes a implementar

Todos devem seguir a convenção atual da lib: componente Svelte 5 autocontido
com `<style>` escopado, classes `twui-*`, **só tokens** (zero Tailwind, zero
dependência), e exportados no `src/lib/index.js` + tabelha do `README.md` +
`CHANGELOG.md`. As specs abaixo têm os valores exatos do portfolio.

### 3.1. `TabCard` (o painel "aba de arquivo") — **mais signature do repo**

Origem: `src/lib/components/TabLiftCard.svelte`.

Props: `title: string`, `note?: string`, `children: Snippet`.

Estrutura:

- **Aba (label):** `inline-flex w-fit border border-b-0 border-rule bg-paper-raised px-4 py-1.5 font-mono text-xs text-ink-soft` — a aba fica "grudada" por cima da borda do corpo (borda inferior da aba = 0).
- **Corpo:** `flex flex-1 flex-col border border-rule p-6` contendo `children`.
- **Nota (opcional):** `mt-auto ml-auto font-mono text-xs text-ink-faint` — canto inferior direito.
- Container: `flex h-full w-full flex-col`.

> ⚠️ Divergência com o `Card` atual da lib: o `Card` (header + título mono em
> `paper-raised`) é pra painéis de formulário dos apps; o `TabCard` é o
> painel de chrome de página. Não mesclar — implementar como componente novo.

### 3.2. `Timeline` + `TimelineItem` (linha do tempo)

Origem: `src/lib/components/ExperienceCard.svelte` + `ExperienceGrid.svelte`.

`Timeline` = wrapper `<ul>` que recebe `items` e renderiza `TimelineItem`s,
marcando `isLast` no último (ver `ExperienceGrid.svelte`).

`TimelineItem` props:
`title`, `subtitle`, `date?`, `start?`, `end?`, `location?`, `link?`,
`details?: string[]`, `skills?: string[]`, `isLast = false`.
`current` é **derivado**: `!date && !!start && !end`.

Specs:

- Grid: `grid grid-cols-[1.5rem_1fr] gap-x-4`.
- **Trilho:** coluna 1 com `w-px bg-rule` (absolute, top-0 bottom-0); **omitir quando `isLast`**.
- **Dot:** `mt-1.5 size-2.5 rounded-full border-2` (`relative z-10`). Estados:
  - `current` → `border-signal bg-signal-soft`
  - senão → `border-accent bg-paper`
- **Meta (linha 1):** `font-mono text-xs text-ink-faint`, flex-wrap baseline, gap-x-3. Formato `date` ou `start — end` (end vazio → "agora"; no portfolio é i18n, na lib a string vem pronta do app). Data em `text-signal` quando `current`. Se `location`: `<span>· {location}</span>`.
- **Título (linha 2):** `mt-1.5 font-serif text-xl font-medium text-ink`. Se `link`: âncora `underline decoration-rule decoration-1 underline-offset-4 transition-colors hover:text-accent hover:decoration-accent` (target `_blank`).
- **Subtítulo:** `font-mono text-xs text-ink-soft`.
- **Detalhes:** `<ul>` `mt-3 flex flex-col gap-1.5 font-serif text-base text-ink-soft`; cada `li` `relative pl-4` com `before:absolute before:left-0 before:text-ink-faint before:content-['—']`.
- **Skills:** `mt-4 flex flex-wrap gap-x-3 gap-y-1 font-mono text-xs text-ink-soft`; cada skill no formato `[skill]` com os colchetes em `text-ink-faint` (colchetes de "comentário de código").
- Corpo do item: `min-w-0 pb-10`.

### 3.3. `RuleCard` (cartão com borda-superior + label)

Origem: `src/lib/components/ThoughtCard.svelte`.

Props: `icon` (componente de ícone, ex. lucide), `title: string`,
`children: Snippet`.

- Container: `flex flex-col gap-3 border-t border-rule pt-6`.
- **Label:** `flex items-center gap-2 font-mono text-xs tracking-wide text-ink-soft uppercase`; ícone `size-4 text-accent` com `strokeWidth={1.75}`.
- **Prosa:** `font-serif text-lg leading-relaxed text-ink` contendo `children`.

### 3.4. `Nav` (navbar: logo + nav em breadcrumb com separadores `/`)

Origem: `src/lib/components/Navbar.svelte`.

Chrome de página que todo app da família usa. Props sugeridas:
`logo?: Snippet`, `items?: { href: string; label: string; current?: boolean }[]`,
`trailing?: Snippet` (onde entram ThemeToggle/Dropdown de idioma).

- Header: `border-b border-rule`.
- Linha de topo: `flex items-center justify-between gap-4 px-5 py-4 sm:px-8 lg:px-10`.
- Logo: `font-mono text-sm font-medium whitespace-nowrap text-ink`.
- Nav: `flex flex-wrap gap-x-1 gap-y-2 px-5 pb-4 font-mono text-sm`.
- Entre itens: separador `/` → `px-2 text-ink-faint select-none`.
- Link: `text-ink-soft transition-colors hover:text-accent`; quando `current`
  (equivalente ao `aria-current="page"`): `text-accent underline decoration-2 underline-offset-4`.

### 3.5. `ThemeToggle` (controle de tema)

Origem: `src/lib/components/ThemeController.svelte` (+ script de boot em
`src/app.html` linhas 8-16).

A lib já suporta `.dark`/`[data-theme=dark]` no CSS; falta o **controle JS**.

Props: `labels?: { light: string; dark: string }` (aria-label; i18n é do app).

Comportamento:

- Lê `document.documentElement.getAttribute('data-theme')`.
- Toggle seta `data-theme` em `<html>` **e** `localStorage.setItem('theme', next)`.
- Botão: `flex size-8 items-center justify-center text-ink-soft transition-colors hover:text-accent`; ícone Sun (tema escuro → mostra sol) / Moon (tema claro → mostra lua). Ícones via prop `icons?` (não acoplar a lib a lucide — aceitar `{ sun, moon }` snippets/componentes).

### 3.6. `Dropdown` (menu via `<details>` com sombra impressa)

Origem: `src/lib/components/LanguageController.svelte`.

Props: `trigger: Snippet`, `align?: 'left' | 'right'` (default `right`),
`children: Snippet` (itens).

- `<details class="group relative">` com `<summary>`:
  `flex cursor-pointer list-none items-center gap-1.5 text-sm text-ink-soft transition-colors hover:text-accent [&::-webkit-details-marker]:hidden`.
- Menu (`<ul>`): `absolute top-full right-0 z-10 mt-2 min-w-40 border border-rule bg-paper py-1` + **sombra `3px 3px 0 0 var(--twui-rule)`** (usar o token da seção 2.3).
- Item: `block w-full px-3 py-1.5 text-left text-sm whitespace-nowrap text-ink transition-colors hover:bg-accent-soft hover:text-accent`.

---

## 4. Utilitários pequenos (opcionais mas baratos)

- **`// ---` divider** — `block my-6 font-mono text-xs text-ink-faint` com
  texto `// ---` (origem: `src/routes/+page.svelte`, snippet `CommentLine`).
- **Eyebrow / section label** — `font-mono text-xs uppercase text-ink-faint`
  (mesma página, seções "Contact me" / "Download CV"). Pode ser uma classe
  `.twui-eyebrow` no tema ou um componente `Eyebrow`.
- **`Link` com colchetes** (`[ label ]`) — link mono com os colchetes em
  `text-ink-faint` que acendem em `text-accent` no hover (padrão usado no
  botão de download do CV e que combina com o `Button variant="link"`). Se
  criar, não mexe no `Button` existente.

---

## 5. Divergências de estilo onde a lib deve seguir o portfolio

1. **Toast (`Toaster`)** — hoje usa `box-shadow: 0 2px 8px rgb(0 0 0 / 10%)`
   (sombra difusa). A estética do portfolio é sombra dura com offset. Trocar
   pra `3px 3px 0 0 var(--twui-rule)` (token da 2.3). Também tem
   `aria-label="Fechar"` hardcoded em PT — deixar configurável/i18n-neutro.
2. **`Card` vs `TabCard`** — ver nota na seção 3.1. `Card` (formulário) e
   `TabCard` (chrome de página) coexistem; o `TabCard` é o que o portfolio usa.
3. **`Badge`** — o portfolio não usa Badge, mas a estética "tag" dele é
   `[skill]` com colchetes faint (seção 3.2). Se um dia adicionar variante,
   seguir esse formato, não o `border-rule` puro do Badge atual.

---

## 6. Ordem sugerida de implementação

1. Tema/base (2.1, 2.2, 2.3) — destrava tudo.
2. `TabCard` (3.1) e `RuleCard` (3.3) — os dois painéis signature.
3. `Timeline` + `TimelineItem` (3.2).
4. `Nav` (3.4) + `ThemeToggle` (3.5) + `Dropdown` (3.6) — o chrome.
5. Utilitários (4) e ajustes de divergência (5).
6. Exportar tudo em `index.js`, atualizar `README.md` e `CHANGELOG.md`.
7. Validar: `bun run check && bun run lint && bun run build` (svelte-package).

---

## 7. Arquivos de referência no portfolio

| Piece                                  | Arquivo fonte                                                       |
| -------------------------------------- | ------------------------------------------------------------------- |
| Tema/base                              | `src/routes/layout.css`                                             |
| Shell da página                        | `src/routes/+layout.svelte`                                         |
| Boot de tema (FOUC)                    | `src/app.html`                                                      |
| `Nav`                                  | `src/lib/components/Navbar.svelte`                                  |
| `ThemeToggle`                          | `src/lib/components/ThemeController.svelte`                         |
| `Dropdown`                             | `src/lib/components/LanguageController.svelte`                      |
| `TabCard`                              | `src/lib/components/TabLiftCard.svelte`                             |
| `Timeline`                             | `src/lib/components/ExperienceCard.svelte`, `ExperienceGrid.svelte` |
| `RuleCard`                             | `src/lib/components/ThoughtCard.svelte`                             |
| Utilitários (`// ---`, links, eyebrow) | `src/routes/+page.svelte`                                           |
