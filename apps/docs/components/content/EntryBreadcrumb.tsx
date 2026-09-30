"use client";

import Link from "next/link";
import { Breadcrumb } from "@meridui/react";

interface Crumb {
  readonly name: string;
  readonly path: string;
}

/**
 * Visible breadcrumb for blog and compare pages. A client module because `Breadcrumb.*` is built
 * with a client-only helper and cannot be evaluated in a server component.
 */
export function EntryBreadcrumb({ label, trail }: { readonly label: string; readonly trail: readonly Crumb[] }) {
  const last = trail[trail.length - 1];
  return (
    <Breadcrumb.Root aria-label={label} className="entry__crumbs">
      {trail.slice(0, -1).map((c) => (
        <Breadcrumb.Item key={c.path}>
          <Breadcrumb.Link asChild>
            <Link href={c.path}>{c.name}</Link>
          </Breadcrumb.Link>
        </Breadcrumb.Item>
      ))}
      {last ? (
        <Breadcrumb.Item>
          <Breadcrumb.Page aria-current="page">{last.name}</Breadcrumb.Page>
        </Breadcrumb.Item>
      ) : null}
    </Breadcrumb.Root>
  );
}
