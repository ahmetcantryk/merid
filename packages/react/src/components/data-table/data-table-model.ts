import type { ReactNode } from "react";

/** Sorting state: one column at a time. */
export interface DataTableSort {
  columnId: string;
  direction: "ascending" | "descending";
}

export interface DataTableColumn<Row> {
  /** Unique column id. */
  id: string;
  /** Header content. */
  header: ReactNode;
  /** Plain-text column name for menus and screen-reader labels. Defaults to `header` when it is a string, else `id`. */
  label?: string;
  /** Value used for sorting, filtering and the default cell. A key of the row or a function. */
  accessor?: keyof Row | ((row: Row) => unknown);
  /** Cell content. Defaults to the accessor value as text. */
  cell?: (row: Row) => ReactNode;
  /** Allow sorting by this column. Defaults to false. */
  sortable?: boolean;
  /** Custom compare for sorting (ascending). Defaults to numeric / date / locale-aware text compare. */
  sortFn?: (a: Row, b: Row) => number;
  /** Include this column in the global search. Defaults to true when it has an accessor. */
  searchable?: boolean;
  /** Custom per-column filter; gets the row and the filter value set with `setColumnFilter`. */
  filterFn?: (row: Row, filter: string) => boolean;
  /** Allow hiding the column from the column menu. Defaults to true. */
  hideable?: boolean;
  /** Text alignment; use `end` for numbers. Defaults to `start`. */
  align?: "start" | "center" | "end";
}

export function columnLabel<Row>(column: DataTableColumn<Row>): string {
  return column.label ?? (typeof column.header === "string" ? column.header : column.id);
}

export function getValue<Row>(row: Row, column: DataTableColumn<Row>): unknown {
  const { accessor } = column;
  if (accessor === undefined) return undefined;
  return typeof accessor === "function" ? accessor(row) : row[accessor];
}

const collator = typeof Intl === "undefined" ? undefined : new Intl.Collator(undefined, { numeric: true, sensitivity: "base" });

export function compareValues(a: unknown, b: unknown): number {
  if (a === b) return 0;
  if (a === null || a === undefined || a === "") return 1;
  if (b === null || b === undefined || b === "") return -1;
  if (typeof a === "number" && typeof b === "number") return a - b;
  if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime();
  if (typeof a === "boolean" && typeof b === "boolean") return Number(a) - Number(b);
  const sa = String(a);
  const sb = String(b);
  return collator ? collator.compare(sa, sb) : sa.localeCompare(sb);
}

/** Stable sort by one column; returns a new array. Empty values always sort last. */
export function sortRows<Row>(rows: readonly Row[], columns: readonly DataTableColumn<Row>[], sort: DataTableSort | null): Row[] {
  if (!sort) return [...rows];
  const column = columns.find((c) => c.id === sort.columnId);
  if (!column) return [...rows];
  const factor = sort.direction === "ascending" ? 1 : -1;
  const compare = column.sortFn ?? ((a: Row, b: Row) => compareValues(getValue(a, column), getValue(b, column)));
  return rows
    .map((row, index) => ({ row, index }))
    .sort((x, y) => {
      const va = getValue(x.row, column);
      const vb = getValue(y.row, column);
      const emptyA = !column.sortFn && (va === null || va === undefined || va === "");
      const emptyB = !column.sortFn && (vb === null || vb === undefined || vb === "");
      if (emptyA !== emptyB) return emptyA ? 1 : -1;
      return compare(x.row, y.row) * factor || x.index - y.index;
    })
    .map(({ row }) => row);
}

const text = (value: unknown) => (value === null || value === undefined ? "" : String(value)).toLowerCase();

/** Global search (every word must appear in some searchable column) plus per-column filters. */
export function filterRows<Row>(
  rows: readonly Row[],
  columns: readonly DataTableColumn<Row>[],
  globalFilter: string,
  columnFilters: Readonly<Record<string, string>>,
): Row[] {
  const words = globalFilter.toLowerCase().split(/\s+/).filter(Boolean);
  const searchable = columns.filter((c) => c.searchable ?? c.accessor !== undefined);
  const active = Object.entries(columnFilters).filter(([, value]) => value !== "");
  return rows.filter((row) => {
    for (const [id, value] of active) {
      const column = columns.find((c) => c.id === id);
      if (!column) continue;
      const pass = column.filterFn ? column.filterFn(row, value) : text(getValue(row, column)).includes(value.toLowerCase());
      if (!pass) return false;
    }
    if (words.length === 0) return true;
    const haystack = searchable.map((c) => text(getValue(row, c))).join(" ");
    return words.every((word) => haystack.includes(word));
  });
}

/** Rows of one 1-based page. */
export function paginate<Row>(rows: readonly Row[], page: number, pageSize: number): Row[] {
  const start = (page - 1) * pageSize;
  return rows.slice(start, start + pageSize);
}

/** Next sort after pressing a column header: none → ascending → descending → none. */
export function nextSort(current: DataTableSort | null, columnId: string): DataTableSort | null {
  if (!current || current.columnId !== columnId) return { columnId, direction: "ascending" };
  if (current.direction === "ascending") return { columnId, direction: "descending" };
  return null;
}
