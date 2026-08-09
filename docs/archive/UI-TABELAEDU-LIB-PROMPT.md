# Prompt — primitivos de formulário faltantes pro tabelaedu (tabelawebui)

> Prompt pronto pra colar numa sessão do opencode rodando na raiz de
> `~/codigo/pessoal/tabelawebui`. Objetivo: implementar na lib os dois
> primitivos que o app **tabelaedu** precisa pra concluir a conversão de UI, e
> que a lib **ainda não tem**.
>
> Regra geral de todo componente (ver `IMPLEMENTACAO-TABELAWEBUI.md`): Svelte 5
> autocontido, `<style>` escopado, classes `twui-*`, **só tokens `--twui-*`**
> (zero Tailwind, zero dependência), exportado no `src/lib/index.ts` + tabela do
> `README.md` + `CHANGELOG.md`. Validar com `bun run check && bun run lint && bun run build`.

---

## 1. Contexto

O `tabelaedu` (monorepo SvelteKit, app principal `webapp`) integrou o
`tabelawebui@0.3.1` via um **shim** (`@tabelaedu/ui` re-exporta a lib mantendo a
API de namespace que os apps usavam). A **fundação** da integração já está
feita:

- Tema aplicado (`@import 'tabelawebui/theme.css'` + mapeamento dos tokens
  `--twui-*` pros nomes shadcn).
- Shell de app: `Nav` (breadcrumb) + `ThemeToggle` + `Dropdown` de usuário +
  `<Toaster />` montado.
- Componentes da lib disponíveis pros apps via o shim.

O que **falta** é a conversão página-a-página dos inputs crus
(`<textarea>`, `<input>`, `<select>`, radios nativos) pros componentes da lib.
Essa conversão está **bloqueada por dois primitivos que a lib não tem**:
`Textarea` e `Radio`/`Checkbox`. Este prompt cobre esses dois.

## 2. Task 1 — `Textarea`

Origem de necessidade: o tabelaedu tem **8 páginas** com `<textarea>` cru
(questão QDB, simulado, redações, comunidade, notebooks, atendimento). A lib
só tem `Input` (que é `<input>`). Criar `Textarea.svelte` **espelhando a
convenção do `Input.svelte`**:

Props/API (seguir o `Input.svelte`):

```ts
import type { HTMLTextareaAttributes } from "svelte/elements";

let {
  class: className = "",
  value = $bindable(""),
  rows = 4,
  ...rest
}: HTMLTextareaAttributes & { value?: string; rows?: number } = $props();
```

Markup + estilo (idênticos ao `Input` na intenção):

```svelte
<textarea
  {...rest}
  {rows}
  value={value}
  oninput={(e) => (value = e.currentTarget.value)}
  class="twui-textarea {className}"
></textarea>
```

```css
.twui-textarea {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--twui-rule);
  background: var(--twui-paper);
  font-family: var(--twui-font-mono, "JetBrains Mono", monospace);
  font-size: 14px;
  line-height: 1.5;
  color: var(--twui-ink);
  outline: none;
  resize: vertical;
  min-height: 96px;
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease;
}
.twui-textarea::placeholder {
  color: var(--twui-ink-faint);
}
.twui-textarea:focus-visible {
  border-color: var(--twui-accent);
}
.twui-textarea:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

## 3. Task 2 — `Radio` / `Checkbox` (primitivos de escolha)

Origem de necessidade: o simulado do tabelaedu usa `<input type="radio">` nativo
dentro de labels. A lib não tem nenhum primitivo de escolha estilizado.

Design proposto (2 componentes, ou 1 `Choice` + variante `type` — à sua
escolha, mas mantenha a nomenclatura `Radio`/`Checkbox` exportável):

**`Radio`** — label + input radio oculto + indicador visual:

```ts
import type { HTMLInputAttributes } from "svelte/elements";

let {
  class: className = "",
  checked = $bindable(false),
  name,
  value,
  disabled = false,
  label,
  ...rest
}: HTMLInputAttributes & {
  checked?: boolean;
  name?: string;
  value?: string;
  disabled?: boolean;
  label?: string;
} = $props();
```

Estrutura:

```svelte
<label class="twui-choice {disabled ? 'twui-choice-disabled' : ''} {className}">
  <input
    {...rest}
    type="radio"
    {name}
    {value}
    {disabled}
    checked={checked}
    onchange={(e) => (checked = e.currentTarget.checked)}
    class="twui-choice-input"
  />
  <span class="twui-choice-dot" aria-hidden="true"></span>
  {#if label}<span class="twui-choice-label">{label}</span>{/if}
</label>
```

Estilo (bordas afiadas, accent nunca azul, foco por `:has()` ou focus-visible):

```css
.twui-choice {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-family: var(--twui-font-mono, "JetBrains Mono", monospace);
  font-size: 14px;
  color: var(--twui-ink);
}
.twui-choice-input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}
.twui-choice-dot {
  width: 14px;
  height: 14px;
  border: 1px solid var(--twui-rule);
  background: var(--twui-paper);
  border-radius: 9999px; /* radio: círculo; checkbox: 2px */
  transition:
    border-color 0.15s ease,
    background 0.15s ease;
}
.twui-choice-input:checked + .twui-choice-dot {
  border-color: var(--twui-accent);
  background: var(--twui-accent);
  box-shadow: inset 0 0 0 3px var(--twui-paper);
}
.twui-choice:has(.twui-choice-input:focus-visible) .twui-choice-dot {
  box-shadow: 0 0 0 2px var(--twui-accent-soft);
}
.twui-choice-disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

**`Checkbox`**: mesmo padrão, com indicador quadrado (`border-radius: 2px`),
`type="checkbox"`, e o checked com um `✓` (ou borda accent sólida, à escolha).

> Nota de acessibilidade: o input nativo fica visualmente oculto mas presente
> no DOM (opacity 0), mantendo navegação por teclado e label nativo.

## 4. Exports e documentação

1. `src/lib/index.ts`: `export { default as Textarea } from "./components/Textarea.svelte";`
   `export { default as Radio } from "./components/Radio.svelte";`
   `export { default as Checkbox } from "./components/Checkbox.svelte";`
2. `README.md`: adicionar `Textarea`, `Radio`, `Checkbox` na tabela de componentes.
3. `CHANGELOG.md`: entrada em `[Unreleased] → Adicionado`.

## 5. Critérios de aceite

- `bun run check && bun run lint && bun run build` passam (svelte-package gera `dist/`).
- **Regressão:** nada do que o TabelaFin / tabelacal / portfolio já usam quebra
  (os componentes são novos — não tocam nos existentes).
- O `tabelaedu` (consumidor via `file:` ou `^0.3.1`) resolve `Textarea`/`Radio`/
  `Checkbox` do `dist/` e typechecka.
- Convention check: Svelte 5, `<style>` escopado, `twui-*`, só tokens `--twui-*`,
  zero Tailwind/dependência.

## 6. Referências

- Modelo de convenção: `src/lib/components/Input.svelte` (mais próximo possível).
- Regras gerais: `IMPLEMENTACAO-TABELAWEBUI.md`.
- Consumidor que destrava depois disso: prompt de conversão de UI do tabelaedu
  em `UI-TABELAEDU-PROMPT.md` (página-a-página dos inputs crus → componentes).
