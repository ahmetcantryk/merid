import { renderOgImage } from "@/lib/og";

export const alt = "Merid: React components that don’t fight your CSS.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return renderOgImage("en");
}
