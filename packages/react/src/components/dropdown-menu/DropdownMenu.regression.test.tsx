import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Popover } from "../popover/Popover";
import { Select } from "../select/Select";
import { DropdownMenu } from "./DropdownMenu";

describe("DropdownMenu regressions", () => {
  it("consumer onClick on Item runs and does not replace selection", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const onSelect = vi.fn();
    render(
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>Menu</DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item onClick={onClick} onSelect={onSelect}>
            Edit
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>,
    );
    await user.click(screen.getByRole("button", { name: "Menu" }));
    await user.click(screen.getByRole("menuitem", { name: "Edit" }));
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("consumer onKeyDown composes; preventDefault skips internal activation", async () => {
    const user = userEvent.setup();
    const onKeyDown = vi.fn();
    const onCheckedChange = vi.fn();
    render(
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>Menu</DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.CheckboxItem onKeyDown={onKeyDown} onCheckedChange={onCheckedChange}>
            Grid
          </DropdownMenu.CheckboxItem>
          <DropdownMenu.CheckboxItem onKeyDown={(event) => event.preventDefault()} onCheckedChange={onCheckedChange}>
            Locked
          </DropdownMenu.CheckboxItem>
        </DropdownMenu.Content>
      </DropdownMenu.Root>,
    );
    await user.click(screen.getByRole("button", { name: "Menu" }));
    expect(screen.getByRole("menuitemcheckbox", { name: "Grid" })).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(onKeyDown).toHaveBeenCalled();
    expect(onCheckedChange).toHaveBeenLastCalledWith(true);
    onCheckedChange.mockClear();
    screen.getByRole("menuitemcheckbox", { name: "Locked" }).focus();
    await user.keyboard("{Enter}");
    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it("consumer onPointerMove composes with hover focus", async () => {
    const user = userEvent.setup();
    const onPointerMove = vi.fn();
    render(
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>Menu</DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item>One</DropdownMenu.Item>
          <DropdownMenu.Item onPointerMove={onPointerMove}>Two</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>,
    );
    await user.click(screen.getByRole("button", { name: "Menu" }));
    const two = screen.getByRole("menuitem", { name: "Two" });
    await user.pointer({ target: two });
    expect(onPointerMove).toHaveBeenCalled();
    expect(two).toHaveFocus();
  });

  it("Trigger supports asChild", async () => {
    const user = userEvent.setup();
    render(
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button type="button" className="mine">
            Actions
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item>One</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>,
    );
    const trigger = screen.getByRole("button", { name: "Actions" });
    expect(trigger).toHaveClass("mine");
    expect(trigger).toHaveAttribute("aria-haspopup", "menu");
    await user.click(trigger);
    expect(screen.getByRole("menu", { name: "Actions" })).toBeInTheDocument();
  });
});

describe("Popover regressions", () => {
  it("Trigger and Close support asChild with composed refs and handlers", async () => {
    const user = userEvent.setup();
    const onChildClick = vi.fn();
    render(
      <Popover.Root>
        <Popover.Trigger asChild>
          <button type="button" onClick={onChildClick}>
            Info
          </button>
        </Popover.Trigger>
        <Popover.Content aria-label="Details">
          <Popover.Close asChild>
            <button type="button">Got it</button>
          </Popover.Close>
        </Popover.Content>
      </Popover.Root>,
    );
    const trigger = screen.getByRole("button", { name: "Info" });
    await user.click(trigger);
    expect(onChildClick).toHaveBeenCalledTimes(1);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    await user.click(screen.getByRole("button", { name: "Got it" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    // triggerRef was composed through the slot, so focus returns to the trigger
    expect(trigger).toHaveFocus();
  });
});

describe("Select regressions", () => {
  it("a consumer id on Trigger is honoured and labels the listbox", async () => {
    const user = userEvent.setup();
    render(
      <>
        <label htmlFor="fruit">Fruit</label>
        <Select.Root>
          <Select.Trigger id="fruit" />
          <Select.Content>
            <Select.Item value="a">Apple</Select.Item>
          </Select.Content>
        </Select.Root>
      </>,
    );
    const trigger = screen.getByRole("combobox", { name: "Fruit" });
    expect(trigger).toHaveAttribute("id", "fruit");
    await user.click(trigger);
    expect(screen.getByRole("listbox")).toHaveAttribute("aria-labelledby", "fruit");
  });

  it("Item composes consumer onClick / onPointerMove", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const onPointerMove = vi.fn();
    const onValueChange = vi.fn();
    render(
      <Select.Root onValueChange={onValueChange}>
        <Select.Trigger aria-label="Fruit" />
        <Select.Content>
          <Select.Item value="a">Apple</Select.Item>
          <Select.Item value="b" onClick={onClick} onPointerMove={onPointerMove}>
            Banana
          </Select.Item>
          <Select.Item value="c" onClick={(event) => event.preventDefault()}>
            Cherry
          </Select.Item>
        </Select.Content>
      </Select.Root>,
    );
    await user.click(screen.getByRole("combobox"));
    const banana = screen.getByRole("option", { name: "Banana" });
    await user.pointer({ target: banana });
    expect(onPointerMove).toHaveBeenCalled();
    expect(banana).toHaveAttribute("data-active");
    await user.click(banana);
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onValueChange).toHaveBeenCalledWith("b");
    await user.click(screen.getByRole("combobox"));
    await user.click(screen.getByRole("option", { name: "Cherry" }));
    expect(onValueChange).not.toHaveBeenCalledWith("c");
  });
});
