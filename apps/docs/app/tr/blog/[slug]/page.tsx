import { notFound } from "next/navigation";
import { EntryPage } from "@/components/content/EntryPage";
import { getEntry } from "@/lib/content";
import { entryMetadata, entryParams } from "@/lib/content/routes";

export const dynamicParams = false;

interface Props {
  readonly params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return entryParams("post", "tr");
}

export async function generateMetadata({ params }: Props) {
  return entryMetadata("post", "tr", (await params).slug);
}

export default async function Page({ params }: Props) {
  const entry = getEntry("post", "tr", (await params).slug);
  if (!entry) notFound();
  return <EntryPage entry={entry} />;
}
