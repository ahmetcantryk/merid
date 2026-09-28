import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { Section } from "./Section";

describe("Section", () => {
  it("renders a section element with defaults", () => {
    const { container } = render(<Section>x</Section>);
    const el = container.firstChild as HTMLElement;
    expect(el.tagName).toBe("SECTION");
    expect(el).toHaveAttribute("data-tone", "default");
    expect(el).toHaveAttribute("data-spacing", "default");
  });

  it("applies tone, spacing and className", () => {
    const { container } = render(<Section tone="tray" spacing="compact" className="c" />);
    const el = container.firstChild as HTMLElement;
    expect(el).toHaveAttribute("data-tone", "tray");
    expect(el).toHaveAttribute("data-spacing", "compact");
    expect(el).toHaveClass("mrd-section", "c");
  });

  it("becomes a region landmark when labelled", () => {
    render(
      <Section aria-labelledby="t">
        <h2 id="t">Pricing</h2>
      </Section>,
    );
    expect(screen.getByRole("region", { name: "Pricing" })).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <Section aria-label="Intro">
        <p>x</p>
      </Section>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
