# MCP server do TabelaWebUI

- **autor**: opencode (session de design com o mantenedor)
- **data**: 2026-08-09
- **prioridade**: medium

## O que

Um **servidor MCP** (Model Context Protocol) que expõe o TabelaWebUI como
recursos consultáveis por coding agents (Claude, Cursor, opencode, etc.). O
servidor lê a API pública do pacote instalado (`node_modules/tabelawebui` ou
o próprio repo em dev) e responde queries via stdio transport.

Serve pra qualquer agente que queira montar uma UI **usando o TabelaWebUI
corretamente**: em vez de inventar props/slots ou chutar tokens, ele consulta
o servidor e usa a API real — mesmo pra quem está **fora do repo** (terceiros
com o pacote publicado, sem acesso ao fonte).

### Tools propostas

| Tool              | Descrição                                                                                       |
| ----------------- | ----------------------------------------------------------------------------------------------- |
| `list_components` | Lista todos os componentes exportados com descrição breve                                       |
| `get_component`   | API completa de um componente: props + tipos, defaults, snippets/slots, eventos, snippet de uso |
| `list_tokens`     | Todos os `--twui-*` tokens com valor light/dark (Catppuccin Latte/Mocha)                        |
| `get_token`       | Valor de um token específico nos dois temas                                                     |
| `list_accents`    | Guia de `data-accent` (12 cores + escape hatch `--twui-accent`)                                 |

## Por que / contexto

- O TabelaWebUI é um design system com **~52 componentes** e um **sistema de
  tokens completo** (`theme.css`, 348 linhas). Agentes que consomem a lib
  precisam de uma fonte de verdade programática pra: props exatas, nomes de
  tokens, convenções (mono, "accent never blue", `data-accent`).
- Hoje a API só está documentada em `README.md` (estático) e no fonte `.svelte`
  (precisa ler arquivo). Um agente fora do repo ou sem querer ler fonte não tem
  acesso a isso de forma estruturada.
- Sem o MCP, o agente chuta a API → prop errada, token inexistente, accent
  azul, etc. O MCP elimina esse ciclo de tentativa-e-erro.
- É o equivalente server-side do que `requests/` faz pra agents dentro do repo:
  uma porta de consulta da API — mas pra qualquer consumidor.

## API proposta

O servidor usa o **MCP stdio transport** (npm `@modelcontextprotocol/sdk`).
Exemplo de uso por um agente:

```jsonc
// client-side (ex.: opencode.json)
{
  "mcp": {
    "tabelawebui": {
      "command": "npx",
      "args": ["@tabeladev/mcp-tabelawebui"],
    },
  },
}
```

```jsonc
// tools (server-side)
{
  "tools": [
    {
      "name": "get_component",
      "inputSchema": { "component": "string" },
      "output": {
        "name": "Button",
        "description": "Botão com variantes default/primary/ghost/danger/outline",
        "props": [
          {
            "name": "variant",
            "type": "'default' | 'primary' | 'ghost' | 'danger' | 'outline'",
            "default": "'default'",
          },
        ],
        "slots": [{ "name": "default", "type": "snippet" }],
        "events": [],
        "usage": "<Button variant=\"primary\" href=\"/x\">Salvar</Button>",
      },
    },
  ],
}
```

### Formato dos dados

- **Componentes**: extraídos do source (parsing de `$props()` Svelte 5 +
  eventos/snippets), com tipos TypeScript resolvidos.
- **Tokens**: parse de `--twui-*` no `theme.css`, agrupados por papel
  (semantic, font, shadow, accent) com valor por tema.

### Pacote

- Nome: `@tabeladev/mcp-tabelawebui` (npm), roda com `bun` ou `npx`.
- Moraria num repo/pasta separada do pacote de componentes **ou** num
  mono-repo futuro; não bloquear a estrutura atual (flat).

## Escopo / fora de escopo

- dentro:
  - Servidor MCP funcional com stdio transport (SDK oficial)
  - Tools de consulta (componentes, tokens, accents)
  - Extração dos dados a partir do source instalado
  - `list_components`, `get_component`, `list_tokens`, `get_token`, `list_accents`
- fora:
  - **Não** é um gerador de UI / scaffold (agente gera o código, o MCP só informa)
  - **Não** expõe o `toast` store como recurso mutável (é store de runtime, não token)
  - **Não** consome o CDN/unpkg (leitura local ou via pacote npm)
  - **Não** implementa outro transporte além de stdio (por ora)

## Critérios de aceite

- [ ] `npx @tabeladev/mcp-tabelawebui` sobe o servidor via stdio e responde `tools/list`
- [ ] `get_component` de um componente existente (ex. `Button`) retorna props, tipos, defaults, snippets e exemplo de uso
- [ ] `get_component` de componente inexistente retorna erro claro de "componente não encontrado"
- [ ] `list_tokens` retorna os tokens com valor light/dark corretos (conferir contra `theme.css`)
- [ ] `list_accents` lista as cores de `data-accent` suportadas
- [ ] Build/testes do pacote MCP passam (`bun run check`/`lint`/`build` do pacote, se houver CI)
- [ ] README do MCP documenta a instalação e o uso pelas tools

## Docs a atualizar

- [ ] README do pacote MCP (instalação, tools, exemplos)
- [ ] CHANGELOG do pacote MCP (entry novo)
- [ ] README principal do TabelaWebUI, se decidir divulgar o MCP como parte da lib (seção "Ferramentas" ou similar)
