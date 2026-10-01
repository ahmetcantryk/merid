import Link from "next/link";
import { getDictionary, localizePath, type Locale } from "@/lib/i18n";
import type { Dictionary } from "@/lib/i18n";

type FoundationKey = keyof Dictionary["landing"]["foundations"];

const FOUNDATIONS: readonly { readonly key: FoundationKey; readonly href: string }[] = [
  { key: "color", href: "/docs/foundations/color" },
  { key: "typography", href: "/docs/foundations/typography" },
  { key: "spacing", href: "/docs/foundations/spacing" },
  { key: "radius", href: "/docs/foundations/radius" },
  { key: "elevation", href: "/docs/foundations/elevation" },
  { key: "motion", href: "/docs/foundations/motion" },
  { key: "darkMode", href: "/docs/foundations/dark-mode" },
  { key: "layout", href: "/docs/foundations/layout" },
];

/** The foundations as a typographic index: a title and one line each, under a hairline. */
export function FoundationIndex({ locale }: { readonly locale: Locale }) {
  const copy = getDictionary(locale).landing.foundations;
  return (
    <ul className="findex">
      {FOUNDATIONS.map((f) => (
        <li key={f.href}>
          <Link href={localizePath(f.href, locale)} className="findex__item">
            <span className="findex__title">{copy[f.key].title}</span>
            <span className="findex__text">{copy[f.key].text}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
