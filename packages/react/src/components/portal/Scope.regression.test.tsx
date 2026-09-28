import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Dialog } from "../dialog/Dialog";
import { Popover } from "../popover/Popover";
import { Select } from "../select/Select";

describe("portalled overlays inherit subtree attributes", () => {
  it("Popover content carries the trigger's nearest data-theme / data-accent / data-density / dir", async () => {
    const user = userEvent.setup();
    render(
      <div data-theme="dark" data-accent="violet">
        <div data-density="compact" dir="rtl">
          <Popover.Root>
            <Popover.Trigger>Open</Popover.Trigger>
            <Popover.Content aria-label="Details">Body</Popover.Content>
          </Popover.Root>
        </div>
      </div>,
    );
    await user.click(screen.getByRole("button", { name: "Open" }));
    const scope = screen.getByText("Body").closest(".mrd-portal")!;
    expect(scope).toHaveAttribute("data-theme", "dark");
    expect(scope).toHaveAttribute("data-accent", "violet");
    expect(scope).toHaveAttribute("data-density", "compact");
    expect(scope).toHaveAttribute("dir", "rtl");
  });

  it("Dialog inherits from the element that opened it; Select inside inherits in turn", async () => {
    const user = userEvent.setup();
    render(
      <section data-theme="light" data-accent="green">
        <Dialog.Root>
          <Dialog.Trigger>Edit</Dialog.Trigger>
          <Dialog.Content>
            <Dialog.Title>Edit</Dialog.Title>
            <Select.Root>
              <Select.Trigger aria-label="Plan" />
              <Select.Content>
                <Select.Item value="pro">Pro</Select.Item>
              </Select.Content>
            </Select.Root>
          </Dialog.Content>
        </Dialog.Root>
      </section>,
    );
    await user.click(screen.getByRole("button", { name: "Edit" }));
    const dialogScope = screen.getByRole("dialog").closest(".mrd-portal")!;
    expect(dialogScope).toHaveAttribute("data-theme", "light");
    expect(dialogScope).toHaveAttribute("data-accent", "green");
    await user.click(screen.getByRole("combobox", { name: "Plan" }));
    const listScope = screen.getByRole("listbox").closest(".mrd-portal")!;
    expect(listScope).toHaveAttribute("data-accent", "green");
  });

  it("adds nothing when the attributes live on <html>", async () => {
    const user = userEvent.setup();
    document.documentElement.setAttribute("data-theme", "dark");
    render(
      <Popover.Root>
        <Popover.Trigger>Open</Popover.Trigger>
        <Popover.Content aria-label="Details">Body</Popover.Content>
      </Popover.Root>,
    );
    await user.click(screen.getByRole("button", { name: "Open" }));
    expect(screen.getByText("Body").closest(".mrd-portal")).not.toHaveAttribute("data-theme");
    document.documentElement.removeAttribute("data-theme");
  });
});
