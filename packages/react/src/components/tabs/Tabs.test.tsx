import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { Tabs } from "./Tabs";

function Basic({ onValueChange }: { onValueChange?: (v: string) => void }) {
  return (
    <Tabs.Root defaultValue="a" onValueChange={onValueChange}>
      <Tabs.List aria-label="Sections">
        <Tabs.Trigger value="a">Overview</Tabs.Trigger>
        <Tabs.Trigger value="b" disabled>
          Billing
        </Tabs.Trigger>
        <Tabs.Trigger value="c">Team</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Panel value="a">Overview panel</Tabs.Panel>
      <Tabs.Panel value="b">Billing panel</Tabs.Panel>
      <Tabs.Panel value="c">Team panel</Tabs.Panel>
    </Tabs.Root>
  );
}

describe("Tabs", () => {
  it("wires tabs and panels", () => {
    render(<Basic />);
    const tab = screen.getByRole("tab", { name: "Overview" });
    expect(tab).toHaveAttribute("aria-selected", "true");
    expect(tab).toHaveAttribute("tabindex", "0");
    expect(screen.getByRole("tab", { name: "Team" })).toHaveAttribute("tabindex", "-1");
    expect(screen.getByRole("tabpanel", { name: "Overview" })).toHaveTextContent("Overview panel");
  });

  it("activates automatically with arrows, skipping disabled, wrapping, Home/End", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Basic onValueChange={onValueChange} />);
    await user.tab();
    expect(screen.getByRole("tab", { name: "Overview" })).toHaveFocus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "Team" })).toHaveFocus();
    expect(onValueChange).toHaveBeenLastCalledWith("c");
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Team panel");
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "Overview" })).toHaveFocus();
    await user.keyboard("{End}");
    expect(screen.getByRole("tab", { name: "Team" })).toHaveAttribute("aria-selected", "true");
    await user.keyboard("{Home}");
    expect(screen.getByRole("tab", { name: "Overview" })).toHaveAttribute("aria-selected", "true");
  });

  it("reverses horizontal arrows in RTL", async () => {
    const user = userEvent.setup();
    render(
      <div dir="rtl" style={{ direction: "rtl" }}>
        <Basic />
      </div>,
    );
    await user.tab();
    await user.keyboard("{ArrowLeft}");
    expect(screen.getByRole("tab", { name: "Team" })).toHaveFocus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "Overview" })).toHaveFocus();
  });

  it("Tab moves from the tablist into the panel", async () => {
    const user = userEvent.setup();
    render(<Basic />);
    await user.tab();
    await user.tab();
    expect(screen.getByRole("tabpanel")).toHaveFocus();
  });

  it("has no axe violations", async () => {
    const { container } = render(<Basic />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
