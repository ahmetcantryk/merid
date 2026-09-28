import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { Field } from "../field/Field";
import { Textarea } from "./Textarea";

describe("Textarea", () => {
  it("renders a multi-line textbox", () => {
    render(<Textarea aria-label="Message" />);
    const t = screen.getByRole("textbox", { name: "Message" });
    expect(t.tagName).toBe("TEXTAREA");
    expect(t).toHaveAttribute("rows", "4");
    expect(t).toHaveAttribute("data-resize", "vertical");
  });

  it("applies resize, invalid and className", () => {
    render(<Textarea aria-label="M" resize="none" invalid className="c" />);
    const t = screen.getByRole("textbox");
    expect(t).toHaveAttribute("data-resize", "none");
    expect(t).toHaveAttribute("aria-invalid", "true");
    expect(t).toHaveClass("mrd-textarea", "c");
  });

  it("accepts multi-line keyboard input inside a Field", async () => {
    render(
      <Field label="Notes" description="Optional">
        <Textarea />
      </Field>,
    );
    const t = screen.getByRole("textbox", { name: "Notes" });
    expect(t).toHaveAccessibleDescription("Optional");
    await userEvent.click(t);
    await userEvent.keyboard("a{Enter}b");
    expect(t).toHaveValue("a\nb");
  });

  it("has no axe violations", async () => {
    const { container } = render(<Textarea aria-label="Bio" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
