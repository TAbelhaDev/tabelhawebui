# @tabeladev/mcp-tabelawebui

Servidor MCP (Model Context Protocol) pro
[TabelaWebUI](https://github.com/TabelaDev/tabelawebui): expõe os componentes,
tokens e accents da lib como tools consultáveis por coding agents (Claude,
Cursor, opencode, etc.). Em vez de chutar props/tokens, o agente consulta a
API real do pacote instalado — mesmo quem usa a lib publicada no npm, sem o
repo local.

## Como funciona

O servidor localiza o pacote `@tabeladev/tabelawebui` e parseia:

- **Componentes**: da fonte (`src/lib/components/**/*.svelte`, destructuring
  `$props()` do Svelte 5) ou, no pacote publicado, dos `.d.ts` gerados
  (`dist/components/**/*.svelte.d.ts`). Extrai props com tipo/default/bindable,
  snippets, tipos HTML herdados via `...rest` e um exemplo de uso gerado.
- **Tokens**: do `theme.css` (`--twui-*`), com valor no tema claro (Latte) e
  escuro (Mocha), resolvendo `var()`/`color-mix` quando possível.
- **Accents**: dos presets `data-accent` do `theme.css`, com o par Latte/Mocha
  de cada um + o default (maroon claro / pink escuro).

## Instalação e configuração

```bash
bun add -g @tabeladev/mcp-tabelawebui    # ou: npx @tabeladev/mcp-tabelawebui
```

Exemplo no `opencode.json` (ou `claude_desktop_config.json`/`.cursor/mcp.json`):

```jsonc
{
  "mcp": {
    "tabelawebui": {
      "type": "stdio",
      "command": "mcp-tabelawebui",
      // "args": ["--source", "/caminho/para/checkout/do/tabelawebui"] // opcional
    },
  },
}
```

O servidor resolve o `@tabeladev/tabelawebui` a partir do **diretório de
trabalho** do processo (sobe o `node_modules`), então rode com o cwd no seu
projeto que tem a lib instalada. Pra apontar pra um checkout específico (dev),
use `--source` ou a env `TWUI_MCP_SOURCE`.

## Tools

| Tool              | O que faz                                                                                       |
| ----------------- | ----------------------------------------------------------------------------------------------- |
| `list_components` | Lista componentes/stores/funções exportados, com categoria e descrição                          |
| `get_component`   | API completa de um componente: props (tipo/default/bindable), snippets, eventos, exemplo de uso |
| `list_tokens`     | Todos os `--twui-*` agrupados por papel, com valor light/dark                                   |
| `get_token`       | Valor de um token nos dois temas (aceita `paper` ou `--twui-paper`)                             |
| `list_accents`    | Accents de `data-accent` com o par Latte/Mocha + default + escape hatch                         |

## Desenvolvimento

```sh
bun install
bun run check    # tsc --noEmit
bun run lint     # prettier --check
bun run test     # build + smoke test do servidor via stdio
bun run build    # tsc -> dist/
```

Publicar:

```sh
bun run build
npm publish       # ou bun publish (AGPL-3.0, como o @tabeladev/tabelawebui)
```

## Escopo

- **Só leitura**: informa a API, não gera/scaffolda UI (o agente gera o código).
- **Só stdio** por ora (sem SSE/HTTP).
- Não expõe o `toast` store como recurso mutável (só documenta o uso).
