// Shared combobox keyboard navigation: ArrowUp/Down move an active index,
// Enter confirms the active item, Escape closes.  Used by Select and TagInput.

export function comboboxKeydown(params: {
  open: boolean;
  activeIndex: number;
  itemCount: number;
  onActiveIndexChange: (i: number) => void;
  onClose: () => void;
  onConfirm: (index: number) => void;
  onOpen?: () => void;
}): (e: KeyboardEvent) => void {
  return (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      params.onClose();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!params.open && params.onOpen) {
        params.onOpen();
        return;
      }
      params.onActiveIndexChange(
        Math.min(params.activeIndex + 1, params.itemCount - 1),
      );
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      params.onActiveIndexChange(Math.max(params.activeIndex - 1, 0));
      return;
    }
    if (e.key === "Enter" && params.open && params.activeIndex >= 0) {
      e.preventDefault();
      params.onConfirm(params.activeIndex);
    }
  };
}
