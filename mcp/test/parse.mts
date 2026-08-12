import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { parseIndex } from "../dist/parse-components.js";

// parseIndex reads the library's index by pattern, not by parsing TypeScript,
// so it is only as stable as the formatting it assumes. These tests pin the
// two properties that matter: quote style must not change the result, and an
// index it cannot understand must fail loudly instead of reporting an empty
// library.

const dir = mkdtempSync(join(tmpdir(), "twui-parse-"));

function indexWith(quote: '"' | "'"): string {
  const q = quote;
  const path = join(dir, `index-${quote === '"' ? "double" : "single"}.ts`);
  writeFileSync(
    path,
    [
      "// Utilitários",
      `export { default as Table } from ${q}./components/Table.svelte${q};`,
      `export { default as Badge } from ${q}./components/Badge.svelte${q};`,
      `export { toast } from ${q}./components/toast.svelte.js${q};`,
      "",
    ].join("\n"),
    "utf8",
  );
  return path;
}

const withDouble = parseIndex(indexWith('"'));
const withSingle = parseIndex(indexWith("'"));

assert.deepEqual(
  withDouble.map((e) => e.name),
  ["Table", "Badge", "toast"],
  "double-quoted index should yield the components and the toast store",
);
assert.deepEqual(
  withSingle.map((e) => e.name),
  withDouble.map((e) => e.name),
  "quote style must not change the parsed component list",
);
console.log("ok: parseIndex é indiferente ao estilo de aspas");

const emptyPath = join(dir, "index-unrecognized.ts");
writeFileSync(emptyPath, "export * from './somewhere-else';\n", "utf8");
assert.throws(
  () => parseIndex(emptyPath),
  /nenhum export reconhecido/,
  "an unrecognized index must throw, not report an empty library",
);
console.log("ok: parseIndex falha alto quando não reconhece o index");

const nestedPath = join(dir, "index-nested.ts");
writeFileSync(
  nestedPath,
  [
    "// Dados",
    `export { default as Table } from ${'"'}./components/table/Table.svelte${'"'};`,
    "// Feedback",
    `export { toast } from ${'"'}./components/feedback/toast.svelte.js${'"'};`,
    "",
  ].join("\n"),
  "utf8",
);
const nested = parseIndex(nestedPath);
assert.deepEqual(
  nested.map((e) => [e.name, e.kind, e.file]),
  [
    ["Table", "component", "table/Table.svelte"],
    ["toast", "store", undefined],
  ],
  "subfolder component paths must parse with the folder prefix; the store is still detected",
);
console.log(
  "ok: parseIndex reads exports in subfolders (components/<domain>/)",
);

const multilinePath = join(dir, "index-multiline.ts");
writeFileSync(
  multilinePath,
  [
    "// Ações",
    'export {',
    "  buttonVariants,",
    '  default as Button,',
    '} from "./components/actions/Button.svelte";',
    "",
  ].join("\n"),
  "utf8",
);
const multiline = parseIndex(multilinePath);
assert.deepEqual(
  multiline.map((e) => [e.name, e.kind, e.file]),
  [
    ["buttonVariants", "function", undefined],
    ["Button", "component", "actions/Button.svelte"],
  ],
  "a prettier-broken multiline export must still parse",
);
console.log("ok: parseIndex parses a prettier-broken multiline export");

console.log("\nTUDO OK");
