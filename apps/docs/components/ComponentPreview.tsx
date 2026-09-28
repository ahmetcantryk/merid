import type { ReactNode } from "react";
import { highlight } from "@/lib/highlight";
import { PreviewTabs } from "./PreviewTabs";

interface ComponentPreviewProps {
  /** Live rendering of the example. Until the component ships, omit it and a pending slot renders. */
  readonly children?: ReactNode;
  readonly code: string;
  readonly lang?: string;
  readonly align?: "center" | "start";
}

export async function ComponentPreview({ children, code, lang = "tsx", align = "center" }: ComponentPreviewProps) {
  const html = await highlight(code, lang);
  // TODO(component-pages): pass the live example as children once @merid/react exports the component.
  const preview = children ?? <p className="preview-pending">Live preview is added when this component ships.</p>;
  return <PreviewTabs preview={preview} codeHtml={html} code={code} align={align} />;
}
