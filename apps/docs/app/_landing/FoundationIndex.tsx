import Link from "next/link";
import type { ReactNode } from "react";

interface FoundationCard {
  readonly title: string;
  readonly href: string;
  readonly text: string;
  readonly glyph: ReactNode;
}

const CARDS: readonly FoundationCard[] = [
  {
    title: "Color",
    href: "/docs/foundations/color",
    text: "One accent, ink-tinted neutrals and quiet status tones.",
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
    text: "Inter Variable, nine sizes, three weights, tabular numbers.",
    glyph: <span className="glyph-type">Aa</span>,
  },
  {
    title: "Spacing",
    href: "/docs/foundations/spacing",
    text: "A 4 and 8 pixel scale from 4px to the 112px section rhythm.",
    glyph: [8, 16, 24, 36, 52].map((h) => <span key={h} className="glyph-bar" style={{ height: h }} />),
  },
  {
    title: "Radius",
    href: "/docs/foundations/radius",
    text: "Generous corners that step down as surfaces nest.",
    glyph: (
      <>
        <span className="glyph-shape" style={{ borderRadius: 20 }} />
        <span className="glyph-shape" style={{ borderRadius: 12, width: 32, height: 32 }} />
      </>
    ),
  },
  {
    title: "Elevation",
    href: "/docs/foundations/elevation",
    text: "Seven soft, ink-tinted shadows and a ring in dark mode.",
    glyph: <span className="glyph-shadow" />,
  },
  {
    title: "Motion",
    href: "/docs/foundations/motion",
    text: "Three durations and one easing curve, all removable.",
    glyph: (
      <svg className="glyph-curve" width="72" height="48" viewBox="0 0 72 48" fill="none" aria-hidden="true">
        <path d="M2 46C16 46 18 2 70 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Dark mode",
    href: "/docs/foundations/dark-mode",
    text: "Follows the system or a data-theme attribute, per subtree.",
    glyph: (
      <svg width="44" height="44" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ color: "var(--mrd-ink)" }}>
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1" />
        <path d="M12 2a10 10 0 0 1 0 20Z" fill="currentColor" />
      </svg>
    ),
  },
  {
    title: "Design tokens",
    href: "/docs/foundations",
    text: "Primitive, semantic and component tiers under one prefix.",
    glyph: <code style={{ fontSize: 13, color: "var(--mrd-accent-strong)" }}>--mrd-*</code>,
  },
];

export function FoundationIndex() {
  return (
    <div className="foundation-grid">
      {CARDS.map((card) => (
        <Link key={card.href} href={card.href} className="foundation-card">
          <span className="foundation-card__glyph" aria-hidden="true">
            {card.glyph}
          </span>
          <h3>{card.title}</h3>
          <p>{card.text}</p>
        </Link>
      ))}
    </div>
  );
}
