import type { ButtonSize, ButtonVariant } from "@merid/react";

/**
 * Merid's Button has no `asChild`/`as`, so a navigation link that should look like a button
 * borrows the Button's public data-attribute contract (`.mrd-button[data-variant][data-size]`).
 */
export function buttonLinkProps(variant: ButtonVariant = "secondary", size: ButtonSize = "md") {
  return { className: "mrd-button", "data-variant": variant, "data-size": size } as const;
}
