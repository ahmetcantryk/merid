// Source strings shown in the docs code tabs. Kept out of the client module so server components can read them.

export const breadcrumbBasicCode = `import { Breadcrumb } from "@merid/react";

export function Example() {
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
}`;


export const breadcrumbLongCode = `<Breadcrumb.Root aria-label="Settings location" style={{ maxWidth: 320 }}>
  <Breadcrumb.Item>
    <Breadcrumb.Link href="#">Settings</Breadcrumb.Link>
  </Breadcrumb.Item>
  <Breadcrumb.Item>
    <Breadcrumb.Link href="#">Billing</Breadcrumb.Link>
  </Breadcrumb.Item>
  <Breadcrumb.Item style={{ minWidth: 0 }}>
    <Breadcrumb.Page>Invoice INV-2026-000482 for September</Breadcrumb.Page>
  </Breadcrumb.Item>
</Breadcrumb.Root>`;
