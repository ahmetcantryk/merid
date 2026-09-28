import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { Separator } from "./Separator";

describe("Separator", () => {
  it("is decorative by default", () => {
    const { container } = render(<Separator />);
    expect(container.firstChild).toHaveAttribute("role", "none");
    expect(container.firstChild).toHaveAttribute("data-orientation", "horizontal");
  });

  it("exposes a vertical separator role when not decorative", () => {
    render(<Separator decorative={false} orientation="vertical" className="c" />);
    const sep = screen.getByRole("separator");
    expect(sep).toHaveAttribute("aria-orientation", "vertical");
    expect(sep).toHaveClass("mrd-separator", "c");
  });

  it("is never focusable", () => {
    render(<Separator decorative={false} />);
    expect(screen.getByRole("separator")).not.toHaveAttribute("tabindex");
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <div>
        <p>a</p>
        <Separator decorative={false} />
        <p>b</p>
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
