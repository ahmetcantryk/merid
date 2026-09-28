import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { Input } from "../input/Input";
import { Field } from "./Field";

describe("Field", () => {
  it("wires label and description to the control", () => {
    render(
      <Field label="Email" description="We never share it.">
        <Input type="email" />
      </Field>,
    );
    const input = screen.getByRole("textbox", { name: "Email" });
    expect(input).toHaveAccessibleDescription("We never share it.");
    expect(input).not.toHaveAttribute("aria-invalid");
  });

  it("marks invalid and links the error", () => {
    render(
      <Field label="Email" description="Work address" error="Enter a valid email" required className="c">
        <Input />
      </Field>,
    );
    const input = screen.getByRole("textbox", { name: "Email" });
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toBeRequired();
    expect(input).toHaveAccessibleDescription("Work address Enter a valid email");
    expect(input.closest(".mrd-field")).toHaveClass("c");
    expect(input.closest(".mrd-field")).toHaveAttribute("data-invalid", "true");
  });

  it("uses an explicit id and focuses the control from the label", async () => {
    render(
      <Field label="Name" id="name">
        <Input />
      </Field>,
    );
    await userEvent.click(screen.getByText("Name"));
    expect(screen.getByRole("textbox")).toHaveFocus();
    expect(screen.getByRole("textbox")).toHaveAttribute("id", "name");
  });

  it("disables the control", () => {
    render(
      <Field label="Off" disabled>
        <Input />
      </Field>,
    );
    expect(screen.getByRole("textbox")).toBeDisabled();
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <Field label="Phone" description="Mobile" error="Required" required>
        <Input />
      </Field>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
