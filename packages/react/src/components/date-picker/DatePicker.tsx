"use client";

import {
  forwardRef,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { focusElement } from "../../internal/ovl-focusable";
import { cx } from "../../utils/cx";
import { useControllableState } from "../../utils/use-controllable";
import { Calendar } from "../calendar/Calendar";
import {
  compareDays,
  type DateRange,
  formatNumericDate,
  parseNumericDate,
  type Weekday,
} from "../calendar/date-utils";
import { useFieldControlProps } from "../field/field-context";
import { Popover } from "../popover/Popover";

interface DatePickerBaseProps extends Omit<HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange"> {
  /** BCP 47 locale for the calendar and the typed format (e.g. `"tr-TR"` → `30.09.2026`). Defaults to `"en-US"`. */
  locale?: string;
  /** Earliest selectable day. */
  min?: Date;
  /** Latest selectable day. */
  max?: Date;
  /** Marks individual days unavailable. */
  isDateDisabled?: (date: Date) => boolean;
  /** First column of the calendar. Defaults to the locale's week start. */
  weekStartsOn?: Weekday;
  /** Height of the field. Defaults to `"md"`. */
  size?: "sm" | "md" | "lg";
  /** Disables the field and the calendar button. */
  disabled?: boolean;
  /** Invalid style and `aria-invalid`. Inside a `Field`, derived from its `error`. */
  invalid?: boolean;
  /** Marks the field required. */
  required?: boolean;
  /** Form field name. Submits `yyyy-mm-dd`; a range submits two values under `name[]`. */
  name?: string;
  /** Controlled open state of the calendar. */
  open?: boolean;
  /** Called when the calendar opens or closes. */
  onOpenChange?: (open: boolean) => void;
  /** Placeholder of the text field(s). Defaults to the locale's numeric pattern, e.g. `MM/DD/YYYY`. */
  placeholder?: string;
  /** Accessible name of the calendar button. Defaults to `"Choose date"`. */
  calendarLabel?: string;
  /** Accessible name of the calendar dialog. Defaults to `calendarLabel`. */
  dialogLabel?: string;
  /** Accessible name of the previous-month button. Defaults to `"Previous month"`. */
  previousMonthLabel?: string;
  /** Accessible name of the next-month button. Defaults to `"Next month"`. */
  nextMonthLabel?: string;
  /** Icon inside the calendar button. */
  icon?: ReactNode;
  /** id of the (first) text input; a `<label htmlFor>` can point at it. Inside a `Field`, set automatically. */
  inputId?: string;
}

export interface DatePickerSingleProps extends DatePickerBaseProps {
  /** Pick one day. */
  mode?: "single";
  /** Selected day (controlled). */
  value?: Date | null;
  /** Initially selected day (uncontrolled). */
  defaultValue?: Date | null;
  /** Called with the new day, or `null` when cleared. */
  onValueChange?: (value: Date | null) => void;
}

export interface DatePickerRangeProps extends DatePickerBaseProps {
  /** Pick a start and end day. */
  mode: "range";
  /** Selected range (controlled). */
  value?: DateRange;
  /** Initially selected range (uncontrolled). */
  defaultValue?: DateRange;
  /** Called with the new range. */
  onValueChange?: (value: DateRange) => void;
  /** Accessible name of the start field. Defaults to `"Start date"`. */
  startLabel?: string;
  /** Accessible name of the end field. Defaults to `"End date"`. */
  endLabel?: string;
}

export type DatePickerProps = DatePickerSingleProps | DatePickerRangeProps;

const EMPTY_RANGE: DateRange = { start: null, end: null };

function CalendarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false">
      <rect x="2.5" y="3.5" width="11" height="10" rx="2" stroke="currentColor" strokeWidth="1.4" />
      <path d="M2.5 6.5h11M5.5 2v3M10.5 2v3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

/** `yyyy-mm-dd` in local time. */
export function toISODate(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function patternFor(locale: string): string {
  return new Intl.DateTimeFormat(locale, { year: "numeric", month: "2-digit", day: "2-digit" })
    .formatToParts(new Date(2000, 0, 2))
    .map((p) => (p.type === "year" ? "YYYY" : p.type === "month" ? "MM" : p.type === "day" ? "DD" : p.value))
    .join("");
}

interface DateFieldProps {
  value: Date | null;
  onCommit: (date: Date | null) => void;
  locale: string;
  isValid: (date: Date) => boolean;
  onOpenRequest: () => void;
  inputProps: Record<string, unknown>;
}

/** Text field that shows the date in the locale's numeric format and parses what is typed on blur / Enter. */
function DateField({ value, onCommit, locale, isValid, onOpenRequest, inputProps }: DateFieldProps) {
  const [draft, setDraft] = useState<string | null>(null);
  const text = draft ?? (value ? formatNumericDate(value, locale) : "");
  const commit = () => {
    if (draft === null) return;
    setDraft(null);
    if (draft.trim() === "") {
      onCommit(null);
      return;
    }
    const parsed = parseNumericDate(draft, locale);
    // Invalid or unavailable input reverts to the last good value.
    if (parsed && isValid(parsed)) onCommit(parsed);
  };
  return (
    <input
      type="text"
      inputMode="numeric"
      autoComplete="off"
      className="mrd-date-picker__input"
      value={text}
      onChange={(event) => setDraft(event.currentTarget.value)}
      onBlur={commit}
      onKeyDown={(event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter" && draft !== null) {
          event.preventDefault();
          commit();
        } else if (event.key === "ArrowDown" && event.altKey) {
          event.preventDefault();
          onOpenRequest();
        }
      }}
      {...inputProps}
    />
  );
}

