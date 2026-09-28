import Link from "next/link";
import type { ReactNode } from "react";

interface Foundation {
  readonly title: string;
  readonly href: string;
  readonly text: string;
  readonly token: string;
  readonly glyph: ReactNode;
}

const FOUNDATIONS: readonly Foundation[] = [
  {
    title: "Color",
    href: "/docs/foundations/color",
    text: "One accent, ink-tinted neutrals, quiet status tones.",
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
    title: "Typography",
    href: "/docs/foundations/typography",
    text: "Geist and Geist Mono, nine sizes, three weights.",
    token: "--mrd-text-*",
    glyph: <span className="glyph-type">Aa</span>,
  },
  {
    title: "Spacing",
    href: "/docs/foundations/spacing",
    text: "A 4 and 8 pixel scale up to the section rhythm.",
    token: "--mrd-space-*",
    glyph: [6, 10, 14, 20, 28].map((h) => <span key={h} className="glyph-bar" style={{ height: h }} />),
  },
  {
    title: "Radius",
    href: "/docs/foundations/radius",
    text: "Corners that step down as surfaces nest.",
    token: "--mrd-radius-*",
    glyph: (
      <>
        <span className="glyph-shape" style={{ borderRadius: 10 }} />
        <span className="glyph-shape" style={{ borderRadius: 6, width: 20, height: 20 }} />
      </>
    ),
  },
  {
    title: "Elevation",
    href: "/docs/foundations/elevation",
    text: "Soft ink-tinted shadows, a ring in dark mode.",
    token: "--mrd-shadow-*",
    glyph: <span className="glyph-shadow" />,
  },
  {
    title: "Motion",
    href: "/docs/foundations/motion",
    text: "Three durations and one easing curve.",
    token: "--mrd-ease",
    glyph: (
      <svg className="glyph-curve" width="40" height="28" viewBox="0 0 40 28" fill="none" aria-hidden="true">
        <path d="M1 27C9 27 10 1 39 1" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Dark mode",
    href: "/docs/foundations/dark-mode",
    text: "System preference or a data-theme attribute.",
    token: "data-theme",
    glyph: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ color: "var(--mrd-ink)" }}>
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1" />
        <path d="M12 2a10 10 0 0 1 0 20Z" fill="currentColor" />
      </svg>
    ),
  },
  {
    title: "Layout",
    href: "/docs/foundations/layout",
    text: "Container, gutter, section and reading widths.",
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

export function FoundationIndex() {
  return (
    <ul className="findex">
      {FOUNDATIONS.map((f) => (
        <li key={f.href}>
          <Link href={f.href} className="findex__item">
            <span className="findex__glyph" aria-hidden="true">
              {f.glyph}
            </span>
            <span className="findex__title">{f.title}</span>
            <span className="findex__text">{f.text}</span>
            <code className="findex__token">{f.token}</code>
          </Link>
        </li>
      ))}
    </ul>
  );
}
