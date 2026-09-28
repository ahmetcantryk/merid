import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { Tooltip } from "./Tooltip";

describe("Tooltip", () => {
  it("shows on focus immediately, is described by, and hides on Escape", async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Copy to clipboard">
        <button type="button">Copy</button>
      </Tooltip>,
    );
    await user.tab();
    const button = screen.getByRole("button", { name: "Copy" });
    expect(button).toHaveFocus();
    expect(screen.getByRole("tooltip")).toHaveTextContent("Copy to clipboard");
    expect(button).toHaveAccessibleDescription("Copy to clipboard");
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    expect(button).toHaveFocus();
  });

  it("shows on hover after the delay and hides on leave", async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Settings" delay={80}>
        <button type="button">S</button>
      </Tooltip>,
    );
    const button = screen.getByRole("button");
    await user.hover(button);
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    expect(await screen.findByRole("tooltip")).toHaveTextContent("Settings");
    await user.unhover(button);
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("keeps the child's own handlers", async () => {
    const user = userEvent.setup();
    const onFocus = vi.fn();
    render(
      <Tooltip content="Hi">
        <button type="button" onFocus={onFocus}>
          X
        </button>
      </Tooltip>,
    );
    await user.tab();
    expect(onFocus).toHaveBeenCalled();
  });

  it("has no axe violations when open", async () => {
    render(
      <Tooltip content="Help" defaultOpen>
        <button type="button">?</button>
      </Tooltip>,
    );
    // "region" is a page-level landmark rule; a lone widget in a test body is not a page.
    expect(await axe(document.body, { rules: { region: { enabled: false } } })).toHaveNoViolations();
  });
});
