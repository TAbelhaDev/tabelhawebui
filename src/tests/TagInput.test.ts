import { render, screen } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import TagInput from "$lib/components/forms/TagInput.svelte";

const options = ["Viagem SP", "PC novo", "Aniversário"];

const input = () => screen.getByRole("combobox");

describe("TagInput", () => {
  it("renders the given tags as chips", () => {
    render(TagInput, { options, value: ["Viagem SP"] });
    expect(screen.getByText("Viagem SP")).toBeInTheDocument();
  });

  it("selects an existing option from the filtered list", async () => {
    const user = userEvent.setup();
    render(TagInput, { options });

    await user.type(input(), "PC");
    await user.click(screen.getByRole("option", { name: "PC novo" }));

    expect(screen.getByText("PC novo")).toBeInTheDocument();
    expect(
      screen.queryByRole("option", { name: "PC novo" }),
    ).not.toBeInTheDocument();
  });

  it("creates a new tag that is not among the options", async () => {
    const user = userEvent.setup();
    render(TagInput, { options });

    await user.type(input(), "Rolê SP");
    await user.keyboard("{Enter}");

    expect(screen.getByText("Rolê SP")).toBeInTheDocument();
  });

  it("creates a tag via the create action button", async () => {
    const user = userEvent.setup();
    render(TagInput, { options, createLabel: "Criar tag" });

    await user.type(input(), "Viagem RJ");
    await user.click(
      screen.getByRole("option", { name: "Criar tag: Viagem RJ" }),
    );

    expect(screen.getByText("Viagem RJ")).toBeInTheDocument();
  });

  it("does not duplicate a tag that is already selected", async () => {
    const user = userEvent.setup();
    render(TagInput, { options, value: ["PC novo"] });

    await user.type(input(), "PC novo");
    await user.keyboard("{Enter}");

    expect(screen.getAllByText("PC novo")).toHaveLength(1);
  });

  it("removes a chip through its remove button", async () => {
    const user = userEvent.setup();
    render(TagInput, { options, value: ["Viagem SP", "PC novo"] });

    await user.click(screen.getByRole("button", { name: "Remover Viagem SP" }));

    expect(screen.queryByText("Viagem SP")).not.toBeInTheDocument();
    expect(screen.getByText("PC novo")).toBeInTheDocument();
  });

  it("removes the last chip with Backspace on an empty input", async () => {
    const user = userEvent.setup();
    render(TagInput, { options, value: ["Viagem SP", "PC novo"] });

    await user.click(input());
    expect(input()).toHaveFocus();
    await user.keyboard("{Backspace}");

    expect(
      screen.queryByRole("button", { name: "Remover PC novo" }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Remover Viagem SP" }),
    ).toBeInTheDocument();
  });

  it("filters the options as the user types", async () => {
    const user = userEvent.setup();
    render(TagInput, { options });

    await user.type(input(), "aniv");

    expect(
      screen.getByRole("option", { name: "Aniversário" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("option", { name: "Viagem SP" }),
    ).not.toBeInTheDocument();
  });

  it("is operable from the keyboard alone", async () => {
    const user = userEvent.setup();
    render(TagInput, { options });

    await user.tab();
    expect(input()).toHaveFocus();

    await user.keyboard("{ArrowDown}");
    await user.keyboard("{Enter}");

    expect(screen.getByText("Viagem SP")).toBeInTheDocument();
  });
});
