import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import { readFileSync } from "node:fs";

function devPort() {
  try {
    const cwd = process.cwd();
    const line = readFileSync(
      `${process.env.HOME}/.config/dev-ports.yaml`,
      "utf8",
    )
      .split("\n")
      .find((l) => l.startsWith(`${cwd}: `));
    if (line) return Number(line.slice(cwd.length + 2));
  } catch {}
  return parseInt(process.env.DEV_PORT || "5173", 10);
}

export default defineConfig(({ mode }) => ({
  server: {
    port: devPort(),
  },
  plugins: [sveltekit()],
  test: {
    environment: "jsdom",
    include: ["src/**/*.test.ts"],
    setupFiles: ["src/test-setup.ts"],
  },
  // Without the browser condition Svelte resolves to its server build and
  // mount() is unavailable, so every component test fails on render. Vitest
  // runs in "test" mode, so this never leaks into a real build.
  resolve: mode === "test" ? { conditions: ["browser"] } : undefined,
}));
