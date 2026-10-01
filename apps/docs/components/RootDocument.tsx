import type { Viewport } from "next";
import type { ReactNode } from "react";
import { Analytics } from "@/components/Analytics";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { themeInitScript } from "@/components/ThemeToggle";
import { getDictionary, htmlLang, type Locale } from "@/lib/i18n";
import "../app/site.css";
import "@meridui/react/styles.css";
// TEMPORARY: Pafta tokens and fonts until @meridui/react ships them. Delete with the file.
import "../app/landing.css";
import "../app/docs.css";
import "../app/studio.css";
import "../app/blog.css";

export const rootViewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0d0e10" },
  ],
};

/**
 * `<html>` shell shared by the per-locale root layouts. Each locale is its own root layout,
 * so `lang` is correct in the static HTML; switching locale is a full page load.
 */
export function RootDocument({ locale, children }: { readonly locale: Locale; readonly children: ReactNode }) {
  const dict = getDictionary(locale);
  return (
    <html lang={htmlLang[locale]} className="mrd-root" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <a href="#content" className="skip-link">
          {dict.skipToContent}
        </a>
        <SiteHeader locale={locale} />
        <main id="content">{children}</main>
        <SiteFooter locale={locale} />
        <Analytics />
      </body>
    </html>
  );
}
