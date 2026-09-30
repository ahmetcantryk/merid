import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { Calendar } from "./Calendar";
import { addMonths, getMonthGrid, getWeekStart, parseNumericDate, formatNumericDate } from "./date-utils";

const day = (label: string) => screen.getByRole("button", { name: label });

describe("date-utils", () => {
  it("resolves the locale's first day of the week", () => {
    expect(getWeekStart("tr-TR")).toBe(1);
    expect(getWeekStart("en-US")).toBe(0);
    expect(getWeekStart("en-GB")).toBe(1);
  });

  it("builds a stable 6-week grid starting on the week start", () => {
    const grid = getMonthGrid(new Date(2026, 8, 15), 1);
    expect(grid).toHaveLength(6);
    expect(grid[0]![0]!.getDay()).toBe(1);
    expect(grid[0]!.some((d) => d.getDate() === 1 && d.getMonth() === 8)).toBe(true);
  });

  it("clamps the day when adding months", () => {
    expect(addMonths(new Date(2026, 0, 31), 1).getDate()).toBe(28);
  });

  it("parses and formats numeric dates in locale order", () => {
    expect(formatNumericDate(new Date(2026, 8, 30), "tr-TR")).toBe("30.09.2026");
    expect(parseNumericDate("30.09.2026", "tr-TR")?.getMonth()).toBe(8);
    expect(parseNumericDate("09/30/2026", "en-US")?.getDate()).toBe(30);
    expect(parseNumericDate("2026-09-30", "en-US")?.getFullYear()).toBe(2026);
    expect(parseNumericDate("31.02.2026", "tr-TR")).toBeNull();
    expect(parseNumericDate("nonsense", "tr-TR")).toBeNull();
  });
});

describe("Calendar", () => {
  it("renders a labelled grid for the month with locale names", () => {
    render(<Calendar defaultMonth={new Date(2026, 8, 1)} locale="tr-TR" />);
    const grid = screen.getByRole("grid", { name: "Eylül 2026" });
    const headers = within(grid).getAllByRole("columnheader");
    expect(headers[0]).toHaveAttribute("abbr", "Pazartesi");
    expect(day("30 Eylül 2026 Çarşamba")).toBeInTheDocument();
  });

  it("starts the week on Sunday for en-US and honours weekStartsOn", () => {
    const { unmount } = render(<Calendar defaultMonth={new Date(2026, 8, 1)} />);
    expect(screen.getAllByRole("columnheader")[0]).toHaveAttribute("abbr", "Sunday");
    unmount();
    render(<Calendar defaultMonth={new Date(2026, 8, 1)} weekStartsOn={6} />);
    expect(screen.getAllByRole("columnheader")[0]).toHaveAttribute("abbr", "Saturday");
  });

  it("selects a day on click and marks it aria-selected", async () => {
    const onValueChange = vi.fn();
    render(<Calendar defaultMonth={new Date(2026, 8, 1)} onValueChange={onValueChange} />);
    await userEvent.click(day("Tuesday, September 15, 2026"));
    expect(onValueChange).toHaveBeenCalledWith(new Date(2026, 8, 15));
    expect(day("Tuesday, September 15, 2026").closest("td")).toHaveAttribute("aria-selected", "true");
  });

  it("has one tab stop and moves with the keyboard across months", async () => {
    render(<Calendar defaultValue={new Date(2026, 8, 30)} />);
    await userEvent.tab();
    await userEvent.tab();
    await userEvent.tab();
    expect(day("Wednesday, September 30, 2026")).toHaveFocus();
    await userEvent.keyboard("{ArrowRight}");
    expect(day("Thursday, October 1, 2026")).toHaveFocus();
    expect(screen.getByRole("grid", { name: "October 2026" })).toBeInTheDocument();
    await userEvent.keyboard("{ArrowUp}");
    expect(day("Thursday, September 24, 2026")).toHaveFocus();
    await userEvent.keyboard("{Home}");
    expect(day("Sunday, September 20, 2026")).toHaveFocus();
    await userEvent.keyboard("{End}");
    expect(day("Saturday, September 26, 2026")).toHaveFocus();
    await userEvent.keyboard("{PageDown}");
    expect(day("Monday, October 26, 2026")).toHaveFocus();
    await userEvent.keyboard("{Shift>}{PageUp}{/Shift}");
    expect(day("Sunday, October 26, 2025")).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    expect(day("Sunday, October 26, 2025").closest("td")).toHaveAttribute("aria-selected", "true");
  });

  it("previous / next buttons change the month and use custom labels", async () => {
    const onMonthChange = vi.fn();
    render(
      <Calendar
        defaultMonth={new Date(2026, 8, 1)}
        previousMonthLabel="Önceki ay"
        nextMonthLabel="Sonraki ay"
        onMonthChange={onMonthChange}
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: "Sonraki ay" }));
    expect(onMonthChange).toHaveBeenCalledWith(new Date(2026, 9, 1));
    await userEvent.click(screen.getByRole("button", { name: "Önceki ay" }));
    await userEvent.click(screen.getByRole("button", { name: "Önceki ay" }));
    expect(screen.getByRole("grid", { name: "August 2026" })).toBeInTheDocument();
  });

  it("respects min, max and isDateDisabled", async () => {
    const onValueChange = vi.fn();
    render(
      <Calendar
        defaultMonth={new Date(2026, 8, 1)}
        min={new Date(2026, 8, 10)}
        max={new Date(2026, 8, 20)}
        isDateDisabled={(d) => d.getDay() === 0}
        onValueChange={onValueChange}
      />,
    );
    expect(day("Wednesday, September 9, 2026")).toHaveAttribute("aria-disabled", "true");
    expect(day("Sunday, September 13, 2026")).toHaveAttribute("aria-disabled", "true");
    await userEvent.click(day("Wednesday, September 9, 2026"));
    expect(onValueChange).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Previous month" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Next month" })).toBeDisabled();
  });

  it("range mode picks start then end, swapping when needed", async () => {
    const onValueChange = vi.fn();
    render(<Calendar mode="range" defaultMonth={new Date(2026, 8, 1)} onValueChange={onValueChange} />);
    await userEvent.click(day("Thursday, September 10, 2026"));
    expect(onValueChange).toHaveBeenLastCalledWith({ start: new Date(2026, 8, 10), end: null });
    await userEvent.click(day("Saturday, September 5, 2026"));
    expect(onValueChange).toHaveBeenLastCalledWith({ start: new Date(2026, 8, 5), end: new Date(2026, 8, 10) });
    expect(day("Monday, September 7, 2026").closest("td")).toHaveAttribute("data-in-range");
    expect(day("Monday, September 7, 2026").closest("td")).toHaveAttribute("aria-selected", "true");
  });

  it("moves focus to the selected day with autoFocus", () => {
    render(<Calendar autoFocus defaultValue={new Date(2026, 1, 3)} />);
    expect(day("Tuesday, February 3, 2026")).toHaveFocus();
  });

  it("has no axe violations", async () => {
    const { container } = render(<Calendar defaultValue={new Date(2026, 8, 30)} locale="tr-TR" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
