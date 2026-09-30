import { BlogIndex } from "@/components/content/BlogIndex";
import { blogIndexMetadata } from "@/lib/content/routes";

export const metadata = blogIndexMetadata("en");

export default function Page() {
  return <BlogIndex locale="en" />;
}
