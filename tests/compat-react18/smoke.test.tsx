import * as React from "react";
import { act, createRef } from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  Accordion, Alert, Avatar, Badge, Button, Checkbox, Dialog, DropdownMenu, Field, IconButton, Input,
  Pagination, Popover, Radio, RadioGroup, SegmentedControl, Select, Switch, Tabs, Textarea, ToastProvider,
  Tooltip, useToast,
} from "@meridui/react";

describe("environment", () => {
  it("runs React 18", () => {
    expect(React.version.startsWith("18.")).toBe(true);
  });
});

describe("render and interaction smoke on React 18", () => {
  it("static primitives render", () => {
    render(
      <div>
        <Button>Save</Button>
        <Badge>New</Badge>
        <Alert title="Heads up">Body</Alert>
        <Avatar name="Ada Lovelace" />
        <IconButton label="Close" icon={<span>x</span>} />
      </div>,
    );
    expect(screen.getByRole("button", { name: "Save" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Close" })).toBeTruthy();
    expect(screen.getByText("Heads up")).toBeTruthy();
  });

  it("Field wires label and error to Input", () => {
    render(
      <Field label="Email" error="Required">
        <Input />
      </Field>,
    );
    const input = screen.getByLabelText("Email");
    expect(input.getAttribute("aria-invalid")).toBe("true");
    expect(input.getAttribute("aria-describedby")).toBeTruthy();
  });

  it("Checkbox, Switch and Radio toggle", async () => {
    const user = userEvent.setup();
    render(
      <div>
        <Checkbox>Accept</Checkbox>
        <Switch>Wifi</Switch>
        <RadioGroup aria-label="Plan" defaultValue="a">
          <Radio value="a">A</Radio>
          <Radio value="b">B</Radio>
        </RadioGroup>
      </div>,
    );
    await user.click(screen.getByRole("checkbox", { name: "Accept" }));
    expect((screen.getByRole("checkbox", { name: "Accept" }) as HTMLInputElement).checked).toBe(true);
    await user.click(screen.getByRole("switch", { name: "Wifi" }));
    expect(screen.getByRole("switch", { name: "Wifi" }).getAttribute("aria-checked")).toBe("true");
    await user.click(screen.getByRole("radio", { name: "B" }));
    expect((screen.getByRole("radio", { name: "B" }) as HTMLInputElement).checked).toBe(true);
  });

  it("SegmentedControl changes value", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <SegmentedControl
        aria-label="View"
        options={[
          { value: "a", label: "A" },
          { value: "b", label: "B" },
        ]}
        onValueChange={onValueChange}
      />,
    );
    await user.click(screen.getByRole("radio", { name: "B" }));
    expect(onValueChange).toHaveBeenCalledWith("b");
  });

  it("Tabs switch with arrow keys", async () => {
    const user = userEvent.setup();
    render(
      <Tabs.Root defaultValue="a">
        <Tabs.List aria-label="T">
          <Tabs.Trigger value="a">A</Tabs.Trigger>
          <Tabs.Trigger value="b">B</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Panel value="a">Panel A</Tabs.Panel>
        <Tabs.Panel value="b">Panel B</Tabs.Panel>
      </Tabs.Root>,
    );
    await user.click(screen.getByRole("tab", { name: "A" }));
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "B" }).getAttribute("aria-selected")).toBe("true");
    expect(screen.getByRole("tabpanel").textContent).toBe("Panel B");
  });

  it("Accordion toggles", async () => {
    const user = userEvent.setup();
    render(
      <Accordion.Root type="single">
        <Accordion.Item value="a">
          <Accordion.Trigger>One</Accordion.Trigger>
          <Accordion.Content>Body</Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>,
    );
    const trigger = screen.getByRole("button", { name: "One" });
    await user.click(trigger);
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
  });

  it("Dialog opens, closes on Escape and returns focus", async () => {
    const user = userEvent.setup();
    render(
      <Dialog.Root>
        <Dialog.Trigger>Open</Dialog.Trigger>
        <Dialog.Content>
          <Dialog.Title>Title</Dialog.Title>
          <Dialog.Close>Close</Dialog.Close>
        </Dialog.Content>
      </Dialog.Root>,
    );
    const trigger = screen.getByRole("button", { name: "Open" });
    await user.click(trigger);
    expect(await screen.findByRole("dialog", { name: "Title" })).toBeTruthy();
    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    expect(document.activeElement).toBe(trigger);
  });

  it("DropdownMenu selects with the keyboard", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>Menu</DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item onSelect={onSelect}>Edit</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>,
    );
    act(() => screen.getByRole("button", { name: "Menu" }).focus());
    await user.keyboard("{Enter}");
    await screen.findByRole("menu");
    await waitFor(() => expect(document.activeElement?.textContent).toContain("Edit"));
    await user.keyboard("{Enter}");
    expect(onSelect).toHaveBeenCalled();
  });

  it("Select chooses an option and writes the form value", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <form>
        <Select.Root name="fruit" defaultValue="apple">
          <Select.Trigger aria-label="Fruit" />
          <Select.Content>
            <Select.Item value="apple">Apple</Select.Item>
            <Select.Item value="cherry">Cherry</Select.Item>
          </Select.Content>
        </Select.Root>
      </form>,
    );
    await user.click(screen.getByRole("combobox", { name: "Fruit" }));
    await user.click(await screen.findByRole("option", { name: "Cherry" }));
    const form = container.querySelector("form") as HTMLFormElement;
    expect(new FormData(form).get("fruit")).toBe("cherry");
  });

  it("Popover opens", async () => {
    const user = userEvent.setup();
    render(
      <Popover.Root>
        <Popover.Trigger>Share</Popover.Trigger>
        <Popover.Content aria-label="Share options">Body</Popover.Content>
      </Popover.Root>,
    );
    await user.click(screen.getByRole("button", { name: "Share" }));
    expect(await screen.findByText("Body")).toBeTruthy();
  });

  it("Tooltip shows on focus", async () => {
    render(
      <Tooltip content="Copy" delay={0}>
        <Button>Copy it</Button>
      </Tooltip>,
    );
    act(() => screen.getByRole("button", { name: "Copy it" }).focus());
    expect(await screen.findByRole("tooltip")).toBeTruthy();
  });

  it("Toast appears", async () => {
    function Emit() {
      const { toast } = useToast();
      return <Button onClick={() => toast({ title: "Saved" })}>Go</Button>;
    }
    render(
      <ToastProvider>
        <Emit />
      </ToastProvider>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Go" }));
    expect(await screen.findByText("Saved")).toBeTruthy();
  });

  it("Pagination moves pages", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(<Pagination pageCount={10} defaultPage={5} onPageChange={onPageChange} />);
    await user.click(screen.getByRole("button", { name: /next/i }));
    expect(onPageChange).toHaveBeenCalledWith(6);
  });
});

describe("ref forwarding (React 19 ref-as-prop, checked on React 18)", () => {
  const cases: Array<[string, (ref: React.RefObject<HTMLElement>) => React.ReactElement]> = [
    ["Button", (ref) => <Button ref={ref as never}>x</Button>],
    ["Input", (ref) => <Input aria-label="i" ref={ref as never} />],
    ["Textarea", (ref) => <Textarea aria-label="t" ref={ref as never} />],
    ["Checkbox", (ref) => <Checkbox ref={ref as never}>c</Checkbox>],
    ["Switch", (ref) => <Switch ref={ref as never}>s</Switch>],
    ["IconButton", (ref) => <IconButton label="l" icon={<span />} ref={ref as never} />],
  ];
  for (const [name, make] of cases) {
    it(`${name} forwards ref to its DOM node`, () => {
      const ref = createRef<HTMLElement>();
      render(make(ref));
      expect(ref.current).toBeInstanceOf(HTMLElement);
    });
  }
});
