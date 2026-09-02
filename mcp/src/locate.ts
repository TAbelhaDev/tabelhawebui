import { existsSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join, resolve } from "node:path";
import type { SourceLayout } from "./types.js";

const require = createRequire(import.meta.url);

interface CliArgs {
  /** `--source <dir>` */
  source?: string;
}

export function parseArgs(argv: string[]): CliArgs {
  const args: CliArgs = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--source" || a === "-s") {
      args.source = argv[i + 1];
      i++;
    } else if (a?.startsWith("--source=")) {
      args.source = a.slice("--source=".length);
    }
  }
  return args;
}

/** Where to look for the package: env TWUI_MCP_SOURCE > --source > cwd resolution. */
function resolveRoot(sourceArg?: string): string | undefined {
  if (sourceArg) return resolve(process.cwd(), sourceArg);
  const env = process.env.TWUI_MCP_SOURCE;
  if (env) return resolve(process.cwd(), env);

  // cwd is the tabelhawebui repo (e.g. running from inside it)
  const cwdPkg = join(process.cwd(), "package.json");
  if (existsSync(cwdPkg)) {
    try {
      const pkg = JSON.parse(readPkg(cwdPkg)) as { name?: string };
      if (pkg.name === "@tabelhadev/tabelhawebui") return process.cwd();
    } catch {
      /* ignore */
    }
  }

  // Resolve `@tabelhadev/tabelhawebui` from cwd (walks up node_modules).
  try {
    const entry = require.resolve("@tabelhadev/tabelhawebui", {
      paths: [process.cwd()],
    });
    // entry points at dist/index.js (or theme.css) — the package root is its dirname.
    const pkgJson = findPackageJson(dirname(entry));
    if (pkgJson) return dirname(pkgJson);
  } catch {
    /* not resolvable from cwd */
  }
  return undefined;
}

function readPkg(path: string): string {
  return readFileSync(path, "utf8");
}

function findPackageJson(startDir: string): string | undefined {
  let dir = startDir;
  for (let i = 0; i < 20; i++) {
    const candidate = join(dir, "package.json");
    if (existsSync(candidate)) return candidate;
    const parent = dirname(dir);
    if (parent === dir) return undefined;
    dir = parent;
  }
  return undefined;
}

function describeLayout(root: string): SourceLayout {
  const repoComponents = join(root, "src", "lib", "components");
  const repoTheme = join(root, "src", "lib", "theme", "theme.css");
  const repoIndex = join(root, "src", "lib", "index.ts");

  const distComponents = join(root, "dist", "components");
  const distTheme = join(root, "dist", "theme", "theme.css");
  const distIndex = join(root, "dist", "index.d.ts");

  const readme = join(root, "README.md");

  let pkg: Record<string, unknown> | undefined;
  try {
    pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
  } catch {
    /* no package.json */
  }

  if (existsSync(repoIndex) && existsSync(repoComponents)) {
    return {
      kind: "repo",
      root,
      indexFile: repoIndex,
      componentsDir: repoComponents,
      themeCss: existsSync(repoTheme) ? repoTheme : distTheme,
      readmeFile: existsSync(readme) ? readme : undefined,
      packageJson: pkg,
    };
  }
  if (existsSync(distIndex) && existsSync(distComponents)) {
    return {
      kind: "dist",
      root,
      indexFile: distIndex,
      componentsDir: distComponents,
      themeCss: existsSync(distTheme) ? distTheme : repoTheme,
      readmeFile: existsSync(readme) ? readme : undefined,
      packageJson: pkg,
    };
  }
  return {
    kind: "dist",
    root,
    indexFile: distIndex,
    componentsDir: distComponents,
    themeCss: distTheme,
    packageJson: pkg,
  };
}

/** Locates the tabelhawebui source (repo checkout or published package). */
export function locate(sourceArg?: string): SourceLayout {
  const root = resolveRoot(sourceArg);
  if (!root) {
    throw new Error(
      "tabelhawebui not found. Install the package in the project (bun add @tabelhadev/tabelhawebui) " +
        "or point at a checkout with TWUI_MCP_SOURCE or --source <dir>.",
    );
  }
  return describeLayout(root);
}
