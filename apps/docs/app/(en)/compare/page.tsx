import { CompareIndex } from "@/components/content/CompareIndex";
import { compareIndexMetadata } from "@/lib/content/routes";

export const metadata = compareIndexMetadata("en");

export default function Page() {
  return <CompareIndex locale="en" />;
}
