import Link from "next/link";
import { Link as MeridLink, Stack } from "@merid/react";
import { buttonLinkProps } from "@/lib/button-link";
import { MobileNav } from "./MobileNav";
import { NAV_LINKS } from "./nav-links";
import { ThemeToggle } from "./ThemeToggle";

/** Server component: Merid primitives render here directly because the package carries "use client". */
export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link href="/" className="brand" aria-label="Northwind Cloud home">
          <span className="brand__mark" aria-hidden="true">N</span>
          <span className="brand__name">Northwind Cloud</span>
        </Link>
        <nav aria-label="Main" className="site-header__nav">
          <Stack as="ul" direction="row" gap={5} className="plain-list">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <MeridLink href={l.href} tone="muted" underline="none">{l.label}</MeridLink>
              </li>
            ))}
          </Stack>
        </nav>
        <div className="site-header__actions">
          <ThemeToggle />
          <Link href="/login" {...buttonLinkProps("ghost", "sm")} className="mrd-button hide-sm">Log in</Link>
          <Link href="/signup" {...buttonLinkProps("primary", "sm")} className="mrd-button hide-sm">Sign up</Link>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
