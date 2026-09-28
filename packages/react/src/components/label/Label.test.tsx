import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { Label } from "./Label";

describe("Label", () => {
  it("labels a control", () => {
    render(
      <>
        <Label htmlFor="n">Name</Label>
        <input id="n" />
      </>,
    );
    expect(screen.getByRole("textbox", { name: "Name" })).toBeInTheDocument();
  });

  it("shows a hidden required marker and disabled state", () => {
    render(
      <Label required disabled className="c">
        Email
      </Label>,
    );
    const label = screen.getByText("Email");
    expect(label).toHaveAttribute("data-disabled", "true");
    expect(label).toHaveClass("mrd-label", "c");
    expect(label.querySelector(".mrd-label__required")).toHaveAttribute("aria-hidden", "true");
  });

  it("clicking the label focuses the control", async () => {
    render(
      <>
        <Label htmlFor="x">X</Label>
        <input id="x" />
      </>,
    );
    await userEvent.click(screen.getByText("X"));
    expect(screen.getByRole("textbox")).toHaveFocus();
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <>
        <Label htmlFor="a" required>
          A
        </Label>
        <input id="a" required />
      </>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
