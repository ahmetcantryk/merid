import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { Spinner } from "./Spinner";

describe("Spinner", () => {
  it("renders a status with a default label", () => {
    render(<Spinner />);
    expect(screen.getByRole("status", { name: "Loading" })).toBeInTheDocument();
  });

  it("applies size variant and custom class", () => {
    render(<Spinner size="lg" label="Saving" className="x" />);
    const el = screen.getByRole("status", { name: "Saving" });
    expect(el).toHaveAttribute("data-size", "lg");
    expect(el).toHaveClass("mrd-spinner", "x");
  });

  it("is hidden from AT when decorative", () => {
    const { container } = render(<Spinner label={null} />);
    expect(screen.queryByRole("status")).toBeNull();
    expect(container.firstChild).toHaveAttribute("aria-hidden", "true");
  });

  it("has no axe violations", async () => {
    const { container } = render(<Spinner />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
