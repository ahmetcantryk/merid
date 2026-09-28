import type { ReactNode } from "react";
import { DocPager } from "@/components/DocPager";
import { DocsSidebar } from "@/components/DocsSidebar";
import { OnThisPage } from "@/components/OnThisPage";

export default function DocsLayout({ children }: { readonly children: ReactNode }) {
  return (
    <div className="docs-shell">
      <DocsSidebar />
      <div className="docs-main">
        <article className="doc-article">{children}</article>
        <DocPager />
      </div>
      <OnThisPage />
    </div>
  );
}
