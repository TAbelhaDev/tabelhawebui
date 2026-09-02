# Prompt de integração de UI — tabelhaedu ↔ tabelhawebui

> Prompt pronto pra colar numa sessão do opencode rodando na raiz de
> `/home/ianptkcs/codigo/pessoal/tabelhaedu`. Objetivo: migrar a camada de
> **apresentação** dos 5 apps pra `tabelhawebui` (o design system da família),
> sem tocar em nenhuma lógica de dados/servidor.

---

## Contexto

- **Repo alvo:** `/home/ianptkcs/codigo/pessoal/tabelhaedu` (monorepo pnpm, SvelteKit,
  4 apps: `webapp`, `b2btool`, `b2bdemo`, `checkoutapp`; pacote compartilhado
  `packages/ui` com Button/Card shadcn + tokens Tailwind).
- **Lib de UI:** `tabelhawebui` **v0.3.1** — publicada no npm
  (`npm view tabelhawebui` → 0.3.1). Design system Catppuccin (Latte/Mocha),
  estética "reading someone's source file": **mono leva estrutura, serif leva
  prosa, bordas afiadas, accent nunca azul, sombra dura 3px offset**.
- **Referência de integração que já existe:** `~/codigo/pessoal/tabelhafin` — o
  app irmão já consome a lib (`file:` no package.json, `@import
'tabelhawebui/theme.css'` no `src/routes/layout.css`, componentes da lib nas
  páginas). Olhe o `layout.css` e as páginas dele como modelo fiel. A doc da
  lib (`~/codigo/pessoal/tabelhawebui/INTEGRACAO_TABELHAWEBUI.md`) descreve o
  mesmo padrão.

## O que a lib JÁ ENTREGA (não reimplementar)

Import do tema (uma vez por app): `@import "tabelhawebui/theme.css";`

Componentes exportados (`import { ... } from "tabelhawebui";`):

| Componente                | Uso                                                                                                                                            |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `Card`                    | painel de formulário; API composta `Card.Root/Header/Title/Description/Content/Footer` (aceita `class` em cada parte)                          |
| `TabCard`                 | **painel de chrome de página** (aba "arquivo" + corpo `p-6`) — o painel principal das páginas de conteúdo                                      |
| `Table`                   | tabelha com `columns` (aceita `{ key, label }`) / `rows` + snippet `cell`                                                                       |
| `Badge`                   | tag — variantes `default`/`secondary`/`outline`                                                                                                |
| `Button`                  | variantes `default`/`primary`/`ghost`/`danger`/`outline`, `size` default/sm/lg/icon-sm, `href` (renderiza `<a>`); `buttonVariants()` exportada |
| `Panel`                   | contêiner com `focused` → borda accent                                                                                                         |
| `Status`                  | semântico `success`/`warning`/`error`/`info`                                                                                                   |
| `Input`                   | campo de texto (password, file com `bind:files`, ...) — forward de atributos                                                                   |
| `Label`                   | rótulo mono 13px                                                                                                                               |
| `Select`                  | select nativo estilizado, `bind:value`                                                                                                         |
| `DatePicker`              | seletor de data                                                                                                                                |
| `Toaster` + store `toast` | toasts (`success`/`error`/`info`/`warning`, `action`) — monte `<Toaster />` no layout                                                          |
| `Timeline`/`TimelineItem` | linha do tempo                                                                                                                                 |
| `RuleCard`                | cartão com borda-superior, ícone, prosa serif                                                                                                  |
| `Nav`                     | navbar breadcrumb: `logo?`/`items` (`{href,label,current?}`)/`trailing?`                                                                       |
| `ThemeToggle`             | alterna `data-theme` + `localStorage`                                                                                                          |
| `Dropdown`                | menu via `<details>` com sombra impressa (token `--twui-shadow-offset`)                                                                        |
| `Divider`                 | `// ---`                                                                                                                                       |
| `Eyebrow`                 | label de seção mono uppercase                                                                                                                  |
| `BracketLink`             | link mono `[ label ]`, colchetes acendem no hover                                                                                              |

Tokens do tema (`--twui-*`): semânticos `--twui-paper`, `--twui-paper-raised`,
`--twui-ink`, `--twui-ink-soft`, `--twui-ink-faint`, `--twui-rule`,
`--twui-accent`, `--twui-accent-soft`, `--twui-signal`, `--twui-danger`;
fontes `--twui-font-mono`/`--twui-font-serif`; sombra `--twui-shadow-offset`;
paleta Catppuccin crua `--twui-latte-*` / `--twui-mocha-*` (neutros + 14
acentos). Escuro via `[data-theme="dark"]` **ou** `.dark`. Já tem
`prefers-reduced-motion` e defaults de `body`.

## O que a lib NÃO tem (implementar NESTE repo, localmente)

> **Atualização 2026-08-06:** a fundação da integração já foi feita — o
> `@tabelhaedu/ui` virou shim sobre a lib (tema + shell + componentes
> disponíveis); falta só a conversão página-a-página. E os dois primitivos
> abaixo (`Textarea`, `Radio`/`Checkbox`) estão sendo adicionados à **própria
> lib** (ver `UI-TABELHAEDU-LIB-PROMPT.md` no repo tabelhawebui). Se já
> estiverem no `dist/` da lib quando você rodar, **use da lib**; senão,
> implemente localmente seguindo a convenção: Svelte 5, `<style>` escopado,
> classes `twui-*`, **só tokens `--twui-*`** (zero Tailwind), exportado de um
> módulo local (ex.: `packages/ui` ou `$lib/`).

