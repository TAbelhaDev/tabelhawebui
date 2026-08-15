import { render, screen } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import DialogHarness from "./DialogHarness.svelte";

describe("Dialog", () => {
  it("locks the page scroll while open and restores it when closed", async () => {
    const user = userEvent.setup();
    render(DialogHarness);

    await user.click(screen.getByTestId("open"));
    await screen.findByRole("dialog");
    expect(document.body.style.overflow).toBe("hidden");

    await user.click(screen.getByTestId("close"));
    await screen.findByText("dialog a").catch(() => {});
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(document.body.style.overflow).toBe("");
  });

  it("closing by the footer button restores the scroll too", async () => {
    const user = userEvent.setup();
    render(DialogHarness);

    await user.click(screen.getByTestId("open"));
    await screen.findByRole("dialog");
    expect(document.body.style.overflow).toBe("hidden");

    await user.click(screen.getByTestId("footer-close"));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(document.body.style.overflow).toBe("");
  });

  it("applies the size class to the panel", async () => {
    const user = userEvent.setup();
    render(DialogHarness, { size: "lg" });

    await user.click(screen.getByTestId("open"));
    const dialog = await screen.findByRole("dialog");
    expect(dialog.classList.contains("twui-dialog-lg")).toBe(true);
    expect(dialog.classList.contains("twui-dialog-md")).toBe(false);

    await user.click(screen.getByTestId("close"));
  });

  it("keeps the scroll locked while a nested dialog is still open", async () => {
    const user = userEvent.setup();
    render(DialogHarness, { nested: true });

    await user.click(screen.getByTestId("open"));
    await screen.findByText("dialog a");
    expect(document.body.style.overflow).toBe("hidden");

    // Second dialog on top.
    await user.click(screen.getByTestId("open-b"));
    await screen.findByText("dialog b");
    expect(document.body.style.overflow).toBe("hidden");

    // The outer dialog closes first — the lock must stay because `b` is open.
    await user.click(screen.getByTestId("close"));
    expect(screen.queryByText("dialog a")).not.toBeInTheDocument();
    expect(document.body.style.overflow).toBe("hidden");

    await user.click(screen.getByTestId("close-b"));
    expect(screen.queryByText("dialog b")).not.toBeInTheDocument();
    expect(document.body.style.overflow).toBe("");
  });
});
