# @tabelhadev/mcp-tabelhawebui

MCP (Model Context Protocol) server for
[TAbelhaWebUI](https://github.com/TAbelhaDev/tabelhawebui): exposes the library's
components, tokens and accents as tools that coding agents (Claude, Cursor,
opencode, etc.) can query. Instead of guessing props/tokens, the agent queries
the real API of the installed package — even when consuming the npm-published
lib without a local checkout.

## How it works

The server locates the `@tabelhadev/tabelhawebui` package and parses:

- **Components**: from the source (`src/lib/components/**/*.svelte`,
  Svelte 5 `$props()` destructuring) or, on the published package, from the
  generated `.d.ts` (`dist/components/**/*.svelte.d.ts`). Extracts props with
  type/default/bindable, snippets, HTML types inherited via `...rest`, and a
  generated usage example.
- **Tokens**: from `theme.css` (`--twui-*`), with light (Latte) and dark
  (Mocha) values, resolving `var()`/`color-mix` where possible.
- **Accents**: from the `data-accent` presets in `theme.css`, with the
  Latte/Mocha pair of each + the default (maroon light / pink dark).

## Installation and setup

```bash
bun add -g @tabelhadev/mcp-tabelhawebui    # or: npx @tabelhadev/mcp-tabelhawebui
```

Example in `opencode.json` (or `claude_desktop_config.json`/`.cursor/mcp.json`):

```jsonc
{
  "mcp": {
    "tabelhawebui": {
      "type": "stdio",
      "command": "mcp-tabelhawebui",
      // "args": ["--source", "/path/to/tabelhawebui/checkout"] // optional
    },
  },
}
```

The server resolves `@tabelhadev/tabelhawebui` from the process's **working
directory** (walks up `node_modules`), so run it with the cwd in your project
that has the lib installed. To point at a specific checkout (dev), use
`--source` or the `TWUI_MCP_SOURCE` env.

## Tools

| Tool              | What it does                                                                              |
| ----------------- | ----------------------------------------------------------------------------------------- |
| `list_components` | Lists exported components/stores/functions, with category and description                 |
| `get_component`   | Full API of one component: props (type/default/bindable), snippets, events, usage example |
| `list_tokens`     | All `--twui-*` grouped by role, with light/dark values                                    |
| `get_token`       | Value of one token in both themes (accepts `paper` or `--twui-paper`)                     |
| `list_accents`    | `data-accent` accents with the Latte/Mocha pair + default + escape hatch                  |

## Development

```sh
bun install
bun run check    # tsc --noEmit
bun run lint     # prettier --check
bun run test     # build + stdio smoke test of the server
bun run build    # tsc -> dist/
```

Publishing:

```sh
bun run build
npm publish       # or bun publish (AGPL-3.0, like @tabelhadev/tabelhawebui)
```

## Scope

- **Read-only**: reports the API, does not generate/scaffold UI (the agent writes the code).
- **stdio only** for now (no SSE/HTTP).
- Does not expose the `toast` store as a mutable resource (only documents usage).
