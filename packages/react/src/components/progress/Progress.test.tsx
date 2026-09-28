import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { Progress } from "./Progress";

describe("Progress", () => {
  it("renders a determinate progressbar", () => {
    render(<Progress aria-label="Upload" value={40} />);
    const bar = screen.getByRole("progressbar", { name: "Upload" });
    expect(bar).toHaveAttribute("aria-valuenow", "40");
    expect(bar).toHaveAttribute("aria-valuetext", "40%");
    expect(bar).toHaveAttribute("data-state", "loading");
    expect(bar.style.getPropertyValue("--mrd-progress-value")).toBe("40%");
  });

  it("is indeterminate without a value and supports size/className", () => {
    render(<Progress aria-label="Loading" size="sm" className="c" />);
    const bar = screen.getByRole("progressbar");
    expect(bar).not.toHaveAttribute("aria-valuenow");
    expect(bar).toHaveAttribute("data-state", "indeterminate");
    expect(bar).toHaveAttribute("data-size", "sm");
    expect(bar).toHaveClass("mrd-progress", "c");
  });

  it("clamps values and uses custom value text", () => {
    render(<Progress aria-label="Steps" value={9} max={5} valueText="5 of 5 steps" />);
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuenow", "5");
    expect(bar).toHaveAttribute("aria-valuetext", "5 of 5 steps");
    expect(bar).toHaveAttribute("data-state", "complete");
    expect(bar).not.toHaveAttribute("tabindex");
  });

  it("has no axe violations", async () => {
    const { container } = render(<Progress aria-label="Upload" value={20} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
