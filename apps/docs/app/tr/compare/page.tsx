import { CompareIndex } from "@/components/content/CompareIndex";
import { compareIndexMetadata } from "@/lib/content/routes";

export const metadata = compareIndexMetadata("tr");

export default function Page() {
  return <CompareIndex locale="tr" />;
}
