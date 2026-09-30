"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getDictionary, localeFromPath, localizePath, stripLocale } from "@/lib/i18n";

const SECTIONS = ["/docs/foundations", "/docs/components", "/docs/integrations", "/docs/patterns"] as const;

function isSection(pathname: string): boolean {
  return SECTIONS.some((section) => pathname.startsWith(section));
}

/** `match` receives the locale-neutral pathname. */
const LINKS = [
  { key: "docs", href: "/docs/introduction", match: (p: string) => p.startsWith("/docs") && !isSection(p) },
  { key: "foundations", href: "/docs/foundations", match: (p: string) => p.startsWith("/docs/foundations") },
  { key: "components", href: "/docs/components", match: (p: string) => p.startsWith("/docs/components") },
  { key: "integrations", href: "/docs/integrations/react-hook-form", match: (p: string) => p.startsWith("/docs/integrations") },
  { key: "patterns", href: "/docs/patterns/forms", match: (p: string) => p.startsWith("/docs/patterns") },
  // launch: blog
  { key: "blog", href: "/blog", match: (p: string) => p.startsWith("/blog") },
] as const;

export function HeaderNavLinks() {
  const pathname = usePathname() ?? "/";
  const locale = localeFromPath(pathname);
  const neutral = stripLocale(pathname);
  const t = getDictionary(locale).header;
  return (
    <nav className="site-header__nav" aria-label={t.primaryNav}>
      {LINKS.map((link) => {
        const active = link.match(neutral);
        return (
          <Link
            key={link.href}
            href={localizePath(link.href, locale)}
            className="nav-link"
            aria-current={active ? "page" : undefined}
          >
            {t.nav[link.key]}
          </Link>
        );
      })}
    </nav>
  );
}
