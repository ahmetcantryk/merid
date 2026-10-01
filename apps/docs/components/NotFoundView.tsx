import Link from "next/link";
import { HeroMap } from "@/components/landing/HeroMap";
import { getDictionary, localizePath, type Locale } from "@/lib/i18n";

/** "This page is off the map": the landing's hero sheet, with the way back instead of the pitch. */
export function NotFoundView({ locale }: { readonly locale: Locale }) {
  const t = getDictionary(locale).notFound;
  return (
    <section className="band band--end hero not-found" aria-labelledby="not-found-title">
      <div className="frame hero__grid">
        <div className="hero__copy">
          <h1 id="not-found-title" className="hero__title t-display">
            {t.heading}
          </h1>
          <p className="hero__lead">{t.body}</p>
          <div className="hero__actions">
            <Link href={localizePath("/docs/introduction", locale)} className="btn" data-variant="primary" data-size="lg">
              {t.docs}
            </Link>
            <Link href={localizePath("/", locale)} className="btn" data-variant="secondary" data-size="lg">
              {t.home}
            </Link>
          </div>
        </div>
        <HeroMap />
      </div>
    </section>
  );
}
