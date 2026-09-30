export const dataTableBasicCode = `import { Badge, DataTable, type DataTableColumn, useDataTable } from "@meridui/react";

const columns: DataTableColumn<Member>[] = [
  { id: "name", header: "Ad", accessor: "name", sortable: true, hideable: false },
  { id: "email", header: "E-posta", accessor: "email" },
  { id: "role", header: "Rol", accessor: "role", sortable: true },
  {
    id: "status",
    header: "Durum",
    accessor: "status",
    sortable: true,
    cell: (row) => <Badge tone={row.status === "Aktif" ? "success" : "neutral"}>{row.status}</Badge>,
  },
  { id: "projects", header: "Projeler", accessor: "projects", sortable: true, align: "end" },
];

export function Members({ members }: { members: Member[] }) {
  const table = useDataTable({ data: members, columns, defaultPageSize: 5 });
  return (
    <DataTable
      table={table}
      caption="Ekip üyeleri"
      selectable
      getRowLabel={(row) => row.name}
      pageSizeOptions={[5, 10]}
      labels={labelsTr}
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
  caption="Role göre ekip üyeleri"
  labels={labelsTr}
  toolbar={
    <NativeSelect
      size="sm"
      aria-label="Rol"
      value={table.columnFilters.role ?? ""}
      onChange={(event) => table.setColumnFilter("role", event.target.value)}
    >
      <option value="">Tüm roller</option>
      <option value="Sahip">Sahip</option>
      {/* … */}
    </NativeSelect>
  }
/>`;

