import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { Command } from "./Command";
import { defaultCommandFilter } from "./command-filter";

function Palette({ onRun, onSelect }: { onRun?: (v: string) => void; onSelect?: (v: string) => void }) {
  return (
    <Command.Root onSelect={onSelect}>
      <Command.Input />
      <Command.List>
        <Command.Empty />
        <Command.Group heading="Pages">
          <Command.Item onSelect={onRun} keywords={["dashboard"]}>Home</Command.Item>
          <Command.Item onSelect={onRun}>Settings</Command.Item>
          <Command.Item onSelect={onRun} disabled>Billing</Command.Item>
        </Command.Group>
        <Command.Separator />
        <Command.Group heading="Actions">
          <Command.Item onSelect={onRun} value="new-project" shortcut={["ctrl", "n"]}>New project</Command.Item>
          <Command.Item onSelect={onRun}>Café menu</Command.Item>
        </Command.Group>
      </Command.List>
    </Command.Root>
  );
}

describe("Command", () => {
  it("renders a combobox controlling a listbox with the first item active", () => {
    render(<Palette />);
    const input = screen.getByRole("combobox", { name: "Command menu" });
    const listbox = screen.getByRole("listbox", { name: "Suggestions" });
    expect(input).toHaveAttribute("aria-controls", listbox.id);
    const home = screen.getByRole("option", { name: "Home" });
    expect(home).toHaveAttribute("aria-selected", "true");
    expect(input).toHaveAttribute("aria-activedescendant", home.id);
    expect(screen.getByRole("group", { name: "Pages" })).toBeInTheDocument();
  });

  it("filters by text and keywords, hides empty groups and separators, announces results", async () => {
    const user = userEvent.setup();
    render(<Palette />);
    const input = screen.getByRole("combobox");
    await user.type(input, "dash");
    expect(screen.getAllByRole("option").map((o) => o.textContent)).toEqual(["Home"]);
    expect(document.querySelector(".mrd-command__separator")).toBeNull();
    expect(screen.getByText("Actions").closest(".mrd-command__group")).not.toBeVisible();
    expect(screen.getByRole("status")).toHaveTextContent("1 result");

    await user.clear(input);
    await user.type(input, "cafe");
    expect(screen.getByRole("option", { name: "Café menu" })).toHaveAttribute("aria-selected", "true");

    await user.type(input, "zzz");
    expect(screen.queryAllByRole("option")).toHaveLength(0);
    expect(screen.getByText("No results found.")).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("0 results");
  });

  it("moves with arrows (skipping disabled, wrapping) and runs with Enter", async () => {
    const user = userEvent.setup();
    const onRun = vi.fn();
    const onSelect = vi.fn();
    render(<Palette onRun={onRun} onSelect={onSelect} />);
    screen.getByRole("combobox").focus();
    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("option", { name: "Settings" })).toHaveAttribute("aria-selected", "true");
    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("option", { name: /New project/ })).toHaveAttribute("aria-selected", "true");
    await user.keyboard("{Enter}");
    expect(onRun).toHaveBeenCalledWith("new-project");
    expect(onSelect).toHaveBeenCalledWith("new-project");
    await user.keyboard("{ArrowDown}{ArrowDown}");
    expect(screen.getByRole("option", { name: "Home" })).toHaveAttribute("aria-selected", "true");
    await user.keyboard("{ArrowUp}");
    expect(screen.getByRole("option", { name: "Café menu" })).toHaveAttribute("aria-selected", "true");
    await user.keyboard("{PageUp}");
    expect(screen.getByRole("option", { name: "Home" })).toHaveAttribute("aria-selected", "true");
  });

  it("runs an item from its shortcut and on click", async () => {
    const user = userEvent.setup();
    const onRun = vi.fn();
    render(<Palette onRun={onRun} />);
    screen.getByRole("combobox").focus();
    await user.keyboard("{Control>}n{/Control}");
    expect(onRun).toHaveBeenCalledWith("new-project");
    await user.click(screen.getByRole("option", { name: "Settings" }));
    expect(onRun).toHaveBeenLastCalledWith("Settings");
    await user.click(screen.getByRole("option", { name: "Billing" }));
    expect(onRun).not.toHaveBeenCalledWith("Billing");
  });

  it("supports a custom filter and shouldFilter=false", async () => {
    const user = userEvent.setup();
    const { unmount } = render(
      <Command.Root filter={(value, search) => value.startsWith(search)}>
        <Command.Input />
        <Command.List>
          <Command.Item>alpha</Command.Item>
          <Command.Item>beta</Command.Item>
        </Command.List>
      </Command.Root>,
    );
    await user.type(screen.getByRole("combobox"), "et");
    expect(screen.queryAllByRole("option")).toHaveLength(0);
    unmount();
    render(
      <Command.Root shouldFilter={false}>
        <Command.Input />
        <Command.List>
          <Command.Item>alpha</Command.Item>
        </Command.List>
      </Command.Root>,
    );
    await user.type(screen.getByRole("combobox"), "zzz");
    expect(screen.getAllByRole("option")).toHaveLength(1);
  });

  it("Command.Dialog toggles with ⌘K / Ctrl+K and closes after a selection", async () => {
    const user = userEvent.setup();
    const onRun = vi.fn();
    render(
      <Command.Dialog label="Search the docs">
        <Command.Input />
        <Command.List>
          <Command.Item onSelect={onRun}>Button</Command.Item>
        </Command.List>
      </Command.Dialog>,
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    fireEvent.keyDown(document, { key: "k", ctrlKey: true });
    const dialog = await screen.findByRole("dialog", { name: "Search the docs" });
    expect(dialog).toHaveClass("mrd-command-dialog");
    expect(screen.getByRole("combobox", { name: "Search the docs" })).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(onRun).toHaveBeenCalledWith("Button");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("default filter matches every word, ignoring case and accents", () => {
    expect(defaultCommandFilter("Open Settings", "set op", [])).toBe(true);
    expect(defaultCommandFilter("Open Settings", "close", ["exit"])).toBe(false);
    expect(defaultCommandFilter("Ayarlar", "İstatistik", ["istatistik"])).toBe(true);
  });

  it("has no axe violations with results and when empty", async () => {
    const user = userEvent.setup();
    const { container } = render(<Palette />);
    expect(await axe(container)).toHaveNoViolations();
    await user.type(screen.getByRole("combobox"), "zzz");
    expect(await axe(container)).toHaveNoViolations();
  });
});
