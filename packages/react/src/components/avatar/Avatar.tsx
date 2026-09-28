"use client";

import { forwardRef, useState, type HTMLAttributes } from "react";
import { cx } from "../../utils/cx";

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface AvatarProps extends HTMLAttributes<HTMLSpanElement> {
  /** Image URL. Falls back to initials when missing or when loading fails. */
  src?: string;
  /** Person or entity name. Used as the accessible name and to derive initials. */
  name: string;
  /** Diameter: `xs` 24, `sm` 32, `md` 40 (default), `lg` 48, `xl` 64px. */
  size?: AvatarSize;
  /** Overrides the derived initials (max 2 characters shown). */
  initials?: string;
}

/** Derives up to two initials from a name. */
export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "";
  return (first + last).toUpperCase();
}

/** Circular avatar: image, or initials on a tray fill. Exposed as `role="img"` named by `name`. */
export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(function Avatar(
  { src, name, size = "md", initials, className, ...props },
  ref,
) {
  const [failedSrc, setFailedSrc] = useState<string | undefined>(undefined);
  const showImage = Boolean(src) && failedSrc !== src;
  return (
    <span
      ref={ref}
      role="img"
      aria-label={name}
      className={cx("mrd-avatar", className)}
      data-size={size}
      data-status={showImage ? "image" : "fallback"}
      {...props}
    >
      {showImage ? (
        <img className="mrd-avatar__image" src={src} alt="" onError={() => setFailedSrc(src)} />
      ) : (
        <span className="mrd-avatar__fallback" aria-hidden="true">
          {(initials ?? getInitials(name)).slice(0, 2)}
        </span>
      )}
    </span>
  );
});
