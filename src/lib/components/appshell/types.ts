import type { Snippet } from "svelte";

export interface AppShellNavItem {
  href: string;
  label: string;
  icon?: Snippet;
}
