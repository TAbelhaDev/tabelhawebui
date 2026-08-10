# Table: pageSize={0} deve mostrar todas as linhas

- **autor**: tabelafin
- **data**: 2026-08-09
- **prioridade**: high

## O que

Quando o app passa `pageSize={0}` pra Table, a intenção é "sem paginação,
mostrar todas as linhas" — mas o componente calcula
`pageRows = sortedRows.slice((page-1)*0, page*0)` = `slice(0, 0)` = `[]`,
deixando a tabela sempre vazia (mesmo com dados). O header/cards que vêm do
load mostram os números, mas as linhas somem.

## Por que / contexto

O TabelaFin usa `pageSize={0}` em 3 telas (dashboard — transações recentes,
`/proximas`, `/contas`) pra exibir listas curtas sem paginação. Todas estão
quebradas: contagem correta no topo, tabela vazia embaixo. É um bug do
componente, não do app.

## Comportamento esperado

- `pageSize={0}` (ou ausente/`null`) → sem paginação, `pageRows = sortedRows`
  (todas as linhas, sem controles de página)
- `pageSize` positivo → comportamento atual (paginação)

## API proposta

Nenhuma mudança de API — só o comportamento de `pageSize=0`:

```svelte
<!-- hoje: tabela vazia -->
<Table rows={rows} pageSize={0} />

<!-- esperado: mostra todas as linhas, sem paginação -->
<Table rows={rows} pageSize={0} />
```

## Escopo / fora de escopo

- dentro: corrigir o cálculo de `pageRows` pra tratar `pageSize=0` como "todas"
- fora: nova API de paginação, filtros, ordenação, seleção

## Critérios de aceite

- [ ] `pageSize={0}` renderiza todas as linhas de `rows`
- [ ] `pageSize={0}` não mostra controles de paginação
- [ ] `pageSize={10}` mantém o comportamento atual
- [ ] `bun run check`, `bun run lint` e `bun run build` passam

## Docs a atualizar

- [ ] README (tabela de componentes — nota sobre `pageSize={0}`)
- [ ] CHANGELOG (entry de fix)
