// Shared scroll-lock counter: document.body.style.overflow is locked while ANY
// consumer (Dialog, Sidebar overlay, …) is open, and only restored when the
// last one closes.  This prevents the bug where closing one modal unlocks scroll
// while another is still visible.

let openCount = 0;

export function lockScroll() {
  if (openCount === 0) {
    document.body.style.overflow = "hidden";
  }
  openCount += 1;
  return () => {
    openCount -= 1;
    if (openCount === 0) {
      document.body.style.overflow = "";
    }
  };
}
