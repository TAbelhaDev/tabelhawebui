// Shared Svelte action: fires `callback` on pointerdown outside the node.
// Used by Dropdown, Select, TagInput, DatePicker, MultiSelect.

export function clickOutside(node: HTMLElement, callback: () => void) {
  function handler(e: PointerEvent) {
    if (!node.contains(e.target as Node)) callback();
  }
  document.addEventListener("pointerdown", handler);
  return {
    destroy: () => document.removeEventListener("pointerdown", handler),
  };
}
