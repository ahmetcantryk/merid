"use client";

import Link from "next/link";
import { Breadcrumb } from "@merid/react";

// `as={Link}` passes a function, which a server component cannot hand to a client component,
// so the breadcrumb that renders through next/link lives in this small client file.
export function SettingsBreadcrumb() {
  return (
    <Breadcrumb.Root>
      <Breadcrumb.Item>
        <Breadcrumb.Link as={Link} href="/">Home</Breadcrumb.Link>
      </Breadcrumb.Item>
      <Breadcrumb.Item>
        <Breadcrumb.Page>Settings</Breadcrumb.Page>
      </Breadcrumb.Item>
    </Breadcrumb.Root>
  );
}
