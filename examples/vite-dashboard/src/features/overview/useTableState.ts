import { useMemo, useState } from "react";
import type { Project } from "../../lib/data";

export type SortKey = "name" | "requests" | "updated";
export interface Sort { key: SortKey; direction: "ascending" | "descending" }

const compare: Record<SortKey, (a: Project, b: Project) => number> = {
  name: (a, b) => a.name.localeCompare(b.name),
  requests: (a, b) => a.requests - b.requests,
  updated: (a, b) => a.updated.localeCompare(b.updated),
};

/** Sorting, paging and selection for a list of projects. */
export function useTableState(rows: readonly Project[], pageSize: number) {
  const [sort, setSort] = useState<Sort>({ key: "updated", direction: "descending" });
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<ReadonlySet<string>>(new Set());

  const sorted = useMemo(() => {
    const factor = sort.direction === "ascending" ? 1 : -1;
    return [...rows].sort((a, b) => compare[sort.key](a, b) * factor);
  }, [rows, sort]);

  const pageCount = Math.max(1, Math.ceil(sorted.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const visible = sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const toggleSort = (key: SortKey) =>
    setSort((s) => ({ key, direction: s.key === key && s.direction === "ascending" ? "descending" : "ascending" }));

  const toggleRow = (id: string) =>
    setSelected((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const visibleIds = visible.map((r) => r.id);
  const selectedOnPage = visibleIds.filter((id) => selected.has(id)).length;
  const togglePage = () =>
    setSelected((s) => {
      const next = new Set(s);
      const selectAll = selectedOnPage < visibleIds.length;
      visibleIds.forEach((id) => (selectAll ? next.add(id) : next.delete(id)));
      return next;
    });

  return {
    sort, toggleSort, page: currentPage, setPage, pageCount, visible,
    selected, toggleRow, togglePage, clearSelection: () => setSelected(new Set()),
    pageSelection: selectedOnPage === 0 ? "none" : selectedOnPage === visibleIds.length ? "all" : "some",
  } as const;
}
