import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { Drawer } from "./Drawer";

describe("Drawer", () => {
  it("opens on the chosen side, closes on Escape and restores focus", async () => {
    const user = userEvent.setup();
    render(
      <Drawer.Root>
        <Drawer.Trigger>Filters</Drawer.Trigger>
        <Drawer.Content side="left">
          <Drawer.Title>Filters</Drawer.Title>
          <Drawer.Close />
        </Drawer.Content>
      </Drawer.Root>,
    );
    const trigger = screen.getByRole("button", { name: "Filters" });
    await user.click(trigger);
    const dialog = screen.getByRole("dialog", { name: "Filters" });
    expect(dialog).toHaveAttribute("data-side", "left");
    expect(dialog).toHaveClass("mrd-drawer");
    expect(screen.getByRole("button", { name: "Close" })).toHaveFocus();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("has no axe violations", async () => {
    render(
      <Drawer.Root defaultOpen>
        <Drawer.Content>
          <Drawer.Title>Menu</Drawer.Title>
          <Drawer.Close />
        </Drawer.Content>
      </Drawer.Root>,
    );
    expect(await axe(document.body)).toHaveNoViolations();
  });
});
