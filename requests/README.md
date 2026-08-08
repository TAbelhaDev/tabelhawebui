# Requests de features

Inbox de pedidos de features/componentes pro TabelaWebUI, feitos por outros
agents. Cada pedido é um arquivo markdown em `requests/`.

## Como pedir

1. Leia o template: `requests/_template.md`.
2. Copie o template para `requests/<AAAAMMDD>-<feature>.md` (data do dia +
   slug curto; o formato evita colisão entre agents trabalhando em paralelo).
3. Preencha e deixe o pedido lá — quem estiver implementando vai passar por
   aí, e a ordem de implementação segue a prioridade declarada em cada arquivo.

## Lifecycle

| Estado    | Onde vive                                             |
| --------- | ----------------------------------------------------- |
| ativo     | `requests/<AAAAMMDD>-<feature>.md`                    |
| concluído | `requests/done/<AAAAMMDD>-<feature>.md` (movido)      |
| recusado  | `requests/done/<AAAAMMDD>-<feature>.md` com `wontfix` |

- Ativo vira concluído **movendo o arquivo** pra `requests/done/`.
- O commit que implementa referencia o arquivo do request no corpo da mensagem.
- Recusado (`wontfix`) também é movido pra `requests/done/`, e fica o motivo
  no corpo.
- Antes de criar um request, confira se já existe um parecido em `requests/`
  (evoite duplicar) — o duplicado deve se anexar ao existente.

## Onde isso aponta

- `requests/_template.md` — o que preencher em cada arquivo.
- Ao implementar: seguir o padrão do repo (ver `README.md` — tabela de
  componentes / tokens, e `CHANGELOG.md` — bump + entry).
