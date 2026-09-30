import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { NavigationMenu } from "./NavigationMenu";

function Example({ onValueChange }: { onValueChange?: (v: string) => void }) {
  return (
    <>
      <NavigationMenu.Root onValueChange={onValueChange} openDelay={100} closeDelay={100}>
        <NavigationMenu.List>
          <NavigationMenu.Item value="products">
            <NavigationMenu.Trigger>Products</NavigationMenu.Trigger>
            <NavigationMenu.Content fullWidth>
              <NavigationMenu.Link href="/analytics" description="Dashboards and reports">Analytics</NavigationMenu.Link>
              <NavigationMenu.Link href="/billing">Billing</NavigationMenu.Link>
            </NavigationMenu.Content>
          </NavigationMenu.Item>
          <NavigationMenu.Item value="company">
            <NavigationMenu.Trigger>Company</NavigationMenu.Trigger>
            <NavigationMenu.Content>
              <NavigationMenu.Link href="/about">About</NavigationMenu.Link>
            </NavigationMenu.Content>
          </NavigationMenu.Item>
          <NavigationMenu.Item>
            <NavigationMenu.Link href="/pricing" active>Pricing</NavigationMenu.Link>
          </NavigationMenu.Item>
        </NavigationMenu.List>
      </NavigationMenu.Root>
      <button type="button">Outside</button>
    </>
  );
}

describe("NavigationMenu", () => {
  afterEach(() => vi.useRealTimers());

  it("renders a labelled nav with disclosure buttons and hidden panels", () => {
    render(<Example />);
    expect(screen.getByRole("navigation", { name: "Main" })).toBeInTheDocument();
    const trigger = screen.getByRole("button", { name: "Products" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    const panel = document.getElementById(trigger.getAttribute("aria-controls") ?? "");
    expect(panel).not.toBeVisible();
    expect(panel).toHaveAttribute("data-full", "true");
    expect(screen.getByRole("link", { name: "Pricing" })).toHaveAttribute("aria-current", "page");
  });

  it("toggles on click, only one panel open at a time", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Example onValueChange={onValueChange} />);
    await user.click(screen.getByRole("button", { name: "Products" }));
    expect(screen.getByRole("link", { name: /Analytics/ })).toBeVisible();
    await user.click(screen.getByRole("button", { name: "Company" }));
    expect(screen.getByRole("link", { name: "About" })).toBeVisible();
    expect(screen.getByRole("link", { name: /Analytics/, hidden: true })).not.toBeVisible();
    expect(onValueChange).toHaveBeenLastCalledWith("company");
    // The pointer hovered Company on its way to the click, so that click keeps the panel open…
    expect(screen.getByRole("button", { name: "Company" })).toHaveAttribute("aria-expanded", "true");
    // …while Enter / Space toggle it closed.
    await user.keyboard("{Enter}");
    expect(onValueChange).toHaveBeenLastCalledWith("");
  });

  it("opens on hover after the delay and closes after leaving", () => {
    vi.useFakeTimers();
    render(<Example />);
    const trigger = screen.getByRole("button", { name: "Products" });
    fireEvent.pointerEnter(trigger, { pointerType: "mouse" });
    act(() => vi.advanceTimersByTime(120));
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    fireEvent.pointerLeave(trigger, { pointerType: "mouse" });
    act(() => vi.advanceTimersByTime(120));
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("moves along the bar with arrows, Home and End", async () => {
    const user = userEvent.setup();
    render(<Example />);
    screen.getByRole("button", { name: "Products" }).focus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("button", { name: "Company" })).toHaveFocus();
    await user.keyboard("{End}");
    expect(screen.getByRole("link", { name: "Pricing" })).toHaveFocus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("button", { name: "Products" })).toHaveFocus();
    await user.keyboard("{ArrowLeft}");
    expect(screen.getByRole("link", { name: "Pricing" })).toHaveFocus();
  });

  it("ArrowDown opens and focuses the first link; arrows move in the panel; Escape returns focus", async () => {
    const user = userEvent.setup();
    render(<Example />);
    const trigger = screen.getByRole("button", { name: "Products" });
    trigger.focus();
    await user.keyboard("{ArrowDown}");
    await waitFor(() => expect(screen.getByRole("link", { name: /Analytics/ })).toHaveFocus());
    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("link", { name: "Billing" })).toHaveFocus();
    await user.keyboard("{Escape}");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveFocus();
  });

  it("closes when focus leaves the nav or on outside press", async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.click(screen.getByRole("button", { name: "Company" }));
    await user.click(screen.getByRole("button", { name: "Outside" }));
    expect(screen.getByRole("button", { name: "Company" })).toHaveAttribute("aria-expanded", "false");
  });

  it("has no axe violations open and closed", async () => {
    const user = userEvent.setup();
    const { container } = render(<Example />);
    expect(await axe(container)).toHaveNoViolations();
    await user.click(screen.getByRole("button", { name: "Products" }));
    expect(await axe(container)).toHaveNoViolations();
  });
});
