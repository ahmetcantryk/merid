import Link from "next/link";
import { CopyButton } from "@/components/CopyButton";
import { componentCount } from "@/lib/components-catalog";
import { getDictionary, localizePath, type Locale } from "@/lib/i18n";
import { trackAttrs } from "@/lib/analytics";
import { JsonLd, organization, softwareSourceCode, website } from "@/lib/seo/jsonld";
import { site } from "@/lib/site";
import { ComponentIndex } from "./ComponentIndex";
import { HeroMap } from "./HeroMap";
import { Playground } from "./Playground";

/** Where each of the six rules is explained, in the order of `landing.contract`. */
const RULE_PAGES = [
  "/docs/foundations/color",
  "/docs/foundations/elevation",
  "/docs/foundations/radius",
  "/docs/foundations/typography",
  "/docs/foundations/motion",
  "/docs/styling",
] as const;

/**
 * The landing page, laid out as one map sheet: a 12-column grid between two rails, every band
 * closed by a full-width rule, every heading on the same left edge. The hero carries the only
 * picture, a contour map crossed by the meridian.
 */
export function HomePage({ locale }: { readonly locale: Locale }) {
  const dict = getDictionary(locale);
  const t = dict.landing;
  const href = (path: string) => localizePath(path, locale);
  return (
    <div className="board">
      <JsonLd data={[organization(), website(), softwareSourceCode(dict.meta.description)]} />

      <section className="band hero" aria-labelledby="hero-title">
        <div className="frame hero__grid">
          <div className="hero__copy">
            <h1 id="hero-title" className="hero__title t-display">
              {t.heroTitle}
            </h1>
            <p className="hero__lead">{t.heroLead(componentCount)}</p>
            <div className="hero__actions">
              <Link href={href("/docs/introduction")} className="btn" data-variant="primary" data-size="lg">
                {t.getStarted}
              </Link>
              <div className="install" aria-label={t.installLabel}>
                <code>{site.install}</code>
                <CopyButton value={site.install} className="install__copy" eventLocation="hero" />
              </div>
            </div>
          </div>
          <HeroMap />
        </div>
      </section>

      <section className="band" aria-labelledby="playground-title">
        <div className="frame">
          <header className="band__head">
            <h2 id="playground-title" className="t-title">{t.playgroundTitle}</h2>
            <p>{t.playgroundText}</p>
          </header>
          <Playground />
        </div>
      </section>

      <section className="band" aria-labelledby="index-title">
        <div className="frame">
          <header className="band__head">
            <h2 id="index-title" className="t-title">
              {t.indexTitle(componentCount)}
              {t.indexTitleMuted}
            </h2>
            <p>
              {t.indexText} <Link href={href("/docs/components")}>{t.indexLink}</Link>
            </p>
          </header>
          <ComponentIndex locale={locale} />
        </div>
      </section>

      <section className="band" aria-labelledby="contract-title">
        <div className="frame">
          <header className="band__head">
            <h2 id="contract-title" className="t-title">{t.contractTitle}</h2>
            <p>
              {t.contractText} <Link href={href("/docs/foundations/principles")}>{t.contractLink}</Link>
            </p>
          </header>
          <ol className="ledger rules">
            {t.contract.map((c, i) => (
              <li key={c.rule} className="ledger__row">
                <div className="rules__head">
                  <Link href={href(RULE_PAGES[i] ?? "/docs/foundations/principles")} className="rules__name">
                    {c.rule}
                  </Link>
                  <code className="rules__spec">{c.spec}</code>
                </div>
                <p className="rules__text">{c.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="band band--end" aria-label={t.closingLabel}>
        <div className="frame closing">
          <p className="closing__cmd">{site.install}</p>
          <div className="closing__body">
            <p className="closing__text">{t.closingText}</p>
            <div className="hero__actions">
              <Link href={href("/docs/installation")} className="btn" data-variant="primary" data-size="lg">
                {t.installation}
              </Link>
              <a
                href={site.repo}
                className="btn"
                data-variant="secondary"
                data-size="lg"
                {...trackAttrs("github_click", { location: "hero" })}
              >
                GitHub
              </a>
            </div>
            <p className="closing__release">
              v{site.version}, {t.releaseBadge.toLocaleLowerCase(locale)},{" "}
              <time dateTime={site.releaseDate}>{t.releaseDate}</time>.{" "}
              <Link href={href("/docs/changelog")}>{t.changelog}</Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
