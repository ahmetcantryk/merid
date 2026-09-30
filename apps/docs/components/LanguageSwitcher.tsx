"use client";

import { usePathname } from "next/navigation";
import { htmlLang, localeFromPath, switchLocalePath, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n";

/**
 * Links to the same page in the other language. A plain anchor on purpose: each locale is its
 * own root layout, so the switch is a full page load either way.
 */
export function LanguageSwitcher() {
  const pathname = usePathname() ?? "/";
  const current = localeFromPath(pathname);
  const target: Locale = current === "tr" ? "en" : "tr";
  const t = getDictionary(current).header;
  return (
    <a
      className="lang-switch"
      href={switchLocalePath(pathname, target)}
      hrefLang={htmlLang[target]}
      lang={htmlLang[target]}
      aria-label={t.switchLanguageLabel}
      title={t.switchLanguage}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="8.25" stroke="currentColor" strokeWidth="1.5" />
        <path d="M3.75 12h16.5M12 3.75c2.2 2.3 3.3 5 3.3 8.25s-1.1 5.95-3.3 8.25c-2.2-2.3-3.3-5-3.3-8.25S9.8 6.05 12 3.75Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
      <span>{t.switchLanguageShort}</span>
    </a>
  );
}
