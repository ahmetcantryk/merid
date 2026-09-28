import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { Badge } from "./Badge";

describe("Badge", () => {
  it("renders text with neutral tone", () => {
    render(<Badge>New</Badge>);
    const badge = screen.getByText("New");
    expect(badge).toHaveClass("mrd-badge");
    expect(badge).toHaveAttribute("data-tone", "neutral");
  });

  it("applies tone, dot and className", () => {
    const { container } = render(
      <Badge tone="success" dot className="c">
        Live
      </Badge>,
    );
    const badge = screen.getByText("Live");
    expect(badge).toHaveAttribute("data-tone", "success");
    expect(badge).toHaveClass("c");
    expect(container.querySelector(".mrd-badge__dot")).toHaveAttribute("aria-hidden", "true");
  });

  it("is not focusable (non-interactive role)", () => {
    render(<Badge>3</Badge>);
    expect(screen.getByText("3")).not.toHaveAttribute("tabindex");
  });

  it("has no axe violations", async () => {
    const { container } = render(<Badge tone="danger">Failed</Badge>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
