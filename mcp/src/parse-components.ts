import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import {
  collapseWs,
  findTopLevelSeps,
  lastLineComment,
  matchClose,
  splitTopLevel,
  stripComments,
  topLevelIndexOf,
} from "./scan.js";
import type { ComponentInfo, PropInfo, SourceLayout } from "./types.js";

interface IndexExport {
  name: string;
  kind: "component" | "store" | "function";
  file?: string;
  category?: string;
}

/**
 * Extrai a lista de exports do index (src/lib/index.ts ou dist/index.d.ts).
 *
 * Quote style is deliberately not pinned: the regex used to require double
 * quotes, so running prettier with singleQuote over index.ts would have made
 * this return an empty list — and an agent would silently conclude the library
 * has no components at all. Hence the throw below rather than an empty array.
 */
export function parseIndex(indexFile: string): IndexExport[] {
  const text = readFileSync(indexFile, "utf8");
  const out: IndexExport[] = [];
  let category: string | undefined;
  const sectionRe = /^\s*\/\/\s*([A-ZÁÉÍÓÚ][^\n]*)$/;
  const exportRe =
    /export\s*\{([^}]*)\}\s*from\s*["']\.\/components\/([A-Za-z0-9./]+)["']/g;
  const cardRe = /export\s+(?:declare\s+)?const\s+(Card)\s*:/;
  const timelineRe = /export\s+(?:declare\s+)?const\s+(Timeline)\s*:/;

  // Prettier breaks `export { a, b } from "..."` onto several lines once the
  // module path grows past its print width. The matcher below is per-line, so
  // collapse export-from blocks back onto a single line first — otherwise a
  // lengthening path would silently drop components from the catalog.
  const normalized = text.replace(
    /export\s*\{[^{}]*?\}\s*from\s*["'][^"'\n]+["'];?/g,
    (m) => m.replace(/\s*\n\s*/g, " "),
  );

  const lines = normalized.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i] as string;
    const sec = line.match(sectionRe);
    if (sec) {
      const s = (sec[1] as string).trim();
      if (
        !/:$/.test(s) &&
        s.length >= 3 &&
        s.length <= 60 &&
        !s.includes("<") &&
        !s.includes("`") &&
        !s.startsWith("tabelawebui")
      ) {
        category = s;
        continue;
      }
    }
    exportRe.lastIndex = 0;
    const m = exportRe.exec(line);
    if (m) {
      const entries = (m[1] as string).split(",");
      const file = (m[2] as string).trim();
      for (const raw of entries) {
        const e = raw.trim();
        if (!e) continue;
        const d = e.match(/default as ([A-Za-z0-9_$]+)/);
        if (d) {
          out.push({ name: d[1] as string, kind: "component", file, category });
        } else {
          const n = e.trim();
          if (n === "toast") out.push({ name: n, kind: "store", category });
          else if (n === "buttonVariants")
            out.push({ name: n, kind: "function", category });
        }
      }
    } else if (cardRe.test(line)) {
      out.push({
        name: "Card",
        kind: "component",
        file: "card/Card.svelte",
        category: "Compostos",
      });
      for (const [sub, f] of [
        ["Header", "card/CardHeader.svelte"],
        ["Title", "card/CardTitle.svelte"],
        ["Description", "card/CardDescription.svelte"],
        ["Content", "card/CardContent.svelte"],
        ["Footer", "card/CardFooter.svelte"],
      ] as const) {
        out.push({
          name: sub,
          kind: "component",
          file: f,
          category: "Compostos",
        });
      }
    } else if (timelineRe.test(line)) {
      out.push({
        name: "Timeline",
        kind: "component",
        file: "timeline/Timeline.svelte",
        category: "Compostos",
      });
      out.push({
        name: "Item",
        kind: "component",
        file: "timeline/TimelineItem.svelte",
        category: "Compostos",
      });
    }
  }

  // An index file that yields nothing means the parser lost track of the
  // format, not that the library is empty. Failing loudly here turns a silent
  // "no components found" into an actionable error.
  if (out.length === 0) {
    throw new Error(
      `parseIndex: nenhum export reconhecido em ${indexFile}. ` +
        `O formato do index mudou e o parser precisa acompanhar.`,
    );
  }
  return out;
}

interface ParsedProps {
  props: PropInfo[];
  bindable: string[];
  inherits: string[];
}

