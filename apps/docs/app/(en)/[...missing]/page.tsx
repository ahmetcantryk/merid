import { notFound } from "next/navigation";

/**
 * With one root layout per locale there is no `app/layout.tsx` to host a global 404, so unmatched
 * English URLs land here and render `(en)/not-found.tsx` inside the English layout.
 */
export default function Missing(): never {
  notFound();
}
