import Link from "next/link";
import { Button, Link as MeridLink, Stack } from "@merid/react";
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
                <MeridLink asChild tone="muted" underline="none">
                  <Link href={l.href}>{l.label}</Link>
                </MeridLink>
              </li>
            ))}
          </Stack>
        </nav>
        <div className="site-header__actions">
          <ThemeToggle />
          <Button asChild variant="ghost" size="sm" className="hide-sm">
            <Link href="/login">Log in</Link>
          </Button>
          <Button asChild variant="primary" size="sm" className="hide-sm">
            <Link href="/signup">Sign up</Link>
          </Button>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
