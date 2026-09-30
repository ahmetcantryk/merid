"use client";

import {
  forwardRef,
  useEffect,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
} from "react";
import { useId } from "../../internal/ovl-use-id";
import { cx } from "../../utils/cx";
import { mergeRefs } from "../../utils/merge-refs";
import { useControllableState } from "../../utils/use-controllable";
import {
  addDays,
  addMonths,
  clampDate,
  compareDays,
  type DateRange,
  getMonthGrid,
  getWeekStart,
  isSameDay,
  isSameMonth,
  startOfDay,
  startOfMonth,
  type Weekday,
} from "./date-utils";

export type { DateRange, Weekday };

interface CalendarBaseProps extends Omit<HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange"> {
  /** Displayed month (controlled). Any day in the month. */
  month?: Date;
  /** Initially displayed month (uncontrolled). Defaults to the selected date or today. */
  defaultMonth?: Date;
  /** Called when the displayed month changes. */
  onMonthChange?: (month: Date) => void;
  /** Earliest selectable day. */
  min?: Date;
  /** Latest selectable day. */
  max?: Date;
  /** Marks individual days unavailable (weekends, booked dates…). */
  isDateDisabled?: (date: Date) => boolean;
  /** BCP 47 locale for month, weekday and day names. Defaults to `"en-US"`. */
  locale?: string;
  /** First column: 0 = Sunday … 6 = Saturday. Defaults to the locale's week start (`tr-TR` → Monday). */
  weekStartsOn?: Weekday;
  /** Accessible name of the previous-month button. Defaults to `"Previous month"`. */
  previousMonthLabel?: string;
  /** Accessible name of the next-month button. Defaults to `"Next month"`. */
  nextMonthLabel?: string;
  /** Move focus to the selected (or today's) day on mount. */
  autoFocus?: boolean;
}

export interface CalendarSingleProps extends CalendarBaseProps {
  /** Select one day. */
  mode?: "single";
  /** Selected day (controlled); `null` for none. */
  value?: Date | null;
  /** Initially selected day (uncontrolled). */
  defaultValue?: Date | null;
  /** Called with the picked day. */
  onValueChange?: (value: Date | null) => void;
}

export interface CalendarRangeProps extends CalendarBaseProps {
  /** Select a start and end day. */
  mode: "range";
  /** Selected range (controlled). */
  value?: DateRange;
  /** Initially selected range (uncontrolled). */
  defaultValue?: DateRange;
  /** Called after each pick: first with `{ start, end: null }`, then with both days. */
  onValueChange?: (value: DateRange) => void;
}

export type CalendarProps = CalendarSingleProps | CalendarRangeProps;

const EMPTY_RANGE: DateRange = { start: null, end: null };

