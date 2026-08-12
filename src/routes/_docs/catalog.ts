import type { PropInfo } from "./types";

// Lê o source de cada componente via import.meta.glob (?raw) e extrai as
// props da anotação de tipo do `$props()`. Mesma técnica do parser MCP, numa
// versão enxuta que roda no bundle do site (sem node:fs).

function matchingBrace(text: string, open: number): number {
  let depth = 0;
  for (let i = open; i < text.length; i++) {
    if (text[i] === "{") depth++;
    else if (text[i] === "}") {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1;
}

function splitTopLevel(text: string): string[] {
  const out: string[] = [];
  let depth = 0;
  let current = "";
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === "{" || c === "(" || c === "[") depth++;
    else if (c === "}" || c === ")" || c === "]") depth--;
    if ((c === "," || c === ";") && depth === 0) {
      out.push(current);
      current = "";
    } else {
      current += c;
    }
  }
  if (current.trim()) out.push(current);
  return out;
}

function stripComments(text: string): string {
  return text.replace(/\/\/.*$/gm, "").replace(/\/\*[\s\S]*?\*\//g, "");
}

function parseProps(source: string): PropInfo[] {
  const props: PropInfo[] = [];
  const propsPos = source.indexOf("$props(");
  if (propsPos === -1) return props;

  const letIdx = source.lastIndexOf("let {", propsPos);
  if (letIdx === -1) return props;
  const destrOpen = source.indexOf("{", letIdx);
  const destrClose = matchingBrace(source, destrOpen);
  if (destrClose === -1) return props;

  const destrBody = source.slice(destrOpen + 1, destrClose);
  const equalsIdx = source.indexOf("=", destrClose);
  let typeText = source
    .slice(destrClose + 1, equalsIdx === -1 ? propsPos : equalsIdx)
    .trim();
  if (typeText.startsWith(":")) typeText = typeText.slice(1).trim();

  const defaults = new Map<string, string>();
  const bindable = new Set<string>();
  for (const seg of splitTopLevel(destrBody)) {
    const clean = stripComments(seg).trim();
    if (!clean || clean.startsWith("...")) continue;
    const eq = clean.indexOf("=");
    const lhs = eq === -1 ? clean : clean.slice(0, eq);
    let def = eq === -1 ? undefined : clean.slice(eq + 1).trim();
    const key = lhs.split(":")[0].trim().replace(/['"]/g, "");
    if (def?.startsWith("$bindable(")) {
      bindable.add(key);
      const inner = def
        .slice(def.indexOf("(") + 1, def.lastIndexOf(")"))
        .trim();
      if (inner) defaults.set(key, inner);
    } else if (def) {
      defaults.set(key, def);
    }
  }

  const objOpen = typeText.indexOf("{");
  const objClose = objOpen === -1 ? -1 : matchingBrace(typeText, objOpen);
  const objBody =
    objOpen !== -1 && objClose !== -1
      ? typeText.slice(objOpen + 1, objClose)
      : typeText;

  for (const seg of splitTopLevel(objBody)) {
    const clean = stripComments(seg).trim();
    const m = clean.match(
      /^(['"][^'"]+['"]|[A-Za-z_$][\w$]*)(\??)\s*:\s*(.+)$/,
    );
    if (!m) continue;
    const name = m[1].replace(/['"]/g, "");
    const optional = !!m[2];
    let type = m[3].trim().replace(/[,;]+$/, "");
    if (type.includes("HTMLInputAttributes") || type.startsWith("&")) continue;
    const hasDefault = defaults.has(name);
    props.push({
      name,
      type,
      required: !optional && !hasDefault,
      default: defaults.get(name),
      bindable: bindable.has(name),
      snippet: type.startsWith("Snippet"),
    });
  }
  return props;
}

const sources = import.meta.glob("../../lib/components/**/*.svelte", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

export const propsCatalog: Record<string, PropInfo[]> = {};
for (const [path, source] of Object.entries(sources)) {
  const name = path.split("/").pop()!.replace(".svelte", "");
  propsCatalog[name] = parseProps(source);
}
