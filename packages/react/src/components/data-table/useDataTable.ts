"use client";

import { useCallback, useMemo } from "react";
import { useControllableState } from "../../internal/ovl-use-controllable-state";
import {
  type DataTableColumn,
  type DataTableSort,
  filterRows,
  nextSort,
  paginate,
  sortRows,
} from "./data-table-model";

type Selection = "all" | "some" | "none";

export interface UseDataTableOptions<Row> {
  /** All rows. Keep the array reference stable (memoise it) to avoid needless recomputation. */
  data: readonly Row[];
  /** Column definitions. */
  columns: readonly DataTableColumn<Row>[];
  /** Stable row id for selection. Defaults to `row.id` when present, else the row's index in `data`. */
  getRowId?: (row: Row, index: number) => string;

  /** Controlled sort (`null` for unsorted). */
  sort?: DataTableSort | null;
  /** Initial sort when uncontrolled. */
  defaultSort?: DataTableSort | null;
  /** Called with the new sort. */
  onSortChange?: (sort: DataTableSort | null) => void;

  /** Controlled global search text. */
  globalFilter?: string;
  /** Initial global search text when uncontrolled. */
  defaultGlobalFilter?: string;
  /** Called with the new global search text. */
  onGlobalFilterChange?: (value: string) => void;

  /** Controlled per-column filters, keyed by column id. */
  columnFilters?: Readonly<Record<string, string>>;
  /** Initial per-column filters when uncontrolled. */
  defaultColumnFilters?: Readonly<Record<string, string>>;
  /** Called with the new per-column filters. */
  onColumnFiltersChange?: (filters: Readonly<Record<string, string>>) => void;

  /** Controlled page, 1-based. */
  page?: number;
  /** Initial page when uncontrolled. Defaults to 1. */
  defaultPage?: number;
  /** Called with the new page. */
  onPageChange?: (page: number) => void;
  /** Controlled rows per page. */
  pageSize?: number;
  /** Initial rows per page when uncontrolled. Defaults to 10. */
  defaultPageSize?: number;
  /** Called with the new page size. */
  onPageSizeChange?: (size: number) => void;

  /** Controlled selected row ids. */
  selection?: readonly string[];
  /** Initially selected row ids when uncontrolled. */
  defaultSelection?: readonly string[];
  /** Called with the new selected row ids. */
  onSelectionChange?: (ids: readonly string[]) => void;

  /** Controlled hidden column ids. */
  hiddenColumns?: readonly string[];
  /** Initially hidden column ids when uncontrolled. */
  defaultHiddenColumns?: readonly string[];
  /** Called with the new hidden column ids. */
  onHiddenColumnsChange?: (ids: readonly string[]) => void;
}

export interface DataTableInstance<Row> {
  /** Every column definition. */
  columns: readonly DataTableColumn<Row>[];
  /** Columns not hidden, in order. */
  visibleColumns: readonly DataTableColumn<Row>[];
  /** Rows of the current page (filtered and sorted). */
  rows: readonly Row[];
  /** All rows after filtering and sorting, across pages. */
  filteredRows: readonly Row[];
  /** Number of rows before filtering. */
  totalRows: number;
  /** The id of a row. */
  getRowId: (row: Row) => string;

  sort: DataTableSort | null;
  setSort: (sort: DataTableSort | null) => void;
  /** Cycles a column: ascending → descending → unsorted. */
  toggleSort: (columnId: string) => void;
  /** `aria-sort`-style direction of a column. */
  getSortDirection: (columnId: string) => "ascending" | "descending" | "none";

  globalFilter: string;
  /** Sets the search text and returns to page 1. */
  setGlobalFilter: (value: string) => void;
  columnFilters: Readonly<Record<string, string>>;
  /** Sets one column filter (`""` clears it) and returns to page 1. */
  setColumnFilter: (columnId: string, value: string) => void;

  /** Current page, 1-based, clamped to `pageCount`. */
  page: number;
  pageCount: number;
  pageSize: number;
  setPage: (page: number) => void;
  /** Sets rows per page and returns to page 1. */
  setPageSize: (size: number) => void;

  selection: readonly string[];
  /** Selected rows from `data`, across pages and filters. */
  selectedRows: readonly Row[];
  isSelected: (id: string) => boolean;
  /** Toggles one row, or sets it when `selected` is given. */
  toggleRow: (id: string, selected?: boolean) => void;
  /** Selects or clears every row on the current page. */
  togglePage: (selected?: boolean) => void;
  /** Whether all, some or none of the current page is selected. */
  pageSelection: Selection;
  clearSelection: () => void;

  hiddenColumns: readonly string[];
  isColumnVisible: (columnId: string) => boolean;
  /** Toggles a column, or sets it when `visible` is given. */
  toggleColumn: (columnId: string, visible?: boolean) => void;
}

const EMPTY: readonly string[] = [];
const NO_FILTERS: Readonly<Record<string, string>> = {};

function defaultRowId<Row>(row: Row, index: number): string {
  const id = (row as { id?: unknown } | null)?.id;
  return typeof id === "string" || typeof id === "number" ? String(id) : String(index);
}

