# Integração tabelhacal ↔ tabelhawebui — relatório de análise

> **Objetivo deste documento:** servir de prompt para um agente trabalhar no
> repo `tabelhawebui` (~/codigo/pessoal/tabelhawebui). Ele descreve o que o app
> `tabelhacal` precisa consumir da lib, o que a lib já tem, o que falta
> implementar e como o app vai consumir depois.
>
> **Contexto:** o `tabelhawebui` ainda não está publicado no npm. O tabelhacal
> apontará para `file:/home/ianptkcs/codigo/pessoal/tabelhawebui` no
> package.json até a publicação, quando troca para `"tabelhawebui": "^0.1.0"`.

---

## 1. Referência de integração já existente: o TAbelhaFin

O repo irmão `~/codigo/pessoal/tabelhafin` já fez essa integração e serve de
modelo. Padrão observado lá:

- `src/routes/layout.css` faz `@import 'tabelhawebui/theme.css';` e mapeia os
  tokens `--twui-*` para os tokens shadcn (`--background`, `--primary`, ...)
  e para aliases próprios (`--paper`, `--ink`, `--rule`, ...). As cores
  Catppuccin cruas são expostas como `--catppuccin-*` → `--twui-<flavor>-*`.
- As páginas principais usam os componentes da lib:
  `import { Card, Table, Badge, Button, Status } from 'tabelhawebui';`
- O que a lib **não** cobre (Select, Dialog, Input, Label, Toaster/sonner)
  continua usando shadcn (`$lib/components/ui/*`).
- O tema fica "afiado": `--radius: 0.375rem`, fontes 100% JetBrains Mono.

**Nota importante:** o layout.css do TAbelhaFin referencia
`var(--twui-latte-base, #eff1f5)` etc. — ou seja, os neutros do Catppuccin
**ainda não existem** no theme.css da lib e o TAbelhaFin vive de fallback
hardcoded. Implementar esses neutros na lib é uma das tarefas abaixo.

---

## 2. O que o tabelhacal usa hoje (inventário completo)

Stack do tabelhacal: SvelteKit + Tailwind 4 + shadcn-svelte + bits-ui
(primitivos), tema Catppuccin próprio em `src/routes/layout.css`.

### 2.1 Componentes shadcn usados (imports reais)

| Componente         | Arquivos que usam                                                                                                                            | API usada                                                                                                                                                                                  |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `Button`           | `AppHeader`, `ThemeToggle`, `PushSubscribe`, `ReminderSettings`, `+page`, `chat/+page`, `events/+page`, `onboarding/ai`, `onboarding/google` | `variant`: default/outline/ghost/destructive · `size`: default/sm/lg/icon-sm · `href` (renderiza `<a>`) · `onclick`, `type`, `disabled` · também `buttonVariants()` como função de classes |
| `Card` (composto)  | `+page`, `chat/+page`, `events/+page`, `onboarding/ai`, `onboarding/google`                                                                  | `Card.Root`, `Card.Header`, `Card.Title`, `Card.Description`, `Card.Content`, `Card.Footer` — sempre com `class` custom passado a cada parte                                               |
| `Badge`            | `+page`, `events/+page`, `ReminderSettings`                                                                                                  | `variant="secondary"`, `variant="outline"` (sempre com `class` custom)                                                                                                                     |
| `Input`            | `chat/+page`, `ReminderSettings`, `onboarding/ai`, `onboarding/google`                                                                       | `bind:value`, `placeholder`, `disabled`, `type`, `id`, `name`, `required`, `autocomplete`, `class`                                                                                         |
| `Label`            | `onboarding/ai`, `onboarding/google`                                                                                                         | `for` + `class`                                                                                                                                                                            |
| `Select` (bits-ui) | `ReminderSettings`, `onboarding/ai`                                                                                                          | `Select.Root type="single" bind:value` + `Trigger`/`Content`/`Item`                                                                                                                        |

`Dialog` e `Separator` existem no projeto mas **não são usados** em nenhuma rota
hoje (ficam no diretório ui sem consumo).

### 2.2 Classes utilitárias / tokens usados no markup

Além dos componentes, o app usa bastante classe Tailwind direto no markup.
As que dependem do tema (não podem quebrar):

- Cores por flavor: `text-accent-ink`, `text-ctp-mauve`, `text-ctp-sapphire`,
  `text-ctp-peach`, `text-ctp-green`, `text-ctp-yellow`, `text-ctp-blue`,
  `text-ctp-red` · backgrounds translúcidos: `bg-ctp-<cor>/12`, `bg-ctp-yellow/8`
  · bordas: `border-ctp-yellow`.
