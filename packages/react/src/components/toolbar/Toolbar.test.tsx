import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { Toolbar } from "./Toolbar";

function Example({ onBold, orientation }: { onBold?: () => void; orientation?: "horizontal" | "vertical" }) {
  return (
    <>
      <button type="button">Before</button>
      <Toolbar.Root aria-label="Formatting" orientation={orientation}>
        <Toolbar.Group aria-label="Style">
          <Toolbar.Button aria-pressed="false" onClick={onBold}>Bold</Toolbar.Button>
          <Toolbar.Button>Italic</Toolbar.Button>
          <Toolbar.Button disabled>Strike</Toolbar.Button>
        </Toolbar.Group>
        <Toolbar.Separator />
        <Toolbar.Link href="#help">Help</Toolbar.Link>
      </Toolbar.Root>
      <button type="button">After</button>
    </>
  );
}

describe("Toolbar", () => {
  it("is a single tab stop with arrow, Home and End movement that skips disabled items", async () => {
    const user = userEvent.setup();
    render(<Example />);
    expect(screen.getByRole("toolbar", { name: "Formatting" })).toHaveAttribute("aria-orientation", "horizontal");
    await user.tab();
    await user.tab();
    expect(screen.getByRole("button", { name: "Bold" })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole("button", { name: "After" })).toHaveFocus();

    await user.tab({ shift: true });
    expect(screen.getByRole("button", { name: "Bold" })).toHaveFocus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("button", { name: "Italic" })).toHaveFocus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("link", { name: "Help" })).toHaveFocus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("button", { name: "Bold" })).toHaveFocus();
    await user.keyboard("{End}");
    expect(screen.getByRole("link", { name: "Help" })).toHaveFocus();
    await user.keyboard("{Home}");
    expect(screen.getByRole("button", { name: "Bold" })).toHaveFocus();
    await user.keyboard("{ArrowLeft}");
    expect(screen.getByRole("link", { name: "Help" })).toHaveFocus();
  });

  it("remembers the last focused item as the tab stop", async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.tab();
    await user.tab();
    await user.keyboard("{ArrowRight}");
    await user.tab();
    await user.tab({ shift: true });
    expect(screen.getByRole("button", { name: "Italic" })).toHaveFocus();
    expect(screen.getByRole("button", { name: "Bold" })).toHaveAttribute("tabindex", "-1");
  });

  it("uses ArrowUp / ArrowDown when vertical and flips the separator", async () => {
    const user = userEvent.setup();
    render(<Example orientation="vertical" />);
    expect(screen.getByRole("separator")).toHaveAttribute("aria-orientation", "horizontal");
    screen.getByRole("button", { name: "Bold" }).focus();
    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("button", { name: "Italic" })).toHaveFocus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("button", { name: "Italic" })).toHaveFocus();
  });

  it("blocks clicks on disabled buttons", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Toolbar.Root aria-label="Actions">
        <Toolbar.Button disabled onClick={onClick}>Delete</Toolbar.Button>
      </Toolbar.Root>,
    );
    const button = screen.getByRole("button", { name: "Delete" });
    expect(button).toHaveAttribute("aria-disabled", "true");
    await user.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("renders a custom element with asChild", () => {
    render(
      <Toolbar.Root aria-label="Actions">
        <Toolbar.Button asChild>
          <a href="#share">Share</a>
        </Toolbar.Button>
      </Toolbar.Root>,
    );
    expect(screen.getByRole("link", { name: "Share" })).toHaveAttribute("data-mrd-roving");
  });

  it("has no axe violations", async () => {
    const { container } = render(<Example />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