/** Parseia o type object de props (do `$props()` source ou `$$ComponentProps` dist). */
function parsePropsObject(objBody: string): ParsedProps {
  const props: PropInfo[] = [];
  const segs = splitTopLevel(objBody, ";,");
  for (const seg of segs) {
    const clean = stripComments(seg.value);
    const t = clean.trim();
    if (!t) continue;
    const m = /^('([^']+)'|"([^"]+)"|([A-Za-z_$][\w$]*))\s*(\?)?\s*:(.*)$/.exec(
      t,
    );
    if (!m) continue;
    const name = (m[2] ?? m[3] ?? m[4]) as string;
    const optional = !!m[5];
    const type = collapseWs((m[6] as string).trim().replace(/[;,\s]+$/, ""));
    props.push({
      name,
      type,
      required: !optional,
      description: lastLineComment(seg.value),
    });
  }
  return { props, bindable: [], inherits: [] };
}

function extractInherits(typeText: string): string[] {
  const inherits: string[] = [];
  const re = /&\s*(HTML[A-Za-z]+(?:<[^>]*>)?)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(typeText)) !== null) inherits.push(m[1] as string);
  return [...new Set(inherits)];
}

/** Parseia o destructuring `let { ... }: <type> = $props();` do source .svelte. */
function parseSourceProps(source: string): ParsedProps {
  const propsPos = source.indexOf("$props(");
  if (propsPos === -1) return { props: [], bindable: [], inherits: [] };

  const letIdx = source.lastIndexOf("let {", propsPos);
  if (letIdx === -1) return { props: [], bindable: [], inherits: [] };
  const destrOpen = source.indexOf("{", letIdx);
  const destrClose = matchClose(source, destrOpen, "{", "}");
  if (destrClose === -1) return { props: [], bindable: [], inherits: [] };

  const destrBody = source.slice(destrOpen + 1, destrClose);
  const propsEq = source.indexOf("$props(", destrClose);
  const equalsIdx = source.lastIndexOf("=", propsEq);
  let typeText = source.slice(destrClose + 1, equalsIdx).trim();
  if (typeText.startsWith(":")) typeText = typeText.slice(1).trim();

  // --- destructuring: nomes + defaults + bindable ---
  const bindable: string[] = [];
  const defaults = new Map<string, string>();
  const bindMap = new Map<string, string>();
  const descMap = new Map<string, string>();

  const segs = splitTopLevel(destrBody, ",");
  let prevEnd = 0;
  for (const seg of segs) {
    const gap = destrBody.slice(prevEnd, seg.start);
    const gapComment = lastLineComment(gap);
    prevEnd = seg.end;

    const clean = stripComments(seg.value).trim();
    if (!clean || clean.startsWith("...")) continue;

    const eqIdx = topLevelIndexOf(clean, "=");
    const lhs = (eqIdx === -1 ? clean : clean.slice(0, eqIdx)).trim();
    let def = eqIdx === -1 ? undefined : clean.slice(eqIdx + 1).trim();

    const colonIdx = topLevelIndexOf(lhs, ":");
    let key = lhs;
    if (colonIdx !== -1) {
      key = (lhs.slice(0, colonIdx) as string).trim();
    }
    if (
      (key.startsWith("'") && key.endsWith("'")) ||
      (key.startsWith('"') && key.endsWith('"'))
    ) {
      key = key.slice(1, -1);
    }

    let bindableProp = false;
    if (def?.startsWith("$bindable(")) {
      bindableProp = true;
      bindable.push(key);
      const inner = matchClose(def, def.indexOf("("), "(", ")");
      def =
        inner !== -1
          ? def.slice(def.indexOf("(") + 1, inner).trim()
          : undefined;
    }
    if (def) defaults.set(key, collapseWs(def));
    if (bindableProp) bindMap.set(key, def ? collapseWs(def) : "");
    if (gapComment) descMap.set(key, gapComment);
  }

  // --- type annotation ---
  const objOpen = typeText.indexOf("{");
  const objClose =
    objOpen === -1 ? -1 : matchClose(typeText, objOpen, "{", "}");
  const parsed =
    objClose === -1
      ? { props: [] as PropInfo[], inherits: [] as string[] }
      : parsePropsObject(typeText.slice(objOpen + 1, objClose));
  const inherits = extractInherits(
    typeText.slice(objClose === -1 ? 0 : objClose + 1),
  );

  const props = parsed.props.map((p) => ({
    ...p,
    default:
      defaults.get(p.name) ??
      (bindMap.has(p.name) ? bindMap.get(p.name) : undefined),
    bindable: bindable.includes(p.name) || bindMap.has(p.name),
    description: descMap.get(p.name) ?? p.description,
  }));

  return { props, bindable, inherits };
}

