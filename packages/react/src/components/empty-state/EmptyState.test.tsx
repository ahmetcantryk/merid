import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { EmptyState } from "./EmptyState";

describe("EmptyState", () => {
  it("renders title as h3 and description", () => {
    render(<EmptyState title="No invoices" description="Create one to get started." />);
    expect(screen.getByRole("heading", { level: 3, name: "No invoices" })).toBeInTheDocument();
    expect(screen.getByText("Create one to get started.")).toBeInTheDocument();
  });

  it("applies variant, titleLevel, icon and className", () => {
    const { container } = render(
      <EmptyState title="Empty" titleLevel={2} variant="plain" icon={<svg />} className="c" />,
    );
    expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
    expect(container.firstChild).toHaveAttribute("data-variant", "plain");
    expect(container.firstChild).toHaveClass("mrd-empty-state", "c");
    expect(container.querySelector(".mrd-empty-state__icon")).toHaveAttribute("aria-hidden", "true");
  });

  it("action is keyboard reachable", async () => {
    const onClick = vi.fn();
    render(
      <EmptyState
        title="Nothing"
        action={
          <button type="button" onClick={onClick}>
            New
          </button>
        }
      />,
    );
    await userEvent.tab();
    await userEvent.keyboard(" ");
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("has no axe violations", async () => {
    const { container } = render(<EmptyState title="No results" description="Try another search." />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
