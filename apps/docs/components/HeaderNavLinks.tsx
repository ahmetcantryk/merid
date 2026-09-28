"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { title: "Docs", href: "/docs/introduction", match: (p: string) => p.startsWith("/docs") && !isSection(p) },
  { title: "Foundations", href: "/docs/foundations", match: (p: string) => p.startsWith("/docs/foundations") },
  { title: "Components", href: "/docs/components", match: (p: string) => p.startsWith("/docs/components") },
  { title: "Integrations", href: "/docs/integrations/react-hook-form", match: (p: string) => p.startsWith("/docs/integrations") },
  { title: "Patterns", href: "/docs/patterns/forms", match: (p: string) => p.startsWith("/docs/patterns") },
] as const;

const SECTIONS = ["/docs/foundations", "/docs/components", "/docs/integrations", "/docs/patterns"] as const;

function isSection(pathname: string): boolean {
  return SECTIONS.some((section) => pathname.startsWith(section));
}

export function HeaderNavLinks() {
  const pathname = usePathname() ?? "/";
  return (
    <nav className="site-header__nav" aria-label="Primary">
      {LINKS.map((link) => {
        const active = link.match(pathname);
        return (
          <Link key={link.href} href={link.href} className="nav-link" aria-current={active ? "page" : undefined}>
            {link.title}
          </Link>
        );
      })}
    </nav>
  );
}
