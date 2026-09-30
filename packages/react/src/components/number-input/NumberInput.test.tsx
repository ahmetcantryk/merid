import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { Field } from "../field/Field";
import { NumberInput } from "./NumberInput";
import { clampValue, createNumberParser, decimalsOf } from "./number-format";

describe("number-format", () => {
  it("parses in the locale's separators", () => {
    expect(createNumberParser("en-US").parse("1,234.5")).toBe(1234.5);
    expect(createNumberParser("tr-TR").parse("1.234,5")).toBe(1234.5);
    expect(createNumberParser("de-DE").parse("-12,25")).toBe(-12.25);
    expect(createNumberParser("en-US").parse("")).toBeNull();
    expect(createNumberParser("en-US").parse("abc")).toBeNull();
    expect(createNumberParser("en-US", { style: "percent" }).parse("45%")).toBeCloseTo(0.45);
  });

  it("formats with Intl.NumberFormat options", () => {
    expect(createNumberParser("tr-TR", { style: "currency", currency: "TRY" }).format(1500)).toMatch(/1\.500,00/);
    expect(createNumberParser("en-US").format(1234.5)).toBe("1,234.5");
  });

  it("clamps and removes float noise", () => {
    expect(decimalsOf(0.25)).toBe(2);
    expect(decimalsOf(1e-7)).toBe(7);
    expect(clampValue(0.1 + 0.2, 0, 1, 1)).toBe(0.3);
    expect(clampValue(12, 0, 10, 0)).toBe(10);
  });
});

describe("NumberInput", () => {
  it("renders a spinbutton with value attributes and stepper buttons", () => {
    render(<NumberInput aria-label="Quantity" defaultValue={3} min={0} max={10} />);
    const input = screen.getByRole("spinbutton", { name: "Quantity" });
    expect(input).toHaveValue("3");
    expect(input).toHaveAttribute("aria-valuenow", "3");
    expect(input).toHaveAttribute("aria-valuemin", "0");
    expect(input).toHaveAttribute("aria-valuemax", "10");
    expect(screen.getByRole("button", { name: "Increase" })).toHaveAttribute("tabindex", "-1");
    expect(screen.getByRole("button", { name: "Decrease" })).toBeInTheDocument();
  });

  it("steps with arrows, Page keys, Home/End and clamps", async () => {
    const onValueChange = vi.fn();
    render(<NumberInput aria-label="Q" defaultValue={5} min={0} max={20} step={2} onValueChange={onValueChange} />);
    const input = screen.getByRole("spinbutton");
    input.focus();
    await userEvent.keyboard("{ArrowUp}");
    expect(onValueChange).toHaveBeenLastCalledWith(7);
    await userEvent.keyboard("{ArrowDown}{ArrowDown}");
    expect(input).toHaveValue("3");
    await userEvent.keyboard("{PageUp}");
    expect(input).toHaveValue("20");
    await userEvent.keyboard("{Home}");
    expect(input).toHaveValue("0");
    await userEvent.keyboard("{End}");
    expect(input).toHaveValue("20");
    expect(screen.getByRole("button", { name: "Increase" })).toBeDisabled();
  });

  it("commits typed text on Enter and blur, parsing the locale", async () => {
    const onValueChange = vi.fn();
    render(<NumberInput aria-label="Amount" locale="tr-TR" onValueChange={onValueChange} formatOptions={{ maximumFractionDigits: 2 }} />);
    const input = screen.getByRole("spinbutton");
    await userEvent.type(input, "1.234,56{Enter}");
    expect(onValueChange).toHaveBeenLastCalledWith(1234.56);
    expect(input).toHaveValue("1.234,56");
    await userEvent.clear(input);
    await userEvent.tab();
    expect(onValueChange).toHaveBeenLastCalledWith(null);
  });

  it("formats with Intl options and exposes aria-valuetext", () => {
    render(<NumberInput aria-label="Price" locale="en-US" value={1500} formatOptions={{ style: "currency", currency: "USD" }} />);
    const input = screen.getByRole("spinbutton");
    expect(input).toHaveValue("$1,500.00");
    expect(input).toHaveAttribute("aria-valuetext", "$1,500.00");
  });

  it("buttons step and custom labels apply", async () => {
    const onValueChange = vi.fn();
    render(
      <NumberInput
        aria-label="Adet"
        defaultValue={1}
        incrementLabel="Artır"
        decrementLabel="Azalt"
        onValueChange={onValueChange}
        name="qty"
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: "Artır" }));
    expect(onValueChange).toHaveBeenLastCalledWith(2);
    await userEvent.click(screen.getByRole("button", { name: "Azalt" }));
    expect(onValueChange).toHaveBeenLastCalledWith(1);
    expect(document.querySelector("input[type=hidden][name=qty]")).toHaveValue("1");
  });

  it("wires into Field and respects disabled", () => {
    render(
      <Field label="Seats" error="Too many" disabled>
        <NumberInput defaultValue={4} />
      </Field>,
    );
    const input = screen.getByRole("spinbutton", { name: "Seats" });
    expect(input).toBeDisabled();
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByRole("button", { name: "Increase" })).toBeDisabled();
  });

  it("has no axe violations", async () => {
    const { container } = render(<NumberInput aria-label="Quantity" defaultValue={2} min={0} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