/**
 * Date field with a calendar popover. Type a date in the locale's numeric format or pick one from
 * the calendar; `mode="range"` picks a start and end day.
 */
export const DatePicker = forwardRef<HTMLDivElement, DatePickerProps>(function DatePicker(props, ref) {
  const {
    mode = "single",
    value,
    defaultValue,
    onValueChange,
    locale = "en-US",
    min,
    max,
    isDateDisabled,
    weekStartsOn,
    size = "md",
    disabled,
    invalid,
    required,
    name,
    open: openProp,
    onOpenChange,
    placeholder,
    calendarLabel = "Choose date",
    dialogLabel,
    previousMonthLabel,
    nextMonthLabel,
    icon,
    inputId,
    className,
    ...rest
  } = props;
  const { startLabel = "Start date", endLabel = "End date", ...divProps } = rest as typeof rest & {
    startLabel?: string;
    endLabel?: string;
  };
  const isRange = mode === "range";
  const [single, setSingle] = useControllableState<Date | null>(
    isRange ? undefined : (value as Date | null | undefined),
    isRange ? null : ((defaultValue as Date | null | undefined) ?? null),
    isRange ? undefined : (onValueChange as ((v: Date | null) => void) | undefined),
  );
  const [range, setRange] = useControllableState<DateRange>(
    isRange ? (value as DateRange | undefined) : undefined,
    isRange ? ((defaultValue as DateRange | undefined) ?? EMPTY_RANGE) : EMPTY_RANGE,
    isRange ? (onValueChange as ((v: DateRange) => void) | undefined) : undefined,
  );
  const [open, setOpen] = useControllableState(openProp, false, onOpenChange);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const {
    invalid: isInvalid,
    id: fieldId,
    ...wiring
  } = useFieldControlProps({
    id: inputId,
    disabled,
    required,
    invalid,
    "aria-describedby": divProps["aria-describedby"],
    "aria-invalid": divProps["aria-invalid"],
  });
  const isDisabled = Boolean(wiring.disabled);
  const hint = placeholder ?? patternFor(locale);

  const isValid = (d: Date) =>
    !(min && compareDays(d, min) < 0) && !(max && compareDays(d, max) > 0) && !isDateDisabled?.(d);

  const close = () => {
    setOpen(false);
    focusElement(triggerRef.current);
  };

  const shared = {
    placeholder: hint,
    disabled: isDisabled,
    required: wiring.required,
    "aria-describedby": wiring["aria-describedby"],
    "aria-invalid": wiring["aria-invalid"],
  };
  const { "aria-label": ariaLabel, "aria-labelledby": ariaLabelledBy, "aria-describedby": _d, "aria-invalid": _i, ...rootProps } =
    divProps;

  const calendarShared = {
    locale,
    min,
    max,
    isDateDisabled,
    weekStartsOn,
    previousMonthLabel,
    nextMonthLabel,
    autoFocus: true,
  };

  return (
    <div
      ref={ref}
      className={cx("mrd-date-picker", className)}
      data-size={size}
      data-mode={mode}
      data-invalid={isInvalid || undefined}
      data-disabled={isDisabled || undefined}
      {...rootProps}
    >
      <Popover.Root open={open && !isDisabled} onOpenChange={setOpen}>
        <span className="mrd-date-picker__field">
          {isRange ? (
            <>
              <DateField
                value={range.start}
                locale={locale}
                isValid={isValid}
                onOpenRequest={() => setOpen(true)}
                onCommit={(d) => setRange({ start: d, end: d && range.end && compareDays(d, range.end) > 0 ? null : range.end })}
                inputProps={{ ...shared, id: fieldId, "aria-label": startLabel }}
              />
              <span className="mrd-date-picker__separator" aria-hidden="true">
                –
              </span>
              <DateField
                value={range.end}
                locale={locale}
                isValid={isValid}
                onOpenRequest={() => setOpen(true)}
                onCommit={(d) => setRange({ start: d && range.start && compareDays(d, range.start) < 0 ? null : range.start, end: d })}
                inputProps={{ ...shared, "aria-label": endLabel }}
              />
            </>
          ) : (
            <DateField
              value={single}
              locale={locale}
              isValid={isValid}
              onOpenRequest={() => setOpen(true)}
              onCommit={setSingle}
              inputProps={{ ...shared, id: fieldId, "aria-label": ariaLabel, "aria-labelledby": ariaLabelledBy }}
            />
          )}
          <Popover.Trigger
            ref={triggerRef}
            className="mrd-date-picker__trigger"
            aria-label={calendarLabel}
            disabled={isDisabled}
          >
            {icon ?? <CalendarIcon />}
          </Popover.Trigger>
        </span>
        <Popover.Content className="mrd-date-picker__content" placement="bottom-end" aria-label={dialogLabel ?? calendarLabel}>
          {isRange ? (
            <Calendar
              {...calendarShared}
              mode="range"
              value={range}
              onValueChange={(next) => {
                setRange(next);
                if (next.start && next.end) close();
              }}
            />
          ) : (
            <Calendar
              {...calendarShared}
              value={single}
              onValueChange={(next) => {
                setSingle(next);
                close();
              }}
            />
          )}
        </Popover.Content>
      </Popover.Root>
      {name && !isRange ? (
        <input type="hidden" name={name} value={single ? toISODate(single) : ""} disabled={isDisabled} />
      ) : null}
      {name && isRange ? (
        <>
          <input type="hidden" name={`${name}[]`} value={range.start ? toISODate(range.start) : ""} disabled={isDisabled} />
          <input type="hidden" name={`${name}[]`} value={range.end ? toISODate(range.end) : ""} disabled={isDisabled} />
        </>
      ) : null}
    </div>
  );
});
