"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { track } from "@/lib/analytics";
import { htmlLang, localeFromPath, switchLocalePath, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n";

/** Pages whose slug differs between locales. */
const RENAMED: Readonly<Record<string, string>> = { "/privacy": "/tr/gizlilik", "/tr/gizlilik": "/privacy" };

/**
 * Best guess before hydration. Blog posts have different slugs per language and not every post
 * is translated, so a post links to the other blog index until the page's hreflang tags refine it.
 */
function fallbackPath(pathname: string, target: Locale): string {
  const renamed = RENAMED[pathname];
  if (renamed) return renamed;
  if (/^(\/tr)?\/blog\/(?!tag\/|rss\.xml)[^/]+$/.test(pathname)) return target === "tr" ? "/tr/blog" : "/blog";
  return switchLocalePath(pathname, target);
}

/** The counterpart the page itself declares in `<link rel="alternate" hreflang>`, when it has one. */
function declaredAlternate(target: Locale): string | undefined {
  const link = document.querySelector<HTMLLinkElement>(`link[rel="alternate"][hreflang="${htmlLang[target]}"]`);
  if (!link?.href) return undefined;
  try {
    const url = new URL(link.href);
    return `${url.pathname}${url.search}`;
  } catch {
    return undefined;
  }
}

/**
 * Links to the same page in the other language. A plain anchor on purpose: each locale is its
 * own root layout, so the switch is a full page load either way.
 */
export function LanguageSwitcher() {
  const pathname = usePathname() ?? "/";
  const current = localeFromPath(pathname);
  const target: Locale = current === "tr" ? "en" : "tr";
  const t = getDictionary(current).header;
  const [href, setHref] = useState(() => fallbackPath(pathname, target));

  useEffect(() => {
    setHref(declaredAlternate(target) ?? fallbackPath(pathname, target));
  }, [pathname, target]);

  return (
    <a
      className="lang-switch"
      href={href}
      hrefLang={htmlLang[target]}
      lang={htmlLang[target]}
      aria-label={t.switchLanguageLabel}
      title={t.switchLanguage}
      onClick={() => track("locale_switch", { from: current, to: target, path: pathname })}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="8.25" stroke="currentColor" strokeWidth="1.5" />
        <path d="M3.75 12h16.5M12 3.75c2.2 2.3 3.3 5 3.3 8.25s-1.1 5.95-3.3 8.25c-2.2-2.3-3.3-5-3.3-8.25S9.8 6.05 12 3.75Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
      <span>{t.switchLanguageShort}</span>
    </a>
  );
}
