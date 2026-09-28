import Link from "next/link";
import { site } from "@/lib/site";
import { Logo } from "./Logo";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <div className="site-footer__brand">
          <Logo />
          <p>{site.tagline}</p>
        </div>
        <nav className="site-footer__links" aria-label="Footer">
          <Link href="/docs/introduction">Docs</Link>
          <a href={site.repo}>GitHub</a>
          <a href={`${site.repo}/blob/main/LICENSE`}>License MIT</a>
          <Link href="/docs/changelog">Changelog</Link>
          <Link href="/docs/brand">Brand</Link>
        </nav>
        <p className="site-footer__copy">© 2026 Merid</p>
      </div>
    </footer>
  );
}
