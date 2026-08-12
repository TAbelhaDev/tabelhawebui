import { locate } from "./locate.js";
import { componentByName, parseComponents } from "./parse-components.js";
import { parseReadmeDescriptions } from "./parse-readme.js";
import { parseTokens } from "./parse-tokens.js";
import type { Catalog } from "./types.js";

/**
 * Locates tabelawebui and builds the full catalog (components, tokens,
 * accents). The result is cached — the source is static during the session.
 */
export async function buildCatalog(sourceArg?: string): Promise<Catalog> {
  const layout = locate(sourceArg);
  const descriptions = await parseReadmeDescriptions(layout.readmeFile);
  const components = await parseComponents(layout, descriptions);
  const { tokens, accents, defaultAccent } = parseTokens(layout.themeCss);
  return {
    layout,
    components,
    tokens,
    accents,
    defaultAccent,
    version: (layout.packageJson?.version as string | undefined) ?? undefined,
  };
}

export { componentByName };
