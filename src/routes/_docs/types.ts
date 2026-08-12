import type { Component } from "svelte";

export interface Example {
  label: string;
  props?: Record<string, unknown>;
  children?: string;
  code: string;
}

export interface ComponentDoc {
  name: string;
  category: string;
  description: string;
  examples?: Example[];
  preview?: Component<any, any, any>;
}

export interface PropInfo {
  name: string;
  type: string;
  required: boolean;
  default?: string;
  bindable: boolean;
  snippet: boolean;
}
