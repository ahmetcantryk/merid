import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { Text } from "./Text";

describe("Text", () => {
  it("renders a paragraph with defaults", () => {
    render(<Text>Hello</Text>);
    const p = screen.getByText("Hello");
    expect(p.tagName).toBe("P");
    expect(p).toHaveAttribute("data-size", "md");
    expect(p).toHaveAttribute("data-tone", "body");
    expect(p).toHaveAttribute("data-weight", "regular");
  });

  it("applies size, tone, weight, numeric and as", () => {
    render(
      <Text as="span" size="2xs" tone="muted" weight="medium" numeric className="c">
        12
      </Text>,
    );
    const el = screen.getByText("12");
    expect(el.tagName).toBe("SPAN");
    expect(el).toHaveAttribute("data-size", "2xs");
    expect(el).toHaveAttribute("data-tone", "muted");
    expect(el).toHaveAttribute("data-weight", "medium");
    expect(el).toHaveAttribute("data-numeric", "true");
    expect(el).toHaveClass("mrd-text", "c");
  });

  it("is not focusable", () => {
    render(<Text>x</Text>);
    expect(screen.getByText("x")).not.toHaveAttribute("tabindex");
  });

  it("has no axe violations", async () => {
    const { container } = render(<Text size="lg">Lead</Text>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
