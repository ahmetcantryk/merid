import { markAccent, markInk, markViewBox } from "@/lib/brand-paths";

interface LogoMarkProps {
  readonly height?: number;
  readonly title?: string;
}

const [, , VB_W = 1, VB_H = 1] = markViewBox.split(" ").map(Number);

/**
 * The Merid mark: an M drawn as one continuous line whose last stroke carries the accent.
 * The body follows currentColor so it adapts to light, dark and mono contexts.
 */
export function LogoMark({ height = 13, title }: LogoMarkProps) {
  const width = Math.round((height * VB_W) / VB_H);
  return (
    <svg
      width={width}
      height={height}
      viewBox={markViewBox}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      className="logo-mark"
    >
      <path fill="currentColor" d={markInk} />
      <path fill="var(--logo-accent)" d={markAccent} />
    </svg>
  );
}

export function Logo() {
  return (
    <span className="logo">
      <LogoMark />
      <span className="logo-word">merid</span>
    </span>
  );
}
