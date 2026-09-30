import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { axe } from "vitest-axe";
import { Collapsible } from "./Collapsible";

function Example(props: { defaultOpen?: boolean; disabled?: boolean; forceMount?: boolean; onOpenChange?: (o: boolean) => void }) {
  const { forceMount, ...root } = props;
  return (
    <Collapsible.Root {...root}>
      <Collapsible.Trigger>Show details</Collapsible.Trigger>
      <Collapsible.Content forceMount={forceMount}>
        <p>Build 1024 passed</p>
      </Collapsible.Content>
    </Collapsible.Root>
  );
}

describe("Collapsible", () => {
  it("toggles the region and wires aria-expanded / aria-controls", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(<Example onOpenChange={onOpenChange} />);
    const trigger = screen.getByRole("button", { name: "Show details" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByText("Build 1024 passed")).not.toBeInTheDocument();
    const content = document.getElementById(trigger.getAttribute("aria-controls") ?? "");
    expect(content).not.toBeVisible();

    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Build 1024 passed")).toBeVisible();
    expect(onOpenChange).toHaveBeenLastCalledWith(true);

    trigger.focus();
    await user.keyboard("{Enter}");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    await user.keyboard(" ");
    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  it("keeps children mounted with forceMount", () => {
    render(<Example forceMount />);
    expect(screen.getByText("Build 1024 passed")).not.toBeVisible();
  });

  it("does not toggle when disabled", async () => {
    const user = userEvent.setup();
    render(<Example disabled />);
    const trigger = screen.getByRole("button", { name: "Show details" });
    expect(trigger).toBeDisabled();
    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("works controlled and with asChild", async () => {
    const user = userEvent.setup();
    function Controlled() {
      const [open, setOpen] = useState(true);
      return (
        <Collapsible.Root open={open} onOpenChange={setOpen} data-testid="root">
          <Collapsible.Trigger asChild>
            <a href="#details">Toggle</a>
          </Collapsible.Trigger>
          <Collapsible.Content>Details</Collapsible.Content>
        </Collapsible.Root>
      );
    }
    render(<Controlled />);
    const link = screen.getByRole("link", { name: "Toggle" });
    expect(link).toHaveAttribute("aria-expanded", "true");
    await user.click(link);
    expect(link).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByTestId("root")).toHaveAttribute("data-state", "closed");
  });

  it("throws outside Root", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => undefined);
    expect(() => render(<Collapsible.Trigger>x</Collapsible.Trigger>)).toThrow(/Collapsible.Root/);
    spy.mockRestore();
  });

  it("has no axe violations open or closed", async () => {
    const { container, rerender } = render(<Example />);
    expect(await axe(container)).toHaveNoViolations();
    rerender(<Example defaultOpen />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
