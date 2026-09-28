import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { Breadcrumb } from "./Breadcrumb";

describe("Breadcrumb", () => {
  const trail = (
    <Breadcrumb.Root>
      <Breadcrumb.Item>
        <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
      </Breadcrumb.Item>
      <Breadcrumb.Item>
        <Breadcrumb.Link href="/docs">Docs</Breadcrumb.Link>
      </Breadcrumb.Item>
      <Breadcrumb.Item>
        <Breadcrumb.Page>Dialog</Breadcrumb.Page>
      </Breadcrumb.Item>
    </Breadcrumb.Root>
  );

  it("renders a labelled nav with an ordered list and current page", () => {
    render(trail);
    const nav = screen.getByRole("navigation", { name: "Breadcrumb" });
    expect(nav.querySelector("ol")).not.toBeNull();
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
    expect(screen.getByText("Dialog")).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Docs" })).toHaveAttribute("href", "/docs");
  });

  it("has no axe violations", async () => {
    const { container } = render(trail);
    expect(await axe(container)).toHaveNoViolations();
  });
});
