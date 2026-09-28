import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { Heading } from "./Heading";

describe("Heading", () => {
  it("renders h2 by default", () => {
    render(<Heading>Title</Heading>);
    const h = screen.getByRole("heading", { level: 2, name: "Title" });
    expect(h).toHaveAttribute("data-size", "h2");
    expect(h).toHaveClass("mrd-heading");
  });

  it("decouples level from size", () => {
    render(
      <Heading level={1} size="h3" className="c">
        Small h1
      </Heading>,
    );
    const h = screen.getByRole("heading", { level: 1 });
    expect(h).toHaveAttribute("data-size", "h3");
    expect(h).toHaveClass("c");
  });

  it("derives size from level", () => {
    render(<Heading level={1}>Hero</Heading>);
    expect(screen.getByRole("heading", { level: 1 })).toHaveAttribute("data-size", "display");
  });

  it("has no axe violations", async () => {
    const { container } = render(<Heading level={1}>Hi</Heading>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
