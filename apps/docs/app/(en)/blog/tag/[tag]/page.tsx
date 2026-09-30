import { notFound } from "next/navigation";
import { BlogIndex } from "@/components/content/BlogIndex";
import { isTag, tagMetadata, tagParams } from "@/lib/content/routes";

export const dynamicParams = false;

interface Props {
  readonly params: Promise<{ tag: string }>;
}

export function generateStaticParams() {
  return tagParams();
}

export async function generateMetadata({ params }: Props) {
  return tagMetadata("en", (await params).tag);
}

export default async function Page({ params }: Props) {
  const { tag } = await params;
  if (!isTag(tag)) notFound();
  return <BlogIndex locale="en" tag={tag} />;
}
