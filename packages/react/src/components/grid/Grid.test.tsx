import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { Grid } from "./Grid";

describe("Grid", () => {
  it("renders a fixed 3-column grid by default", () => {
    render(<Grid data-testid="g" />);
    const g = screen.getByTestId("g");
    expect(g).toHaveAttribute("data-layout", "fixed");
    expect(g.style.getPropertyValue("--mrd-grid-columns")).toBe("3");
  });

  it("switches to auto-fit with minItemWidth", () => {
    render(<Grid data-testid="g" minItemWidth={240} gap={4} className="c" />);
    const g = screen.getByTestId("g");
    expect(g).toHaveAttribute("data-layout", "auto");
    expect(g.style.getPropertyValue("--mrd-grid-min")).toBe("240px");
    expect(g.style.getPropertyValue("--mrd-grid-gap")).toBe("var(--mrd-space-4)");
    expect(g).toHaveClass("mrd-grid", "c");
  });

  it("renders as a list with listitem roles", () => {
    render(
      <Grid as="ul" columns={2}>
        <li>a</li>
        <li>b</li>
      </Grid>,
    );
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <Grid>
        <p>a</p>
      </Grid>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
