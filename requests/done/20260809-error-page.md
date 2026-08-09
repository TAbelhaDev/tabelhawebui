# ErrorPage

> Componente de display pra páginas de erro (404, 500, 403, ...). O app monta
> o `+error.svelte` do SvelteKit em volta dele — o componente só cuida do
> visual: código HTTP em destaque, título, descrição e link de retorno.

- **autor**: tabelafin
- **data**: 2026-08-09
- **prioridade**: medium

## O que

Componente que renderiza o conteúdo visual de uma página de erro, centralizado,
com o código HTTP em destaque (mono, accent), título PT-BR, descrição e botão de
retorno. Pensado pra ser usado dentro de `+error.svelte` (SvelteKit), que já
fornece `status`/`error` e decide o nível de layout.

## Por que / contexto

O tabelafin não tem nenhuma página de erro: quando algo dá 404/500 o SvelteKit
cai no fallback genérico do adapter. Pra ter erro "bonitinho" sem inventar
CSS/style paralelo no app (convenção deste repo), o display vira componente aqui
e o app só monta os `+error.svelte` (root e `(app)`) em volta.

## API proposta

```svelte
<ErrorPage
  status={404}
  title="Página não encontrada"
  description="A página que você procura não existe ou foi movida."
  homeHref="/"
/>
```

Props:

- `status` (number, required) — código HTTP, renderizado grande em mono/accent
- `title` (string, required) — título (ex: "Página não encontrada")
- `description` (string, default `''`) — subtítulo explicativo
- `homeHref` (string, default `'/'`) — href do botão de retorno
- `homeLabel` (string, default `'Voltar ao início'`) — texto do botão
- `actions` (Snippet opcional) — slots extras ao lado do botão (ex: "Fazer
  login" no 401); renderizado dentro do grupo de ações
- `class` (string, default `''`) — classe aplicada no container raiz

## Escopo / fora de escopo

- dentro: display visual (código + título + descrição + botão), centralizado,
  tema claro/escuro com tokens twui, fonte mono via `--twui-font-mono`
- fora: mapeamento status→mensagem (responsabilidade do app, que conhece o
  conteúdo), routing/redirect, layout de `+error.svelte`, auth, i18n

## Critérios de aceite

- [ ] Renderiza `status` em destaque (mono/accent) e `title`/`description` legíveis
- [ ] Botão de retorno usa `homeHref`/`homeLabel` e é navegável por teclado
- [ ] `actions` (snippet) aparece ao lado/abaixo do botão quando fornecido
- [ ] Tema claro/escuro funciona (tokens `--twui-accent`, `--twui-ink`,
      `--twui-ink-soft`, `--twui-paper`, `--twui-paper-raised`, `--twui-rule`)
- [ ] Container centralizado (`min-h-svh`), sem depender de layout do app
- [ ] Exportado de `src/lib/index.ts`
- [ ] `bun run check`, `bun run lint` e `bun run build` passam

## Docs a atualizar

- [ ] README (tabela de componentes)
- [ ] CHANGELOG (entry novo)
