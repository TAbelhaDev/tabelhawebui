import { readFileSync } from "node:fs";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { buildCatalog, componentByName } from "./catalog.js";
import type { Catalog, ComponentInfo } from "./types.js";

const pkg = JSON.parse(
  readFileSync(new URL("../package.json", import.meta.url), "utf8"),
) as { version: string; name: string };

function ok(data: unknown) {
  return {
    content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }],
  };
}

function err(message: string) {
  return {
    content: [{ type: "text" as const, text: message }],
    isError: true,
  };
}

/** Readable one-line summary of a component (table in the response). */
function describe(c: ComponentInfo): string {
  const bindable =
    c.bindable.length > 0 ? ` bindable=[${c.bindable.join(", ")}]` : "";
  const snippets =
    c.snippets.length > 0
      ? ` snippets=[${c.snippets.map((s) => s.name).join(", ")}]`
      : "";
  return `${c.exportedAs ?? c.name} (${c.kind})${snippets}${bindable}${c.description ? ` — ${c.description}` : ""}`;
}

export async function createServer(
  sourceArg?: string,
): Promise<{ server: McpServer; connect: () => Promise<void> }> {
  const server = new McpServer({
    name: "tabelhawebui",
    version: pkg.version,
  });

  let catalogPromise: Promise<Catalog> | undefined;
  const getCatalog = () => {
    catalogPromise ??= buildCatalog(sourceArg);
    return catalogPromise;
  };

  server.registerTool(
    "list_components",
    {
      title: "List TAbelhaWebUI components",
      description:
        "Lists every component, store and function exported by TAbelhaWebUI, " +
        "with category, kind and description. Use before get_component to see what exists.",
      inputSchema: { includeSubcomponents: z.boolean().optional() },
    },
    async ({ includeSubcomponents }) => {
      try {
        const catalog = await getCatalog();
        let list = catalog.components;
        if (!includeSubcomponents) {
          list = list.filter((c) => !c.exportedAs);
        }
        list = [...list].sort((a, b) =>
          (a.exportedAs ?? a.name).localeCompare(b.exportedAs ?? b.name),
        );
        const summary = list.map((c) => describe(c)).join("\n");
        return ok({
          count: list.length,
          version: catalog.version,
          source: catalog.layout.root,
          components: list.map((c) => ({
            name: c.name,
            exportedAs: c.exportedAs,
            kind: c.kind,
            category: c.category,
            description: c.description,
            bindable: c.bindable,
            snippets: c.snippets.map((s) => s.name),
          })),
        });
      } catch (e) {
        return err((e as Error).message);
      }
    },
  );

  server.registerTool(
    "get_component",
    {
      title: "Full API of one component",
      description:
        "Returns the full API of a TAbelhaWebUI component: props with types, " +
        "defaults and bindables, snippets, events and a usage example. Accepts the " +
        "component name (Button, button, Card.Header, toast, buttonVariants...).",
      inputSchema: {
        component: z.string().describe("Component name (case-insensitive)"),
      },
    },
    async ({ component }) => {
      try {
        const catalog = await getCatalog();
        const info = componentByName(catalog.components, component);
        if (!info) {
          const names = catalog.components
            .map((c) => c.exportedAs ?? c.name)
            .sort()
            .join(", ");
          return err(`Component "${component}" not found. Available: ${names}`);
        }
        const eventsNote = info.inherits.length
          ? `DOM events available via ...rest (props inherited from ${info.inherits.join(
              ", ",
            )}), e.g. on:click, oninput, etc.`
          : undefined;
        return ok({ component: info, events: eventsNote });
      } catch (e) {
        return err((e as Error).message);
      }
    },
  );

  server.registerTool(
    "list_tokens",
    {
      title: "Theme tokens (--twui-*)",
      description:
        "Lists the theme design tokens (--twui-*) grouped by role (semantic, " +
        "font, shadow, palette-active, palette-full), with light (Latte) and " +
        "dark (Mocha) values. Tokens with var()/color-mix are resolved when possible.",
      inputSchema: {
        group: z
          .string()
          .optional()
          .describe(
            "Filters by group: semantic, font, shadow, palette-active, palette-full",
          ),
      },
    },
    async ({ group }) => {
      try {
        const catalog = await getCatalog();
        let tokens = catalog.tokens;
        if (group) {
          tokens = tokens.filter((t) => t.group === group);
        }
        if (tokens.length === 0 && group) {
          return err(
            `Group "${group}" does not exist. Groups: semantic, font, shadow, palette-active, palette-full.`,
          );
        }
        const groups = new Map<string, typeof tokens>();
        for (const t of tokens) {
          const arr = groups.get(t.group) ?? [];
          arr.push(t);
          groups.set(t.group, arr);
        }
        const lines: string[] = [];
        for (const [g, arr] of groups) {
          lines.push(`[${g}]`);
          for (const t of arr) {
            lines.push(
              `  ${t.name}  light=${t.light ?? "-"}  dark=${t.dark ?? "-"}`,
            );
          }
        }
        return ok({
          count: tokens.length,
          version: catalog.version,
          tokens: tokens.map((t) => ({
            name: t.name,
            group: t.group,
            light: t.light,
            dark: t.dark,
            resolved: t.resolved,
          })),
        });
      } catch (e) {
        return err((e as Error).message);
      }
    },
  );

  server.registerTool(
    "get_token",
    {
      title: "Value of one theme token",
      description:
        "Returns the value of a --twui-* token in both themes (light/dark). Accepts " +
        'with or without the --twui- prefix (e.g. "paper" or "--twui-paper").',
      inputSchema: {
        token: z
          .string()
          .describe("Token name, with or without the --twui- prefix"),
      },
    },
    async ({ token }) => {
      try {
        const catalog = await getCatalog();
        const normalized = token.startsWith("--twui-")
          ? token
          : `--twui-${token.replace(/^twui-/, "")}`;
        const info = catalog.tokens.find((t) => t.name === normalized);
        if (!info) {
          return err(
            `Token "${token}" not found. Use list_tokens to see the available ones.`,
          );
        }
        return ok({
          name: info.name,
          group: info.group,
          light: info.light,
          dark: info.dark,
          resolved: info.resolved,
          usage:
            info.group === "palette-full"
              ? `var(${info.name}) — raw, pick the flavor manually`
              : `var(${info.name}) — resolves via the active theme`,
        });
      } catch (e) {
        return err((e as Error).message);
      }
    },
  );

  server.registerTool(
    "list_accents",
    {
      title: "Available accents (data-accent)",
      description:
        "Lists the accents selectable via data-accent on <html>, with the " +
        "Latte/Mocha pair of each. Includes the default accent (no data-accent) and the " +
        "escape hatch --twui-accent.",
      inputSchema: {},
    },
    async () => {
      try {
        const catalog = await getCatalog();
        return ok({
          default: catalog.defaultAccent,
          defaultNote:
            "Without data-accent, the accent is maroon in light and pink in dark.",
          accents: catalog.accents,
          usage: '<html data-accent="teal"></html>',
          escapeHatch:
            "Color outside the list: override --twui-accent directly in the app CSS.",
        });
      } catch (e) {
        return err((e as Error).message);
      }
    },
  );

  return {
    server,
    connect: async () => {
      await server.connect(new StdioServerTransport());
    },
  };
}
