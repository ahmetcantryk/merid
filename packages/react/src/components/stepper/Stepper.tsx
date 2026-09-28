"use client";

import { Children, createContext, type HTMLAttributes, isValidElement, type LiHTMLAttributes, type ReactNode, type Ref, useContext } from "react";
import { cx } from "../../internal/ovl-cx";
import { withRef } from "../../internal/ovl-with-ref";

export type StepState = "complete" | "current" | "upcoming";

interface StepperContextValue {
  current: number;
}
const StepperContext = createContext<StepperContextValue | null>(null);
const IndexContext = createContext<number>(0);

export interface StepperRootProps extends HTMLAttributes<HTMLOListElement> {
  /** Zero-based index of the current step. Steps before it are complete. */
  current: number;
  /** Layout direction. Defaults to `"horizontal"`. */
  orientation?: "horizontal" | "vertical";
  /** Accessible name for the step list. Defaults to `"Progress"`. */
  "aria-label"?: string;
  /** Forwarded ref to the list. */
  ref?: Ref<HTMLOListElement>;
}

function StepperRoot({
  current,
  orientation = "horizontal",
  className,
  children,
  "aria-label": label = "Progress",
  ...rest
}: StepperRootProps) {
  let index = -1;
  return (
    <StepperContext.Provider value={{ current }}>
      <ol aria-label={label} data-orientation={orientation} className={cx("mrd-stepper", className)} {...rest}>
        {Children.map(children, (child) => {
          if (!isValidElement(child)) return child;
          index += 1;
          return <IndexContext.Provider value={index}>{child}</IndexContext.Provider>;
        })}
      </ol>
    </StepperContext.Provider>
  );
}

export interface StepperStepProps extends Omit<LiHTMLAttributes<HTMLLIElement>, "title"> {
  /** Step name. */
  title: ReactNode;
  /** Optional supporting line. */
  description?: ReactNode;
  /** Screen-reader status words. */
  statusLabels?: Partial<Record<StepState, string>>;
}

const DEFAULT_LABELS: Record<StepState, string> = {
  complete: "Completed",
  current: "Current step",
  upcoming: "Not started",
};

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden="true" focusable="false">
      <path d="M3 7.5l2.5 2.5L11 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function StepperStep({ title, description, statusLabels, className, ...rest }: StepperStepProps) {
  const ctx = useContext(StepperContext);
  if (!ctx) throw new Error("<Stepper.Step> must be used inside <Stepper.Root>.");
  const index = useContext(IndexContext);
  const state: StepState = index < ctx.current ? "complete" : index === ctx.current ? "current" : "upcoming";
  const labels = { ...DEFAULT_LABELS, ...statusLabels };
  return (
    <li
      aria-current={state === "current" ? "step" : undefined}
      data-state={state}
      className={cx("mrd-stepper__step", className)}
      {...rest}
    >
      <span className="mrd-stepper__marker" aria-hidden="true">
        {state === "complete" ? <CheckIcon /> : index + 1}
      </span>
      <span className="mrd-stepper__text">
        <span className="mrd-stepper__title" title={typeof title === "string" ? title : undefined}>
          {title}
        </span>
        {description ? <span className="mrd-stepper__description">{description}</span> : null}
        <span className="mrd-sr-only">, {labels[state]}</span>
      </span>
    </li>
  );
}

/**
 * Read-only progress display. The current step has `aria-current="step"`.
 * Horizontal titles stay on one line and truncate with an ellipsis (string titles keep the full text in `title`).
 */
export const Stepper = {
  Root: withRef("Stepper.Root", StepperRoot),
  Step: withRef("Stepper.Step", StepperStep),
};
