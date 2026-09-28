import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { axe } from "vitest-axe";
import { Input } from "./Input";

describe("Input", () => {
  it("renders a text input with defaults", () => {
    render(<Input aria-label="Name" />);
    const input = screen.getByRole("textbox", { name: "Name" });
    expect(input).toHaveAttribute("type", "text");
    expect(input).toHaveAttribute("data-size", "md");
    expect(input).not.toHaveAttribute("aria-invalid");
  });

  it("applies size, invalid and forwards ref", () => {
    const ref = createRef<HTMLInputElement>();
    render(<Input ref={ref} aria-label="E" size="sm" invalid className="c" />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("data-size", "sm");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveClass("mrd-input", "c");
    expect(ref.current).toBe(input);
  });

  it("wraps with addons and keeps className on the wrapper", () => {
    const { container } = render(<Input aria-label="Search" leading={<svg />} className="w" />);
    expect(container.firstChild).toHaveClass("mrd-input-group", "w");
    expect(screen.getByRole("textbox", { name: "Search" })).toBeInTheDocument();
  });

  it("accepts typing via keyboard", async () => {
    const onChange = vi.fn();
    render(<Input aria-label="T" onChange={onChange} />);
    await userEvent.tab();
    await userEvent.keyboard("hey");
    expect(screen.getByRole("textbox")).toHaveValue("hey");
    expect(onChange).toHaveBeenCalledTimes(3);
  });

  it("has no axe violations", async () => {
    const { container } = render(<Input aria-label="City" placeholder="Istanbul" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
