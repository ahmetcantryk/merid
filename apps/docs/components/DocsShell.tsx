import type { ReactNode } from "react";
import { DocPager } from "@/components/DocPager";
import { DocsBreadcrumbJsonLd } from "@/components/DocsBreadcrumbJsonLd";
import { DocsSidebar } from "@/components/DocsSidebar";
import { OnThisPage } from "@/components/OnThisPage";

/** Sidebar, article and table of contents. Locale-aware parts read the locale from the URL. */
export function DocsShell({ children }: { readonly children: ReactNode }) {
  return (
    <div className="docs-shell">
      <DocsBreadcrumbJsonLd />
      <DocsSidebar />
      <div className="docs-main">
        <article className="doc-article">{children}</article>
        <DocPager />
      </div>
      <OnThisPage />
    </div>
  );
}
