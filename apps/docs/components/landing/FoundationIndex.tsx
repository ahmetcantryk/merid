import Link from "next/link";
import type { ReactNode } from "react";
import { getDictionary, localizePath, type Locale } from "@/lib/i18n";
import type { Dictionary } from "@/lib/i18n";

type FoundationKey = keyof Dictionary["landing"]["foundations"];

interface Foundation {
  readonly key: FoundationKey;
  readonly href: string;
  readonly token: string;
  readonly glyph: ReactNode;
}

const FOUNDATIONS: readonly Foundation[] = [
  {
    key: "color",
    href: "/docs/foundations/color",
    token: "--mrd-accent",
    glyph: (
      <>
        <span className="glyph-dot" style={{ background: "var(--mrd-accent)" }} />
        <span className="glyph-dot" style={{ background: "var(--mrd-ink)" }} />
        <span className="glyph-dot" style={{ background: "var(--mrd-tray-2)" }} />
      </>
    ),
  },
  {
    key: "typography",
    href: "/docs/foundations/typography",
    token: "--mrd-text-*",
    glyph: <span className="glyph-type">Aa</span>,
  },
  {
    key: "spacing",
    href: "/docs/foundations/spacing",
    token: "--mrd-space-*",
    glyph: [6, 10, 14, 20, 28].map((h) => <span key={h} className="glyph-bar" style={{ height: h }} />),
  },
  {
    key: "radius",
    href: "/docs/foundations/radius",
    token: "--mrd-radius-*",
    glyph: (
      <>
        <span className="glyph-shape" style={{ borderRadius: 10 }} />
        <span className="glyph-shape" style={{ borderRadius: 6, width: 20, height: 20 }} />
      </>
    ),
  },
  {
    key: "elevation",
    href: "/docs/foundations/elevation",
    token: "--mrd-shadow-*",
    glyph: <span className="glyph-shadow" />,
  },
  {
    key: "motion",
    href: "/docs/foundations/motion",
    token: "--mrd-ease",
    glyph: (
      <svg className="glyph-curve" width="40" height="28" viewBox="0 0 40 28" fill="none" aria-hidden="true">
        <path d="M1 27C9 27 10 1 39 1" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    key: "darkMode",
    href: "/docs/foundations/dark-mode",
    token: "data-theme",
    glyph: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ color: "var(--mrd-ink)" }}>
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1" />
        <path d="M12 2a10 10 0 0 1 0 20Z" fill="currentColor" />
      </svg>
    ),
  },
  {
    key: "layout",
    href: "/docs/foundations/layout",
    token: "--mrd-container",
    glyph: (
      <>
        <span className="glyph-col" />
        <span className="glyph-col" data-wide="" />
        <span className="glyph-col" />
      </>
    ),
  },
];

export function FoundationIndex({ locale }: { readonly locale: Locale }) {
  const copy = getDictionary(locale).landing.foundations;
  return (
    <ul className="findex">
      {FOUNDATIONS.map((f) => (
        <li key={f.href}>
          <Link href={localizePath(f.href, locale)} className="findex__item">
            <span className="findex__glyph" aria-hidden="true">
              {f.glyph}
            </span>
            <span className="findex__title">{copy[f.key].title}</span>
            <span className="findex__text">{copy[f.key].text}</span>
            <code className="findex__token">{f.token}</code>
          </Link>
        </li>
      ))}
    </ul>
  );
}
