import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { AlertDialog } from "./AlertDialog";

function Confirm({ onAction }: { onAction?: () => void }) {
  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger>Delete</AlertDialog.Trigger>
      <AlertDialog.Content>
        <AlertDialog.Title>Delete project?</AlertDialog.Title>
        <AlertDialog.Description>All data will be lost.</AlertDialog.Description>
        <AlertDialog.Footer>
          <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
          <AlertDialog.Action onClick={onAction}>Delete</AlertDialog.Action>
        </AlertDialog.Footer>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
}

describe("AlertDialog", () => {
  it("uses role alertdialog and focuses Cancel", async () => {
    const user = userEvent.setup();
    render(<Confirm />);
    await user.click(screen.getByRole("button", { name: "Delete" }));
    expect(screen.getByRole("alertdialog", { name: "Delete project?" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toHaveFocus();
    expect(screen.queryByRole("button", { name: "Close" })).not.toBeInTheDocument();
  });

  it("does not close on outside press but closes on Escape with focus return", async () => {
    const user = userEvent.setup();
    render(<Confirm />);
    const trigger = screen.getByRole("button", { name: "Delete" });
    await user.click(trigger);
    await user.click(screen.getByRole("alertdialog").parentElement!);
    expect(screen.getByRole("alertdialog")).toBeInTheDocument();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("Action runs its handler and closes", async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();
    render(<Confirm onAction={onAction} />);
    await user.click(screen.getByRole("button", { name: "Delete" }));
    const buttons = screen.getAllByRole("button", { name: "Delete" });
    await user.click(buttons[buttons.length - 1]!);
    expect(onAction).toHaveBeenCalledOnce();
    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const user = userEvent.setup();
    render(<Confirm />);
    await user.click(screen.getByRole("button", { name: "Delete" }));
    expect(await axe(document.body)).toHaveNoViolations();
  });
});
