import Link from "next/link";
import { CopyButton } from "@/components/CopyButton";
import { componentCount } from "@/lib/components-catalog";
import { getDictionary, localizePath, type Locale } from "@/lib/i18n";
import { trackAttrs } from "@/lib/analytics";
import { JsonLd, organization, softwareSourceCode, website } from "@/lib/seo/jsonld";
import { site } from "@/lib/site";
import { ComponentIndex } from "./ComponentIndex";
import { FoundationIndex } from "./FoundationIndex";
import { Playground } from "./Playground";

export function HomePage({ locale }: { readonly locale: Locale }) {
  const dict = getDictionary(locale);
  const t = dict.landing;
  const href = (path: string) => localizePath(path, locale);
  return (
    <div className="board">
      <JsonLd data={[organization(), website(), softwareSourceCode(dict.meta.description)]} />
      <section className="band hero" aria-labelledby="hero-title">
        <div className="frame">
          <h1 id="hero-title">{t.heroTitle}</h1>
          <p className="hero__lead">{t.heroLead(componentCount)}</p>
          <div className="hero__actions">
            <Link href={href("/docs/introduction")} className="btn" data-variant="primary">
              {t.getStarted}
            </Link>
            <Link href={href("/docs/components")} className="btn" data-variant="secondary">
              {t.components}
            </Link>
            <div className="install" aria-label={t.installLabel}>
              <span className="install__prompt" aria-hidden="true">$</span>
              <code>{site.install}</code>
              <CopyButton value={site.install} className="install__copy" eventLocation="hero" />
            </div>
          </div>
        </div>
      </section>

      <section className="band" aria-labelledby="playground-title">
        <div className="frame">
          <div className="band__head">
            <h2 id="playground-title">{t.playgroundTitle}</h2>
            <p>{t.playgroundText}</p>
          </div>
          <Playground />
        </div>
      </section>

      <section className="band" aria-labelledby="index-title">
        <div className="frame">
          <div className="band__head">
            <h2 id="index-title">
              {t.indexTitle(componentCount)}
              <span className="band__head-muted">{t.indexTitleMuted}</span>
            </h2>
            <p>
              {t.indexText} <Link href={href("/docs/components")}>{t.indexLink}</Link>
            </p>
          </div>
          <ComponentIndex locale={locale} />
        </div>
      </section>

      <section className="band" aria-labelledby="contract-title">
        <div className="frame">
          <div className="band__head">
            <h2 id="contract-title">{t.contractTitle}</h2>
            <p>
              {t.contractText} <Link href={href("/docs/foundations/principles")}>{t.contractLink}</Link>
            </p>
          </div>
          <ol className="contract">
            {t.contract.map((c) => (
              <li key={c.rule}>
                <span className="contract__rule">{c.rule}</span>
                <span className="contract__text">{c.text}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="band" aria-labelledby="foundations-title">
        <div className="frame">
          <div className="band__head">
            <h2 id="foundations-title">{t.foundationsTitle}</h2>
            <p>{t.foundationsText}</p>
          </div>
          <FoundationIndex locale={locale} />
        </div>
      </section>

      <section className="band band--end" aria-label={t.closingLabel}>
        <div className="frame">
          <div className="closing">
            <p className="closing__cmd">
              <span aria-hidden="true">$ </span>
              {site.install}
            </p>
            <p className="closing__text">{t.closingText}</p>
            <div className="hero__actions">
              <Link href={href("/docs/installation")} className="btn" data-variant="primary">
                {t.installation}
              </Link>
              <a href={site.repo} className="btn" data-variant="secondary" {...trackAttrs("github_click", { location: "hero" })}>
                GitHub
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
