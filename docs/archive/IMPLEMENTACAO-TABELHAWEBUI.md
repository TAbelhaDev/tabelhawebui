# Plano de implementação consolidado — tabelhawebui

> Consolida os 3 relatórios: `TABELHAWEBUI-COVERAGE.md` (portfolio), `INTEGRACAO_TABELHAWEBUI.md` (tabelhacal), `MIGRATION-TABELHAFIN.md` (TAbelhaFin).
>
> **Regra geral de todo componente:** Svelte 5 autocontido, `<style>` escopado, classes `twui-*`, **só tokens `--twui-*`** (zero Tailwind, zero dependência), exportado no `src/lib/index.js` + tabelha do `README.md` + `CHANGELOG.md`. Validar ao final com `bun run check && bun run lint && bun run build`.

---

## 0. Estado atual

**Já commitados:** `Card`, `Table`, `Badge`, `Button`, `Panel`, `Status`; `theme.css` com tokens semânticos + paleta Latte/Mocha + suporte a `[data-theme="dark"]` e `.dark`.

**Em andamento (existem no working tree, NÃO commitados):**

- Componentes novos: `Input`, `Label`, `Select`, `Toaster`, `toast.svelte.js` — já exportados no `index.js`.
- `theme.css`: 13 neutros por flavor (`--twui-latte-*` / `--twui-mocha-*` base/mantle/crust/surface0-2/overlay0-2/subtext0-1/text), aliases por flavor ativo (`--twui-base`, `--twui-surface0`, `--twui-text`, ...), token `--twui-font-mono`.
- `README.md` reescrito (sem badges); `package.json` ganhou `prepublishOnly: bun run build`.

---

## 1. Tema/base (`src/lib/theme/theme.css`) — FALTA

### 1.1. Fonte serif + defaults de `body`

```css
:root {
  --twui-font-serif: "Newsreader", ui-serif, Georgia, serif;
}
```

Camada base (junto de `::selection`/`:focus-visible`):

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

> Import das fontes (JetBrains Mono + Newsreader via Google Fonts) é responsabilidade do app; a lib só expõe o token e o default.

### 1.2. Guarda `prefers-reduced-motion`

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

### 1.3. Token de sombra "impressa" (hard offset shadow)

```css
--twui-shadow-offset: 3px 3px 0 0 var(--twui-rule);
```

É a sombra signature (dropdown, popover, toast). Usada na seção 6.1.

---

## 2. Componentes novos — chrome/portfolio (TABELHAWEBUI-COVERAGE) — FALTA

### 2.1. `TabCard` — painel "aba de arquivo" (mais signature)

Props: `title: string`, `note?: string`, `children: Snippet`.

- Container: `flex h-full w-full flex-col`.
- **Aba (label):** `inline-flex w-fit border border-b-0 border-rule bg-paper-raised px-4 py-1.5 font-mono text-xs text-ink-soft` — aba "grudada" por cima da borda do corpo (borda inferior = 0).
- **Corpo:** `flex flex-1 flex-col border border-rule p-6` → `children`.
- **Nota (opcional):** `mt-auto ml-auto font-mono text-xs text-ink-faint` — canto inferior direito.
- ⚠️ Não mesclar com `Card` (que é pra formulário) — componente novo.

### 2.2. `Timeline` + `TimelineItem`

`Timeline` = wrapper `<ul>` que recebe `items` e renderiza `TimelineItem`s, marcando `isLast` no último.

`TimelineItem` props: `title`, `subtitle`, `date?`, `start?`, `end?`, `location?`, `link?`, `details?: string[]`, `skills?: string[]`, `isLast = false`. `current` é **derivado**: `!date && !!start && !end`.

- Grid: `grid grid-cols-[1.5rem_1fr] gap-x-4`.
- **Trilho:** coluna 1, `w-px bg-rule` absolute top-0 bottom-0; **omitir quando `isLast`**.
- **Dot:** `mt-1.5 size-2.5 rounded-full border-2` (relative z-10). `current` → `border-signal bg-signal-soft`; senão → `border-accent bg-paper`.
- **Meta (linha 1):** `font-mono text-xs text-ink-faint`, flex-wrap baseline, gap-x-3. Formato `date` ou `start — end` (end vazio → "agora"). Data em `text-signal` quando `current`. `location` → `<span>· {location}</span>`.
- **Título (linha 2):** `mt-1.5 font-serif text-xl font-medium text-ink`. `link` → âncora `underline decoration-rule decoration-1 underline-offset-4 hover:text-accent hover:decoration-accent` (target `_blank`).
- **Subtítulo:** `font-mono text-xs text-ink-soft`.
- **Detalhes:** `<ul>` `mt-3 flex flex-col gap-1.5 font-serif text-base text-ink-soft`; cada `li` `relative pl-4` com `before:absolute before:left-0 before:text-ink-faint before:content-['—']`.
- **Skills:** `mt-4 flex flex-wrap gap-x-3 gap-y-1 font-mono text-xs text-ink-soft`; formato `[skill]`, colchetes em `text-ink-faint`.
- Corpo do item: `min-w-0 pb-10`.

