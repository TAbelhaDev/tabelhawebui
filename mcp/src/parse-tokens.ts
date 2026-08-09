import { existsSync, readFileSync } from "node:fs";
import { collapseWs } from "./scan.js";
import type { AccentInfo, TokenGroup, TokenInfo } from "./types.js";

interface RawVar {
  name: string;
  value: string;
  selector: string;
}

/** Extrai todas as declarações `--...: valor;` com o seletor do bloco. */
function collectVars(css: string): RawVar[] {
  const out: RawVar[] = [];
  const selectorStack: string[] = [];
  let buf = "";
  let depth = 0;
  let i = 0;
  let inComment = false;
  const n = css.length;
  while (i < n) {
    const c = css[i] as string;
    const nx = css[i + 1];
    if (c === "/" && nx === "*") {
      inComment = true;
      i += 2;
      continue;
    }
    if (inComment) {
      if (c === "*" && nx === "/") {
        inComment = false;
        i += 2;
      } else i++;
      continue;
    }
    if (c === "{") {
      selectorStack.push(collapseWs(buf));
      buf = "";
      depth++;
      i++;
      continue;
    }
    if (c === "}") {
      selectorStack.pop();
      depth--;
      buf = "";
      i++;
      continue;
    }
    if (depth > 0 && c === "-" && nx === "-") {
      const m = /^--[\w-]+\s*:/.exec(css.slice(i));
      if (m) {
        const name = (m[0] as string).replace(/\s*:$/, "");
        const start = i + m[0].length;
        let j = start;
        let pd = 0;
        while (j < n) {
          const cc = css[j] as string;
          if (cc === "(") pd++;
          else if (cc === ")") pd--;
          else if (cc === ";" && pd <= 0) break;
          j++;
        }
        const value = collapseWs(css.slice(start, j));
        out.push({
          name,
          value,
          selector: selectorStack[selectorStack.length - 1] ?? "",
        });
        i = j + 1;
        continue;
      }
    }
    buf += c;
    i++;
  }
  return out;
}

const LIGHT = ":root";
const DARK = '[data-theme="dark"], .dark';
const LIGHT_PALETTE = ':root, [data-theme="light"]';

const ACTIVE_NEUTRALS = new Set([
  "base",
  "mantle",
  "crust",
  "surface0",
  "surface1",
  "surface2",
  "overlay0",
  "overlay1",
  "overlay2",
  "subtext0",
  "subtext1",
  "text",
]);

const ACTIVE_COLORS = new Set([
  "rosewater",
  "flamingo",
  "pink",
  "mauve",
  "red",
  "maroon",
  "peach",
  "yellow",
  "green",
  "teal",
  "sky",
  "sapphire",
  "blue",
  "lavender",
]);

const SEMANTIC = new Set([
  "paper",
  "paper-raised",
  "ink",
  "ink-soft",
  "ink-faint",
  "rule",
  "accent",
  "accent-soft",
  "signal",
  "signal-soft",
  "danger",
]);

function tokenGroup(name: string): TokenGroup {
  const short = name.replace(/^--twui-/, "");
  if (short.startsWith("latte-") || short.startsWith("mocha-")) {
    return "palette-full";
  }
  if (short === "font-mono" || short === "font-serif") return "font";
  if (short === "shadow-offset") return "shadow";
  if (ACTIVE_NEUTRALS.has(short) || ACTIVE_COLORS.has(short)) {
    return "palette-active";
  }
  return "semantic";
}

function resolveVars(
  value: string,
  lookup: Map<string, string>,
  depth = 0,
): { value: string; resolved: boolean } {
  if (depth > 4 || !value) return { value, resolved: false };
  const direct = value.match(/^var\((--[\w-]+)\)$/);
  if (direct) {
    const inner = lookup.get(direct[1] as string);
    if (inner !== undefined) {
      return resolveVars(inner, lookup, depth + 1);
    }
    return { value, resolved: false };
  }
  let out = value;
  let remainingVar = false;
  out = out.replace(/var\((--[\w-]+)\)/g, (_, name: string) => {
    const v = lookup.get(name);
    if (v === undefined) {
      remainingVar = true;
      return `var(${name})`;
    }
    return v;
  });
  // normalize espaços internos de funções css: color-mix( a, b )
  out = out.replace(/\(\s+/g, "(").replace(/\s+\)/g, ")");
  return { value: out, resolved: !remainingVar };
}

