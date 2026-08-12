export interface PropInfo {
  name: string;
  type: string;
  required: boolean;
  /** Literal default value (from destructuring). undefined when none. */
  default?: string;
  /** Bindable prop (`$bindable(...)`). */
  bindable?: boolean;
  /** Inline comment from the source, when present. */
  description?: string;
}

export interface SnippetInfo {
  name: string;
  type: string;
  required: boolean;
}

export type ComponentKind = "component" | "store" | "function";

export interface ComponentInfo {
  name: string;
  kind: ComponentKind;
  /** Defining file (relative to the package root). */
  file: string;
  /** Public export name (e.g. `Card.Header`). */
  exportedAs?: string;
  /** Category from the README/index (e.g. Form Controls). */
  category?: string;
  description?: string;
  props: PropInfo[];
  /** Props of Snippet type (children, cell, footer, ...). */
  snippets: SnippetInfo[];
  /** Names of bindable props. */
  bindable: string[];
  /** HTML types the component inherits via `...rest` (e.g. HTMLButtonAttributes). */
  inherits: string[];
  /** Generated usage example. */
  usage?: string;
}

export type TokenGroup =
  | "semantic"
  | "font"
  | "shadow"
  | "palette-active"
  | "palette-full";

export interface TokenInfo {
  name: string;
  group: TokenGroup;
  /** Value in the light theme (Latte), resolving var() where possible. */
  light?: string;
  /** Value in the dark theme (Mocha). */
  dark?: string;
  /** true when the value is a resolved hex; false when it is raw var()/color-mix. */
  resolved?: boolean;
}

export interface AccentInfo {
  name: string;
  latte: string;
  mocha: string;
}

export interface SourceLayout {
  kind: "repo" | "dist";
  root: string;
  indexFile: string;
  componentsDir: string;
  themeCss: string;
  readmeFile?: string;
  packageJson?: Record<string, unknown>;
}

export interface Catalog {
  layout: SourceLayout;
  components: ComponentInfo[];
  tokens: TokenInfo[];
  accents: AccentInfo[];
  /** Default accent (no data-accent): maroon in light, pink in dark. */
  defaultAccent: { light: string; dark: string };
  version?: string;
}
