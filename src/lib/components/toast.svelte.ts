// Toast simples e autocontido — substitui o svelte-sonner. O store é um
// módulo Svelte 5 (`$state` em .svelte.js) importável de qualquer lugar; o
// <Toaster> do tabelawebui é o único que renderiza.

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
  // Auto-dismiss (exceto toasts com action, tipo "nova versão disponível").
  if (!opts?.action) {
    setTimeout(() => dismiss(id), 4000);
  }
}

type ToastOptions = { action?: Toast["action"] };

export interface ToastApi {
  (message: string, opts?: ToastOptions): void;
  success(message: string, opts?: ToastOptions): void;
  error(message: string): void;
  info(message: string): void;
  warning(message: string): void;
}

// Chamável (`toast('msg', opts)`) e com métodos (`toast.success('msg')`).
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
