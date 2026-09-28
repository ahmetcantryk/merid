import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { Code } from "./Code";

describe("Code", () => {
  it("renders inline code by default", () => {
    render(<Code>npm i</Code>);
    const c = screen.getByText("npm i");
    expect(c.tagName).toBe("CODE");
    expect(c).toHaveAttribute("data-variant", "inline");
  });

  it("renders a block variant inside pre", () => {
    render(
      <Code variant="block" className="c" tabIndex={0}>
        const a = 1;
      </Code>,
    );
    const code = screen.getByText("const a = 1;");
    const pre = code.parentElement as HTMLElement;
    expect(pre.tagName).toBe("PRE");
    expect(pre).toHaveAttribute("data-variant", "block");
    expect(pre).toHaveClass("mrd-code", "c");
  });

  it("scrollable block can receive keyboard focus via tabIndex", () => {
    render(
      <Code variant="block" tabIndex={0}>
        x
      </Code>,
    );
    const pre = screen.getByText("x").parentElement as HTMLElement;
    pre.focus();
    expect(pre).toHaveFocus();
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <p>
        Run <Code>build</Code>
      </p>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
