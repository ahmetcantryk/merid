import { createRef, type RefObject } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Accordion, Button, Dialog, DropdownMenu, Popover, Select, Tabs, Tooltip } from "@merid/react";

type AnyRef = RefObject<HTMLElement>;

// Compound parts take `ref` as a plain prop (React 19 style). These cases pin down,
// part by part, whether a consumer ref reaches the DOM on React 18.
const compoundParts: Array<[string, (ref: AnyRef) => JSX.Element]> = [
  [
    "Dialog.Trigger",
    (ref) => (
      <Dialog.Root>
        <Dialog.Trigger ref={ref as never}>Open</Dialog.Trigger>
      </Dialog.Root>
    ),
  ],
  [
    "Dialog.Content",
    (ref) => (
      <Dialog.Root defaultOpen>
        <Dialog.Content ref={ref as never}>
          <Dialog.Title>T</Dialog.Title>
        </Dialog.Content>
      </Dialog.Root>
    ),
  ],
  [
    "Popover.Trigger",
    (ref) => (
      <Popover.Root>
        <Popover.Trigger ref={ref as never}>Share</Popover.Trigger>
      </Popover.Root>
    ),
  ],
  [
    "DropdownMenu.Trigger",
    (ref) => (
      <DropdownMenu.Root>
        <DropdownMenu.Trigger ref={ref as never}>Menu</DropdownMenu.Trigger>
      </DropdownMenu.Root>
    ),
  ],
  [
    "Select.Trigger",
    (ref) => (
      <Select.Root>
        <Select.Trigger aria-label="F" ref={ref as never} />
      </Select.Root>
    ),
  ],
  [
    "Tabs.List",
    (ref) => (
      <Tabs.Root defaultValue="a">
        <Tabs.List aria-label="T" ref={ref as never}>
          <Tabs.Trigger value="a">A</Tabs.Trigger>
        </Tabs.List>
      </Tabs.Root>
    ),
  ],
  [
    "Accordion.Trigger",
    (ref) => (
      <Accordion.Root type="single">
        <Accordion.Item value="a">
          <Accordion.Trigger ref={ref as never}>A</Accordion.Trigger>
        </Accordion.Item>
      </Accordion.Root>
    ),
  ],
  [
    "asChild child ref (Dialog.Trigger asChild > Button)",
    (ref) => (
      <Dialog.Root>
        <Dialog.Trigger asChild>
          <Button ref={ref as never}>Open</Button>
        </Dialog.Trigger>
      </Dialog.Root>
    ),
  ],
  [
    "Tooltip child ref",
    (ref) => (
      <Tooltip content="Tip">
        <Button ref={ref as never}>Hover</Button>
      </Tooltip>
    ),
  ],
];

describe("consumer refs on compound parts (React 18)", () => {
  for (const [name, make] of compoundParts) {
    it(`${name} receives the DOM node`, () => {
      const ref = createRef<HTMLElement>();
      render(make(ref));
      expect(ref.current).toBeInstanceOf(HTMLElement);
    });
  }
});

describe("internal refs behind asChild (React 18)", () => {
  it("DropdownMenu with an asChild trigger returns focus on Escape", async () => {
    const user = userEvent.setup();
    render(
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <Button>Actions</Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item>Edit</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>,
    );
    const trigger = screen.getByRole("button", { name: "Actions" });
    await user.click(trigger);
    await screen.findByRole("menu");
    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull());
    expect(document.activeElement).toBe(trigger);
  });

  it("Popover with an asChild trigger returns focus on Escape", async () => {
    const user = userEvent.setup();
    render(
      <Popover.Root>
        <Popover.Trigger asChild>
          <Button>Share</Button>
        </Popover.Trigger>
        <Popover.Content aria-label="Share options">
          <button type="button">Copy</button>
        </Popover.Content>
      </Popover.Root>,
    );
    const trigger = screen.getByRole("button", { name: "Share" });
    await user.click(trigger);
    await screen.findByText("Copy");
    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByText("Copy")).toBeNull());
    expect(document.activeElement).toBe(trigger);
  });

  it("emits no React ref warnings for asChild triggers", async () => {
    const errors: string[] = [];
    const spy = vi.spyOn(console, "error").mockImplementation((...args) => {
      errors.push(args.map(String).join(" "));
    });
    render(
      <div>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <Button>A</Button>
          </DropdownMenu.Trigger>
        </DropdownMenu.Root>
        <Popover.Root>
          <Popover.Trigger asChild>
            <Button>B</Button>
          </Popover.Trigger>
        </Popover.Root>
        <Dialog.Root>
          <Dialog.Trigger asChild>
            <Button>C</Button>
          </Dialog.Trigger>
        </Dialog.Root>
      </div>,
    );
    spy.mockRestore();
    expect(errors.filter((e) => /ref/i.test(e))).toEqual([]);
  });
});
