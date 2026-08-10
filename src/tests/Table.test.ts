import { render, screen, within } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import Table from "$lib/components/Table.svelte";

const columns = ["Data", "Descrição", "Valor"];

const rows = [
  { id: "1", Data: "01/08", Descrição: "Mercado", Valor: 120 },
  { id: "2", Data: "02/08", Descrição: "Uber", Valor: 25 },
  { id: "3", Data: "03/08", Descrição: "Farmácia", Valor: 80 },
];

const bodyRows = () => {
  const table = screen.getByRole("table");
  const [, ...body] = within(table).getAllByRole("rowgroup");
  return within(body[0] as HTMLElement).getAllByRole("row");
};

describe("Table", () => {
  it("renders a header cell per column and a row per record", () => {
    render(Table, { columns, rows });

    for (const label of columns) {
      expect(
        screen.getByRole("columnheader", { name: label }),
      ).toBeInTheDocument();
    }
    expect(bodyRows()).toHaveLength(rows.length);
  });

  it("shows the empty state instead of an empty grid", () => {
    render(Table, { columns, rows: [], labels: { empty: "Nenhum registro" } });
    expect(screen.getByText("Nenhum registro")).toBeInTheDocument();
  });

  it("renders skeleton rows while loading, hidden from assistive tech", () => {
    const { container } = render(Table, {
      columns,
      rows: [],
      loading: true,
      skeletonRows: 4,
    });

    const skeleton = container.querySelector('tbody[aria-hidden="true"]');
    expect(skeleton).not.toBeNull();
    expect(skeleton!.querySelectorAll("tr")).toHaveLength(4);

    // Deliberately outside the accessibility tree: a screen reader should hear
    // nothing rather than four rows of placeholder cells.
    expect(screen.queryAllByRole("row")).toHaveLength(1); // just the header row
  });

  it("paginates instead of rendering every row at once", () => {
    const many = Array.from({ length: 25 }, (_, i) => ({
      id: String(i),
      Data: "01/08",
      Descrição: `Item ${i}`,
      Valor: i,
    }));
    render(Table, { columns, rows: many, pageSize: 10 });

    expect(bodyRows()).toHaveLength(10);
    expect(screen.getByText("Item 0")).toBeInTheDocument();
    expect(screen.queryByText("Item 10")).not.toBeInTheDocument();
  });

  it("sorts by a column when sorting is enabled", async () => {
    const user = userEvent.setup();
    render(Table, { columns, rows, sortable: true });

    const header = screen.getByRole("columnheader", { name: /Descrição/ });
    await user.click(within(header).getByRole("button"));

    const first = within(bodyRows()[0] as HTMLElement).getByText(
      /Farmácia|Mercado|Uber/,
    );
    expect(first).toHaveTextContent("Farmácia");
  });

  it("filters rows by the global search box", async () => {
    const user = userEvent.setup();
    render(Table, {
      columns,
      rows,
      filterable: true,
      labels: { search: "Buscar..." },
    });

    await user.type(screen.getByPlaceholderText("Buscar..."), "uber");

    expect(bodyRows()).toHaveLength(1);
    expect(screen.getByText("Uber")).toBeInTheDocument();
  });
});
