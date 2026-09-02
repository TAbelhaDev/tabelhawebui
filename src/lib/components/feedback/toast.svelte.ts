// Simple, self-contained toast — replaces svelte-sonner. The store is a
// Svelte 5 module (`$state` in .svelte.js) importable from anywhere; the
// <Toaster> from tabelhawebui is the only one that renders.

export type ToastKind = "success" | "error" | "info" | "warning";

export interface Toast {
  id: number;
  kind: ToastKind;
  message: string;
  action?: { label: string; onClick: () => void };
}

let nextId = 1;

export const toasts: { current: Toast[] } = $state({ current: [] });

export function dismiss(id: number) {
  toasts.current = toasts.current.filter((t) => t.id !== id);
}

function push(
  kind: ToastKind,
  message: string,
  opts?: { action?: Toast["action"] },
) {
  const id = nextId++;
  toasts.current.push({ id, kind, message, action: opts?.action });
  // Auto-dismiss (except toasts with action, like "new version available").
  if (!opts?.action) {
    setTimeout(() => dismiss(id), 4000);
  }
}

type ToastOptions = { action?: Toast["action"]; duration?: number };

export interface ToastApi {
  (message: string, opts?: ToastOptions): void;
  success(message: string, opts?: ToastOptions): void;
  error(message: string): void;
  info(message: string): void;
  warning(message: string): void;
}

// Callable (`toast('msg', opts)`) and with methods (`toast.success('msg')`).
export const toast: ToastApi = Object.assign(
  (message: string, opts?: ToastOptions) => push("info", message, opts),
  {
    success: (message: string, opts?: ToastOptions) =>
      push("success", message, opts),
    error: (message: string) => push("error", message),
    info: (message: string) => push("info", message),
    warning: (message: string) => push("warning", message),
  },
);
