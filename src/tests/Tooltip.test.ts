import { render, screen } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import TooltipHarness from "./TooltipHarness.svelte";

// The bubble used to live in a ::after pseudo-element, which is not part of the
// accessibility tree: the label existed visually and nowhere else. These tests
// pin the contract that replaced it.
describe("Tooltip", () => {
  const wrapperOf = (container: HTMLElement) =>
    container.querySelector(".twui-tooltip") as HTMLElement;

  it("exposes the label to assistive tech via aria-describedby", () => {
    const { container } = render(TooltipHarness, { label: "Copiar link" });

    const bubble = screen.getByRole("tooltip");
    expect(bubble).toHaveTextContent("Copiar link");
    expect(bubble.id).toBeTruthy();
    expect(wrapperOf(container)).toHaveAttribute("aria-describedby", bubble.id);
  });

  it("shows the bubble on hover and hides it again on leave", async () => {
    const user = userEvent.setup();
    const { container } = render(TooltipHarness);
    const wrapper = wrapperOf(container);

    expect(wrapper).not.toHaveClass("twui-tooltip-visible");

    await user.hover(wrapper);
    expect(wrapper).toHaveClass("twui-tooltip-visible");

    await user.unhover(wrapper);
    expect(wrapper).not.toHaveClass("twui-tooltip-visible");
  });

  it("shows the bubble on keyboard focus, not only on hover", async () => {
    const user = userEvent.setup();
    const { container } = render(TooltipHarness);
    const wrapper = wrapperOf(container);

    await user.tab();
    expect(screen.getByRole("button")).toHaveFocus();
    expect(wrapper).toHaveClass("twui-tooltip-visible");
  });

  it("dismisses with Escape without moving the pointer (WCAG 1.4.13)", async () => {
    const user = userEvent.setup();
    const { container } = render(TooltipHarness);
    const wrapper = wrapperOf(container);

    await user.hover(wrapper);
    expect(wrapper).toHaveClass("twui-tooltip-visible");

    await user.keyboard("{Escape}");
    expect(wrapper).not.toHaveClass("twui-tooltip-visible");

    // Escape suppresses the current showing; it does not disable the tooltip.
    await user.unhover(wrapper);
    await user.hover(wrapper);
    expect(wrapper).toHaveClass("twui-tooltip-visible");
  });
});
