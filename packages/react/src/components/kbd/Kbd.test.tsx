import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { Kbd } from "./Kbd";

describe("Kbd", () => {
  it("renders a kbd element", () => {
    render(<Kbd>K</Kbd>);
    const k = screen.getByText("K");
    expect(k.tagName).toBe("KBD");
    expect(k).toHaveAttribute("data-size", "md");
  });

  it("applies size and className", () => {
    render(
      <Kbd size="sm" className="c">
        Esc
      </Kbd>,
    );
    expect(screen.getByText("Esc")).toHaveAttribute("data-size", "sm");
    expect(screen.getByText("Esc")).toHaveClass("mrd-kbd", "c");
  });

  it("is not focusable", () => {
    render(<Kbd>⌘</Kbd>);
    expect(screen.getByText("⌘")).not.toHaveAttribute("tabindex");
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <p>
        Press <Kbd>Ctrl</Kbd> + <Kbd>K</Kbd>
      </p>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
