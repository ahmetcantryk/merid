import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { VisuallyHidden } from "./VisuallyHidden";

describe("VisuallyHidden", () => {
  it("renders a span with the hiding class", () => {
    render(<VisuallyHidden>Hidden text</VisuallyHidden>);
    const el = screen.getByText("Hidden text");
    expect(el.tagName).toBe("SPAN");
    expect(el).toHaveClass("mrd-visually-hidden");
  });

  it("supports `as` and className", () => {
    render(
      <VisuallyHidden as="h2" className="c">
        Section
      </VisuallyHidden>,
    );
    expect(screen.getByRole("heading", { name: "Section" })).toHaveClass("c");
  });

  it("contributes to an accessible name", () => {
    render(
      <button type="button">
        <svg aria-hidden="true" />
        <VisuallyHidden>Close</VisuallyHidden>
      </button>,
    );
    expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = render(<VisuallyHidden>Skip</VisuallyHidden>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
