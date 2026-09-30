"use client";

import { Breadcrumb } from "@meridui/react";

export function BreadcrumbBasic() {
  return (
    <Breadcrumb.Root>
      <Breadcrumb.Item>
        <Breadcrumb.Link href="#">Home</Breadcrumb.Link>
      </Breadcrumb.Item>
      <Breadcrumb.Item>
        <Breadcrumb.Link href="#">Projects</Breadcrumb.Link>
      </Breadcrumb.Item>
      <Breadcrumb.Item>
        <Breadcrumb.Page>Northwind</Breadcrumb.Page>
      </Breadcrumb.Item>
    </Breadcrumb.Root>
  );
}

export function BreadcrumbLong() {
  return (
    <Breadcrumb.Root aria-label="Settings location" style={{ maxWidth: 320 }}>
      <Breadcrumb.Item>
        <Breadcrumb.Link href="#">Settings</Breadcrumb.Link>
      </Breadcrumb.Item>
      <Breadcrumb.Item>
        <Breadcrumb.Link href="#">Billing</Breadcrumb.Link>
      </Breadcrumb.Item>
      <Breadcrumb.Item style={{ minWidth: 0 }}>
        <Breadcrumb.Page>Invoice INV-2026-000482 for September</Breadcrumb.Page>
      </Breadcrumb.Item>
    </Breadcrumb.Root>
  );
}
