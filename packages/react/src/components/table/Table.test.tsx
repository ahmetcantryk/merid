import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./Table";

function Invoices(props: { scrollLabel?: string; density?: "sm" | "md" }) {
  return (
    <Table aria-label="Invoices" className="c" {...props}>
      <TableHead>
        <TableRow>
          <TableHeader>Invoice</TableHeader>
          <TableHeader align="end">Amount</TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell>#001</TableCell>
          <TableCell align="end">1,200</TableCell>
        </TableRow>
        <TableRow selected>
          <TableCell>#002</TableCell>
          <TableCell align="end">80</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}

describe("Table", () => {
  it("renders table semantics", () => {
    render(<Invoices />);
    const table = screen.getByRole("table", { name: "Invoices" });
    expect(within(table).getAllByRole("columnheader")).toHaveLength(2);
    expect(within(table).getAllByRole("row")).toHaveLength(3);
    expect(screen.getByRole("columnheader", { name: "Invoice" })).toHaveAttribute("scope", "col");
  });

  it("applies density, alignment, selection and className", () => {
    render(<Invoices density="sm" />);
    const table = screen.getByRole("table");
    expect(table).toHaveAttribute("data-density", "sm");
    expect(table).toHaveClass("mrd-table", "c");
    expect(screen.getByRole("cell", { name: "80" })).toHaveAttribute("data-align", "end");
    const selectedRow = screen.getAllByRole("row")[2];
    expect(selectedRow).toHaveAttribute("data-selected");
    // plain tables have no selection semantics: aria-selected is only valid in grid/treegrid
    expect(selectedRow).not.toHaveAttribute("aria-selected");
  });

  it("makes the scroll frame a focusable region when labelled", async () => {
    render(<Invoices scrollLabel="Invoices table" />);
    await userEvent.tab();
    expect(screen.getByRole("region", { name: "Invoices table" })).toHaveFocus();
  });

  it("has no axe violations", async () => {
    const { container } = render(<Invoices scrollLabel="Invoices table" />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("sortable headers expose aria-sort and a button", async () => {
    const onSort = vi.fn();
    const { container } = render(
      <Table aria-label="Sorted">
        <TableHead>
          <TableRow>
            <TableHeader sortDirection="ascending" onSort={onSort}>
              Name
            </TableHeader>
            <TableHeader sortDirection="none" onSort={onSort}>
              Amount
            </TableHeader>
            <TableHeader>Plain</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>a</TableCell>
            <TableCell>1</TableCell>
            <TableCell>x</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );
    const [name, amount, plain] = screen.getAllByRole("columnheader");
    expect(name).toHaveAttribute("aria-sort", "ascending");
    expect(amount).toHaveAttribute("aria-sort", "none");
    expect(plain).not.toHaveAttribute("aria-sort");
    await userEvent.click(within(amount!).getByRole("button", { name: "Amount" }));
    expect(onSort).toHaveBeenCalledTimes(1);
    expect(await axe(container)).toHaveNoViolations();
  });
});
