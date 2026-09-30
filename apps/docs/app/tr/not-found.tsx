import { NotFoundView } from "@/components/NotFoundView";
import { getDictionary } from "@/lib/i18n";

export const metadata = { title: getDictionary("tr").notFound.title };

export default function NotFound() {
  return <NotFoundView locale="tr" />;
}