1. **`Textarea`** — o repo tem **8 arquivos** com `<textarea>` cru (QDB
   statement, simulado, redações, comunidade, notebooks, atendimento).
   Estilizado: borda `--twui-rule`, fundo `--twui-paper`, texto `--twui-ink`,
   `:focus` com borda `--twui-accent`, `::placeholder` `--twui-ink-faint`,
   `min-h`, `resize: vertical`. Forward de atributos + `class`.
2. **`Radio`/`Checkbox`** — o simulado usa `<input type="radio">` nativo dentro
   de labels. Primitivo estilizado com tokens (accent no checked, borda `rule`,
   foco accent, input nativo oculto por `opacity:0` mantendo acessibilidade).
3. (Opcional) `EmptyState` — não é obrigatório; vazio pode ser composto com
   `Eyebrow`/`Status`/texto `ink-faint`.

## Escopo da migração

**Não toque:** nenhum `+page.server.ts`, `+server.ts`, `hooks.server.ts`,
`+layout.server.ts`, guards de feature/permissão, schema, runtime de
`@tabelhaedu/db`/`auth`/`authz`, migrações, seeds, testes de dados. A UI é só
camada de apresentação — o comportamento (load/actions/redirects) fica intacto.

**Faça:**

1. **Dependência:** `pnpm add tabelhawebui` no root (ou nos apps). Se a rede não
   alcançar o npm, use `file:/home/ianptkcs/codigo/pessoal/tabelhawebui` (a lib
   tem `dist/` pronto). Depois decida: (a) trocar os imports
   `@tabelhaedu/ui` → `tabelhawebui` direto, ou (b) deixar `@tabelhaedu/ui` como
   shim de re-export (`export { default as Button } from 'tabelhawebui'`) pra
   minimizar o churn dos 51 arquivos. Prefira (b) se mantiver `packages/ui`
   relevante, senão (a).
2. **Tema por app:** em cada `src/routes/layout.css`, trocar
   `@import '@tabelhaedu/ui/styles.css';` por `@import 'tabelhawebui/theme.css';`
   (antes de qualquer import Tailwind) e mapear os tokens usados no markup
   (`text-muted-foreground` → `--twui-ink-soft`, `border-border` →
   `--twui-rule`, `bg-muted`/`bg-accent` → `--twui-accent-soft`, `text-destructive`
   → `--twui-danger`, `text-destructive`/`bg-destructive` → `--twui-danger`).
   Manter aliases próprios (`--paper`, `--ink`, `--rule`, ...) como o TAbelhaFin
   faz. `--radius: 0.375rem` (afiado). Fontes: JetBrains Mono + Newsreader
   (via `@fontsource-variable` ou Google Fonts) — mono estrutura, serif prosa.
3. **Shell de app** (`+layout.svelte` de cada app): `Nav` (logo "TAbelhaEdu" +
   items de navegação + `trailing` com `ThemeToggle` e `Dropdown` de usuário com
   Sair), `<Toaster />` montado. O webapp tem ~20 rotas de domínio — os items do
   Nav refletem as rotas principais (home, questões, vídeos, simulados,
   redações, plano, agenda, decks, handouts, anotações, dúvidas, comunidade,
   recompensas, mentor, atendimento, admin).
4. **Conversão das páginas:** envolver o conteúdo em `TabCard` (chrome de
   página) ou `Card` (formulários). Trocar:
   - `Button` (shadcn) → `Button` (tabelhawebui): `default`→`primary`,
     `destructive`→`danger`, `outline`→`outline`, `ghost`→`ghost`.
   - `<input>` cru → `Input`; `<textarea>` cru → `Textarea` (o novo);
     `<select>` cru → `Select`; `<input type="radio">` → primitivo local estilizado.
   - Feedback de forms: hoje é `<p class="text-muted-foreground">` pós-`enhance` —
     trocar por `toast.success/error` (store `toast` da lib).
   - `Status`/`Badge` pra estados (nota de simulado, pontos de recompensa,
     toggle on/off de feature, dns_status).
5. **`b2btool`/`b2bdemo`/`checkoutapp`:** mesmo tratamento (tema + shell +
   componentes), proporcional ao tamanho de cada um.
6. **`packages/ui`:** se ficar como shim, atualize `src/lib/index.ts`; se for
   substituído, remova os imports dele dos apps.

## Critérios de aceite

- `pnpm -r check` → 0 erros (o warning pré-existente de notebooks pode ficar).
- `pnpm test` → 93+ testes verdes (nada de lógica mudou).
- `pnpm test:workers` → verde.
- `pnpm db:bootstrap:local` → ok (dev).
- `pnpm dev:webapp` carrega com o tema aplicado, sem quebra de fluxo (login,
  QDB, simulado, home dashboard, admin, b2btool claim/clients).
- Sem mudança de comportamento de auth/feature/permissão.

## Observações

- A estética é a da família (portfolio/TAbelhaFin): **funcional primeiro**,
  consistente — não inventar um redesign. Seguir o TAbelhaFin como referência
  visual e o `theme.css` da lib como fonte dos tokens.
- Se a lib ganhar `Textarea`/`Radio` no futuro, pode substituir os locais —
  os locais devem seguir o mesmo contrato (`twui-*` + tokens) pra troca ser
  trivial.
