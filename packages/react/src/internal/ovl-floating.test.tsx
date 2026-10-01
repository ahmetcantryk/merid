import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DropdownMenu } from "../components/dropdown-menu/DropdownMenu";
import { Popover } from "../components/popover/Popover";

// Floating parts open with a keyframe that animates `transform`. If the position were also
// written to `transform`, the animation (fill-mode both) would override it and the panel
// would sit at the viewport's top-left corner. Position must therefore come from left/top.
function expectPositionedWithoutTransform(el: HTMLElement) {
  expect(el.style.transform).toBe("");
  expect(el.style.left).not.toBe("");
  expect(el.style.top).not.toBe("");
}

describe("floating position", () => {
  it("DropdownMenu content is placed with left/top, not transform", async () => {
    const user = userEvent.setup();
    render(
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>Columns</DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item>Name</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>,
    );
    await user.click(screen.getByRole("button", { name: "Columns" }));
    expectPositionedWithoutTransform(screen.getByRole("menu"));
  });

  it("Popover content is placed with left/top, not transform", async () => {
    const user = userEvent.setup();
    render(
      <Popover.Root>
        <Popover.Trigger>Details</Popover.Trigger>
        <Popover.Content aria-label="Details">Body</Popover.Content>
      </Popover.Root>,
    );
    await user.click(screen.getByRole("button", { name: "Details" }));
    expectPositionedWithoutTransform(screen.getByRole("dialog", { name: "Details" }));
  });
});