### 2.3. `RuleCard`

Props: `icon` (componente de ícone, ex. lucide), `title: string`, `children: Snippet`.

- Container: `flex flex-col gap-3 border-t border-rule pt-6`.
- **Label:** `flex items-center gap-2 font-mono text-xs tracking-wide text-ink-soft uppercase`; ícone `size-4 text-accent` `strokeWidth={1.75}`.
- **Prosa:** `font-serif text-lg leading-relaxed text-ink`.

### 2.4. `Nav`

Props: `logo?: Snippet`, `items?: { href: string; label: string; current?: boolean }[]`, `trailing?: Snippet` (ThemeToggle/Dropdown).

- Header: `border-b border-rule`.
- Linha de topo: `flex items-center justify-between gap-4 px-5 py-4 sm:px-8 lg:px-10`.
- Logo: `font-mono text-sm font-medium whitespace-nowrap text-ink`.
- Nav: `flex flex-wrap gap-x-1 gap-y-2 px-5 pb-4 font-mono text-sm`.
- Separador `/`: `px-2 text-ink-faint select-none`.
- Link: `text-ink-soft hover:text-accent`; `current` (`aria-current="page"`): `text-accent underline decoration-2 underline-offset-4`.

### 2.5. `ThemeToggle`

Props: `labels?: { light: string; dark: string }` (aria-label; i18n do app), `icons?: { sun; moon }` (não acoplar a lucide).

- Lê `document.documentElement.getAttribute('data-theme')`; toggle seta `data-theme` no `<html>` **e** `localStorage.setItem('theme', next)`.
- Botão: `flex size-8 items-center justify-center text-ink-soft hover:text-accent`; ícone Sun (tema escuro) / Moon (tema claro).
- (TAbelhaFin usa classe `.dark` — o toggle deve atender `data-theme` **e** `.dark` para não quebrar o mode-watcher.)

### 2.6. `Dropdown` (menu via `<details>`)

Props: `trigger: Snippet`, `align?: 'left' | 'right'` (default `right`), `children: Snippet`.

- `<details class="group relative">` + `<summary>`: `flex cursor-pointer list-none items-center gap-1.5 text-sm text-ink-soft hover:text-accent [&::-webkit-details-marker]:hidden`.
- Menu `<ul>`: `absolute top-full right-0 z-10 mt-2 min-w-40 border border-rule bg-paper py-1` + sombra `3px 3px 0 0 var(--twui-rule)` (token da 1.3).
- Item: `block w-full px-3 py-1.5 text-left text-sm whitespace-nowrap text-ink hover:bg-accent-soft hover:text-accent`.

---

## 3. Componentes novos — formulário/toast (INTEGRACAO + MIGRATION) — JÁ IMPLEMENTADOS

Existem no working tree; falta **commitar + validar + aplicar os ajustes da seção 6**.

| Componente          | Spec                                                                                                                                                                                     | Status                 |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- |
| `Input`             | `type="password"`, `type="file"` com `bind:files`, `placeholder`/`required`/`disabled`/`autocomplete`, `class`; borda rule, focus accent, placeholder ink-faint                          | Feito                  |
| `Label`             | `<label>` mono/13px, `for` + `class`                                                                                                                                                     | Feito                  |
| `Select`            | nativo estilizado, `bind:value`, `name`, `children` (options), `class`                                                                                                                   | Feito                  |
| `Toaster` + `toast` | store `$state` chamável + `toast.success/error/info/warning`; Toaster canto sup. dir., auto-dismiss ~4s, `action` que não auto-dismissa (`duration: Infinity` do ReloadPrompt vira isso) | Feito (ver ajuste 6.1) |

---

## 4. Componentes existentes a ESTENDER — FALTA

### 4.1. `Button`

API atual: `variant: 'default' | 'primary' | 'ghost' | 'danger'`, sem size, sem href.

- **`size`**: `'default' | 'sm' | 'lg' | 'icon-sm'` (sm ~h-7, lg ~h-9, icon-sm ~size-7, default ~h-8).
- **`href`**: quando presente, renderizar `<a>` (link) — como o Button shadcn.
- **`variant="outline"`**: borda `--twui-rule` + hover de fundo. (`danger` já cobre `destructive`.)
- **Exportar `buttonVariants()`** como função de classes (tabelhacal usa `buttonVariants({ size: 'sm' })` em `<span>` decorativo).
- API antiga (`default`/`primary`/`ghost`/`danger`) **não pode quebrar**.

