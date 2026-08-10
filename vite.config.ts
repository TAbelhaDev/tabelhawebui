import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig(({ mode }) => ({
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
