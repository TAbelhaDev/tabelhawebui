import { spawn } from "node:child_process";
import assert from "node:assert/strict";

// Smoke test of the MCP server over stdio. Usage: `bun test` or
// `tsx test/client.mts [--source <dir>]`. Without --source, uses the parent
// repo (tabelawebui root, where the source lives).
const cwd = new URL("..", import.meta.url).pathname;
const sourceArg = process.argv.includes("--source")
  ? (process.argv[process.argv.indexOf("--source") + 1] as string)
  : new URL("../..", import.meta.url).pathname;

const child = spawn(
  process.execPath,
  ["dist/index.js", "--source", sourceArg],
  { cwd },
);

child.stderr.setEncoding("utf8");
child.stderr.on("data", (d) => process.stderr.write(d));

let nextId = 1;
const pending = new Map<
  number,
  { resolve: (v: unknown) => void; reject: (e: Error) => void }
>();
let tail = "";

child.stdout.setEncoding("utf8");
child.stdout.on("data", (d) => {
  tail += d;
  let nl: number;
  while ((nl = tail.indexOf("\n")) !== -1) {
    const line = tail.slice(0, nl);
    tail = tail.slice(nl + 1);
    if (!line.trim()) continue;
    try {
      const msg = JSON.parse(line);
      const p = msg.id !== undefined ? pending.get(msg.id) : undefined;
      if (p) {
        pending.delete(msg.id);
        msg.error
          ? p.reject(new Error(JSON.stringify(msg.error)))
          : p.resolve(msg.result);
      }
    } catch {
      process.stderr.write("bad line: " + line + "\n");
    }
  }
});

function send(method: string, params: unknown): Promise<any> {
  const id = nextId++;
  child.stdin.write(
    JSON.stringify({ jsonrpc: "2.0", id, method, params }) + "\n",
  );
  return new Promise((resolve, reject) => pending.set(id, { resolve, reject }));
}

function text(result: any): any {
  return JSON.parse(result.content[0].text);
}

async function main() {
  const init = await send("initialize", {
    protocolVersion: "2025-06-18",
    capabilities: {},
    clientInfo: { name: "test-client", version: "0.0.0" },
  });
  assert.equal(init.serverInfo.name, "tabelawebui");
  console.log("ok: initialize");

  const tools = await send("tools/list", {});
  const names = tools.tools.map((t: any) => t.name);
  assert.deepEqual(names.sort(), [
    "get_component",
    "get_token",
    "list_accents",
    "list_components",
    "list_tokens",
  ]);
  console.log("ok: tools/list =", names.join(", "));

  const lc = text(
    await send("tools/call", { name: "list_components", arguments: {} }),
  );
  assert.ok(lc.count > 40, `expected >40 components, got ${lc.count}`);
  assert.ok(lc.components.some((c: any) => c.name === "Button"));
  console.log(`ok: list_components (${lc.count})`);

  const gb = text(
    await send("tools/call", {
      name: "get_component",
      arguments: { component: "Button" },
    }),
  );
  assert.equal(gb.component.name, "Button");
  assert.ok(gb.component.props.some((p: any) => p.name === "variant"));
  assert.ok(gb.component.usage.includes("<Button"));
  console.log(
    "ok: get_component(Button) props=",
    gb.component.props.map((p: any) => p.name).join(","),
  );

  const gs = text(
    await send("tools/call", {
      name: "get_component",
      arguments: { component: "table" },
    }),
  );
  assert.equal(gs.component.name, "Table");
  assert.ok(gs.component.bindable.includes("pageSize"));
  console.log(
    "ok: get_component(table) bindable=",
    gs.component.bindable.join(","),
  );

  const nf = await send("tools/call", {
    name: "get_component",
    arguments: { component: "NaoExiste" },
  });
  assert.equal(nf.isError, true);
  console.log("ok: get_component(NaoExiste) -> isError");

  const lt = text(
    await send("tools/call", { name: "list_tokens", arguments: {} }),
  );
  assert.ok(lt.count >= 80, `expected >=80 tokens, got ${lt.count}`);
  const accentTok = lt.tokens.find((t: any) => t.name === "--twui-accent");
  assert.ok(accentTok?.light && accentTok?.dark);
  console.log(
    `ok: list_tokens (${lt.count}) accent=${accentTok.light}/${accentTok.dark}`,
  );

  const gt = text(
    await send("tools/call", {
      name: "get_token",
      arguments: { token: "paper" },
    }),
  );
  assert.equal(gt.name, "--twui-paper");
  assert.equal(gt.group, "semantic");
  console.log(`ok: get_token(paper) ${gt.light}/${gt.dark}`);

  const la = text(
    await send("tools/call", { name: "list_accents", arguments: {} }),
  );
  assert.ok(la.accents.length >= 11);
  assert.ok(la.default.light && la.default.dark);
  console.log(
    `ok: list_accents (${la.accents.length}) default=${la.default.light}/${la.default.dark}`,
  );

  child.kill();
  console.log("\nALL OK");
  process.exit(0);
}

main().catch((e) => {
  console.error("FAILED:", e.message);
  child.kill();
  process.exit(1);
});
