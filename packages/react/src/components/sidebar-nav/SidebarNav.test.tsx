import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { axe } from "vitest-axe";
import { SidebarNav, SidebarNavItem } from "./SidebarNav";

function FakeLink({ to, children, ...rest }: { to: string; children?: ReactNode }) {
  return (
    <a href={`#${to}`} data-router="" {...rest}>
      {children}
    </a>
  );
}

const nav = (
  <SidebarNav aria-label="Main">
    <SidebarNavItem href="/">Overview</SidebarNavItem>
    <SidebarNav.Group label="Workspace">
      <SidebarNav.Item href="/projects" active trailing="12">
        Projects
      </SidebarNav.Item>
      <SidebarNav.Item as={FakeLink} to="/settings">
        Settings
      </SidebarNav.Item>
    </SidebarNav.Group>
  </SidebarNav>
);

describe("SidebarNav", () => {
  it("marks the active item with aria-current and supports custom link components", () => {
    render(nav);
    expect(screen.getByRole("navigation", { name: "Main" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Projects/ })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Overview" })).not.toHaveAttribute("aria-current");
    const settings = screen.getByRole("link", { name: "Settings" });
    expect(settings).toHaveAttribute("href", "#/settings");
    expect(settings).toHaveAttribute("data-router");
    expect(screen.getByRole("list", { name: "Workspace" })).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = render(nav);
    expect(await axe(container)).toHaveNoViolations();
  });
});
