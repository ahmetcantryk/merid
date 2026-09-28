import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { Stack } from "./Stack";

describe("Stack", () => {
  it("renders a column stack with default gap", () => {
    render(<Stack data-testid="s">a</Stack>);
    const s = screen.getByTestId("s");
    expect(s).toHaveAttribute("data-direction", "column");
    expect(s.style.getPropertyValue("--mrd-stack-gap")).toBe("var(--mrd-space-4)");
  });

  it("applies direction, gap, alignment and as", () => {
    render(
      <Stack as="ul" direction="row" gap={2} align="center" justify="between" wrap className="c">
        <li>x</li>
      </Stack>,
    );
    const list = screen.getByRole("list");
    expect(list).toHaveAttribute("data-direction", "row");
    expect(list).toHaveAttribute("data-align", "center");
    expect(list).toHaveAttribute("data-justify", "between");
    expect(list).toHaveAttribute("data-wrap", "true");
    expect(list.style.getPropertyValue("--mrd-stack-gap")).toBe("var(--mrd-space-2)");
    expect(list).toHaveClass("mrd-stack", "c");
  });

  it("keeps DOM order for keyboard navigation", () => {
    render(
      <Stack direction="row">
        <button type="button">1</button>
        <button type="button">2</button>
      </Stack>,
    );
    const [a, b] = screen.getAllByRole("button");
    expect(a?.compareDocumentPosition(b as Node)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <Stack>
        <p>a</p>
      </Stack>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
