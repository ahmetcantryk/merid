"use client";

import { usePathname } from "next/navigation";
import { getDictionary, localeFromPath, localizePath } from "@/lib/i18n";
import { navFor } from "@/lib/nav";
import { JsonLd, breadcrumb } from "@/lib/seo/jsonld";

/**
 * BreadcrumbList (Docs > section > page) for docs pages. Rendered from the URL so every MDX page
 * gets it without an export; it is part of the server-rendered HTML.
 */
export function DocsBreadcrumbJsonLd() {
  const pathname = usePathname() ?? "/";
  const locale = localeFromPath(pathname);
  const group = navFor(locale).find((g) => g.items.some((item) => item.href === pathname));
  const page = group?.items.find((item) => item.href === pathname);
  if (!group || !page) return null;
  const docs = { name: getDictionary(locale).header.nav.docs, path: localizePath("/docs/introduction", locale) };
  const items = [docs, { name: group.title, path: group.items[0]?.href ?? page.href }, { name: page.title, path: page.href }];
  // Drop repeated steps (e.g. the introduction page is both "Docs" and its own section start).
  const unique = items.filter((item, i) => items.findIndex((other) => other.path === item.path) === i);
  return <JsonLd data={breadcrumb(unique)} />;
}
