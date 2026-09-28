import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { Link } from "./Link";

describe("Link", () => {
  it("renders an anchor with defaults", () => {
    render(<Link href="/docs">Docs</Link>);
    const link = screen.getByRole("link", { name: "Docs" });
    expect(link).toHaveAttribute("href", "/docs");
    expect(link).toHaveAttribute("data-tone", "accent");
    expect(link).toHaveAttribute("data-underline", "hover");
  });

  it("applies tone and external behaviour", () => {
    render(
      <Link href="https://x.dev" tone="muted" external className="c">
        Site
      </Link>,
    );
    const link = screen.getByRole("link", { name: /Site/ });
    expect(link).toHaveAttribute("data-tone", "muted");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
    expect(link).toHaveAccessibleName("Site (opens in a new tab)");
    expect(link).toHaveClass("mrd-link", "c");
  });

  it("is reachable by keyboard", async () => {
    render(<Link href="#a">A</Link>);
    await userEvent.tab();
    expect(screen.getByRole("link")).toHaveFocus();
  });

  it("has no axe violations", async () => {
    const { container } = render(<Link href="/">Home</Link>);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("asChild styles the child element and keeps its props", () => {
    render(
      <Link asChild tone="muted" underline="always" external>
        <a href="https://example.com" data-router="">
          Docs
        </a>
      </Link>,
    );
    const link = screen.getByRole("link", { name: /Docs/ });
    expect(link).toHaveClass("mrd-link");
    expect(link).toHaveAttribute("data-tone", "muted");
    expect(link).toHaveAttribute("data-router", "");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveTextContent("(opens in a new tab)");
  });
});
