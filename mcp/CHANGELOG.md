# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0]

### Adicionado

- Servidor MCP (`@tabeladev/mcp-tabelawebui`) via stdio transport
  (`@modelcontextprotocol/sdk`), consultando o pacote `tabelawebui`
  instalado (repo checkout ou dist publicado).
- Tools: `list_components`, `get_component`, `list_tokens`, `get_token`,
  `list_accents`.
- Parsing de componentes: props (tipo/default/bindable), snippets, tipos HTML
  herdados e exemplo de uso — do source `$props()` (Svelte 5) ou dos `.d.ts`
  do dist.
- Parsing de tokens do `theme.css` com resolução de `var()`/`color-mix` por
  tema (Latte/Mocha) e accents de `data-accent`.
- Resolução do pacote via cwd/`node_modules`, `--source` ou
  `TWUI_MCP_SOURCE`.
