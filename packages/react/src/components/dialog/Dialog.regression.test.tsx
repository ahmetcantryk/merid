import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AlertDialog } from "../alert-dialog/AlertDialog";
import { Drawer } from "../drawer/Drawer";
import { Dialog } from "./Dialog";

describe("Dialog regressions", () => {
  it("asChild on Trigger and Close merges props, handlers and className onto the child", async () => {
    const user = userEvent.setup();
    const childClick = vi.fn();
    render(
      <Dialog.Root>
        <Dialog.Trigger asChild className="from-slot">
          <a
            href="#x"
            className="mine"
            onClick={(event) => {
              event.preventDefault();
              childClick();
            }}
          >
            Open link
          </a>
        </Dialog.Trigger>
        <Dialog.Content>
          <Dialog.Title>Title</Dialog.Title>
          <Dialog.Close asChild>
            <button type="button">Done</button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Root>,
    );
    const trigger = screen.getByText("Open link");
    expect(trigger.tagName).toBe("A");
    expect(trigger).toHaveClass("mine", "from-slot");
    expect(trigger).toHaveAttribute("aria-haspopup", "dialog");
    expect(trigger).not.toHaveAttribute("type");
    // the child's handler calls preventDefault: the dialog must stay closed (consumer wins)
    await user.click(trigger);
    expect(childClick).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("asChild trigger opens and asChild close closes", async () => {
    const user = userEvent.setup();
    render(
      <Dialog.Root>
        <Dialog.Trigger asChild>
          <button type="button" className="mrd-button">Open</button>
        </Dialog.Trigger>
        <Dialog.Content>
          <Dialog.Title>Title</Dialog.Title>
          <Dialog.Close asChild>
            <button type="button">Done</button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Root>,
    );
    await user.click(screen.getByRole("button", { name: "Open" }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Done" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("Close with text renders as a secondary Button; icon close stays an icon button", () => {
    render(
      <Dialog.Root defaultOpen>
        <Dialog.Content>
          <Dialog.Title>Title</Dialog.Title>
          <Dialog.Close>Cancel</Dialog.Close>
          <Dialog.Close />
        </Dialog.Content>
      </Dialog.Root>,
    );
    const cancel = screen.getByRole("button", { name: "Cancel" });
    expect(cancel).toHaveClass("mrd-button");
    expect(cancel).toHaveAttribute("data-variant", "secondary");
    const icon = screen.getByRole("button", { name: "Close" });
    expect(icon).toHaveClass("mrd-dialog__close");
    expect(icon).not.toHaveClass("mrd-button");
  });

  it("size maps to data-size (md by default)", () => {
    const { unmount } = render(
      <Dialog.Root defaultOpen>
        <Dialog.Content>
          <Dialog.Title>T</Dialog.Title>
        </Dialog.Content>
      </Dialog.Root>,
    );
    expect(screen.getByRole("dialog")).toHaveAttribute("data-size", "md");
    unmount();
    render(
      <Dialog.Root defaultOpen>
        <Dialog.Content size="lg">
          <Dialog.Title>T</Dialog.Title>
        </Dialog.Content>
      </Dialog.Root>,
    );
    expect(screen.getByRole("dialog")).toHaveAttribute("data-size", "lg");
  });
});

describe("AlertDialog regressions", () => {
  it("Action and Cancel render with Button styles; tone selects danger", () => {
    render(
      <AlertDialog.Root defaultOpen>
        <AlertDialog.Content>
          <AlertDialog.Title>Delete?</AlertDialog.Title>
          <AlertDialog.Cancel>Keep</AlertDialog.Cancel>
          <AlertDialog.Action tone="danger">Delete</AlertDialog.Action>
        </AlertDialog.Content>
      </AlertDialog.Root>,
    );
    const cancel = screen.getByRole("button", { name: "Keep" });
    const action = screen.getByRole("button", { name: "Delete" });
    expect(cancel).toHaveClass("mrd-button");
    expect(cancel).toHaveAttribute("data-variant", "secondary");
    expect(action).toHaveClass("mrd-button");
    expect(action).toHaveAttribute("data-variant", "danger");
  });

  it("Action defaults to primary; Cancel supports asChild", async () => {
    const user = userEvent.setup();
    render(
      <AlertDialog.Root defaultOpen>
        <AlertDialog.Content>
          <AlertDialog.Title>Sure?</AlertDialog.Title>
          <AlertDialog.Action>Yes</AlertDialog.Action>
          <AlertDialog.Cancel asChild>
            <button type="button" className="custom">
              Custom
            </button>
          </AlertDialog.Cancel>
        </AlertDialog.Content>
      </AlertDialog.Root>,
    );
    expect(screen.getByRole("button", { name: "Yes" })).toHaveAttribute("data-variant", "primary");
    const custom = screen.getByRole("button", { name: "Custom" });
    expect(custom).toHaveClass("custom");
    expect(custom).not.toHaveClass("mrd-button");
    await user.click(custom);
    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
  });
});

describe("Drawer regressions", () => {
  it("size maps to data-size; Trigger and Close support asChild", async () => {
    const user = userEvent.setup();
    render(
      <Drawer.Root>
        <Drawer.Trigger asChild>
          <button type="button" className="mine">
            Filters
          </button>
        </Drawer.Trigger>
        <Drawer.Content size="lg">
          <Drawer.Title>Filter list</Drawer.Title>
          <Drawer.Close asChild>
            <button type="button">Apply</button>
          </Drawer.Close>
        </Drawer.Content>
      </Drawer.Root>,
    );
    await user.click(screen.getByRole("button", { name: "Filters" }));
    expect(screen.getByRole("dialog")).toHaveAttribute("data-size", "lg");
    await user.click(screen.getByRole("button", { name: "Apply" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("defaults to size md", () => {
    render(
      <Drawer.Root defaultOpen>
        <Drawer.Content>
          <Drawer.Title>T</Drawer.Title>
        </Drawer.Content>
      </Drawer.Root>,
    );
    expect(screen.getByRole("dialog")).toHaveAttribute("data-size", "md");
  });
});
