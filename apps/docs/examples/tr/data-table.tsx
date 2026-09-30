"use client";

import { Badge, DataTable, type DataTableColumn, type DataTableLabels, NativeSelect, useDataTable } from "@merid/react";

interface Member {
  id: string;
  name: string;
  email: string;
  role: "Sahip" | "Yönetici" | "Üye" | "İzleyici";
  status: "Aktif" | "Davet edildi";
  projects: number;
}

const members: Member[] = [
  { id: "u1", name: "Ada Lovelace", email: "ada@northwind.dev", role: "Sahip", status: "Aktif", projects: 12 },
  { id: "u2", name: "Grace Hopper", email: "grace@northwind.dev", role: "Yönetici", status: "Aktif", projects: 9 },
  { id: "u3", name: "Alan Turing", email: "alan@northwind.dev", role: "Üye", status: "Aktif", projects: 7 },
  { id: "u4", name: "Katherine Johnson", email: "katherine@northwind.dev", role: "Üye", status: "Davet edildi", projects: 0 },
  { id: "u5", name: "Margaret Hamilton", email: "margaret@northwind.dev", role: "Yönetici", status: "Aktif", projects: 15 },
  { id: "u6", name: "Linus Torvalds", email: "linus@northwind.dev", role: "İzleyici", status: "Aktif", projects: 2 },
  { id: "u7", name: "Barbara Liskov", email: "barbara@northwind.dev", role: "Üye", status: "Aktif", projects: 5 },
  { id: "u8", name: "Edsger Dijkstra", email: "edsger@northwind.dev", role: "İzleyici", status: "Davet edildi", projects: 0 },
  { id: "u9", name: "Frances Allen", email: "frances@northwind.dev", role: "Üye", status: "Aktif", projects: 4 },
];

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

export const dataTableLabelsTr: Partial<DataTableLabels> = {
  search: "Ara",
  searchPlaceholder: "Ara…",
  columns: "Kolonlar",
  selectPage: "Bu sayfadaki tüm satırları seç",
  selectRow: (label) => `${label} satırını seç`,
  selected: (count, total) => `${total} satırdan ${count} tanesi seçili`,
  results: (count) => `${count} sonuç`,
  empty: "Sonuç yok.",
  rowsPerPage: "Sayfa başına satır",
  pagination: "Sayfalama",
  previousPage: "Önceki sayfa",
  nextPage: "Sonraki sayfa",
  page: (page) => `Sayfa ${page}`,
};

export function DataTableBasic() {
  const table = useDataTable({ data: members, columns, defaultPageSize: 5 });
  return (
    <div style={{ width: "100%" }}>
      <DataTable
        table={table}
        caption="Ekip üyeleri"
        selectable
        getRowLabel={(row) => row.name}
        pageSizeOptions={[5, 10]}
        labels={dataTableLabelsTr}
      />
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
        caption="Role göre ekip üyeleri"
        labels={dataTableLabelsTr}
        toolbar={
          <NativeSelect
            size="sm"
            aria-label="Rol"
            value={table.columnFilters.role ?? ""}
            onChange={(event) => table.setColumnFilter("role", event.target.value)}
          >
            <option value="">Tüm roller</option>
            <option value="Sahip">Sahip</option>
            <option value="Yönetici">Yönetici</option>
            <option value="Üye">Üye</option>
            <option value="İzleyici">İzleyici</option>
          </NativeSelect>
        }
      />
    </div>
  );
}