function ChevronIcon({ direction }: { direction: "prev" | "next" }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false">
      <path
        d={direction === "prev" ? "M10 4l-4 4 4 4" : "M6 4l4 4-4 4"}
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const dayKey = (d: Date) => `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;

/**
 * Month grid for picking a day or a range (WAI-ARIA APG date grid). One tab stop; arrow keys move by
 * day and week, Page Up / Page Down by month (with Shift, by year). Names come from `Intl` for `locale`.
 */
export const Calendar = forwardRef<HTMLDivElement, CalendarProps>(function Calendar(props, ref) {
  const {
    mode = "single",
    value,
    defaultValue,
    onValueChange,
    month: monthProp,
    defaultMonth,
    onMonthChange,
    min,
    max,
    isDateDisabled,
    locale = "en-US",
    weekStartsOn,
    previousMonthLabel = "Previous month",
    nextMonthLabel = "Next month",
    autoFocus = false,
    className,
    ...rest
  } = props;
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

  const anchor = (isRange ? range.start : single) ?? null;
  const [today] = useState(() => startOfDay(new Date()));
  const initialFocus = clampDate(anchor ?? defaultMonth ?? today, min, max);
  const [month, setMonthState] = useControllableState<Date>(
    monthProp ? startOfMonth(monthProp) : undefined,
    startOfMonth(defaultMonth ?? initialFocus),
    onMonthChange,
  );
  const [focused, setFocused] = useState<Date>(initialFocus);
  const [hovered, setHovered] = useState<Date | null>(null);
  const wantsFocus = useRef(autoFocus);
  const gridRef = useRef<HTMLTableElement | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const baseId = useId(undefined, "mrd-calendar");

  const firstDay = weekStartsOn ?? getWeekStart(locale);
  const weeks = useMemo(() => getMonthGrid(month, firstDay), [month, firstDay]);
  const formatters = useMemo(
    () => ({
      caption: new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }),
      day: new Intl.DateTimeFormat(locale, { day: "numeric" }),
      full: new Intl.DateTimeFormat(locale, { weekday: "long", year: "numeric", month: "long", day: "numeric" }),
      weekdayShort: new Intl.DateTimeFormat(locale, { weekday: "short" }),
      weekdayLong: new Intl.DateTimeFormat(locale, { weekday: "long" }),
    }),
    [locale],
  );

  const disabledDay = (d: Date) =>
    (min !== undefined && compareDays(d, min) < 0) ||
    (max !== undefined && compareDays(d, max) > 0) ||
    Boolean(isDateDisabled?.(d));

  // The roving tab stop always lives in the displayed month.
  const tabStop = isSameMonth(focused, month) ? focused : startOfMonth(month);

  useEffect(() => {
    if (!wantsFocus.current) return;
    wantsFocus.current = false;
    gridRef.current?.querySelector<HTMLButtonElement>(`[data-day="${dayKey(tabStop)}"]`)?.focus();
  });

  const goToMonth = (next: Date) => {
    const target = startOfMonth(next);
    if (!isSameMonth(target, month)) setMonthState(target);
  };

  const moveFocus = (next: Date) => {
    const target = clampDate(next, min, max);
    setFocused(target);
    goToMonth(target);
    wantsFocus.current = true;
  };

  const select = (d: Date) => {
    if (disabledDay(d)) return;
    setFocused(d);
    goToMonth(d);
    if (!isRange) {
      setSingle(d);
      return;
    }
    if (!range.start || range.end) {
      setRange({ start: d, end: null });
    } else if (compareDays(d, range.start) < 0) {
      setRange({ start: d, end: range.start });
    } else {
      setRange({ start: range.start, end: d });
    }
    setHovered(null);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTableElement>) => {
    const rtl = rootRef.current ? getComputedStyle(rootRef.current).direction === "rtl" : false;
    const current = tabStop;
    const weekday = (current.getDay() - firstDay + 7) % 7;
    let next: Date | null = null;
    switch (event.key) {
      case "ArrowRight":
        next = addDays(current, rtl ? -1 : 1);
        break;
      case "ArrowLeft":
        next = addDays(current, rtl ? 1 : -1);
        break;
      case "ArrowDown":
        next = addDays(current, 7);
        break;
      case "ArrowUp":
        next = addDays(current, -7);
        break;
      case "Home":
        next = addDays(current, -weekday);
        break;
      case "End":
        next = addDays(current, 6 - weekday);
        break;
      case "PageUp":
        next = addMonths(current, event.shiftKey ? -12 : -1);
        break;
      case "PageDown":
        next = addMonths(current, event.shiftKey ? 12 : 1);
        break;
      default:
        return;
    }
    event.preventDefault();
    moveFocus(next);
  };

  const prevMonth = addMonths(month, -1);
  const nextMonth = addMonths(month, 1);
  const prevDisabled = min !== undefined && compareDays(new Date(month.getFullYear(), month.getMonth(), 0), min) < 0;
  const nextDisabled = max !== undefined && compareDays(nextMonth, max) > 0;

  const navigate = (target: Date) => {
    goToMonth(target);
    setFocused(clampDate(new Date(target.getFullYear(), target.getMonth(), Math.min(focused.getDate(), 28)), min, max));
  };

  const inRange = (d: Date) => {
    if (!isRange || !range.start) return false;
    const end = range.end ?? hovered;
    if (!end) return false;
    const [a, b] = compareDays(range.start, end) <= 0 ? [range.start, end] : [end, range.start];
    return compareDays(d, a) >= 0 && compareDays(d, b) <= 0;
  };

  const captionId = `${baseId}-caption`;

  return (
    <div
      ref={mergeRefs(rootRef, ref)}
      className={cx("mrd-calendar", className)}
      data-mode={mode}
      {...rest}
    >
      <div className="mrd-calendar__header">
        <button
          type="button"
          className="mrd-calendar__nav"
          aria-label={previousMonthLabel}
          disabled={prevDisabled}
          onClick={() => navigate(prevMonth)}
        >
          <ChevronIcon direction="prev" />
        </button>
        <div id={captionId} className="mrd-calendar__caption" aria-live="polite">
          {formatters.caption.format(month)}
        </div>
        <button
          type="button"
          className="mrd-calendar__nav"
          aria-label={nextMonthLabel}
          disabled={nextDisabled}
          onClick={() => navigate(nextMonth)}
        >
          <ChevronIcon direction="next" />
        </button>
      </div>
      <table
        ref={gridRef}
        role="grid"
        aria-labelledby={captionId}
        className="mrd-calendar__grid"
        onKeyDown={handleKeyDown}
        onPointerLeave={() => setHovered(null)}
      >
        <thead>
          <tr>
            {weeks[0]?.map((d) => (
              <th key={d.getDay()} scope="col" abbr={formatters.weekdayLong.format(d)} className="mrd-calendar__weekday">
                {formatters.weekdayShort.format(d)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week) => (
            <tr key={dayKey(week[0] as Date)}>
              {week.map((d) => {
                const disabled = disabledDay(d);
                const selected = isRange
                  ? isSameDay(d, range.start) || isSameDay(d, range.end) || (range.end !== null && inRange(d))
                  : isSameDay(d, single);
                const outside = !isSameMonth(d, month);
                return (
                  <td
                    key={dayKey(d)}
                    role="gridcell"
                    aria-selected={selected}
                    className="mrd-calendar__cell"
                    data-in-range={inRange(d) ? "" : undefined}
                    data-range-start={isRange && isSameDay(d, range.start) ? "" : undefined}
                    data-range-end={isRange && isSameDay(d, range.end ?? (range.start ? hovered : null)) ? "" : undefined}
                  >
                    <button
                      type="button"
                      tabIndex={isSameDay(d, tabStop) ? 0 : -1}
                      className="mrd-calendar__day"
                      aria-label={formatters.full.format(d)}
                      aria-disabled={disabled || undefined}
                      aria-current={isSameDay(d, today) ? "date" : undefined}
                      data-day={dayKey(d)}
                      data-selected={selected ? "" : undefined}
                      data-outside={outside ? "" : undefined}
                      data-today={isSameDay(d, today) ? "" : undefined}
                      data-disabled={disabled ? "" : undefined}
                      data-autofocus={autoFocus && isSameDay(d, tabStop) ? "" : undefined}
                      onClick={() => select(d)}
                      onFocus={() => {
                        if (!isSameDay(d, focused)) setFocused(d);
                      }}
                      onPointerEnter={() => {
                        if (isRange && range.start && !range.end && !disabled) setHovered(d);
                      }}
                    >
                      {formatters.day.format(d)}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});