export interface TokenParse {
  tokens: TokenInfo[];
  accents: AccentInfo[];
  defaultAccent: { light: string; dark: string };
}

/** Parseia `theme.css`: tokens `--twui-*` (light/dark) + accents `data-accent`. */
export function parseTokens(themeCss: string): TokenParse {
  if (!existsSync(themeCss)) {
    throw new Error(`theme.css não encontrado em ${themeCss}`);
  }
  const css = readFileSync(themeCss, "utf8");
  const vars = collectVars(css);

  const lightMap = new Map<string, string>();
  const darkMap = new Map<string, string>();
  const lightPaletteMap = new Map<string, string>();
  const darkPaletteMap = new Map<string, string>();
  const accentLight = new Map<string, string>();
  const accentDark = new Map<string, string>();

  for (const v of vars) {
    if (v.name.startsWith("--twui-latte-")) {
      lightMap.set(v.name, v.value);
      continue;
    }
    if (v.name.startsWith("--twui-mocha-")) {
      darkMap.set(v.name, v.value);
      continue;
    }
    if (v.selector === LIGHT) {
      lightMap.set(v.name, v.value);
      continue;
    }
    if (v.selector === LIGHT_PALETTE) {
      lightPaletteMap.set(v.name, v.value);
      continue;
    }
    if (v.selector === DARK) {
      darkMap.set(v.name, v.value);
      darkPaletteMap.set(v.name, v.value);
      continue;
    }
    // accent rules: `:root[data-accent="x"]` / `[data-theme="dark"][data-accent="x"]`
    const lightAccent = v.selector.match(/^:root\[data-accent="([^"]+)"\]$/);
    if (lightAccent) {
      accentLight.set(lightAccent[1] as string, v.value);
      continue;
    }
    const darkAccent = v.selector.match(
      /^\[data-theme="dark"\]\[data-accent="([^"]+)"\], \.dark\[data-accent="([^"]+)"\]$/,
    );
    if (darkAccent) {
      accentDark.set(darkAccent[1] as string, v.value);
    }
  }

  // --- tokens ---
  const rawLookup = (map: Map<string, string>) =>
    new Map<string, string>([...map]);

  const byName = new Map<
    string,
    { group: TokenGroup; light?: string; dark?: string; resolved?: boolean }
  >();

  const resolveLight = (name: string) => {
    const raw = lightMap.get(name) ?? lightPaletteMap.get(name);
    if (raw === undefined) return undefined;
    return resolveVars(raw, rawLookup(lightMap));
  };
  const resolveDark = (name: string) => {
    const raw = darkMap.get(name);
    if (raw === undefined) return undefined;
    return resolveVars(raw, rawLookup(darkMap));
  };

  const allNames = new Set<string>([
    ...lightMap.keys(),
    ...darkMap.keys(),
    ...lightPaletteMap.keys(),
  ]);

  for (const name of allNames) {
    const l = resolveLight(name);
    const d = resolveDark(name);
    byName.set(name, {
      group: tokenGroup(name),
      light: l?.value,
      dark: d?.value,
      resolved: l?.resolved || d?.resolved,
    });
  }

  const GROUP_ORDER: Record<TokenGroup, number> = {
    semantic: 0,
    font: 1,
    shadow: 2,
    "palette-active": 3,
    "palette-full": 4,
  };
  const tokens = [...byName.entries()]
    .map(([name, t]) => ({ name, ...t }) as TokenInfo)
    .sort(
      (a, b) =>
        GROUP_ORDER[a.group] - GROUP_ORDER[b.group] ||
        a.name.localeCompare(b.name),
    );

  // --- accents ---
  const accents: AccentInfo[] = [];
  for (const [name, lightVar] of accentLight) {
    const darkVar = accentDark.get(name);
    const latte = lightVar
      ? resolveVars(lightVar, rawLookup(lightMap))
      : undefined;
    const mocha = darkVar
      ? resolveVars(darkVar, rawLookup(darkMap))
      : undefined;
    accents.push({
      name,
      latte: latte?.value ?? "",
      mocha: mocha?.value ?? "",
    });
  }
  accents.sort((a, b) => a.name.localeCompare(b.name));

  const defaultLight = resolveLight("--twui-accent");
  const defaultDark = resolveDark("--twui-accent");

  return {
    tokens,
    accents,
    defaultAccent: {
      light: defaultLight?.value ?? "",
      dark: defaultDark?.value ?? "",
    },
  };
}
