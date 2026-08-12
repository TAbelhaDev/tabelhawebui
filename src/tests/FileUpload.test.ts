import { render, screen, fireEvent } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import { tick } from "svelte";
import { describe, expect, it, vi } from "vitest";

import FileUpload from "$lib/components/forms/FileUpload.svelte";

function makeFile(
  name: string,
  options: { type?: string; size?: number } = {},
): File {
  const { type = "application/octet-stream", size = 10 } = options;
  return new File([new Uint8Array(size)], name, { type });
}

async function selectViaInput(container: HTMLElement, files: File[]) {
  const input = container.querySelector(
    'input[type="file"]',
  ) as HTMLInputElement;
  const data = new DataTransfer();
  for (const file of files) data.items.add(file);
  Object.defineProperty(input, "files", {
    configurable: true,
    value: data.files,
  });
  fireEvent.change(input);
  await tick();
}

const dropzone = () =>
  screen.getByRole("button", { name: /Escolher arquivos/ });

describe("FileUpload", () => {
  it("renders a focusable dropzone with the choose label", async () => {
    const user = userEvent.setup();
    render(FileUpload, { chooseLabel: "Escolher arquivos" });

    expect(dropzone()).toBeInTheDocument();
    await user.tab();
    expect(dropzone()).toHaveFocus();
  });

  it("adds chosen files to the list in advanced mode", async () => {
    const { container } = render(FileUpload, { mode: "advanced" });
    await selectViaInput(container, [
      makeFile("extrato.pdf", { type: "application/pdf" }),
      makeFile("nota.zip", { type: "application/zip" }),
    ]);

    expect(screen.getByText("extrato.pdf")).toBeInTheDocument();
    expect(screen.getByText("nota.zip")).toBeInTheDocument();
  });

  it("fires onSelect with the accepted files", async () => {
    const onSelect = vi.fn();
    const { container } = render(FileUpload, { onSelect });
    const file = makeFile("extrato.pdf", { type: "application/pdf" });

    await selectViaInput(container, [file]);

    expect(onSelect).toHaveBeenCalledWith([file]);
  });

  it("shows a count badge in basic mode", async () => {
    const { container } = render(FileUpload, { mode: "basic" });
    await selectViaInput(container, [makeFile("a.txt"), makeFile("b.txt")]);

    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("rejects files outside accept and fires onError with kind 'type'", async () => {
    const onError = vi.fn();
    const { container } = render(FileUpload, {
      accept: ".zip,application/zip",
      onError,
    });
    const bad = makeFile("extrato.pdf", { type: "application/pdf" });

    await selectViaInput(container, [bad]);

    expect(screen.queryByText("extrato.pdf")).not.toBeInTheDocument();
    expect(onError).toHaveBeenCalledWith({ kind: "type", file: bad });
  });

  it("rejects files above maxFileSize and fires onError with kind 'size'", async () => {
    const onError = vi.fn();
    const { container } = render(FileUpload, {
      maxFileSize: 1024,
      onError,
    });
    const big = makeFile("big.zip", { size: 4096 });

    await selectViaInput(container, [big]);

    expect(screen.queryByText("big.zip")).not.toBeInTheDocument();
    expect(onError).toHaveBeenCalledWith({ kind: "size", file: big });
  });

  it("stops at fileLimit and fires onError with kind 'limit'", async () => {
    const onError = vi.fn();
    const { container } = render(FileUpload, {
      fileLimit: 2,
      onError,
    });

    await selectViaInput(container, [
      makeFile("a.txt"),
      makeFile("b.txt"),
      makeFile("c.txt"),
    ]);

    expect(screen.getByText("a.txt")).toBeInTheDocument();
    expect(screen.getByText("b.txt")).toBeInTheDocument();
    expect(screen.queryByText("c.txt")).not.toBeInTheDocument();
    expect(onError).toHaveBeenCalledWith({
      kind: "limit",
      file: expect.anything(),
    });
  });

  it("hands files to uploadHandler and makes no request of its own", async () => {
    const uploadHandler = vi.fn();
    vi.stubGlobal("fetch", vi.fn());
    const { container } = render(FileUpload, {
      customUpload: true,
      uploadHandler,
      showUploadButton: true,
      uploadLabel: "Enviar",
    });
    const file = makeFile("extrato.pdf", { type: "application/pdf" });
    await selectViaInput(container, [file]);

    await userEvent.click(screen.getByRole("button", { name: "Enviar" }));

    expect(uploadHandler).toHaveBeenCalledWith([file], expect.any(Function));
    expect(fetch).not.toHaveBeenCalled();
    vi.unstubAllGlobals();
  });

  it("shows progress reported by the consumer per file", async () => {
    const uploadHandler = vi.fn(
      (_files: File[], report: (file: File, pct: number) => void) => {
        for (const file of _files) report(file, 42);
      },
    );
    const { container } = render(FileUpload, {
      customUpload: true,
      uploadHandler,
      auto: true,
    });
    const file = makeFile("extrato.pdf", { type: "application/pdf" });

    await selectViaInput(container, [file]);

    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "42",
    );
  });

  it("removing an item fires onRemove and leaves the others untouched", async () => {
    const onRemove = vi.fn();
    const { container } = render(FileUpload, { onRemove });
    const a = makeFile("a.txt");
    const b = makeFile("b.txt");
    await selectViaInput(container, [a, b]);

    fireEvent.click(screen.getByRole("button", { name: "Remover a.txt" }));
    await tick();

    expect(onRemove).toHaveBeenCalledWith(a);
    expect(screen.queryByText("a.txt")).not.toBeInTheDocument();
    expect(screen.getByText("b.txt")).toBeInTheDocument();
  });

  it("clears all files with the cancel button and fires onClear", async () => {
    const onClear = vi.fn();
    const { container } = render(FileUpload, {
      showCancelButton: true,
      cancelLabel: "Cancelar",
      onClear,
    });
    await selectViaInput(container, [makeFile("a.txt"), makeFile("b.txt")]);

    fireEvent.click(screen.getByRole("button", { name: "Cancelar" }));
    await tick();

    expect(screen.queryByText("a.txt")).not.toBeInTheDocument();
    expect(screen.queryByText("b.txt")).not.toBeInTheDocument();
    expect(onClear).toHaveBeenCalledOnce();
  });

  it("marks the dropzone active while dragging and clears it on drop", async () => {
    render(FileUpload);
    const zone = dropzone();

    fireEvent.dragEnter(zone);
    await tick();
    expect(zone.classList).toContain("twui-fileupload-dropzone-active");

    const file = makeFile("extrato.pdf", { type: "application/pdf" });
    const data = new DataTransfer();
    data.items.add(file);
    fireEvent.drop(zone, { dataTransfer: data });
    await tick();

    expect(zone.classList).not.toContain("twui-fileupload-dropzone-active");
    expect(screen.getByText("extrato.pdf")).toBeInTheDocument();
  });

  it("reflects invalid state on the file input", () => {
    const { container } = render(FileUpload, { invalid: true });

    const input = container.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(dropzone().classList).toContain("twui-fileupload-invalid");
  });

  it("disables the dropzone when disabled", () => {
    render(FileUpload, { disabled: true });

    expect(dropzone()).toBeDisabled();
  });

  it("accepts only the first file when multiple is false", async () => {
    const { container } = render(FileUpload, { multiple: false });
    await selectViaInput(container, [makeFile("a.txt"), makeFile("b.txt")]);

    expect(screen.getByText("a.txt")).toBeInTheDocument();
    expect(screen.queryByText("b.txt")).not.toBeInTheDocument();
  });
});
