# Convenções dos apps web da TabelaDev

Regras comuns aos apps SvelteKit que consomem o `@tabeladev/tabelawebui`. Hoje:
**tabelafin** (aberto) e **tabelarpgdk/apps/site** (fechado).

Mora aqui porque a lib é a única dependência que todos compartilham, aberto ou fechado.
Cada repo tem um `AGENTS.md` que **aponta** pra este arquivo e guarda só o que é
específico dele — as regras não são duplicadas.

Doc de trabalho, em pt-BR, conforme a política de linguagem em
`tabelafin/CONTRIBUTING.md#language`.

---

## Por que existe

Os dois apps nasceram da mesma base — SvelteKit 2 + Svelte 5 (runes) + TS + Vite +
Tailwind v4 + adapter-cloudflare + D1/Drizzle + better-auth + mode-watcher +
sveltekit-flash-message + bun — mas foram tocados em paralelo, e o que divergiu foi o
acabamento: onde a landing mora, como o header é montado, se cor vem de utilitário ou de
`style=` inline, qual Toaster. Cada divergência custa contexto na troca entre projetos, e
bug corrigido num repo não chegava no outro.

Caso concreto: o `checkJs: true` fazia o `svelte-check` type-checar o bundle gerado e
reportar **milhares** de erros falsos. O tabelafin achou, corrigiu e documentou. O
tabelarpgdk conviveu com `bun run check` inutilizável até este alinhamento.

---

## Rotas

|                 | Regra                                                                                            |
| --------------- | ------------------------------------------------------------------------------------------------ |
| Público         | Grupo `(marketing)/`, com `+layout.svelte` próprio. Nunca landing solta na raiz.                 |
| Logado          | Grupo `(app)/`, com guard **único** em `(app)/+layout.server.ts`. Sem checagem por página.       |
| Auth            | Namespace `auth/` (segmento real) com subgrupo `(redirect)` pra quem já está logado.             |
| API             | `api/`, fora dos grupos. Só `+server.ts`.                                                        |
| Mutação de tela | **form action** no `+page.server.ts`. `api/` é pra JSON/binário (upload, stream, webhook, auth). |
| Links internos  | `resolve()` de `$app/paths`. Nada de string crua.                                                |

> O tabelafin ainda tem `login/`, `signup/` e `logout/` soltas na raiz em vez de `auth/`.
> Divergência conhecida, não corrigida ainda.

## Chrome

Header, nav e footer de uma área **moram no `+layout.svelte` do grupo**, nunca dentro da
página. Página que desenha o próprio header obriga copiar o header na segunda página —
foi exatamente o que aconteceu no tabelafin.

## Tema e cor

Uma camada de tokens, não duas:

```
--twui-*  (lib)  →  --ctp-* / semânticos  (app)  →  --color-*  (@theme inline)  →  utilitário
```

- Os primitivos Catppuccin chamam **`--ctp-*`**. Nada de `--catppuccin-*`.
- Semânticos: `--paper`, `--paper-raised`, `--ink`, `--ink-soft`, `--ink-faint`, `--rule`,
  `--accent`, `--accent-soft`, `--signal`, `--danger`. Todos aliases de `--twui-*` — a
  paleta tem **uma fonte de verdade**, que é a lib.
- Declarar os semânticos num bloco `:root, .dark` só, não duplicar a lista nos dois.
- `color-scheme: light` / `dark` declarado.
- **Sem camada de compat shadcn.** `--background`, `--card`, `--primary`, `--sidebar-*`,
  `--chart-*` não existem. Quem chegar de um template shadcn traduz na entrada.

### Como aplicar cor

Utilitário Tailwind vindo do `@theme inline`: `bg-paper`, `border-rule`, `text-ink-soft`,
`text-ctp-mauve`.

`style="..."` inline **só** quando o valor é passado como prop pra componente da lib
(`iconColor`, `color` de `Landing.Steps`, `background-image: var(--gradient-hero)`). Nesses
casos use a variável crua (`var(--ctp-mauve)`), não `var(--color-ctp-mauve)` — os
`--color-*` existem pra alimentar o Tailwind, não pra serem lidos em CSS.

Classe que não corresponde a token definido **não gera CSS e falha em silêncio**. O
`bg-background/80` do header do tabelarpgdk deixou o header sticky transparente por isso.

> O `(app)/+layout.svelte` do tabelarpgdk ainda tem ~160 `style=` inline. Divergência
> conhecida, fora do escopo do alinhamento inicial.

## Fontes

Self-hosted via `@fontsource-variable/*`. Sem CDN do Google Fonts.

Atenção: os pacotes registram a família como `'<Nome> Variable'` (`'JetBrains Mono
Variable'`, `'Newsreader Variable'`). A lib aponta `--twui-font-serif` pra `"Newsreader"` —
o app que usa a serif da lib **precisa** re-apontar o token, senão cai pra Georgia sem
avisar.

## Landing

- Composta **só** de primitivas da lib: `Landing.Hero` / `.Steps` / `.Features` /
  `.Roadmap` / `.Footer`, mais `SectionHeading`, `Button` e `RuleCard`. Sem componente de
  seção local.
