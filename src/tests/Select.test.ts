import { render, screen } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import Select from "$lib/components/Select.svelte";

const options = [
  { value: "mercado", label: "Mercado" },
  { value: "transporte", label: "Transporte" },
  { value: "saude", label: "Saúde", disabled: true },
];

// The trigger is a plain button carrying aria-haspopup/aria-expanded, so it is
// queried by the button role rather than combobox.
const trigger = () => screen.getByRole("button", { name: "Categoria" });

describe("Select", () => {
  it("shows the placeholder until something is chosen", () => {
    render(Select, { options, placeholder: "Escolher categoria" });
    expect(screen.getByText("Escolher categoria")).toBeInTheDocument();
  });

  it("renders the label of the current value, not the raw value", () => {
    render(Select, { options, value: "transporte" });
    expect(screen.getByText("Transporte")).toBeInTheDocument();
    expect(screen.queryByText("transporte")).not.toBeInTheDocument();
  });

  it("reflects open state on the trigger for assistive tech", async () => {
    const user = userEvent.setup();
    render(Select, { options, "aria-label": "Categoria" });

    expect(trigger()).toHaveAttribute("aria-expanded", "false");
    await user.click(trigger());
    expect(trigger()).toHaveAttribute("aria-expanded", "true");
  });

  it("opens on click and picks an option with the mouse", async () => {
    const user = userEvent.setup();
    render(Select, { options, "aria-label": "Categoria" });

    await user.click(trigger());
    await user.click(screen.getByRole("option", { name: "Mercado" }));

    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(trigger()).toHaveTextContent("Mercado");
  });

  it("is operable from the keyboard alone", async () => {
    const user = userEvent.setup();
    render(Select, { options, "aria-label": "Categoria" });

    await user.tab();
    expect(trigger()).toHaveFocus();

    // ArrowDown opens; a second one moves onto the first option.
    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("listbox")).toBeInTheDocument();

    await user.keyboard("{ArrowDown}{Enter}");
    expect(trigger()).toHaveTextContent("Mercado");
  });

  it("closes on Escape without changing the value", async () => {
    const user = userEvent.setup();
    render(Select, { options, value: "mercado", "aria-label": "Categoria" });

    await user.click(trigger());
    expect(screen.getByRole("listbox")).toBeInTheDocument();

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(trigger()).toHaveTextContent("Mercado");
  });

  it("never selects a disabled option", async () => {
    const user = userEvent.setup();
    render(Select, { options, "aria-label": "Categoria" });

    await user.click(trigger());
    const disabled = screen.getByRole("option", { name: "Saúde" });
    expect(disabled).toBeDisabled();

    await user.click(disabled);
    expect(trigger()).not.toHaveTextContent("Saúde");
  });

  it("filters the options when filter is on", async () => {
    const user = userEvent.setup();
    render(Select, {
      options,
      filter: true,
      filterPlaceholder: "Buscar categoria",
      "aria-label": "Categoria",
    });

    await user.click(trigger());
    await user.type(screen.getByLabelText("Buscar categoria"), "trans");

    expect(
      screen.getByRole("option", { name: "Transporte" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("option", { name: "Mercado" }),
    ).not.toBeInTheDocument();
  });
});
