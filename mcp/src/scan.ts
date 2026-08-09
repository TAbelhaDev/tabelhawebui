/**
 * Utilitários de varredura de texto usados pelos parsers. Tratam strings,
 * template literals (`...${...}`), comentários de linha e bloco, e
 * aninhamento de `()`, `[]`, `{}`, `<>` — pra splitar no topo só onde
 * faz sentido.
 */

export interface Segment {
  value: string;
  start: number;
  end: number;
}

function skipString(text: string, start: number, quote: string): number {
  const n = text.length;
  let i = start + 1;
  if (quote === "`") {
    let depth = 0;
    while (i < n) {
      const c = text[i];
      if (c === "\\") {
        i += 2;
        continue;
      }
      if (c === "`" && depth === 0) return i + 1;
      if (c === "$" && text[i + 1] === "{") {
        depth++;
        i += 2;
        continue;
      }
      if (c === "}" && depth > 0) depth--;
      i++;
    }
    return n;
  }
  while (i < n) {
    const c = text[i];
    if (c === "\\") {
      i += 2;
      continue;
    }
    if (c === quote) return i + 1;
    i++;
  }
  return n;
}

/** Índices dos separadores que estão no depth 0 (fora de aninhamento). */
export function findTopLevelSeps(text: string, seps: string): number[] {
  const sepSet = new Set(seps);
  const out: number[] = [];
  const stack: string[] = [];
  const n = text.length;
  let i = 0;
  while (i < n) {
    const c = text[i] as string;
    const next = text[i + 1];
    if (c === "/" && next === "/") {
      const end = text.indexOf("\n", i);
      i = end === -1 ? n : end + 1;
      continue;
    }
    if (c === "/" && next === "*") {
      const end = text.indexOf("*/", i + 2);
      i = end === -1 ? n : end + 2;
      continue;
    }
    if (c === "'" || c === '"' || c === "`") {
      i = skipString(text, i, c);
      continue;
    }
    if (c === "<") {
      // Genérico de tipo (Array<...>, Record<...>, Snippet<...>): só conta como
      // abertura se vier depois de identificador (evita `=>`, comparações).
      const prev = previousChar(text, i);
      if (prev && /[A-Za-z0-9_$]/.test(prev)) stack.push("<");
      i++;
      continue;
    }
    if (c === ">") {
      if (stack[stack.length - 1] === "<") stack.pop();
      i++;
      continue;
    }
    if (stack.length === 0) {
      if (sepSet.has(c)) out.push(i);
      if (c === "{" || c === "(" || c === "[") stack.push(c);
    } else {
      const top = stack[stack.length - 1];
      if (
        (c === "}" && top === "{") ||
        (c === ")" && top === "(") ||
        (c === "]" && top === "[")
      ) {
        stack.pop();
      } else if (c === "{" || c === "(" || c === "[") {
        stack.push(c);
      }
    }
    i++;
  }
  return out;
}

function previousChar(text: string, idx: number): string | undefined {
  for (let j = idx - 1; j >= 0; j--) {
    const c = text[j];
    if (c === "\n" || c === " " || c === "\t" || c === "\r") continue;
    return c;
  }
  return undefined;
}

/** Splita `text` nos separadores de topo. Comentário `//` no fim de uma linha
 *  é preservado dentro do segmento (usado como descrição de prop). */
export function splitTopLevel(text: string, seps: string): Segment[] {
  const idx = findTopLevelSeps(text, seps);
  const segs: Segment[] = [];
  let start = 0;
  for (const i of idx) {
    segs.push({ value: text.slice(start, i), start, end: i });
    start = i + 1;
  }
  segs.push({ value: text.slice(start), start, end: text.length });
  return segs.filter((s) => s.value.trim().length > 0);
}

/** Índice do `close` que casa com o `open` na posição `openIdx`. */
export function matchClose(
  text: string,
  openIdx: number,
  open: string,
  close: string,
): number {
  let depth = 0;
  const n = text.length;
  let i = openIdx;
  while (i < n) {
    const c = text[i];
    const next = text[i + 1];
    if (c === "/" && next === "/") {
      const end = text.indexOf("\n", i);
      i = end === -1 ? n : end + 1;
      continue;
    }
    if (c === "/" && next === "*") {
      const end = text.indexOf("*/", i + 2);
      i = end === -1 ? n : end + 2;
      continue;
    }
    if (c === "'" || c === '"' || c === "`") {
      i = skipString(text, i, c);
      continue;
    }
    if (c === open) depth++;
    else if (c === close) {
      depth--;
      if (depth === 0) return i;
    }
    i++;
  }
  return -1;
}

/** Índice do separador no topo (depth 0) dentro de `text`, ou -1. */
export function topLevelIndexOf(text: string, sep: string): number {
  const idx = findTopLevelSeps(text, sep);
  return idx.length > 0 ? (idx[0] as number) : -1;
}

/** Remove comentários, preservando strings. */
export function stripComments(text: string): string {
  let out = "";
  const n = text.length;
  let i = 0;
  while (i < n) {
    const c = text[i];
    const next = text[i + 1];
    if (c === "'" || c === '"' || c === "`") {
      const end = skipString(text, i, c);
      out += text.slice(i, end);
      i = end;
      continue;
    }
    if (c === "/" && next === "/") {
      const end = text.indexOf("\n", i);
      i = end === -1 ? n : end + 1;
      out += "\n";
      continue;
    }
    if (c === "/" && next === "*") {
      const end = text.indexOf("*/", i + 2);
      i = end === -1 ? n : end + 2;
      out += " ";
      continue;
    }
    out += c;
    i++;
  }
  return out;
}

/** Extrai o último comentário `//` de uma linha em `text`. */
export function lastLineComment(text: string): string | undefined {
  const lines = text.split("\n");
  for (let i = lines.length - 1; i >= 0; i--) {
    const line = lines[i] as string;
    const idx = line.indexOf("//");
    if (idx !== -1) {
      const comment = line.slice(idx + 2).trim();
      if (comment) return comment;
    }
  }
  return undefined;
}

/** Normaliza whitespace (colapsa quebras de linha e espaços múltiplos). */
export function collapseWs(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}