const BINDABLE_RE = /Component<[^>]*,\s*\{[^}]*\},\s*((?:"[^"]*"\s*\|?\s*)+)>/;

/** Parseia o `.svelte.d.ts` gerado no dist (props + bindables, sem defaults). */
function parseDistProps(dts: string): ParsedProps {
  const propsStart = dts.indexOf("type $$ComponentProps");
  let props: PropInfo[] = [];
  let inherits: string[] = [];
  if (propsStart !== -1) {
    const objOpen = dts.indexOf("{", propsStart);
    const objClose = matchClose(dts, objOpen, "{", "}");
    if (objClose !== -1) {
      const parsed = parsePropsObject(dts.slice(objOpen + 1, objClose));
      props = parsed.props;
      const after = dts.slice(objClose + 1);
      const semicolon = after.indexOf(";");
      inherits = extractInherits(
        semicolon === -1 ? after : after.slice(0, semicolon),
      );
    }
  }

  const bindable: string[] = [];
  const bm = dts.match(BINDABLE_RE);
  if (bm?.[1]) {
    for (const q of bm[1].match(/"([^"]+)"/g) ?? []) {
      bindable.push(q.replace(/"/g, ""));
    }
  }
  return { props, bindable, inherits };
}

function firstLiteral(type: string): string | undefined {
  const m = type.match(/'([^']+)'/);
  return m?.[1];
}

function placeholderForType(type: string): string {
  if (/\bstring\b/.test(type)) return "...";
  if (/\bboolean\b/.test(type)) return "true";
  if (/\bnumber\b/.test(type)) return "0";
  const lit = firstLiteral(type);
  if (lit) return `"${lit}"`;
  if (type.includes("[]")) return "[...]";
  return "...";
}

function generateUsage(info: ComponentInfo): string {
  if (info.kind === "store") return `toast.success('mensagem')`;
  if (info.kind === "function") return `buttonVariants({ variant: 'primary' })`;
  const name = info.exportedAs ?? info.name;
  const snippetNames = new Set(info.snippets.map((s) => s.name));
  const hasChildren = snippetNames.has("children");

  const attrs: string[] = [];
  for (const p of info.props) {
    if (snippetNames.has(p.name)) continue;
    if (!p.required) continue;
    if (p.bindable) {
      attrs.push(`bind:${p.name}={...}`);
      continue;
    }
    const ph = placeholderForType(p.type);
    if (ph === "...") attrs.push(`${p.name}={...}`);
    else attrs.push(`${p.name}={${ph}}`);
    if (attrs.length >= 3) break;
  }
  for (const p of info.props) {
    if (attrs.length >= 3) break;
    if (p.bindable) {
      const marker = `bind:${p.name}={...}`;
      if (!attrs.includes(marker)) attrs.push(marker);
    }
  }

  const attrStr = attrs.length > 0 ? ` ${attrs.join(" ")}` : "";
  return hasChildren
    ? `<${name}${attrStr}>\n\tconteúdo\n</${name}>`
    : `<${name}${attrStr} />`;
}

function buildSpecialExport(
  name: string,
  kind: "store" | "function",
  category: string | undefined,
  layout: SourceLayout,
): ComponentInfo {
  if (kind === "store") {
    return {
      name,
      kind: "store",
      file: "src/lib/components/feedback/toast.svelte.ts",
      category,
      description:
        "Store de toasts do TabelaWebUI (módulo Svelte 5, `$state`). Chamável " +
        "e com métodos por tipo: `toast(msg)`, `toast.success(msg)`, " +
        "`toast.error(msg)`, `toast.info(msg)`, `toast.warning(msg)`. " +
        "`<Toaster>` é o único que renderiza.",
      props: [],
      snippets: [],
      bindable: [],
      inherits: [],
      usage: "toast.success('Salvo com sucesso')",
    };
  }
  return {
    name,
    kind: "function",
    file: "src/lib/components/actions/Button.svelte",
    category,
    description:
      "Helper de classes do Button pra uso onde um `<Button>` real não cabe " +
      "(ex.: `<span>` decorativo). Retorna a string de classes `twui-button ...`.",
    props: [
      {
        name: "variant",
        type: "'default' | 'primary' | 'ghost' | 'danger' | 'outline'",
        required: false,
        default: "'default'",
      },
      {
        name: "size",
        type: "'default' | 'sm' | 'lg' | 'icon-sm'",
        required: false,
        default: "'default'",
      },
    ],
    snippets: [],
    bindable: [],
    inherits: [],
    usage: "buttonVariants({ variant: 'primary', size: 'sm' })",
  };
}

/** Lê e parseia um componente (source .svelte no repo, .svelte.d.ts no dist). */
function parseComponentFile(
  exp: IndexExport,
  layout: SourceLayout,
  descriptions: Map<string, string>,
): ComponentInfo {
  const base = exp.file ?? `${exp.name}.svelte`;
  const path =
    layout.kind === "repo"
      ? join(layout.componentsDir, base)
      : join(layout.componentsDir, `${base}.d.ts`);

  let parsed: ParsedProps = { props: [], bindable: [], inherits: [] };
  if (existsSync(path)) {
    const text = readFileSync(path, "utf8");
    parsed =
      layout.kind === "repo" ? parseSourceProps(text) : parseDistProps(text);
  }

  const snippets = parsed.props
    .filter((p) => p.type.startsWith("Snippet"))
    .map((p) => ({ name: p.name, type: p.type, required: p.required }));

  const file =
    layout.kind === "repo"
      ? join("src", "lib", "components", base)
      : join("dist", "components", `${base}.d.ts`);

  return {
    name: exp.name,
    kind: exp.kind,
    file,
    category: exp.category,
    description: descriptions.get(exp.name) ?? descriptions.get(exp.file ?? ""),
    props: parsed.props,
    snippets,
    bindable: parsed.bindable,
    inherits: parsed.inherits,
  };
}

/** Monta o catálogo de componentes a partir do layout localizado. */
export async function parseComponents(
  layout: SourceLayout,
  descriptions: Map<string, string>,
): Promise<ComponentInfo[]> {
  const exports = parseIndex(layout.indexFile);
  const out: ComponentInfo[] = [];

  for (const exp of exports) {
    if (exp.kind !== "component") {
      out.push(buildSpecialExport(exp.name, exp.kind, exp.category, layout));
      continue;
    }
    if (exp.category === undefined) {
      // Grupo inicial do index (Table..Button) não tem comentário de seção.
      exp.category = "Core";
    }
    const info = parseComponentFile(exp, layout, descriptions);
    out.push(info);

    // Subcomponentes dos compostos: expõem também como Card.Header, etc.
    if (exp.file === "card/Card.svelte" && exp.name === "Card") {
      for (const [sub, f] of [
        ["Header", "card/CardHeader.svelte"],
        ["Title", "card/CardTitle.svelte"],
        ["Description", "card/CardDescription.svelte"],
        ["Content", "card/CardContent.svelte"],
        ["Footer", "card/CardFooter.svelte"],
      ] as const) {
        const subExp: IndexExport = {
          name: sub,
          kind: "component",
          file: f,
          category: exp.category,
        };
        const subInfo = parseComponentFile(subExp, layout, descriptions);
        subInfo.exportedAs = `Card.${sub}`;
        out.push(subInfo);
      }
    }
    if (exp.file === "timeline/Timeline.svelte" && exp.name === "Timeline") {
      const subExp: IndexExport = {
        name: "Item",
        kind: "component",
        file: "timeline/TimelineItem.svelte",
        category: exp.category,
      };
      const subInfo = parseComponentFile(subExp, layout, descriptions);
      subInfo.exportedAs = "Timeline.Item";
      out.push(subInfo);
    }
  }

  // exportedAs para componentes com nome de arquivo ≠ nome exportado.
  return out.map((c) => ({ ...c, usage: generateUsage({ ...c }) }));
}

/** Referência de exportação pra lookup (nome, minúsculo). Prioriza nome exato. */
export function componentByName(
  components: ComponentInfo[],
  name: string,
): ComponentInfo | undefined {
  const target = name.trim().toLowerCase();
  const exact = components.find(
    (c) =>
      c.name.toLowerCase() === target || c.exportedAs?.toLowerCase() === target,
  );
  if (exact) return exact;
  return components.find((c) =>
    c.file.toLowerCase().replace(".svelte", "").endsWith(`/${target}`),
  );
}
