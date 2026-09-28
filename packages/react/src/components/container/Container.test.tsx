import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { Container } from "./Container";

describe("Container", () => {
  it("renders a div with default size", () => {
    render(<Container data-testid="c">x</Container>);
    expect(screen.getByTestId("c")).toHaveAttribute("data-size", "default");
  });

  it("applies prose size, as and className", () => {
    render(
      <Container as="main" size="prose" className="k">
        x
      </Container>,
    );
    const main = screen.getByRole("main");
    expect(main).toHaveAttribute("data-size", "prose");
    expect(main).toHaveClass("mrd-container", "k");
  });

  it("does not add focusable elements", () => {
    render(<Container data-testid="c" />);
    expect(screen.getByTestId("c")).not.toHaveAttribute("tabindex");
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <Container>
        <p>x</p>
      </Container>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
