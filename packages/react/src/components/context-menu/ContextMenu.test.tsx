import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { ContextMenu } from "./ContextMenu";

function Example({ onSelect, label }: { onSelect?: (v: string) => void; label?: string }) {
  return (
    <ContextMenu.Root label={label}>
      <ContextMenu.Trigger data-testid="area">
        <button type="button">report.pdf</button>
      </ContextMenu.Trigger>
      <ContextMenu.Content>
        <ContextMenu.Item onSelect={() => onSelect?.("open")}>Open</ContextMenu.Item>
        <ContextMenu.Item disabled>Rename</ContextMenu.Item>
        <ContextMenu.Separator />
        <ContextMenu.CheckboxItem defaultChecked>Pinned</ContextMenu.CheckboxItem>
        <ContextMenu.Item onSelect={() => onSelect?.("delete")}>Delete</ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu.Root>
  );
}

describe("ContextMenu", () => {
  it("opens at the pointer on right-click with a default name, focusing the first item", async () => {
    render(<Example />);
    fireEvent.contextMenu(screen.getByTestId("area"), { clientX: 120, clientY: 80 });
    const menu = await screen.findByRole("menu", { name: "Context menu" });
    expect(menu).toHaveClass("mrd-menu");
    expect(screen.getByRole("menuitem", { name: "Open" })).toHaveFocus();
  });

  it("does not open when disabled", () => {
    render(
      <ContextMenu.Root>
        <ContextMenu.Trigger disabled data-testid="area">Area</ContextMenu.Trigger>
        <ContextMenu.Content>
          <ContextMenu.Item>Open</ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu.Root>,
    );
    fireEvent.contextMenu(screen.getByTestId("area"));
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("shares DropdownMenu keyboard handling and returns focus on Escape", async () => {
    const user = userEvent.setup();
    render(<Example label="File actions" />);
    const file = screen.getByRole("button", { name: "report.pdf" });
    file.focus();
    // The ContextMenu key / Shift+F10 fire a contextmenu event with no coordinates.
    fireEvent.contextMenu(file);
    expect(await screen.findByRole("menu", { name: "File actions" })).toBeInTheDocument();
    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("menuitemcheckbox", { name: "Pinned" })).toHaveFocus();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    expect(file).toHaveFocus();
  });

  it("selects an item and closes", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<Example onSelect={onSelect} />);
    fireEvent.contextMenu(screen.getByTestId("area"), { clientX: 10, clientY: 10 });
    await user.click(await screen.findByRole("menuitem", { name: "Delete" }));
    expect(onSelect).toHaveBeenCalledWith("delete");
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("closes on a press inside the trigger area", async () => {
    render(<Example />);
    fireEvent.contextMenu(screen.getByTestId("area"), { clientX: 10, clientY: 10 });
    await screen.findByRole("menu");
    fireEvent.pointerDown(screen.getByTestId("area"));
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("has no axe violations when open", async () => {
    render(<Example />);
    fireEvent.contextMenu(screen.getByTestId("area"), { clientX: 10, clientY: 10 });
    await screen.findByRole("menu");
    expect(await axe(document.body, { rules: { region: { enabled: false } } })).toHaveNoViolations();
  });
});
