#!/usr/bin/env node
import { parseArgs } from "./locate.js";
import { createServer } from "./server.js";

const { source } = parseArgs(process.argv.slice(2));

try {
  const { connect } = await createServer(source);
  await connect();
} catch (e) {
  console.error(`[tabelhawebui-mcp] ${(e as Error).message}`);
  process.exit(1);
}
