export const dataTableBasicCode = `import { Badge, DataTable, type DataTableColumn, useDataTable } from "@meridui/react";

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

export function Members({ members }: { members: Member[] }) {
  const table = useDataTable({ data: members, columns, defaultPageSize: 5 });
  return (
    <DataTable
      table={table}
      caption="Team members"
      selectable
      getRowLabel={(row) => row.name}
      pageSizeOptions={[5, 10]}
    />
  );
}`;

export const dataTableFiltersCode = `const table = useDataTable({
  data: members,
  columns,
  defaultSort: { columnId: "projects", direction: "descending" },
  defaultHiddenColumns: ["email"],
});

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
      {/* … */}
    </NativeSelect>
  }
/>`;

