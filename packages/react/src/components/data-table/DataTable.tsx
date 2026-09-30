"use client";

import { type ReactNode, useId } from "react";
import { cx } from "../../internal/ovl-cx";
import { Button } from "../button";
import { Checkbox } from "../checkbox";
import { DropdownMenu } from "../dropdown-menu/DropdownMenu";
import { Input } from "../input";
import { NativeSelect } from "../native-select";
import { Pagination } from "../pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, type TableProps, TableRow } from "../table";
import { columnLabel, type DataTableColumn, getValue } from "./data-table-model";
import type { DataTableInstance } from "./useDataTable";

/** Every visible and screen-reader string in DataTable. Defaults are English. */
export interface DataTableLabels {
  /** Accessible name of the search box. */
  search: string;
  /** Placeholder of the search box. */
  searchPlaceholder: string;
  /** Column visibility menu button. */
  columns: string;
  /** Header checkbox. */
  selectPage: string;
  /** Row checkbox, given the row's label from `getRowLabel`. */
  selectRow: (rowLabel: string) => string;
  /** Selection summary. */
  selected: (count: number, total: number) => string;
  /** Result count announced after filtering. */
  results: (count: number) => string;
  /** Shown when no row matches. */
  empty: string;
  /** Label of the page size select. */
  rowsPerPage: string;
  /** Pagination landmark name. */
  pagination: string;
  previousPage: string;
  nextPage: string;
  /** Label of a page button. */
  page: (page: number) => string;
}

export const defaultDataTableLabels: DataTableLabels = {
  search: "Search",
  searchPlaceholder: "Search…",
  columns: "Columns",
  selectPage: "Select all rows on this page",
  selectRow: (rowLabel) => `Select ${rowLabel}`,
  selected: (count, total) => `${count} of ${total} selected`,
  results: (count) => `${count} ${count === 1 ? "result" : "results"}`,
  empty: "No results.",
  rowsPerPage: "Rows per page",
  pagination: "Pagination",
  previousPage: "Previous page",
  nextPage: "Next page",
  page: (page) => `Page ${page}`,
};

export interface DataTableProps<Row> extends Omit<TableProps, "children"> {
  /** State from `useDataTable`. */
  table: DataTableInstance<Row>;
  /** Table caption: names the table for screen readers. Visually hidden unless `showCaption`. */
  caption: ReactNode;
  /** Show the caption above the table. Defaults to false. */
  showCaption?: boolean;
  /** Add a checkbox column for row selection. Defaults to false. */
  selectable?: boolean;
  /** Text naming a row, used in its checkbox label. Defaults to the first visible column's value. */
  getRowLabel?: (row: Row) => string;
  /** Show the search box. Defaults to true. */
  searchable?: boolean;
  /** Show the column visibility menu. Defaults to true when any column is hideable. */
  columnToggle?: boolean;
  /** Show pagination. Defaults to true when there is more than one page. */
  paginated?: boolean;
  /** Offer a rows-per-page select with these sizes. */
  pageSizeOptions?: readonly number[];
  /** Extra controls at the end of the toolbar (filters, actions). */
  toolbar?: ReactNode;
  /** Content shown when no row matches. Defaults to `labels.empty`. */
  emptyState?: ReactNode;
  /** Override any label; defaults are English. */
  labels?: Partial<DataTableLabels>;
  /** Class name for the outer wrapper. */
  rootClassName?: string;
}

function renderCell<Row>(row: Row, column: DataTableColumn<Row>): ReactNode {
  if (column.cell) return column.cell(row);
  const value = getValue(row, column);
  if (value === null || value === undefined) return "";
  if (value instanceof Date) return value.toLocaleDateString();
  return String(value);
}

/**
 * Table view for `useDataTable`: toolbar (search, column menu), sortable headers, optional
 * checkbox selection and pagination. Built from Table, Checkbox, Input, DropdownMenu and Pagination.
 */
