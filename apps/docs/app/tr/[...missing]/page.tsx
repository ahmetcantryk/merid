import { notFound } from "next/navigation";

/** Unmatched `/tr/...` URLs render `tr/not-found.tsx` inside the Turkish layout. */
export default function Missing(): never {
  notFound();
}
