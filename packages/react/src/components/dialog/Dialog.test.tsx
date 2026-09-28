import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { axe } from "vitest-axe";
import { Dialog } from "./Dialog";

function Basic(props: { onOpenChange?: (open: boolean) => void }) {
  return (
    <Dialog.Root onOpenChange={props.onOpenChange}>
      <Dialog.Trigger>Open</Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Title>Delete file</Dialog.Title>
        <Dialog.Description>This cannot be undone.</Dialog.Description>
        <input aria-label="Name" />
        <Dialog.Footer>
          <Dialog.Close>Cancel</Dialog.Close>
        </Dialog.Footer>
        <Dialog.Close />
      </Dialog.Content>
    </Dialog.Root>
  );
}

describe("Dialog", () => {
  it("opens from the trigger, wires title/description and focuses the first tabbable", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(<Basic onOpenChange={onOpenChange} />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Open" }));
    const dialog = screen.getByRole("dialog", { name: "Delete file" });
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAccessibleDescription("This cannot be undone.");
    expect(screen.getByLabelText("Name")).toHaveFocus();
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(document.body.style.overflow).toBe("hidden");
  });

  it("closes on Escape and returns focus to the trigger", async () => {
    const user = userEvent.setup();
    render(<Basic />);
    const trigger = screen.getByRole("button", { name: "Open" });
    await user.click(trigger);
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
    expect(document.body.style.overflow).toBe("");
  });

  it("traps Tab inside the dialog", async () => {
    const user = userEvent.setup();
    render(<Basic />);
    await user.click(screen.getByRole("button", { name: "Open" }));
    const input = screen.getByLabelText("Name");
    const close = screen.getByRole("button", { name: "Close" });
    await user.tab();
    await user.tab();
    expect(close).toHaveFocus();
    await user.tab();
    expect(input).toHaveFocus();
    await user.tab({ shift: true });
    expect(close).toHaveFocus();
  });

  it("closes on backdrop press and via Close", async () => {
    const user = userEvent.setup();
    render(<Basic />);
    await user.click(screen.getByRole("button", { name: "Open" }));
    await user.click(screen.getByRole("dialog").parentElement!);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Open" }));
    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("supports controlled mode", async () => {
    const user = userEvent.setup();
    function Controlled() {
      const [open, setOpen] = useState(true);
      return (
        <>
          <span data-testid="state">{String(open)}</span>
          <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Content>
              <Dialog.Title>Hi</Dialog.Title>
              <Dialog.Close />
            </Dialog.Content>
          </Dialog.Root>
        </>
      );
    }
    render(<Controlled />);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Close" }));
    expect(screen.getByTestId("state")).toHaveTextContent("false");
  });

  it("has no axe violations when open", async () => {
    render(
      <Dialog.Root defaultOpen>
        <Dialog.Content>
          <Dialog.Title>Settings</Dialog.Title>
          <Dialog.Description>Adjust things.</Dialog.Description>
          <Dialog.Close />
        </Dialog.Content>
      </Dialog.Root>,
    );
    expect(await axe(document.body)).toHaveNoViolations();
  });

  it("renders an automatic icon close (showClose) unless an icon Close is present or disabled", async () => {
    const user = userEvent.setup();
    const { unmount } = render(
      <Dialog.Root defaultOpen>
        <Dialog.Content>
          <Dialog.Title>Auto</Dialog.Title>
        </Dialog.Content>
      </Dialog.Root>,
    );
    expect(screen.getAllByRole("button", { name: "Close" })).toHaveLength(1);
    await user.click(screen.getByRole("button", { name: "Close" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    unmount();

    const second = render(
      <Dialog.Root defaultOpen>
        <Dialog.Content>
          <Dialog.Title>Own close</Dialog.Title>
          <Dialog.Close />
        </Dialog.Content>
      </Dialog.Root>,
    );
    expect(screen.getAllByRole("button", { name: "Close" })).toHaveLength(1);
    second.unmount();

    render(
      <Dialog.Root defaultOpen>
        <Dialog.Content showClose={false}>
          <Dialog.Title>None</Dialog.Title>
        </Dialog.Content>
      </Dialog.Root>,
    );
    expect(screen.queryByRole("button", { name: "Close" })).not.toBeInTheDocument();
  });
});