export function DataTable<Row>({
  table,
  caption,
  showCaption = false,
  selectable = false,
  getRowLabel,
  searchable = true,
  columnToggle,
  paginated,
  pageSizeOptions,
  toolbar,
  emptyState,
  labels: labelOverrides,
  rootClassName,
  className,
  ...tableProps
}: DataTableProps<Row>) {
  const labels = { ...defaultDataTableLabels, ...labelOverrides };
  const baseId = useId();
  const statusId = `mrd-data-table-${baseId.replace(/[^a-zA-Z0-9_-]/g, "")}-status`;
  const hideable = table.columns.filter((c) => c.hideable !== false);
  const showColumnToggle = columnToggle ?? hideable.length > 0;
  const showPagination = paginated ?? table.pageCount > 1;
  const columnCount = table.visibleColumns.length + (selectable ? 1 : 0);
  const labelFor = (row: Row) => {
    if (getRowLabel) return getRowLabel(row);
    const first = table.visibleColumns[0];
    return first ? String(getValue(row, first) ?? table.getRowId(row)) : table.getRowId(row);
  };
  const filtering = table.globalFilter !== "" || Object.values(table.columnFilters).some(Boolean);

  return (
    <div className={cx("mrd-data-table", rootClassName)}>
      {searchable || showColumnToggle || toolbar ? (
        <div className="mrd-data-table__toolbar">
          {searchable ? (
            <Input
              type="search"
              size="sm"
              className="mrd-data-table__search"
              aria-label={labels.search}
              aria-describedby={statusId}
              placeholder={labels.searchPlaceholder}
              value={table.globalFilter}
              onChange={(event) => table.setGlobalFilter(event.target.value)}
            />
          ) : null}
          {toolbar}
          {showColumnToggle ? (
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <Button variant="secondary" size="sm" className="mrd-data-table__columns">
                  {labels.columns}
                </Button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content placement="bottom-end">
                {hideable.map((column) => (
                  <DropdownMenu.CheckboxItem
                    key={column.id}
                    checked={table.isColumnVisible(column.id)}
                    onCheckedChange={(visible) => table.toggleColumn(column.id, visible)}
                  >
                    {columnLabel(column)}
                  </DropdownMenu.CheckboxItem>
                ))}
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          ) : null}
        </div>
      ) : null}

      <Table className={className} {...tableProps}>
        <caption className={showCaption ? "mrd-data-table__caption" : "mrd-visually-hidden"}>{caption}</caption>
        <TableHead>
          <TableRow>
            {selectable ? (
              <TableHeader className="mrd-data-table__select">
                <Checkbox
                  aria-label={labels.selectPage}
                  checked={table.pageSelection === "all"}
                  indeterminate={table.pageSelection === "some"}
                  disabled={table.rows.length === 0}
                  onChange={(event) => table.togglePage(event.target.checked)}
                />
              </TableHeader>
            ) : null}
            {table.visibleColumns.map((column) =>
              column.sortable ? (
                <TableHeader
                  key={column.id}
                  align={column.align}
                  sortDirection={table.getSortDirection(column.id)}
                  onSort={() => table.toggleSort(column.id)}
                >
                  {column.header}
                </TableHeader>
              ) : (
                <TableHeader key={column.id} align={column.align}>
                  {column.header}
                </TableHeader>
              ),
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {table.rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columnCount} className="mrd-data-table__empty">
                {emptyState ?? labels.empty}
              </TableCell>
            </TableRow>
          ) : (
            table.rows.map((row) => {
              const id = table.getRowId(row);
              const selected = selectable && table.isSelected(id);
              return (
                <TableRow key={id} selected={selected} data-row-id={id}>
                  {selectable ? (
                    <TableCell className="mrd-data-table__select">
                      <Checkbox
                        aria-label={labels.selectRow(labelFor(row))}
                        checked={selected}
                        onChange={(event) => table.toggleRow(id, event.target.checked)}
                      />
                    </TableCell>
                  ) : null}
                  {table.visibleColumns.map((column) => (
                    <TableCell key={column.id} align={column.align}>
                      {renderCell(row, column)}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>

      <div className="mrd-data-table__footer">
        <p id={statusId} className="mrd-data-table__status" role="status" aria-live="polite">
          {selectable && table.selection.length > 0
            ? labels.selected(table.selection.length, table.totalRows)
            : filtering
              ? labels.results(table.filteredRows.length)
              : null}
        </p>
        {pageSizeOptions && pageSizeOptions.length > 0 ? (
          <label className="mrd-data-table__page-size">
            <span>{labels.rowsPerPage}</span>
            <NativeSelect
              size="sm"
              value={String(table.pageSize)}
              onChange={(event) => table.setPageSize(Number(event.target.value))}
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </NativeSelect>
          </label>
        ) : null}
        {showPagination ? (
          <Pagination
            pageCount={table.pageCount}
            page={table.page}
            onPageChange={table.setPage}
            aria-label={labels.pagination}
            previousLabel={labels.previousPage}
            nextLabel={labels.nextPage}
            pageLabel={labels.page}
          />
        ) : null}
      </div>
    </div>
  );
}
