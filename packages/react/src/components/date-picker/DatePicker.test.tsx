import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { Field } from "../field/Field";
import { DatePicker, toISODate } from "./DatePicker";

describe("DatePicker", () => {
  it("shows the value in the locale's numeric format with a pattern placeholder", () => {
    const { unmount } = render(<DatePicker aria-label="Due" defaultValue={new Date(2026, 8, 30)} locale="tr-TR" />);
    expect(screen.getByRole("textbox", { name: "Due" })).toHaveValue("30.09.2026");
    unmount();
    render(<DatePicker aria-label="Due" />);
    expect(screen.getByRole("textbox", { name: "Due" })).toHaveAttribute("placeholder", "MM/DD/YYYY");
  });

  it("parses typed dates on blur and reverts invalid text", async () => {
    const onValueChange = vi.fn();
    render(<DatePicker aria-label="Due" locale="tr-TR" onValueChange={onValueChange} max={new Date(2026, 11, 31)} />);
    const input = screen.getByRole("textbox", { name: "Due" });
    await userEvent.type(input, "5.10.2026");
    await userEvent.tab();
    expect(onValueChange).toHaveBeenLastCalledWith(new Date(2026, 9, 5));
    expect(input).toHaveValue("05.10.2026");
    await userEvent.clear(input);
    await userEvent.type(input, "01.01.2030{Enter}");
    expect(input).toHaveValue("05.10.2026");
    await userEvent.clear(input);
    await userEvent.tab();
    expect(onValueChange).toHaveBeenLastCalledWith(null);
  });

  it("opens a calendar dialog, focuses the selected day and closes on pick", async () => {
    const onValueChange = vi.fn();
    render(<DatePicker aria-label="Due" defaultValue={new Date(2026, 8, 10)} onValueChange={onValueChange} name="due" />);
    const trigger = screen.getByRole("button", { name: "Choose date" });
    expect(trigger).toHaveAttribute("aria-haspopup", "dialog");
    await userEvent.click(trigger);
    expect(screen.getByRole("dialog", { name: "Choose date" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Thursday, September 10, 2026" })).toHaveFocus();
    await userEvent.keyboard("{ArrowRight}{Enter}");
    expect(onValueChange).toHaveBeenLastCalledWith(new Date(2026, 8, 11));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
    expect(document.querySelector("input[type=hidden][name=due]")).toHaveValue("2026-09-11");
  });

  it("Escape closes the calendar and returns focus", async () => {
    render(<DatePicker aria-label="Due" calendarLabel="Tarih seç" />);
    const trigger = screen.getByRole("button", { name: "Tarih seç" });
    await userEvent.click(trigger);
    expect(screen.getByRole("dialog", { name: "Tarih seç" })).toBeInTheDocument();
    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("Alt+ArrowDown in the field opens the calendar", async () => {
    render(<DatePicker aria-label="Due" />);
    screen.getByRole("textbox").focus();
    await userEvent.keyboard("{Alt>}{ArrowDown}{/Alt}");
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("range mode has start and end fields and picks both days", async () => {
    const onValueChange = vi.fn();
    render(
      <DatePicker
        mode="range"
        aria-label="Stay"
        startLabel="Giriş"
        endLabel="Çıkış"
        defaultValue={{ start: new Date(2026, 8, 1), end: null }}
        onValueChange={onValueChange}
        name="stay"
      />,
    );
    expect(screen.getByRole("textbox", { name: "Giriş" })).toHaveValue("09/01/2026");
    expect(screen.getByRole("textbox", { name: "Çıkış" })).toHaveValue("");
    await userEvent.click(screen.getByRole("button", { name: "Choose date" }));
    await userEvent.click(screen.getByRole("button", { name: "Saturday, September 5, 2026" }));
    expect(onValueChange).toHaveBeenLastCalledWith({ start: new Date(2026, 8, 1), end: new Date(2026, 8, 5) });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    const hidden = Array.from(document.querySelectorAll<HTMLInputElement>("input[name='stay[]']")).map((i) => i.value);
    expect(hidden).toEqual(["2026-09-01", "2026-09-05"]);
  });

  it("wires into Field and disables the button", () => {
    render(
      <Field label="Due date" error="Required" disabled>
        <DatePicker />
      </Field>,
    );
    const input = screen.getByRole("textbox", { name: "Due date" });
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toBeDisabled();
    expect(screen.getByRole("button", { name: "Choose date" })).toBeDisabled();
  });

  it("formats ISO dates in local time", () => {
    expect(toISODate(new Date(2026, 0, 5))).toBe("2026-01-05");
  });

  it("has no axe violations (closed and open)", async () => {
    const { container } = render(<DatePicker aria-label="Due" defaultValue={new Date(2026, 8, 10)} />);
    expect(await axe(container)).toHaveNoViolations();
    await userEvent.click(screen.getByRole("button", { name: "Choose date" }));
    expect(await axe(document.body, { rules: { region: { enabled: false } } })).toHaveNoViolations();
  });
});
