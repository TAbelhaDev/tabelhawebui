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

/** Resumo legível de um componente (tabela na resposta). */
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
    name: "tabelawebui",
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
      title: "Lista os componentes do TabelaWebUI",
      description:
        "Lista todos os componentes, stores e funções exportados pelo TabelaWebUI, " +
        "com categoria, kind e descrição. Use antes de get_component pra saber o que existe.",
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
      title: "API completa de um componente",
      description:
        "Retorna a API completa de um componente do TabelaWebUI: props com tipos, " +
        "defaults e bindables, snippets, eventos e exemplo de uso. Aceita nome do " +
        "componente (Button, button, Card.Header, toast, buttonVariants...).",
      inputSchema: {
        component: z.string().describe("Nome do componente (case-insensitive)"),
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
          return err(
            `Componente "${component}" não encontrado. Disponíveis: ${names}`,
          );
        }
        const eventsNote = info.inherits.length
          ? `Eventos de DOM disponíveis via ...rest (props herdadas de ${info.inherits.join(
              ", ",
            )}), ex. on:click, oninput, etc.`
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
      title: "Tokens do tema (--twui-*)",
      description:
        "Lista os design tokens do tema (--twui-*) agrupados por papel (semantic, " +
        "font, shadow, palette-active, palette-full), com valor no tema claro (Latte) " +
        "e escuro (Mocha). Tokens com var()/color-mix são resolvidos quando possível.",
      inputSchema: {
        group: z
          .string()
          .optional()
          .describe(
            "Filtra por grupo: semantic, font, shadow, palette-active, palette-full",
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
            `Grupo "${group}" não existe. Grupos: semantic, font, shadow, palette-active, palette-full.`,
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
      title: "Valor de um token do tema",
      description:
        "Retorna o valor de um token --twui-* nos dois temas (claro/escuro). Aceita " +
        'com ou sem o prefixo --twui- (ex.: "paper" ou "--twui-paper").',
      inputSchema: {
        token: z.string().describe("Nome do token, com ou sem prefixo --twui-"),
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
            `Token "${token}" não encontrado. Use list_tokens pra ver os disponíveis.`,
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
              ? `var(${info.name}) — cru, escolha o flavor manualmente`
              : `var(${info.name}) — já resolve pelo tema ativo`,
        });
      } catch (e) {
        return err((e as Error).message);
      }
    },
  );

  server.registerTool(
    "list_accents",
    {
      title: "Accents disponíveis (data-accent)",
      description:
        "Lista os accents selecionáveis via data-accent no <html>, com o par " +
        "Latte/Mocha de cada um. Include o accent default (sem data-accent) e o " +
        "escape hatch --twui-accent.",
      inputSchema: {},
    },
    async () => {
      try {
        const catalog = await getCatalog();
        return ok({
          default: catalog.defaultAccent,
          defaultNote:
            "Sem data-accent, o accent é maroon no claro e pink no escuro.",
          accents: catalog.accents,
          usage: '<html data-accent="teal"></html>',
          escapeHatch:
            "Cor fora da lista: sobrescrever --twui-accent direto no CSS do app.",
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
