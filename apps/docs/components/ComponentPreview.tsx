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

  return <PreviewTabs preview={children} codeHtml={html} code={code} align={align} />;
}
