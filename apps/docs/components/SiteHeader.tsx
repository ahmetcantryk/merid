import Link from "next/link";
import { getDictionary, localizePath, type Locale } from "@/lib/i18n";
import { trackAttrs } from "@/lib/analytics";
import { site } from "@/lib/site";
import { HeaderNavLinks } from "./HeaderNavLinks";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Logo } from "./Logo";
import { SearchDialog } from "./SearchDialog";
import { ThemeToggle } from "./ThemeToggle";

export function SiteHeader({ locale }: { readonly locale: Locale }) {
  const t = getDictionary(locale).header;
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link href={localizePath("/", locale)} className="site-header__brand" aria-label={t.homeLabel}>
          <Logo />
        </Link>
        <Link
          href={localizePath("/docs/changelog", locale)}
          className="site-header__version"
          aria-label={t.versionLabel(site.version)}
        >
          v{site.version}
        </Link>
        <HeaderNavLinks />
        <div className="site-header__actions">
          <SearchDialog />
          <LanguageSwitcher />
          <a className="icon-btn" href={site.repo} aria-label={t.github} title="GitHub" {...trackAttrs("github_click", { location: "header" })}>
            <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
              <path d="M12 1.8a10.2 10.2 0 0 0-3.2 19.9c.5.1.7-.2.7-.5v-1.8c-2.8.6-3.4-1.2-3.4-1.2-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.6 1 1.6 1 .9 1.6 2.4 1.1 3 .9.1-.7.4-1.1.6-1.4-2.3-.3-4.7-1.1-4.7-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .9-.3 2.8 1a9.6 9.6 0 0 1 5.1 0c1.9-1.3 2.8-1 2.8-1 .6 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.9-2.4 4.7-4.7 5 .4.3.7.9.7 1.9v2.8c0 .3.2.6.7.5A10.2 10.2 0 0 0 12 1.8Z" />
            </svg>
          </a>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
