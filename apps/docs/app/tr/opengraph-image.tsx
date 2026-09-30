import { renderOgImage } from "@/lib/og";

export const alt = "Merid — Sade ve özenli React component'leri.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return renderOgImage("tr");
}
