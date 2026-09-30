import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { Field } from "../field/Field";
import { PinInput } from "./PinInput";

const cells = () => screen.getAllByRole("textbox");

describe("PinInput", () => {
  it("renders a named group of labelled cells", () => {
    render(<PinInput aria-label="Verification code" length={4} />);
    expect(screen.getByRole("group", { name: "Verification code" })).toHaveClass("mrd-pin-input");
    expect(cells()).toHaveLength(4);
    expect(screen.getByRole("textbox", { name: "Character 1 of 4" })).toHaveAttribute("autocomplete", "one-time-code");
    expect(cells()[0]).toHaveAttribute("inputmode", "numeric");
  });

  it("types forward, ignores rejected characters and calls onComplete", async () => {
    const onComplete = vi.fn();
    const onValueChange = vi.fn();
    render(<PinInput aria-label="Code" length={4} onComplete={onComplete} onValueChange={onValueChange} />);
    await userEvent.click(cells()[0]!);
    await userEvent.keyboard("1a23");
    expect(onValueChange).toHaveBeenLastCalledWith("123");
    expect(cells()[3]).toHaveFocus();
    await userEvent.keyboard("4");
    expect(onComplete).toHaveBeenCalledWith("1234");
  });

  it("Backspace clears and moves back; arrows move between cells", async () => {
    render(<PinInput aria-label="Code" length={4} defaultValue="1234" />);
    await userEvent.click(cells()[3]!);
    await userEvent.keyboard("{Backspace}");
    expect(cells()[3]).toHaveValue("");
    await userEvent.keyboard("{Backspace}");
    expect(cells()[2]).toHaveFocus();
    expect(cells()[2]).toHaveValue("");
    await userEvent.keyboard("{ArrowLeft}");
    expect(cells()[1]).toHaveFocus();
    await userEvent.keyboard("{Home}");
    expect(cells()[0]).toHaveFocus();
  });

  it("paste fills every cell", () => {
    const onComplete = vi.fn();
    render(<PinInput aria-label="Code" length={6} onComplete={onComplete} name="otp" />);
    fireEvent.paste(cells()[0]!, { clipboardData: { getData: () => "12-34 56" } });
    expect(cells().map((c) => (c as HTMLInputElement).value).join("")).toBe("123456");
    expect(onComplete).toHaveBeenCalledWith("123456");
    expect(document.querySelector("input[type=hidden][name=otp]")).toHaveValue("123456");
  });

  it("alphanumeric accepts letters; mask uses password cells", async () => {
    render(<PinInput aria-label="Code" length={3} type="alphanumeric" mask />);
    const first = document.querySelector("input")!;
    expect(first).toHaveAttribute("type", "password");
    await userEvent.click(first);
    await userEvent.keyboard("aB");
    const inputs = Array.from(document.querySelectorAll<HTMLInputElement>(".mrd-pin-input__cell"));
    expect(inputs.map((i) => i.value).join("")).toBe("aB");
  });

  it("uses custom cell labels and Field wiring", () => {
    render(
      <Field label="Code" error="Wrong code">
        <PinInput length={2} getCellLabel={(i, n) => `Karakter ${i} / ${n}`} />
      </Field>,
    );
    const first = screen.getByRole("textbox", { name: "Karakter 1 / 2" });
    expect(first).toHaveAttribute("aria-invalid", "true");
    expect(first.getAttribute("aria-describedby")).toBeTruthy();
    expect(document.querySelector(".mrd-pin-input")).toHaveAttribute("data-invalid", "true");
  });

  it("has no axe violations", async () => {
    const { container } = render(<PinInput aria-label="Verification code" defaultValue="12" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
