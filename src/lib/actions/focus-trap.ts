// Shared focus-trap: cycles Tab/Shift+Tab inside `panelEl`, matching the
// behaviour already in Dialog.svelte (WCAG 2.4.3).  Used by Dialog and Sidebar
// (when in overlay / mobile modal mode).

import { tick } from "svelte";

const FOCUSABLE =
  'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

export function trapFocus(panelEl: HTMLElement, onClose: () => void) {
  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
      return;
    }
    if (e.key !== "Tab") return;
    const focusable = Array.from(
      panelEl.querySelectorAll<HTMLElement>(FOCUSABLE),
    );
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };
  document.addEventListener("keydown", onKey);
  tick().then(() => {
    const first = panelEl?.querySelector<HTMLElement>(FOCUSABLE);
    (first ?? panelEl)?.focus();
  });
  return () => document.removeEventListener("keydown", onKey);
}
