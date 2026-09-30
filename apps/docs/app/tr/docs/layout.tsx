import type { ReactNode } from "react";
import { DocsShell } from "@/components/DocsShell";

export default function DocsLayout({ children }: { readonly children: ReactNode }) {
  return <DocsShell>{children}</DocsShell>;
}
