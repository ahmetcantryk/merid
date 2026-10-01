import Link from "next/link";
import { trackAttrs } from "@/lib/analytics";
import { getDictionary, localizePath, type Locale } from "@/lib/i18n";
import { site } from "@/lib/site";
import { Logo } from "./Logo";

export function SiteFooter({ locale }: { readonly locale: Locale }) {
  const dict = getDictionary(locale);
  const t = dict.footer;
  const launch = dict.launch.footer;
  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <div className="site-footer__brand">
          <Logo height={18} />
          <p>{dict.meta.tagline}</p>
        </div>
        <nav className="site-footer__links" aria-label={t.navLabel}>
          <Link href={localizePath("/docs/introduction", locale)}>{t.docs}</Link>
          <Link href={localizePath("/docs/changelog", locale)}>{t.changelog}</Link>
          <Link href={localizePath("/docs/brand", locale)}>{t.brand}</Link>
          {/* launch: blog, comparisons, privacy */}
          <Link href={localizePath("/blog", locale)}>{launch.blog}</Link>
          <Link href={localizePath("/compare", locale)}>{launch.compare}</Link>
          <Link href={locale === "tr" ? "/tr/gizlilik" : "/privacy"}>{launch.privacy}</Link>
          <a href={site.repo} {...trackAttrs("github_click", { location: "footer" })}>GitHub</a>
          <a href={`${site.repo}/blob/main/LICENSE`}>{t.license}</a>
        </nav>
        <p className="site-footer__copy">© 2026 Merid</p>
      </div>
    </footer>
  );
}
