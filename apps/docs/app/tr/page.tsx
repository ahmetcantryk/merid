import { HomePage } from "@/components/landing/HomePage";
import { alternatesFor } from "@/lib/i18n/metadata";

export const metadata = { alternates: alternatesFor("/", "tr") };

export default function Page() {
  return <HomePage locale="tr" />;
}
