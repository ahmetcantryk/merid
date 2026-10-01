"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useDictionary, useLocale } from "@/lib/i18n/client";
import { findNeighbours, navFor } from "@/lib/nav";

export function DocsSidebar() {
  const pathname = usePathname() ?? "";
  const [open, setOpen] = useState(false);
  const current = findNeighbours(pathname).current;
  const locale = useLocale();
  const t = useDictionary().sidebar;

  useEffect(() => setOpen(false), [pathname]);

  return (
    <aside className="docs-sidebar" data-open={open}>
      <button
        type="button"
        className="docs-sidebar__toggle"
        aria-expanded={open}
        aria-controls="docs-sidebar-nav"
        onClick={() => setOpen((v) => !v)}
      >
        <span>{current?.title ?? t.menu}</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="m7 10 5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <nav id="docs-sidebar-nav" className="docs-sidebar__nav" aria-label={t.navLabel}>
        {navFor(locale).map((group) => (
          <div key={group.title} className="docs-sidebar__group">
            <p className="docs-sidebar__heading">
              {group.title}
              <span className="docs-sidebar__count">{group.items.length}</span>
            </p>
            <ul>
              {group.items.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} aria-current={item.href === pathname ? "page" : undefined}>
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
