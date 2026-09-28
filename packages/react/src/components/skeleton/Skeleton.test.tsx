import { render } from "@testing-library/react";
import { axe } from "vitest-axe";
import { Skeleton } from "./Skeleton";

describe("Skeleton", () => {
  it("renders a hidden placeholder", () => {
    const { container } = render(<Skeleton />);
    const el = container.firstChild as HTMLElement;
    expect(el).toHaveClass("mrd-skeleton");
    expect(el).toHaveAttribute("aria-hidden", "true");
    expect(el).toHaveAttribute("data-shape", "rect");
  });

  it("applies size and circle variant", () => {
    const { container } = render(<Skeleton circle width={40} height="40px" className="c" />);
    const el = container.firstChild as HTMLElement;
    expect(el).toHaveAttribute("data-shape", "circle");
    expect(el.style.width).toBe("40px");
    expect(el.style.height).toBe("40px");
    expect(el).toHaveClass("c");
  });

  it("is not in the tab order", () => {
    const { container } = render(<Skeleton />);
    expect(container.firstChild).not.toHaveAttribute("tabindex");
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <div aria-busy="true">
        <Skeleton />
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
