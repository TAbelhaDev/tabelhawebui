import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/svelte";
import { afterEach } from "vitest";

// @testing-library only auto-registers cleanup when vitest globals are on.
// Without this, components from earlier tests stay in the document and
// queries start matching more than one element.
afterEach(cleanup);

// jsdom has no Web Animations API, and Svelte drives transitions through
// element.animate(). Without a stub the outro never finishes, so a component
// that closes with a transition stays in the DOM and every "is gone" assertion
// fails. This resolves each animation immediately, which is what tests want.
if (typeof Element !== "undefined" && !Element.prototype.animate) {
  Element.prototype.animate = function animate() {
    let finishHandler: (() => void) | null = null;
    const animation = {
      currentTime: 0,
      startTime: 0,
      playbackRate: 1,
      playState: "finished",
      effect: null,
      finished: Promise.resolve(),
      pause() {},
      play() {},
      cancel() {},
      finish() {
        finishHandler?.();
      },
      addEventListener() {},
      removeEventListener() {},
      get onfinish() {
        return finishHandler;
      },
      set onfinish(handler: (() => void) | null) {
        finishHandler = handler;
        if (handler) queueMicrotask(handler);
      },
    };
    return animation as unknown as Animation;
  };
}
