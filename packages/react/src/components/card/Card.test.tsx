import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { Card } from "./Card";

describe("Card", () => {
  it("renders a div with tray defaults", () => {
    render(<Card data-testid="card">Body</Card>);
    const card = screen.getByTestId("card");
    expect(card.tagName).toBe("DIV");
    expect(card).toHaveAttribute("data-variant", "tray");
    expect(card).toHaveAttribute("data-padding", "md");
  });

  it("applies variant, selection and interactive flags", () => {
    render(
      <Card data-testid="card" variant="elevated" interactive selected className="c">
        x
      </Card>,
    );
    const card = screen.getByTestId("card");
    expect(card).toHaveAttribute("data-variant", "elevated");
    expect(card).toHaveAttribute("data-interactive", "true");
    expect(card).toHaveAttribute("data-selected", "true");
    expect(card).toHaveClass("mrd-card", "c");
  });

  it("renders as a link and is keyboard reachable", async () => {
    render(
      <Card as="a" href="/pricing" interactive>
        Pricing
      </Card>,
    );
    await userEvent.tab();
    expect(screen.getByRole("link", { name: "Pricing" })).toHaveFocus();
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <Card as="article">
        <h3>Title</h3>
        <p>Text</p>
      </Card>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
