import {
  Avatar, Badge, Button, Checkbox, Pagination, Stack, Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow, Text, useToast,
} from "@merid/react";
import { REGIONS, STATUS_LABEL, STATUS_TONE, formatDate, formatNumber } from "../../lib/data";
import { useProjects } from "../../lib/projects-store";
import { SortHeader } from "./SortHeader";
import { useTableState } from "./useTableState";

const PAGE_SIZE = 8;

export function DeploymentsTable() {
  const { projects, remove } = useProjects();
  const { toast } = useToast();
  const t = useTableState(projects, PAGE_SIZE);
  const count = t.selected.size;

  const archive = () => {
    remove([...t.selected]);
    t.clearSelection();
    toast({ tone: "success", title: `${count} project${count === 1 ? "" : "s"} archived` });
  };

  return (
    <Stack gap={4}>
      <div className="bulk-bar" data-visible={count > 0 || undefined} aria-live="polite">
        {count > 0 ? (
          <>
            <Text size="sm" tone="ink">{count} selected</Text>
            <Button size="sm" variant="ghost" onClick={t.clearSelection}>Clear</Button>
            <Button size="sm" variant="danger" onClick={archive}>Archive</Button>
          </>
        ) : (
          <Text size="sm" tone="muted">{projects.length} projects</Text>
        )}
      </div>
      <Table hoverable scrollLabel="Projects table" aria-label="Projects">
        <TableHead>
          <TableRow>
            <TableHeader className="col-check">
              <Checkbox
                aria-label="Select all projects on this page"
                checked={t.pageSelection === "all"}
                indeterminate={t.pageSelection === "some"}
                onChange={t.togglePage}
              />
            </TableHeader>
            <SortHeader column="name" label="Project" sort={t.sort} onSort={t.toggleSort} />
            <TableHeader>Status</TableHeader>
            <TableHeader className="col-hide-sm">Region</TableHeader>
            <TableHeader className="col-hide-sm">Owner</TableHeader>
            <SortHeader column="requests" label="Requests" align="end" sort={t.sort} onSort={t.toggleSort} />
            <SortHeader column="updated" label="Updated" align="end" className="col-hide-sm" sort={t.sort} onSort={t.toggleSort} />
          </TableRow>
        </TableHead>
        <TableBody>
          {t.visible.map((p) => (
            <TableRow key={p.id} selected={t.selected.has(p.id)}>
              <TableCell className="col-check">
                <Checkbox aria-label={`Select ${p.name}`} checked={t.selected.has(p.id)} onChange={() => t.toggleRow(p.id)} />
              </TableCell>
              <TableCell>
                <Text size="sm" weight="medium" tone="ink" className="nowrap">{p.name}</Text>
              </TableCell>
              <TableCell><Badge tone={STATUS_TONE[p.status]} dot>{STATUS_LABEL[p.status]}</Badge></TableCell>
              <TableCell className="col-hide-sm">{REGIONS[p.region]}</TableCell>
              <TableCell className="col-hide-sm">
                <Stack direction="row" gap={2} align="center">
                  <Avatar name={p.owner} size="xs" />
                  <span>{p.owner}</span>
                </Stack>
              </TableCell>
              <TableCell align="end"><Text as="span" size="sm" numeric>{formatNumber(p.requests)}</Text></TableCell>
              <TableCell align="end" className="col-hide-sm">{formatDate(p.updated)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {t.pageCount > 1 ? (
        <Pagination page={t.page} pageCount={t.pageCount} onPageChange={t.setPage} aria-label="Projects pages" />
      ) : null}
    </Stack>
  );
}
