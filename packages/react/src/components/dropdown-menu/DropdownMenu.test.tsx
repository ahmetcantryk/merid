import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { DropdownMenu } from "./DropdownMenu";

function Menu({ onSelect, onChecked }: { onSelect?: (v: string) => void; onChecked?: (c: boolean) => void }) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>Actions</DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Label>File</DropdownMenu.Label>
        <DropdownMenu.Item onSelect={() => onSelect?.("edit")}>Edit</DropdownMenu.Item>
        <DropdownMenu.Item disabled>Duplicate</DropdownMenu.Item>
        <DropdownMenu.Item onSelect={() => onSelect?.("archive")}>Archive</DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.CheckboxItem onCheckedChange={onChecked}>Show hidden</DropdownMenu.CheckboxItem>
        <DropdownMenu.Item onSelect={() => onSelect?.("delete")}>Delete</DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}

describe("DropdownMenu", () => {
  it("opens with Enter and focuses the first item; ArrowUp opens on the last", async () => {
    const user = userEvent.setup();
    render(<Menu />);
    const trigger = screen.getByRole("button", { name: "Actions" });
    trigger.focus();
    await user.keyboard("{Enter}");
    expect(screen.getByRole("menu", { name: "Actions" })).toBeInTheDocument();
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("menuitem", { name: "Edit" })).toHaveFocus();
    await user.keyboard("{Escape}");
    expect(trigger).toHaveFocus();
    await user.keyboard("{ArrowUp}");
    expect(screen.getByRole("menuitem", { name: "Delete" })).toHaveFocus();
  });

  it("moves with arrows (skipping disabled), Home/End and typeahead", async () => {
    const user = userEvent.setup();
    render(<Menu />);
    await user.click(screen.getByRole("button", { name: "Actions" }));
    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("menuitem", { name: "Archive" })).toHaveFocus();
    await user.keyboard("{End}");
    expect(screen.getByRole("menuitem", { name: "Delete" })).toHaveFocus();
    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("menuitem", { name: "Edit" })).toHaveFocus();
    await user.keyboard("{Home}s");
    expect(screen.getByRole("menuitemcheckbox", { name: "Show hidden" })).toHaveFocus();
  });

  it("selects an item, closes and returns focus", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<Menu onSelect={onSelect} />);
    const trigger = screen.getByRole("button", { name: "Actions" });
    await user.click(trigger);
    await user.keyboard("{ArrowDown}{Enter}");
    expect(onSelect).toHaveBeenCalledWith("archive");
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("toggles checkbox items without closing", async () => {
    const user = userEvent.setup();
    const onChecked = vi.fn();
    render(<Menu onChecked={onChecked} />);
    await user.click(screen.getByRole("button", { name: "Actions" }));
    const item = screen.getByRole("menuitemcheckbox", { name: "Show hidden" });
    await user.click(item);
    expect(onChecked).toHaveBeenCalledWith(true);
    expect(item).toHaveAttribute("aria-checked", "true");
    expect(screen.getByRole("menu")).toBeInTheDocument();
  });

  it("ignores disabled items", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<Menu onSelect={onSelect} />);
    await user.click(screen.getByRole("button", { name: "Actions" }));
    await user.click(screen.getByRole("menuitem", { name: "Duplicate" }));
    expect(screen.getByRole("menu")).toBeInTheDocument();
  });

  it("has no axe violations when open", async () => {
    const user = userEvent.setup();
    render(<Menu />);
    await user.click(screen.getByRole("button", { name: "Actions" }));
    // "region" is a page-level landmark rule; a lone widget in a test body is not a page.
    expect(await axe(document.body, { rules: { region: { enabled: false } } })).toHaveNoViolations();
  });
});
