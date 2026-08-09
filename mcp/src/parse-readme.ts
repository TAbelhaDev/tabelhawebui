import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { collapseWs } from "./scan.js";

/** Extrai descrições da tabela de componentes do README. */
export async function parseReadmeDescriptions(
  readmeFile?: string,
): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  if (!readmeFile || !existsSync(readmeFile)) return map;

  let text: string;
  try {
    text = await readFile(readmeFile, "utf8");
  } catch {
    return map;
  }

  const row = /^\|\s*`([^`]+)`\s*\|\s*(.+?)\s*\|?$/;
  for (const line of text.split("\n")) {
    const m = line.match(row);
    if (!m) continue;
    const name = (m[1] as string).trim();
    const desc = collapseWs((m[2] as string).replace(/`/g, ""));
    if (name && desc) map.set(name, desc);
  }
  return map;
}
