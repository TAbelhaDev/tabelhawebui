# Migração TAbelhaFin → tabelhawebui (remover shadcn-svelte)

## Objetivo

O app TAbelhaFin (SvelteKit 5 + Tailwind v4) ainda usa a UI do shadcn-svelte
(`src/lib/components/ui/`) e o `svelte-sonner` para toasts. Queremos **zero
dependência de shadcn**: tudo que a UI usa tem que vir do pacote `tabelhawebui`
(componentes + tokens `--twui-*`).

## Contexto do TAbelhaFin

- Stack: SvelteKit + Cloudflare Workers (D1 + KV), Bun, Tailwind v4.
- Já usa o tema `tabelhawebui` (`@import 'tabelhawebui/theme.css'` no
  `src/routes/layout.css`), que mapeia os tokens locais (`--paper`, `--ink`,
  `--rule`, `--accent`...) pros `--twui-*`.
- Já usa os componentes da lib no dashboard e em `/transacoes`:
  `Card`, `Table`, `Badge`, `Button`, `Status` (import de `tabelhawebui`).
- Tema escuro via classe `.dark` (mode-watcher).

## Estado atual dos imports shadcn (8 arquivos)

| Arquivo                                     | Importa                                           |
| ------------------------------------------- | ------------------------------------------------- |
| `src/routes/+layout.svelte`                 | `Toaster` (ui/sonner), `toast` (svelte-sonner)    |
| `src/routes/login/+page.svelte`             | `Button`, `Input`, `Label`, `Card` (ui)           |
| `src/routes/onboarding/ai/+page.svelte`     | `Button`, `Input`, `Label`, `Card`, `Select` (ui) |
| `src/routes/onboarding/pluggy/+page.svelte` | `Button`, `Input`, `Label`, `Card` (ui)           |
| `src/lib/PluggyConnect.svelte`              | `Button` (ui)                                     |
| `src/lib/PushSubscribe.svelte`              | `Button` (ui), `toast` (svelte-sonner)            |
| `src/lib/StatementUpload.svelte`            | `Button`, `Input` (ui), `toast` (svelte-sonner)   |
| `src/lib/ReloadPrompt.svelte`               | `toast` (svelte-sonner)                           |

Dependências do TAbelhaFin a remover após a migração:
`shadcn-svelte`, `bits-ui`, `svelte-sonner`, `tailwind-variants`,
`tailwind-merge`, `clsx`, `tw-animate-css`. **Manter**: `mode-watcher` (tema),
`sveltekit-flash-message` (flash messages → vão pro toast da lib).

## O que a lib tabelhawebui já tem (não reimplementar)

Componentes existentes: `Card`, `Table`, `Badge`, `Button`, `Panel`, `Status`.
Tema: `theme.css` com tokens `--twui-*` (semânticos + escala Latte/Mocha +
paleta por flavor). Já cobre a estética "source file" (bordas afiadas, mono,
accent maroon/pink).

> **Regra do TAbelhaFin:** a lib é o design system. Nada de classe Tailwind
> custom no app pra estilizar componente da lib; o app só usa os componentes
> e tokens.

## O que a lib precisa ganhar (pra cobrir o uso do TAbelhaFin)

1. **`Input`** — campo de texto estilizado com tokens. Precisa suportar:
   - `type="password"` (login, onboarding)
   - `type="file"` com `bind:files` (StatementUpload)
   - `placeholder`, `required`, `disabled`, `autocomplete`
   - `class` pass-through pra layout
2. **`Label`** — `<label>` mono/13px com `for`, children e `class`.
3. **`Select`** — select nativo estilizado com tokens. Precisa de
   `bind:value`, `name`, `children` (options) e `class`. Substitui o
   `Select.Root/Trigger/Content/Item` do bits-ui no onboarding/ai.
4. **Sistema de toast** — substitui o `svelte-sonner`:
   - Store reativo importável de qualquer lugar (`toast.success/error/info/warning`
     - forma chamável `toast('msg', opts)`).
   - `<Toaster>` que renderiza os toasts (canto superior direito, auto-dismiss
     ~4s, `action` opcional que não auto-dismissa — usado pelo ReloadPrompt pra
     "nova versão disponível → Atualizar").

