import { forwardRef } from "react";
import { cx } from "../../utils/cx";
import type { AsProps } from "../../utils/polymorphic";

export interface SectionProps extends AsProps {
  /** Background: `default` page bg, `tray` recessed alt section. */
  tone?: "default" | "tray";
  /** Vertical padding: `default` uses `--mrd-section` (112/80/64px), `compact` is half, `none` removes it. */
  spacing?: "default" | "compact" | "none";
}

/** Full-bleed page band with generous vertical rhythm. Renders a `section`. */
export const Section = forwardRef<HTMLElement, SectionProps>(function Section(
  { as: Component = "section", tone = "default", spacing = "default", className, ...props },
  ref,
) {
  return (
    <Component
      ref={ref}
      className={cx("mrd-section", className)}
      data-tone={tone}
      data-spacing={spacing}
      {...props}
    />
  );
});
