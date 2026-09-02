# Generalizar a landing page no tabelhawebui — relatório de requisição

> **Objetivo deste documento:** servir de prompt para um agente trabalhar no
> repo `tabelhawebui` (~/codigo/pessoal/tabelhawebui). Ele descreve a
> oportunidade de generalizar a landing page — hoje duplicada nos apps da
> família — em componentes compartilhados na lib, o que já existe, o que
> implementar e os critérios de aceite.
>
> **Contexto:** o `tabelhawebui` está publicado no npm (`^0.1.1`) e já é
> consumido pelo TAbelhaCal e pelo TAbelhaFin (`file:`/npm). O padrão de
> integração está estabelecido (ver `INTEGRACAO_TABELHAWEBUI.md`). A família
> tem 7 apps (tabelhaedu, tabelhaos, tabelharadar, tabelharkanban, tabelharpgdk,
> tabelhafin, tabelhacal) — todos terão landing.

---

## 1. O problema

Os apps TAbelhaCal e TAbelhaFin têm landing pages **quase idênticas**, copiadas
entre si. A estrutura é a mesma; só mudam o nome do app, a copy, o conteúdo do
terminal, os arrays de dados e URLs. Como a família tem 7 apps e todos vão
precisar de landing, esse copy-paste vai se multiplicar.

### Comparação atual (TAbelhaCal `src/routes/+page.svelte`, ~225 linhas; TAbelhaFin ~263 linhas)

| Bloco                                                  | TAbelhaCal                             | TAbelhaFin                       |
| ------------------------------------------------------ | ------------------------------------- | ------------------------------- |
| Hero (eyebrow + h1 + parágrafo + 2 CTAs + nota)        | sim                                   | sim                             |
| Terminal de demonstração (`aria-hidden`)               | sim                                   | sim                             |
| Steps (4 passos numerados, cada um com cor)            | sim                                   | sim                             |
| Features (grid de Cards com ícone + título + texto)    | sim                                   | sim                             |
| Roadmap (badges "no radar")                            | sim                                   | sim                             |
| Footer (border-t, nome, licença, botão "Ver o código") | sim                                   | sim                             |
| Header                                                 | **do `+layout.svelte`** (`AppHeader`) | **embutido** na própria landing |

### Componentes auxiliares duplicados (quase iguais nos dois apps)

`TerminalWindow` e `SectionHeading` existem em `src/lib/components/` de cada
app com as mesmas props e markup praticamente idêntico — só diferem nos tokens
usados.

---

## 2. O que já existe no tabelhawebui e deve ser reaproveitado

- `Button` — com `variant` (`primary`/`outline`/`ghost`/...), `size`
  (`lg`/`sm`/...), `href` (renderiza `<a>`).
- `Card` — composto (`Card.Content` etc.) e API simples (`title`/`description`).
- `Badge` — com `variant="outline"`.
- `ThemeToggle` — já exportado.
- `theme.css` — tokens `--twui-*` (cores, `--twui-ink-soft`, `--twui-rule`,
  `--twui-accent`, etc.) e `--twui-latte/mocha-*`.
- `Eyebrow`, `BracketLink`, `Divider` (utilitários já exportados) — verificar
  se cobrem o uso dos apps antes de criar equivalentes novos.

**Ausências observadas:** não há componentes de seção de landing
(`LandingHero`, `LandingSteps`, ...), nem `TerminalWindow`/`SectionHeading`
(duplicados nos apps, deveriam viver na lib).

---

## 3. O que implementar

### 3.1 Componentes de seção (não uma `Landing` monolítica)

Recomendação: componentes de seção individuais, com `children`/snippets onde
houver markup livre, em vez de um componente `Landing` data-driven gigante.
Isso mantém a lib flexível para os 7 apps sem engessar layout.

Lista proposta (nomes a validar com as convenções da lib — a lib usa
`BracketLink`, `Eyebrow`, `RuleCard`, `TabCard`, ... — nomes `PascalCase`,
arquivo `.svelte` por componente):

1. **`LandingHero`**
   - Props sugeridas: `eyebrow?: string`, `title?: string` (ou `title?: Snippet`
     para permitir h1 multi-linha/`text-balance` — TAbelhaCal usa `text-balance`
     numa string, TAbelhaFin usa 3 `<span class="block">`), `lead?: string`,
     `actions?: Snippet` (os CTAs), `note?: string` (a nota sob os CTAs).
   - Render: eyebrow uppercase mono `text-accent-ink`, h1 grande mono bold,
     lead `text-ink-soft`, actions + note.
2. **`LandingSteps`**
   - Props: `steps: Array<{ number: string; color: string; title: string; body: string }>`
     (o TAbelhaCal usa `number: '01'` + `color: 'text-ctp-mauve'` etc.).
   - Render: grid `sm:grid-cols-2 lg:grid-cols-4`, número mono grande colorido,
     título, body.
3. **`LandingFeatures`**
   - Props: `features: Array<{ icon: Component; bgClass: string; textClass: string; title: string; body: string }>`
     (ou `icon?: Snippet` pra não depender de `Component` importado — decidir
     pela convenção da lib; TAbelhaCal passa `feature.icon` como componente
     lucide e usa `bgClass`/`textClass` com `ctp-*`).
   - Render: grid `sm:grid-cols-2 lg:grid-cols-3` de `Card` com
     `Card.Content`, ícone num quadrado `size-9 rounded-lg` com bg, título,
     body.
