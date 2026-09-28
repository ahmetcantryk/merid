import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { IconButton } from "./IconButton";

describe("IconButton", () => {
  it("uses label as accessible name", () => {
    render(<IconButton label="Close" icon={<svg />} />);
    expect(screen.getByRole("button", { name: "Close" })).toHaveClass("mrd-icon-button");
  });

  it("applies variant and size", () => {
    render(<IconButton label="Add" icon={<svg />} variant="secondary" size="lg" className="c" />);
    const b = screen.getByRole("button", { name: "Add" });
    expect(b).toHaveAttribute("data-variant", "secondary");
    expect(b).toHaveAttribute("data-size", "lg");
    expect(b).toHaveClass("c");
  });

  it("activates with keyboard", async () => {
    const onClick = vi.fn();
    render(<IconButton label="Menu" icon={<svg />} onClick={onClick} />);
    await userEvent.tab();
    await userEvent.keyboard("{Enter}");
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("has no axe violations", async () => {
    const { container } = render(<IconButton label="Search" icon={<svg />} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
