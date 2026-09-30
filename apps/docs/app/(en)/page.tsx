import { HomePage } from "@/components/landing/HomePage";
import { alternatesFor } from "@/lib/i18n/metadata";

export const metadata = { alternates: alternatesFor("/", "en") };

export default function Page() {
  return <HomePage locale="en" />;
}
