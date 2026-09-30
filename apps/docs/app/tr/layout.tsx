import type { ReactNode } from "react";
import { RootDocument, rootViewport } from "@/components/RootDocument";
import { rootMetadata } from "@/lib/i18n/metadata";

export const metadata = rootMetadata("tr");
export const viewport = rootViewport;

export default function TurkishRootLayout({ children }: { readonly children: ReactNode }) {
  return <RootDocument locale="tr">{children}</RootDocument>;
}
