import { renderHook, act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { DataTable } from "./DataTable";
import { compareValues, type DataTableColumn, filterRows, nextSort, sortRows } from "./data-table-model";
import { useDataTable, type UseDataTableOptions } from "./useDataTable";

interface Person {
  id: string;
  name: string;
  role: string;
  age: number | null;
}

const people: Person[] = [
  { id: "p1", name: "Ada", role: "Engineer", age: 36 },
  { id: "p2", name: "Grace", role: "Admiral", age: 85 },
  { id: "p3", name: "Linus", role: "Engineer", age: null },
  { id: "p4", name: "Margaret", role: "Director", age: 50 },
  { id: "p5", name: "Alan", role: "Researcher", age: 41 },
];

const columns: DataTableColumn<Person>[] = [
  { id: "name", header: "Name", accessor: "name", sortable: true },
  { id: "role", header: "Role", accessor: "role", sortable: true },
  { id: "age", header: "Age", accessor: "age", sortable: true, align: "end", hideable: true },
];

function Table(props: Partial<UseDataTableOptions<Person>> & { selectable?: boolean; pageSizeOptions?: number[] }) {
  const { selectable, pageSizeOptions, ...options } = props;
  const table = useDataTable({ data: people, columns, defaultPageSize: 2, ...options });
  return <DataTable table={table} caption="Team" selectable={selectable} pageSizeOptions={pageSizeOptions} />;
}

const bodyNames = () =>
  within(screen.getAllByRole("rowgroup")[1] as HTMLElement)
    .getAllByRole("row")
    .map((row) => within(row).queryAllByRole("cell")[0]?.textContent);

describe("data-table model", () => {
  it("sorts stably with empty values last in both directions", () => {
    const age = columns[2] as DataTableColumn<Person>;
    const asc = sortRows(people, [age], { columnId: "age", direction: "ascending" }).map((p) => p.name);
    expect(asc).toEqual(["Ada", "Alan", "Margaret", "Grace", "Linus"]);
    const desc = sortRows(people, [age], { columnId: "age", direction: "descending" }).map((p) => p.name);
    expect(desc).toEqual(["Grace", "Margaret", "Alan", "Ada", "Linus"]);
    expect(sortRows(people, columns, null)).not.toBe(people);
  });

  it("compares numbers, dates and text naturally", () => {
    expect(compareValues(2, 10)).toBeLessThan(0);
    expect(compareValues("item 2", "item 10")).toBeLessThan(0);
    expect(compareValues(new Date(2020, 1, 1), new Date(2019, 1, 1))).toBeGreaterThan(0);
  });

  it("filters globally (every word) and per column", () => {
    expect(filterRows(people, columns, "eng a", {}).map((p) => p.name)).toEqual(["Ada"]);
    expect(filterRows(people, columns, "", { role: "dir" }).map((p) => p.name)).toEqual(["Margaret"]);
  });

  it("cycles sort ascending → descending → none", () => {
    const a = nextSort(null, "name");
    const d = nextSort(a, "name");
    expect(a).toEqual({ columnId: "name", direction: "ascending" });
    expect(d).toEqual({ columnId: "name", direction: "descending" });
    expect(nextSort(d, "name")).toBeNull();
    expect(nextSort(d, "role")).toEqual({ columnId: "role", direction: "ascending" });
  });
});

describe("useDataTable", () => {
  it("paginates, clamps the page and resets it when filtering", () => {
    const { result } = renderHook(() => useDataTable({ data: people, columns, defaultPageSize: 2 }));
    expect(result.current.pageCount).toBe(3);
    act(() => result.current.setPage(9));
    expect(result.current.page).toBe(3);
    expect(result.current.rows.map((p) => p.name)).toEqual(["Alan"]);
    act(() => result.current.setGlobalFilter("engineer"));
    expect(result.current.page).toBe(1);
    expect(result.current.filteredRows).toHaveLength(2);
  });

  it("selects rows and pages immutably", () => {
    const onSelectionChange = vi.fn();
    const { result } = renderHook(() => useDataTable({ data: people, columns, defaultPageSize: 2, onSelectionChange }));
    act(() => result.current.toggleRow("p1"));
    expect(result.current.pageSelection).toBe("some");
    const before = result.current.selection;
    act(() => result.current.togglePage());
    expect(result.current.pageSelection).toBe("all");
    expect(before).toEqual(["p1"]);
    expect(result.current.selectedRows.map((p) => p.name)).toEqual(["Ada", "Grace"]);
    act(() => result.current.togglePage());
    expect(result.current.selection).toEqual([]);
    expect(onSelectionChange).toHaveBeenCalledTimes(3);
  });

  it("hides and shows columns", () => {
    const { result } = renderHook(() => useDataTable({ data: people, columns }));
    act(() => result.current.toggleColumn("age"));
    expect(result.current.visibleColumns.map((c) => c.id)).toEqual(["name", "role"]);
    act(() => result.current.toggleColumn("age", true));
    expect(result.current.isColumnVisible("age")).toBe(true);
  });

  it("works controlled", () => {
    const { result } = renderHook(() =>
      useDataTable({ data: people, columns, sort: { columnId: "name", direction: "descending" }, page: 1, pageSize: 10 }),
    );
    expect(result.current.rows[0]?.name).toBe("Margaret");
    act(() => result.current.toggleSort("name"));
    expect(result.current.rows[0]?.name).toBe("Margaret");
  });
});

describe("DataTable", () => {
  it("sorts from the header button and sets aria-sort", async () => {
    const user = userEvent.setup();
    render(<Table defaultPageSize={10} />);
    const header = screen.getByRole("columnheader", { name: "Name" });
    expect(header).toHaveAttribute("aria-sort", "none");
    await user.click(within(header).getByRole("button"));
    expect(header).toHaveAttribute("aria-sort", "ascending");
    expect(bodyNames()).toEqual(["Ada", "Alan", "Grace", "Linus", "Margaret"]);
    await user.click(within(header).getByRole("button"));
    expect(header).toHaveAttribute("aria-sort", "descending");
    expect(bodyNames()[0]).toBe("Margaret");
  });

  it("searches, shows the result count and an empty row", async () => {
    const user = userEvent.setup();
    render(<Table defaultPageSize={10} />);
    await user.type(screen.getByRole("searchbox", { name: "Search" }), "engineer");
    expect(bodyNames()).toEqual(["Ada", "Linus"]);
    expect(screen.getByRole("status")).toHaveTextContent("2 results");
    await user.type(screen.getByRole("searchbox"), "zzz");
    expect(screen.getByText("No results.")).toBeInTheDocument();
  });

  it("pages with Pagination and the rows-per-page select", async () => {
    const user = userEvent.setup();
    render(<Table pageSizeOptions={[2, 5]} />);
    expect(bodyNames()).toEqual(["Ada", "Grace"]);
    await user.click(screen.getByRole("button", { name: "Next page" }));
    expect(bodyNames()).toEqual(["Linus", "Margaret"]);
    await user.selectOptions(screen.getByRole("combobox", { name: "Rows per page" }), "5");
    expect(bodyNames()).toHaveLength(5);
    expect(screen.queryByRole("navigation", { name: "Pagination" })).not.toBeInTheDocument();
  });

  it("selects rows with checkboxes, including an indeterminate header", async () => {
    const user = userEvent.setup();
    render(<Table selectable />);
    const selectAda = screen.getByRole("checkbox", { name: "Select Ada" });
    await user.click(selectAda);
    const header = screen.getByRole("checkbox", { name: "Select all rows on this page" });
    expect(header).toHaveProperty("indeterminate", true);
    expect(screen.getByRole("status")).toHaveTextContent("1 of 5 selected");
    expect(selectAda.closest("tr")).toHaveAttribute("data-selected", "true");
    await user.click(header);
    expect(screen.getByRole("checkbox", { name: "Select Grace" })).toBeChecked();
    expect(screen.getByRole("status")).toHaveTextContent("2 of 5 selected");
  });

  it("toggles column visibility from the Columns menu", async () => {
    const user = userEvent.setup();
    render(<Table />);
    await user.click(screen.getByRole("button", { name: "Columns" }));
    await user.click(screen.getByRole("menuitemcheckbox", { name: "Age" }));
    expect(screen.queryByRole("columnheader", { name: "Age" })).not.toBeInTheDocument();
  });

  it("accepts translated labels", () => {
    function Tr() {
      const table = useDataTable({ data: people, columns, defaultPageSize: 2 });
      return (
        <DataTable
          table={table}
          caption="Ekip"
          selectable
          labels={{ search: "Ara", columns: "Kolonlar", selectRow: (label) => `${label} satırını seç`, nextPage: "Sonraki sayfa" }}
        />
      );
    }
    render(<Tr />);
    expect(screen.getByRole("searchbox", { name: "Ara" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Kolonlar" })).toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: "Ada satırını seç" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sonraki sayfa" })).toBeInTheDocument();
    expect(screen.getByRole("table", { name: "Ekip" })).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = render(<Table selectable />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
