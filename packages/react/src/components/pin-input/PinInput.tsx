"use client";

import {
  forwardRef,
  useRef,
  type ClipboardEvent,
  type HTMLAttributes,
  type KeyboardEvent,
} from "react";
import { cx } from "../../utils/cx";
import { useControllableState } from "../../utils/use-controllable";
import { useFieldControlProps } from "../field/field-context";

export type PinInputType = "numeric" | "alphanumeric";

export interface PinInputProps extends Omit<HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange"> {
  /** Number of cells. Defaults to 6. */
  length?: number;
  /** Current code (controlled). */
  value?: string;
  /** Initial code (uncontrolled). */
  defaultValue?: string;
  /** Called with the code on every change. */
  onValueChange?: (value: string) => void;
  /** Called once every cell is filled. */
  onComplete?: (value: string) => void;
  /** Accepted characters. `numeric` (default) also opens the numeric keyboard on mobile. */
  type?: PinInputType;
  /** Hide the characters like a password. */
  mask?: boolean;
  /** Form field name; renders a hidden input carrying the code. */
  name?: string;
  /** Disables every cell. */
  disabled?: boolean;
  /** Invalid style and `aria-invalid`. Inside a `Field`, derived from its `error`. */
  invalid?: boolean;
  /** Marks the code as required. */
  required?: boolean;
  /** Height of the cells. Defaults to `"md"`. */
  size?: "sm" | "md" | "lg";
  /** Focus the first empty cell on mount. */
  autoFocus?: boolean;
  /** Placeholder shown in empty cells. */
  placeholder?: string;
  /** Accessible name of each cell. Defaults to `(i, n) => \`Character ${i} of ${n}\``. */
  getCellLabel?: (index: number, length: number) => string;
}

const PATTERN: Record<PinInputType, RegExp> = { numeric: /[0-9]/, alphanumeric: /[a-zA-Z0-9]/ };
const defaultCellLabel = (index: number, length: number): string => `Character ${index} of ${length}`;

/**
 * One-time code / PIN entry: one input per character. Typing moves forward, Backspace moves back,
 * pasting fills every cell. The group is named with `aria-label` (or `aria-labelledby`).
 */
export const PinInput = forwardRef<HTMLDivElement, PinInputProps>(function PinInput(
  {
    length = 6,
    value,
    defaultValue = "",
    onValueChange,
    onComplete,
    type = "numeric",
    mask = false,
    name,
    disabled,
    invalid,
    required,
    size = "md",
    autoFocus = false,
    placeholder = "",
    getCellLabel = defaultCellLabel,
    className,
    id,
    ...props
  },
  ref,
) {
  const [code, setCode] = useControllableState(value, defaultValue, onValueChange);
  const inputs = useRef<Array<HTMLInputElement | null>>([]);
  const wiring = useFieldControlProps({
    id,
    disabled,
    required,
    invalid,
    "aria-describedby": props["aria-describedby"],
    "aria-invalid": props["aria-invalid"],
  });
  const chars = Array.from({ length }, (_, i) => code[i] ?? "");
  const pattern = PATTERN[type];

  const focusCell = (index: number) => {
    const el = inputs.current[Math.max(0, Math.min(index, length - 1))];
    el?.focus();
    el?.select();
  };

  const commit = (next: string[]) => {
    const joined = next.join("").slice(0, length);
    // Keep positions: an empty cell in the middle truncates, so codes never contain gaps.
    const firstGap = next.findIndex((c) => c === "");
    const compact = firstGap === -1 ? joined : next.slice(0, firstGap).join("");
    setCode(compact);
    if (compact.length === length) onComplete?.(compact);
  };

  const insert = (index: number, text: string) => {
    const accepted = Array.from(text).filter((c) => pattern.test(c));
    if (accepted.length === 0) return;
    const next = [...chars];
    // Never leave a gap: typing past the end of the code writes at the first empty cell.
    let at = Math.min(index, code.length);
    for (const c of accepted) {
      if (at >= length) break;
      next[at] = c;
      at += 1;
    }
    commit(next);
    focusCell(at);
  };

  const handleKeyDown = (index: number) => (event: KeyboardEvent<HTMLInputElement>) => {
    const rtl = getComputedStyle(event.currentTarget).direction === "rtl";
    const back = rtl ? "ArrowRight" : "ArrowLeft";
    const forward = rtl ? "ArrowLeft" : "ArrowRight";
    if (event.key === "Backspace") {
      event.preventDefault();
      const next = [...chars];
      const target = chars[index] ? index : index - 1;
      if (target < 0) return;
      next.splice(target, 1);
      next.push("");
      commit(next);
      focusCell(target);
    } else if (event.key === "Delete") {
      event.preventDefault();
      const next = [...chars];
      next.splice(index, 1);
      next.push("");
      commit(next);
    } else if (event.key === back) {
      event.preventDefault();
      focusCell(index - 1);
    } else if (event.key === forward) {
      event.preventDefault();
      focusCell(Math.min(index + 1, code.length));
    } else if (event.key === "Home") {
      event.preventDefault();
      focusCell(0);
    } else if (event.key === "End") {
      event.preventDefault();
      focusCell(Math.min(code.length, length - 1));
    } else if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      event.preventDefault();
      insert(index, event.key);
    }
  };

  const handlePaste = (index: number) => (event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    insert(index, event.clipboardData.getData("text"));
  };

  const firstEmpty = Math.min(code.length, length - 1);

  return (
    <div
      ref={ref}
      role="group"
      className={cx("mrd-pin-input", className)}
      data-size={size}
      data-invalid={wiring.invalid || undefined}
      data-disabled={wiring.disabled || undefined}
      {...props}
      aria-describedby={undefined}
      aria-invalid={undefined}
    >
      {chars.map((char, index) => (
        <input
          key={index}
          ref={(node) => {
            inputs.current[index] = node;
          }}
          id={index === 0 ? wiring.id : undefined}
          className="mrd-pin-input__cell"
          type={mask ? "password" : "text"}
          inputMode={type === "numeric" ? "numeric" : "text"}
          autoComplete={index === 0 ? "one-time-code" : "off"}
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          value={char}
          placeholder={placeholder}
          disabled={wiring.disabled}
          required={wiring.required && index === 0}
          aria-label={getCellLabel(index + 1, length)}
          aria-describedby={wiring["aria-describedby"]}
          aria-invalid={wiring["aria-invalid"]}
          autoFocus={autoFocus && index === firstEmpty}
          data-filled={char ? "" : undefined}
          onKeyDown={handleKeyDown(index)}
          onPaste={handlePaste(index)}
          onFocus={(event) => event.currentTarget.select()}
          // Mobile keyboards and autofill can bypass keydown: accept whatever landed in the cell.
          onChange={(event) => insert(index, event.currentTarget.value.replace(char, "") || event.currentTarget.value)}
        />
      ))}
      {name ? <input type="hidden" name={name} value={code} disabled={wiring.disabled} /> : null}
    </div>
  );
});