4. **`LandingRoadmap`**
   - Props: `items: Array<{ icon: Component; label: string }>` (ou snippet).
   - Render: badges `variant="outline"` com ícone + label, `flex flex-wrap gap-2`.
5. **`LandingFooter`**
   - Props: `name: string`, `license?: string` (ex: "AGPL-3.0 · SvelteKit +
     Cloudflare Workers" — decidir se é prop de string ou snippet),
     `repoUrl: string` (link do "Ver o código").
   - Render: `border-t`, nome mono, licença `text-ink-soft`, `Button
variant="ghost" size="sm"` com ícone + "Ver o código".
6. **`TerminalWindow`** (mover da duplicação dos apps para a lib)
   - Props: `title: string`, `children?: Snippet`.
   - Render: container com borda, barra de 3 bolinhas coloridas
     (ctp-red/yellow/green), título mono, conteúdo.
   - Nota: TAbelhaCal usa `rounded-2xl`, TAbelhaFin `rounded-lg` — decidir o
     radius padrão da lib (consistência com o tema).
7. **`SectionHeading`** (mover da duplicação dos apps para a lib)
   - Props: `eyebrow: string`, `title: string`, `lead?: string`.
   - Render: eyebrow uppercase mono `text-accent-ink`, título h2 mono, lead
     `text-ink-soft md:max-w-xl`.

### 3.2 Opção alternativa (não recomendada como primária)

Um componente `Landing` único data-driven (props: `appName`, `hero`, `steps`,
`features`, `roadmap`, `terminal` snippet, `repoUrl`, ...). Menos código por
app, porém opinativo e rígido: qualquer variação de layout de um dos 7 apps
vira prop/flag. Os componentes de seção (3.1) já entregam ~90% da economia com
muito mais flexibilidade.

---

## 4. Diferenças entre os dois apps que precisam ser acomodadas

- **Header**: TAbelhaFin embute o header (logo + ThemeToggle + "Começar") na
  própria landing, com container `border-x border-rule`. TAbelhaCal usa o
  `AppHeader` do `+layout.svelte` (sticky, com nav Chat/Eventos quando logado).
  → **Não** generalizar o header na lib: é específico do app (navegação
  logada/logada, rotas). O componente de seção de landing cobre só o conteúdo.
- **Tokens no markup**: TAbelhaFin já usa tokens da lib direto
  (`border-rule`, `text-ink-soft`, `bg-paper`); TAbelhaCal ainda usa tokens
  shadcn no markup da landing (`border-border`, `text-muted-foreground`,
  `text-foreground`, `bg-background`). → os componentes da lib devem usar os
  tokens `--twui-*`, e o TAbelhaCal ajusta seu markup/local no consumo.
- **`text-balance` / h1 multi-linha**: TAbelhaCal usa `text-balance` em string;
  TAbelhaFin usa 3 `<span class="block">`. → `LandingHero.title` deve aceitar
  snippet (`title?: Snippet`) para suportar os dois, sem perder o fallback de
  string.
- **Terminal**: o conteúdo interno é 100% específico do app (mock do
  dashboard/chat). → `TerminalWindow` recebe `children` (snippet); o app
  fornece o conteúdo.
- **Ícones**: os apps importam ícones lucide e passam como componente
  (`feature.icon`). → `LandingFeatures`/`LandingRoadmap` devem aceitar o ícone
  como componente/snippet, sem depender de lib de ícone específica.

---

## 5. Critérios de aceite

- Componentes de seção exportados no `index.ts`: `LandingHero`,
  `LandingSteps`, `LandingFeatures`, `LandingRoadmap`, `LandingFooter`,
  `TerminalWindow`, `SectionHeading`.
- Todos usam tokens `--twui-*` (não shadcn) e `class` custom passada por prop
  (padrão da lib atual).
- `TerminalWindow` e `SectionHeading` saem dos apps (`src/lib/components/`) e
  passam a vir da lib — removida a duplicação.
- `LandingHero.title` aceita string e snippet; `LandingFeatures`/`LandingRoadmap`
  aceitam ícone como componente ou snippet.
- Build da lib (`bun run build`) passa e `dist/` atualizado.
- Regressão visual: nada que o TAbelhaFin/TAbelhaCal já usam quebra; os novos
  componentes são aditivos.
- (Opcional) README da lib documenta o uso das seções de landing com um
  exemplo mínimo.

---

## 6. Depois da implementação (consumo nos apps)

1. TAbelhaCal e TAbelhaFin trocam os blocos duplicados da landing pelos
   componentes da lib (na versão publicada, ex. `^0.2.0`).
2. TAbelhaCal ajusta tokens shadcn → `--twui-*` onde necessário no markup da
   landing.
3. Remove `TerminalWindow.svelte` e `SectionHeading.svelte` de
   `src/lib/components/` dos apps.
4. Os outros 5 apps da família passam a montar a landing com os mesmos
   componentes.