- Página monolítica — não quebrar em componentes locais só por tamanho.
- **Todo** dado de seção vira `const` array no `<script>` (`steps`, `features`, `roadmap`,
  …). Nunca literal inline no atributo. Arrays podem referenciar os `{#snippet}` de ícone
  declarados abaixo no template: snippets viram declarações de função e são içadas.
- Snippet de slot passa como **filho** do componente (`{#snippet actions()}` dentro de
  `<Landing.Hero>`), não como prop de topo.
- `Landing.Footer` leva `repoUrl` só em produto aberto.

## SEO

Toda rota pública leva, no `<svelte:head>`: `<title>`, `meta description`,
`link rel="canonical"`, `og:type` / `og:site_name` / `og:locale` / `og:title` /
`og:description` / `og:url`, e `twitter:card` / `twitter:title` / `twitter:description`.

Canonical e `og:url` saem de `page.url` (`$app/state`), não de env nem hardcode:

```ts
const canonical = $derived(`${page.url.origin}${page.url.pathname}`);
```

O `lang` do `app.html` bate com a língua da copy. Ambos os produtos são pt-BR →
`lang="pt-BR"`. O `data-accent` do `app.html` bate com a cor de onde saem `--shadow-glow`
e `--gradient-hero` (o tabelafin ficou meses com `green` e gradiente maroon).

> Nenhum dos dois tem imagem de preview (`og:image`) ainda.

## Feedback ao usuário

- `Toaster` e `toast` vêm do `@tabeladev/tabelawebui`. Não usar `svelte-sonner` direto.
- Flash: sempre `$flash = undefined` depois de exibir, senão o toast repete ao navegar.
- Tipo do flash vem de `src/lib/enums/toast-type.ts` (`ToastType`), igual nos dois repos.

## Organização de código

| Coisa              | Onde                                                                |
| ------------------ | ------------------------------------------------------------------- |
| Componentes locais | `src/lib/components/<domínio>/PascalCase.svelte`                    |
| Módulos TS         | kebab-case                                                          |
| Server-only        | `src/lib/server/`                                                   |
| Schema             | `src/lib/server/db/schema/<domínio>.ts`, reexportado por `index.ts` |
| Regra de negócio   | `src/lib/server/services/<domínio>.ts`                              |
| Helpers de server  | `src/lib/server/utils/`                                             |
| Testes             | `*.spec.ts` colocado ao lado do módulo                              |

> O tabelafin ainda tem 9 componentes soltos em `src/lib/*.svelte`, schema num arquivo só
> e nenhuma camada de services. Divergências conhecidas.

## Dependências

- A lib entra pelo **registry**: `"@tabeladev/tabelawebui": "^0.18.0"`, importada pelo nome
  scoped. Nada de `file:` — some a reprodutibilidade e o lock deixa de fixar versão.
- Runtime em `dependencies`, ferramenta em `devDependencies` (o better-auth já morou no
  lugar errado).
- Ícones: `@lucide/svelte` com import por ícone. O `lucide-svelte` legado não entra.

## Config

- `svelte.config.js` separado do `vite.config.ts`.
- **`checkJs: false`.** Não há `.js` escrito à mão em `src/`, e com `true` o `svelte-check`
  type-checa o bundle gerado depois de um build e soterra os erros reais.
- `worker-configuration.d.ts` (centenas de KB, gerado) entra no `.prettierignore`.
- Porta de dev de `~/.config/dev-ports.yaml`, chaveada pelo cwd, com fallback `DEV_PORT`.
- Bindings do Cloudflare disponíveis no `vite dev` pelo adapter — o alvo é **um comando
  só** pra subir o ambiente.

> O tabelarpgdk ainda precisa de dois terminais (`bun dev` + `bun proxy`) e de acessar pela
> URL do wrangler, porque o `hooks.server.ts` explode sem o binding `DB`.

## Estrutura open-source

O `tabelascaffold --stack web` (LICENSE, badges, CONTRIBUTING bilíngue, CHANGELOG, CI,
templates de issue/PR) se aplica **só a repo aberto**.

- **tabelafin** — aberto, recebe.
- **tabelarpgdk** — fechado, **não recebe**. É decisão, não pendência: nada de tratar a
  ausência de CI ali como débito herdado desta convenção.

---

## Pendências reais

Coisas que a análise levantou e que ainda valem trabalho:

- Boilerplate de `{#snippet}` por ícone: ~40 linhas por landing só pra pendurar uma classe
  no SVG. A correção certa é do lado da lib — `Landing.Features` e `Landing.Roadmap`
  aceitarem `Component` como o `RuleCard` já aceita. Abrir um `requests/`.
- `og:image` nos dois produtos.
- O tabelarpgdk tem ~36 arquivos nunca formatados, então `bun run lint` falha de saída.
  Merece um commit `chore: format` isolado.
- Carregamento de dados do tabelarpgdk é misto: umas rotas usam `+page.server.ts`, outras
  `onMount(fetch('/api/...'))`. Escolher um.
