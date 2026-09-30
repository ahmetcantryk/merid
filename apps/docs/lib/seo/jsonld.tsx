import { site } from "@/lib/site";

type Schema = Record<string, unknown>;

/** Renders schema.org data. `<` is escaped so no string in the data can close the script element. */
export function JsonLd({ data }: { readonly data: Schema | readonly Schema[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

const abs = (path: string) => (path.startsWith("http") ? path : `${site.url}${path === "/" ? "" : path}`);

export const ORG_ID = `${site.url}/#org`;
export const WEBSITE_ID = `${site.url}/#website`;
export const CODE_ID = `${site.url}/#code`;

export function organization(): Schema {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    name: site.name,
    url: site.url,
    logo: `${site.url}/brand/logo-light.svg`,
    sameAs: [site.repo, site.npm],
  };
}

/** WebSite with a SearchAction: `?q=` on any page opens the docs search prefilled. */
export function website(): Schema {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: site.url,
    name: site.name,
    inLanguage: ["en", "tr"],
    publisher: { "@id": ORG_ID },
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${site.url}/?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  };
}

export function softwareSourceCode(description: string): Schema {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    "@id": CODE_ID,
    name: `Merid (${site.packageName})`,
    description,
    url: site.url,
    codeRepository: site.repo,
    programmingLanguage: ["TypeScript", "CSS"],
    runtimePlatform: "React 18, React 19",
    license: "https://opensource.org/licenses/MIT",
    version: site.version,
    author: { "@type": "Person", name: site.author.name, url: site.author.url },
    publisher: { "@id": ORG_ID },
  };
}

export function breadcrumb(items: readonly { readonly name: string; readonly path: string }[]): Schema {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: abs(item.path),
    })),
  };
}

export interface ArticleInput {
  readonly title: string;
  readonly description: string;
  readonly path: string;
  readonly lang: string;
  readonly date: string;
  readonly updated: string;
  readonly image: string;
  readonly keywords?: readonly string[];
}

export function article(p: ArticleInput): Schema {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: p.title,
    description: p.description,
    inLanguage: p.lang,
    mainEntityOfPage: abs(p.path),
    url: abs(p.path),
    image: abs(p.image),
    datePublished: p.date,
    dateModified: p.updated,
    keywords: p.keywords?.join(", "),
    author: { "@type": "Person", name: site.author.name, url: site.author.url },
    publisher: { "@id": ORG_ID },
    about: { "@id": CODE_ID },
  };
}
