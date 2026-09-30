"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { track, trackAttrs } from "@/lib/analytics";
import { useDictionary, useLocale } from "@/lib/i18n/client";
import { localizePath } from "@/lib/i18n/config";
import { site } from "@/lib/site";

/** End-of-article call to action: docs and GitHub. */
export function ContentCta() {
  const t = useDictionary().launch.blog;
  const locale = useLocale();
  const path = usePathname() ?? "/";
  return (
    <aside className="content-cta" aria-labelledby="content-cta-title">
      <div>
        <p id="content-cta-title" className="content-cta__title">
          {t.ctaTitle}
        </p>
        <p className="content-cta__text">{t.ctaText}</p>
        <p className="content-cta__cmd">
          <span aria-hidden="true">$ </span>
          {site.install}
        </p>
      </div>
      <div className="content-cta__actions">
        <Link
          href={localizePath("/docs/installation", locale)}
          className="btn"
          data-variant="primary"
          onClick={() => track("blog_cta_click", { target: "docs", path })}
        >
          {t.ctaDocs}
        </Link>
        <a
          href={site.repo}
          className="btn"
          data-variant="secondary"
          onClick={() => track("blog_cta_click", { target: "github", path })}
          {...trackAttrs("github_click", { location: "blog-cta" })}
        >
          {t.ctaGithub}
        </a>
      </div>
    </aside>
  );
}
