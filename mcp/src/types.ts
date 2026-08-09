export interface PropInfo {
  name: string;
  type: string;
  required: boolean;
  /** Valor default literal (do destructuring). undefined quando não tem. */
  default?: string;
  /** Prop bindável (`$bindable(...)`). */
  bindable?: boolean;
  /** Comentário inline no source, quando houver. */
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
  /** Arquivo que define (relativo à raiz do pacote). */
  file: string;
  /** Nome público de exportação (ex.: `Card.Header`). */
  exportedAs?: string;
  /** Categoria do README/index (ex.: Form Controls). */
  category?: string;
  description?: string;
  props: PropInfo[];
  /** Props do tipo Snippet (children, cell, footer, ...). */
  snippets: SnippetInfo[];
  /** Nomes das props bindables. */
  bindable: string[];
  /** Tipos HTML que o componente herda via `...rest` (ex.: HTMLButtonAttributes). */
  inherits: string[];
  /** Exemplo de uso gerado. */
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
  /** Valor no tema claro (Latte), resolvendo var() onde possível. */
  light?: string;
  /** Valor no tema escuro (Mocha). */
  dark?: string;
  /** true quando o valor é um hex/resolvido; false quando é var()/color-mix cru. */
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
  /** Accent padrão (sem data-accent): maroon no claro, pink no escuro. */
  defaultAccent: { light: string; dark: string };
  version?: string;
}
