import type { ReactNode } from "react";
import { RootDocument, rootViewport } from "@/components/RootDocument";
import { rootMetadata } from "@/lib/i18n/metadata";

export const metadata = rootMetadata("en");
export const viewport = rootViewport;

export default function EnglishRootLayout({ children }: { readonly children: ReactNode }) {
  return <RootDocument locale="en">{children}</RootDocument>;
}