### 4.2. `Card` — API composta

Manter a API simples atual (`title`/`description`/`header`/`children`) **intacta** e adicionar sub-componentes exportados junto: `Card.Header`, `Card.Title`, `Card.Description`, `Card.Content`, `Card.Footer`.

- `Card` (Root): `<section class="twui-card">` — manter.
- `Card.Header`: container com `border-bottom` (hoje `twui-card-header`).
- `Card.Title` / `Card.Description`: `twui-card-title` / `twui-card-description`.
- `Card.Content`: wrapper com padding (`twui-card-content`).
- `Card.Footer`: container `border-top` + `display:flex` (novo).
- Todos aceitam `class`.

### 4.3. `Badge` — variantes

- **`variant: 'default' | 'secondary' | 'outline'`**, sem quebrar o uso sem variante (TAbelhaFin usa sem variant, só `class`).
- `default`: borda rule, texto ink-soft (atual).
- `secondary`: fundo rule/translúcido, texto ink.
- `outline`: borda mais forte, texto ink, fundo transparente.

---

## 5. Utilitários pequenos — FALTA (opcionais, baratos)

- **Divider `// ---`** — `block my-6 font-mono text-xs text-ink-faint` com texto `// ---`.
- **Eyebrow / section label** — `font-mono text-xs uppercase text-ink-faint` (classe `.twui-eyebrow` no tema ou componente `Eyebrow`).
- **`Link` com colchetes** (`[ label ]`) — link mono, colchetes em `text-ink-faint` que acendem `text-accent` no hover. Não mexer no `Button` existente.

---

## 6. Ajustes de divergência — FALTA

### 6.1. `Toaster`/`toast` (do TABELHAWEBUI-COVERAGE)

- **Sombra**: trocar `box-shadow: 0 2px 8px rgb(0 0 0 / 10%)` (difusa) por `3px 3px 0 0 var(--twui-rule)` (token da 1.3).
- **`aria-label="Fechar"` hardcoded em PT** → deixar configurável/i18n-neutro.

### 6.2. `Badge` futura variante de "tag"

Se adicionar variante de tag, seguir o formato `[skill]` com colchetes faint (seção 2.2), não o `border-rule` puro atual.

### 6.3. `Card` vs `TabCard`

Coexistem: `Card` (formulário) / `TabCard` (chrome de página). Não mesclar.

---

## 7. Exports + docs — FALTA

- `src/lib/index.js`: exportar `TabCard`, `Timeline`, `TimelineItem`, `RuleCard`, `Nav`, `ThemeToggle`, `Dropdown` (já exporta Input/Label/Select/Toaster/toast).
- `README.md`: atualizar tabelha de componentes + tokens (já parcialmente reescrito).
- `CHANGELOG.md`: registrar o que entrou.

---

## 8. Critérios de aceite (INTEGRACAO §5)

- `theme.css` expõe os 13 neutros por flavor e mantém as cores existentes. ✅ (feito, falta commitar)
- `Button` aceita `size`, `href`, `variant="outline"`; continua com `variant="danger"`; API antiga não quebra.
- `Card` composto funcional mantendo API simples.
- `Badge` aceita `variant` sem quebrar uso sem variante.
- `Input`/`Label` fazem forward de atributos.
- `index.js` exporta todos os componentes.
- `bun run build` (svelte-package) gera `dist/` atualizado (apps consomem via `file:` → usam `dist/`).
- Regressão visual no TAbelhaFin: nada do que ele usa quebra (componentes só ganham props novas).

---

## 9. Ordem sugerida de implementação (TABELHAWEBUI-COVERAGE §6)

1. Tema/base (1.1, 1.2, 1.3) — destrava tudo.
2. `TabCard` (2.1) + `RuleCard` (2.3) — os painéis signature.
3. `Timeline` + `TimelineItem` (2.2).
4. `Nav` (2.4) + `ThemeToggle` (2.5) + `Dropdown` (2.6) — o chrome.
5. Estender `Button`/`Card`/`Badge` (4) + utilitários (5) + ajustes do `Toaster` (6.1).
6. Exports (7) + `README.md` + `CHANGELOG.md`.
7. Commitar o que já está pronto (seção 0: Input/Label/Select/Toaster/toast, neutros, `--twui-font-mono`, `prepublishOnly`, README).
8. Validar: `bun run check && bun run lint && bun run build`.
