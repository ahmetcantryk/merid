"use client";

import { Badge, DataTable, type DataTableColumn, NativeSelect, useDataTable } from "@meridui/react";

export interface Member {
  id: string;
  name: string;
  email: string;
  role: "Owner" | "Admin" | "Member" | "Viewer";
  status: "Active" | "Invited";
  projects: number;
}

export const members: Member[] = [
  { id: "u1", name: "Ada Lovelace", email: "ada@northwind.dev", role: "Owner", status: "Active", projects: 12 },
  { id: "u2", name: "Grace Hopper", email: "grace@northwind.dev", role: "Admin", status: "Active", projects: 9 },
  { id: "u3", name: "Alan Turing", email: "alan@northwind.dev", role: "Member", status: "Active", projects: 7 },
  { id: "u4", name: "Katherine Johnson", email: "katherine@northwind.dev", role: "Member", status: "Invited", projects: 0 },
  { id: "u5", name: "Margaret Hamilton", email: "margaret@northwind.dev", role: "Admin", status: "Active", projects: 15 },
  { id: "u6", name: "Linus Torvalds", email: "linus@northwind.dev", role: "Viewer", status: "Active", projects: 2 },
  { id: "u7", name: "Barbara Liskov", email: "barbara@northwind.dev", role: "Member", status: "Active", projects: 5 },
  { id: "u8", name: "Edsger Dijkstra", email: "edsger@northwind.dev", role: "Viewer", status: "Invited", projects: 0 },
  { id: "u9", name: "Frances Allen", email: "frances@northwind.dev", role: "Member", status: "Active", projects: 4 },
];

const columns: DataTableColumn<Member>[] = [
  { id: "name", header: "Name", accessor: "name", sortable: true, hideable: false },
  { id: "email", header: "Email", accessor: "email" },
  { id: "role", header: "Role", accessor: "role", sortable: true },
  {
    id: "status",
    header: "Status",
    accessor: "status",
    sortable: true,
    cell: (row) => <Badge tone={row.status === "Active" ? "success" : "neutral"}>{row.status}</Badge>,
  },
  { id: "projects", header: "Projects", accessor: "projects", sortable: true, align: "end" },
];

export function DataTableBasic() {
  const table = useDataTable({ data: members, columns, defaultPageSize: 5 });
  return (
    <div style={{ width: "100%" }}>
      <DataTable table={table} caption="Team members" selectable getRowLabel={(row) => row.name} pageSizeOptions={[5, 10]} />
    </div>
  );
}

export function DataTableFilters() {
  const table = useDataTable({
    data: members,
    columns,
    defaultPageSize: 10,
    defaultSort: { columnId: "projects", direction: "descending" },
    defaultHiddenColumns: ["email"],
  });
  return (
    <div style={{ width: "100%" }}>
      <DataTable
        table={table}
        caption="Team members by role"
        toolbar={
          <NativeSelect
            size="sm"
            aria-label="Role"
            value={table.columnFilters.role ?? ""}
            onChange={(event) => table.setColumnFilter("role", event.target.value)}
          >
            <option value="">All roles</option>
            <option value="Owner">Owner</option>
            <option value="Admin">Admin</option>
            <option value="Member">Member</option>
            <option value="Viewer">Viewer</option>
          </NativeSelect>
        }
      />
    </div>
  );
}