> A API do `toast` da lib deve ser **compatível com o svelte-sonner** no que o
> TAbelhaFin usa: `toast.success(msg)`, `toast.error(msg)`, `toast.info(msg)`,
> `toast.warning(msg)`, e `toast(msg, { action: { label, onClick } })`.
> O TAbelhaFin não usa `duration` custom hoje, mas o ReloadPrompt passa
> `duration: Infinity` no sonner — na lib isso vira "não auto-dismissar quando
> tem action" (pode ignorar `duration`).

## Mapeamento de componentes shadcn → tabelhawebui

- `Card.Root > Card.Header > Card.Title + Card.Description > Card.Content`
  → `<Card title="..." description="...">children</Card>` (a lib já tem o
  `Card` com header via props `title`/`description`; se precisar de header
  custom, tem o snippet `header`).
- `Button` shadcn `default` (botão principal) → `Button variant="primary"`
  (accent). `Button variant="outline"` → `Button variant="default"` (borda
  rule/texto ink). `Button variant="ghost"` → `variant="ghost"`.
- `Input` shadcn → `Input` da lib (mesma forma de uso).
- `Label` shadcn → `Label` da lib.
- `Select.Root/Trigger/Content/Item` (bits-ui) → `Select` da lib com
  `<option>` nativos.
- `Toaster` (sonner) + `toast` (svelte-sonner) → `Toaster` + `toast` da lib.

## Arquivos a migrar no TAbelhaFin (ordem sugerida)

1. `src/routes/+layout.svelte`
   - `import { Toaster } from 'tabelhawebui'` + `import { toast } from 'tabelhawebui'`
   - trocar `<Toaster />` (sonner) pelo da lib
   - o `$effect` que consome flash messages (`getFlash`) passa a chamar
     `toast.success/error/info/warning` da lib — manter o `sveltekit-flash-message`.
2. `src/routes/login/+page.svelte` — `Button`, `Input`, `Label`, `Card` da lib.
3. `src/routes/onboarding/ai/+page.svelte` — idem + `Select` da lib (trocar
   os 2 selects bits-ui por `<Select>` + `<option>`; manter `bind:value`
   nos states `provider`/`model`; **cuidado com tipo**: select nativo devolve
   string, `provider` é `AiProvider` — cast).
4. `src/routes/onboarding/pluggy/+page.svelte` — `Button`, `Input`, `Label`,
   `Card` da lib.
5. `src/lib/PluggyConnect.svelte` — `Button` da lib.
6. `src/lib/PushSubscribe.svelte` — `Button` (variant default/outline→default)
   - `toast` da lib.
7. `src/lib/StatementUpload.svelte` — `Button`, `Input` (file), `toast` da lib.
8. `src/lib/ReloadPrompt.svelte` — `toast` da lib (com `action`).

Depois: 9. Apagar `src/lib/components/ui/` inteiro. 10. Remover as deps: `shadcn-svelte`, `bits-ui`, `svelte-sonner`,
`tailwind-variants`, `tailwind-merge`, `clsx`, `tw-animate-css`
(`bun remove ...`). 11. No `src/routes/layout.css`: remover `@import 'shadcn-svelte/tailwind.css'`
e `@import 'tw-animate-css'`. **Cuidado**: o CSS do shadcn definia
variantes (`rounded-lg`, `text-muted-foreground`, `bg-muted`, `dark:*`) —
revisar se sobrou alguma classe shadcn hardcoded nos componentes migrados. 12. `bun run check && bun run lint && bun run test && bun run test:e2e`
— os E2E cobrem login/dashboard/transações e vão pegar quebra de layout.

## Validação

- `bun run check` (svelte-check) — zero erros.
- `bun run lint` (prettier + eslint) — zero.
- `bun run test` — testes unitários.
- `bun run test:e2e` (Playwright) — login, dashboard (cards, gráficos, tema),
  transações. **O E2E de tema valida a classe `.dark` e o toggle** — a lib
  precisa aplicar o tema escuro com `.dark` (já suportado no theme.css).
- Visual: conferir onboarding/ai (selects), login, e o toast do ReloadPrompt.

## Não fazer

- Não manter nenhum `$lib/components/ui/` remanescente.
- Não duplicar tokens: tudo vem do `tabelhawebui/theme.css` (`--twui-*`).
- Não reestilizar componentes da lib no app com classes Tailwind custom.
