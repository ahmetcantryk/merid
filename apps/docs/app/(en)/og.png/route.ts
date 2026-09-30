import { renderOgImage } from "@/lib/og";

export const dynamic = "force-static";

/** Site-wide Open Graph image at a stable URL, used by pages that set their own openGraph metadata. */
export function GET() {
  return renderOgImage("en");
}