/**
 * Headless state for a data table: sorting, global and per-column filtering, pagination, row
 * selection and column visibility. Every piece works controlled or uncontrolled. Pair with
 * `<DataTable table={...} />` or render your own markup from the returned rows.
 */
export function useDataTable<Row>(options: UseDataTableOptions<Row>): DataTableInstance<Row> {
  const { data, columns, getRowId: getRowIdOption = defaultRowId } = options;

  const [sort, setSortState] = useControllableState<DataTableSort | null>({
    value: options.sort,
    defaultValue: options.defaultSort ?? null,
    onChange: options.onSortChange,
  });
  const [globalFilter, setGlobalFilterState] = useControllableState({
    value: options.globalFilter,
    defaultValue: options.defaultGlobalFilter ?? "",
    onChange: options.onGlobalFilterChange,
  });
  const [columnFilters, setColumnFilters] = useControllableState({
    value: options.columnFilters,
    defaultValue: options.defaultColumnFilters ?? NO_FILTERS,
    onChange: options.onColumnFiltersChange,
  });
  const [pageState, setPageState] = useControllableState({
    value: options.page,
    defaultValue: options.defaultPage ?? 1,
    onChange: options.onPageChange,
  });
  const [pageSize, setPageSizeState] = useControllableState({
    value: options.pageSize,
    defaultValue: options.defaultPageSize ?? 10,
    onChange: options.onPageSizeChange,
  });
  const [selection, setSelection] = useControllableState({
    value: options.selection,
    defaultValue: options.defaultSelection ?? EMPTY,
    onChange: options.onSelectionChange,
  });
  const [hiddenColumns, setHiddenColumns] = useControllableState({
    value: options.hiddenColumns,
    defaultValue: options.defaultHiddenColumns ?? EMPTY,
    onChange: options.onHiddenColumnsChange,
  });

  const ids = useMemo(() => {
    const map = new Map<Row, string>();
    data.forEach((row, index) => map.set(row, getRowIdOption(row, index)));
    return map;
  }, [data, getRowIdOption]);
  const getRowId = useCallback((row: Row) => ids.get(row) ?? "", [ids]);

  const filteredRows = useMemo(
    () => sortRows(filterRows(data, columns, globalFilter, columnFilters), columns, sort),
    [data, columns, globalFilter, columnFilters, sort],
  );
  const size = Math.max(1, Math.floor(pageSize));
  const pageCount = Math.max(1, Math.ceil(filteredRows.length / size));
  const page = Math.min(Math.max(1, pageState), pageCount);
  const rows = useMemo(() => paginate(filteredRows, page, size), [filteredRows, page, size]);

  const selected = useMemo(() => new Set(selection), [selection]);
  const pageIds = useMemo(() => rows.map(getRowId), [rows, getRowId]);
  const selectedOnPage = pageIds.filter((id) => selected.has(id)).length;
  const pageSelection: Selection =
    selectedOnPage === 0 ? "none" : selectedOnPage === pageIds.length ? "all" : "some";

  const hidden = useMemo(() => new Set(hiddenColumns), [hiddenColumns]);
  const visibleColumns = useMemo(() => columns.filter((c) => !hidden.has(c.id)), [columns, hidden]);

  return {
    columns,
    visibleColumns,
    rows,
    filteredRows,
    totalRows: data.length,
    getRowId,

    sort,
    setSort: setSortState,
    toggleSort: (columnId) => setSortState((prev) => nextSort(prev, columnId)),
    getSortDirection: (columnId) => (sort?.columnId === columnId ? sort.direction : "none"),

    globalFilter,
    setGlobalFilter: (value) => {
      setGlobalFilterState(value);
      setPageState(1);
    },
    columnFilters,
    setColumnFilter: (columnId, value) => {
      setColumnFilters((prev) => ({ ...prev, [columnId]: value }));
      setPageState(1);
    },

    page,
    pageCount,
    pageSize: size,
    setPage: (next) => setPageState(Math.min(Math.max(1, next), pageCount)),
    setPageSize: (next) => {
      setPageSizeState(next);
      setPageState(1);
    },

    selection,
    selectedRows: data.filter((row) => selected.has(getRowId(row))),
    isSelected: (id) => selected.has(id),
    toggleRow: (id, value) =>
      setSelection((prev) => {
        const on = value ?? !prev.includes(id);
        const rest = prev.filter((x) => x !== id);
        return on ? [...rest, id] : rest;
      }),
    togglePage: (value) =>
      setSelection((prev) => {
        const on = value ?? pageSelection !== "all";
        const rest = prev.filter((id) => !pageIds.includes(id));
        return on ? [...rest, ...pageIds] : rest;
      }),
    pageSelection,
    clearSelection: () => setSelection(EMPTY),

    hiddenColumns,
    isColumnVisible: (columnId) => !hidden.has(columnId),
    toggleColumn: (columnId, visible) =>
      setHiddenColumns((prev) => {
        const show = visible ?? prev.includes(columnId);
        const rest = prev.filter((id) => id !== columnId);
        return show ? rest : [...rest, columnId];
      }),
  };
}