- Semânticos shadcn: `bg-background`, `text-foreground`, `text-muted-foreground`,
  `text-destructive`, `bg-destructive/20`, `bg-muted`, `border-border`,
  `text-accent-ink`.
- Extra custom do tabelhacal (definidos no próprio layout.css):
  `--accent-ink` (rosa escurecido no claro / `--ctp-pink` no escuro),
  `--shadow-soft`, `--shadow-glow`, `--gradient-hero`.

### 2.3 Fontes

O tabelhacal usa **Work Sans** (corpo, `--font-sans`) + **JetBrains Mono**
(`--font-mono`), via `@fontsource-variable`. **Diferente do TAbelhaFin**, que é
100% mono. Decisão a preservar no tabelhacal (ou reavaliar).

### 2.4 Radii

O tabelhacal hoje usa `--radius: 0.75rem` (mais suave que o "afiado" do TAbelhaFin,
que usa 0.375rem).

---

## 3. Gap analysis — o que falta no tabelhawebui

### 3.1 Tema: neutros Catppuccin por flavor (FALTA)

O `theme.css` atual define cores cruas (`--twui-latte-rosewater` ...
`--twui-latte-lavender` e as `--twui-mocha-*`) mas **não** define os neutros:
`base`, `mantle`, `crust`, `surface0`, `surface1`, `surface2`, `overlay0`,
`overlay1`, `overlay2`, `subtext0`, `subtext1`, `text`.

**Implementar:** em `:root` (Latte) e `[data-theme="dark"], .dark` (Mocha),
adicionar os 13 neutros com o prefixo por flavor:
`--twui-latte-base`, `--twui-latte-mantle`, ... e `--twui-mocha-base`, ...

Valores oficiais Catppuccin:

- Latte: base `#eff1f5`, mantle `#e6e9ef`, crust `#dce0e8`, surface0
  `#ccd0da`, surface1 `#bcc0cc`, surface2 `#acb0be`, overlay0 `#9ca0b0`,
  overlay1 `#8c8fa1`, overlay2 `#7c7f93`, subtext0 `#6c6f85`, subtext1
  `#5c5f77`, text `#4c4f69`.
- Mocha: base `#1e1e2e`, mantle `#181825`, crust `#11111b`, surface0
  `#313244`, surface1 `#45475a`, surface2 `#585b70`, overlay0 `#6c7086`,
  overlay1 `#7f849c`, overlay2 `#9399b2`, subtext0 `#a6adc8`, subtext1
  `#bac2de`, text `#cdd6f4`.

Isso resolve os fallbacks do TAbelhaFin e dá ao tabelhacal os `--ctp-*` sem
hardcode no app.

### 3.2 Button — estender (FALTA)

API atual: `variant: 'default' | 'primary' | 'ghost' | 'danger'`, sem size,
sem href. O tabelhacal precisa de:

- **`size`**: `'default' | 'sm' | 'lg' | 'icon-sm'` (mapear alturas
  aproximadas do shadcn: sm ~h-7, lg ~h-9, icon-sm ~size-7, default ~h-8).
- **`href`**: quando presente, renderizar `<a>` com o href (comportamento de
  link), como o Button shadcn faz.
- **Variante `outline`**: borda com o `--twui-rule` e hover de fundo
  (equivalente ao `variant="outline"` shadcn). O `danger` do tabelhawebui já
  cobre o `destructive` do shadcn.
- **`buttonVariants` como função de classes** (exportada): o `+page.svelte`
  do tabelhacal usa `buttonVariants({ size: 'sm' })` e
  `buttonVariants({ variant: 'outline', size: 'sm' })` como string de classes
  para um `<span>` decorativo. Pode ser exportada do módulo, ou o tabelhacal
  troca os `<span>` por `<Button>` real.

### 3.3 Card — API composta (FALTA)

API atual: `title`/`description`/`header` (snippet)/`children`. O tabelhacal usa
a API **composta** do shadcn (`Card.Root`, `Card.Header`, `Card.Title`,
`Card.Description`, `Card.Content`, `Card.Footer`), com `class` em cada parte.

**Implementar:** sub-componentes `Card.Header`, `Card.Title`, `Card.Description`,
`Card.Content`, `Card.Footer` exportados junto do `Card` (mantendo a API simples
atual intacta para o TAbelhaFin). Estrutura mínima:

- `Card` (Root): `<section class="twui-card">` — manter.
- `Card.Header`: container com `border-bottom` (hoje `twui-card-header`).
- `Card.Title` / `Card.Description`: parágrafos estilizados (hoje
  `twui-card-title` / `twui-card-description`).
- `Card.Content`: wrapper com padding (`twui-card-content`).
- `Card.Footer`: container com `border-top` e `display:flex` (novo).
- Todos aceitam `class` para o tabelhacal customizar.

### 3.4 Badge — variantes (FALTA)

API atual: só `children` + `class`. O tabelhacal usa `variant="secondary"` e
`variant="outline"`.

**Implementar:** prop `variant: 'default' | 'secondary' | 'outline'`.

- `default`: borda `--twui-rule`, cor `--twui-ink-soft` (comportamento atual).
- `secondary`: fundo `--twui-rule`/translúcido, texto `--twui-ink`.
- `outline`: borda mais forte / texto `--twui-ink`, fundo transparente.

### 3.5 Input e Label (FALTA)

Não existem na lib. O tabelhacal usa:

- **`Input`**: wrapper de `<input>` com borda `--twui-rule`, fundo
  `--twui-paper`, texto `--twui-ink`, `:focus` com outline/borda
  `--twui-accent`, `::placeholder` com `--twui-ink-faint`. Forward de
  atributos HTML (bind:value, type, id, name, required, autocomplete, disabled)
  - `class`.
- **`Label`**: `<label>` com cor `--twui-ink`, forward de `for` + `class`.

### 3.6 O que fica no shadcn do tabelhacal (não implementar)

`Select`, `Dialog`, `Toaster`/sonner — primitivos bits-ui. O TAbelhaFin mantém
shadcn nesses casos; o tabelhacal fará o mesmo. (O `Dialog` do tabelhacal hoje nem
é usado, então é candidato a remoção.)

---

## 4. Como o tabelhacal vai consumir (depois da implementação)

1. `package.json`: `"tabelhawebui": "file:/home/ianptkcs/codigo/pessoal/tabelhawebui"`
   (vira `"^0.1.0"` após a publicação no npm).
2. `src/routes/layout.css`:
   - `@import 'tabelhawebui/theme.css';` antes das imports do shadcn/tailwind.
   - Remover as primitivas Catppuccin duplicadas; usar `--twui-latte-*` /
     `--twui-mocha-*` como fonte de verdade (padrão TAbelhaFin).
   - Manter extras do tabelhacal: `--accent-ink`, `--shadow-*`, `--gradient-hero`,
     fontes (Work Sans + JetBrains Mono) e `--radius: 0.75rem` (decisão de
     design a confirmar — TAbelhaFin usa 0.375rem "afiado").
3. Trocar imports nos `.svelte`:
   - `Button` (shadcn) → `Button` (tabelhawebui) — ajustando `variant`:
     `outline`→`outline`, `destructive`→`danger`, `default`→`primary` (a lib
     chama o filled de "primary"), `ghost`→`ghost`.
   - `Card.Root/Header/...` (shadcn) → `Card` composto (tabelhawebui).
   - `Badge` → `Badge` com `variant` (secondary/outline).
   - `Input`/`Label` (shadcn) → `Input`/`Label` (tabelhawebui).
   - `Select`, Toaster/sonner → permanecem shadcn.

---

## 5. Critérios de aceite da implementação na lib

- `theme.css` expõe os 13 neutros por flavor (Latte/Mocha) com prefixo
  `--twui-<flavor>-*`, e mantém as cores já existentes.
- `Button` aceita `size`, `href` e `variant="outline"`; continua suportando
  `variant="danger"`; a API antiga (`default`/`primary`/`ghost`) não quebra.
- `Card` composto funcional mantendo a API simples de `title`/`description`.
- `Badge` aceita `variant` sem quebrar o uso sem variante (TAbelhaFin usa Badge
  sem `variant`, só com `class`).
- `Input` e `Label` existem e fazem forward de atributos.
- `index.js` exporta todos: `Card`, `Table`, `Badge`, `Button`, `Panel`,
  `Status`, `Input`, `Label`.
- Build da lib (`bun run build` / svelte-package) passa e gera `dist/`
  atualizado (o tabelhacal consome `file:` → usa o `dist/`).
- Regressão visual no TAbelhaFin (ele usa a lib pelo mesmo `file:`): nada do que
  ele usa quebra — os componentes só ganham props novas.
