"use client";

import { Breadcrumb } from "@merid/react";

export function BreadcrumbBasic() {
  return (
    <Breadcrumb.Root aria-label="Sayfa yolu">
      <Breadcrumb.Item>
        <Breadcrumb.Link href="#">Ana sayfa</Breadcrumb.Link>
      </Breadcrumb.Item>
      <Breadcrumb.Item>
        <Breadcrumb.Link href="#">Projeler</Breadcrumb.Link>
      </Breadcrumb.Item>
      <Breadcrumb.Item>
        <Breadcrumb.Page>Northwind</Breadcrumb.Page>
      </Breadcrumb.Item>
    </Breadcrumb.Root>
  );
}

export function BreadcrumbLong() {
  return (
    <Breadcrumb.Root aria-label="Ayarlardaki konum" style={{ maxWidth: 320 }}>
      <Breadcrumb.Item>
        <Breadcrumb.Link href="#">Ayarlar</Breadcrumb.Link>
      </Breadcrumb.Item>
      <Breadcrumb.Item>
        <Breadcrumb.Link href="#">Faturalandırma</Breadcrumb.Link>
      </Breadcrumb.Item>
      <Breadcrumb.Item style={{ minWidth: 0 }}>
        <Breadcrumb.Page>Eylül ayı faturası INV-2026-000482</Breadcrumb.Page>
      </Breadcrumb.Item>
    </Breadcrumb.Root>
  );
}
