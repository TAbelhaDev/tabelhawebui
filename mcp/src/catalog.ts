import { locate } from "./locate.js";
import { componentByName, parseComponents } from "./parse-components.js";
import { parseReadmeDescriptions } from "./parse-readme.js";
import { parseTokens } from "./parse-tokens.js";
import type { Catalog } from "./types.js";

/**
 * Localiza o tabelawebui e monta o catálogo completo (componentes, tokens,
 * accents). Resultado é cacheadado — o source é estático durante a sessão.
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
