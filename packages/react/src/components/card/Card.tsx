import { forwardRef } from "react";
import { cx } from "../../utils/cx";
import type { AsProps } from "../../utils/polymorphic";

export type CardVariant = "tray" | "elevated" | "outline";
export type CardPadding = "none" | "sm" | "md" | "lg";

export interface CardProps extends AsProps {
  /**
   * Surface. `tray` (default) is the recessed card for use on the page;
   * `elevated` is surface + soft shadow for use on a tray section; `outline` is a hairline card.
   */
  variant?: CardVariant;
  /** Inner padding: `none` 0, `sm` 20px, `md` 28px (default), `lg` 32px. */
  padding?: CardPadding;
  /** Adds hover lift (3px) and pointer cursor. Use when the whole card is a link or button. */
  interactive?: boolean;
  /**
   * Draws the 1.5px accent selection ring. When the card is `interactive` and rendered `as="button"`,
   * it also sets `aria-pressed` (a toggle button). Otherwise it is visual only: convey selection
   * through the content or the element you render (e.g. `aria-current` on a link).
   */
  selected?: boolean;
}

/** Content container. Separates by surface, not border. Renders a `div` unless `as` is given. */
export const Card = forwardRef<HTMLElement, CardProps>(function Card(
  { as: Component = "div", variant = "tray", padding = "md", interactive = false, selected, className, ...props },
  ref,
) {
  return (
    <Component
      ref={ref}
      className={cx("mrd-card", className)}
      data-variant={variant}
      data-padding={padding}
      data-interactive={interactive || undefined}
      data-selected={selected || undefined}
      aria-pressed={interactive && Component === "button" && selected !== undefined ? selected : undefined}
      {...props}
    />
  );
});
