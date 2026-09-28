"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { findNeighbours } from "@/lib/nav";
import { editUrl } from "@/lib/site";

export function DocPager() {
  const pathname = usePathname() ?? "";
  const { prev, next, current } = findNeighbours(pathname);
  if (!current) return null;

  return (
    <footer className="doc-pager">
      <a className="doc-pager__edit" href={editUrl(pathname)}>
        Edit this page on GitHub
      </a>
      <nav className="doc-pager__nav" aria-label="Pagination">
        {prev ? (
          <Link href={prev.href} className="doc-pager__link" rel="prev">
            <span className="doc-pager__dir">Previous</span>
            <span className="doc-pager__title">{prev.title}</span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={next.href} className="doc-pager__link" data-dir="next" rel="next">
            <span className="doc-pager__dir">Next</span>
            <span className="doc-pager__title">{next.title}</span>
          </Link>
        ) : null}
      </nav>
    </footer>
  );
}
