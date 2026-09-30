import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { Toggle } from "./Toggle";
import { ToggleGroup, ToggleGroupItem } from "./ToggleGroup";

describe("Toggle", () => {
  it("renders an unpressed button that toggles on click", async () => {
    const onPressedChange = vi.fn();
    render(<Toggle onPressedChange={onPressedChange}>Bold</Toggle>);
    const button = screen.getByRole("button", { name: "Bold" });
    expect(button).toHaveAttribute("aria-pressed", "false");
    expect(button).toHaveAttribute("type", "button");
    await userEvent.click(button);
    expect(button).toHaveAttribute("aria-pressed", "true");
    expect(button).toHaveAttribute("data-state", "on");
    expect(onPressedChange).toHaveBeenCalledWith(true);
  });

  it("is controlled by `pressed`", async () => {
    const onPressedChange = vi.fn();
    render(
      <Toggle pressed onPressedChange={onPressedChange} size="sm" className="c">
        Grid
      </Toggle>,
    );
    const button = screen.getByRole("button", { name: "Grid" });
    await userEvent.click(button);
    expect(onPressedChange).toHaveBeenCalledWith(false);
    expect(button).toHaveAttribute("aria-pressed", "true");
    expect(button).toHaveClass("mrd-toggle", "c");
    expect(button).toHaveAttribute("data-size", "sm");
  });

  it("toggles with Space and Enter", async () => {
    render(<Toggle defaultPressed>Italic</Toggle>);
    const button = screen.getByRole("button", { name: "Italic" });
    button.focus();
    await userEvent.keyboard(" ");
    expect(button).toHaveAttribute("aria-pressed", "false");
    await userEvent.keyboard("{Enter}");
    expect(button).toHaveAttribute("aria-pressed", "true");
  });

  it("has no axe violations", async () => {
    const { container } = render(<Toggle aria-label="Bold">B</Toggle>);
    expect(await axe(container)).toHaveNoViolations();
  });
});

function Alignment(props: { onValueChange?: (v: string) => void; defaultValue?: string }) {
  return (
    <ToggleGroup type="single" aria-label="Alignment" {...props}>
      <ToggleGroupItem value="left">Left</ToggleGroupItem>
      <ToggleGroupItem value="center">Center</ToggleGroupItem>
      <ToggleGroupItem value="justify" disabled>
        Justify
      </ToggleGroupItem>
      <ToggleGroupItem value="right">Right</ToggleGroupItem>
    </ToggleGroup>
  );
}

describe("ToggleGroup", () => {
  it("single: one item on at a time, pressing it again turns it off", async () => {
    const onValueChange = vi.fn();
    render(<Alignment onValueChange={onValueChange} />);
    expect(screen.getByRole("group", { name: "Alignment" })).toHaveClass("mrd-toggle-group");
    await userEvent.click(screen.getByRole("button", { name: "Left" }));
    expect(screen.getByRole("button", { name: "Left" })).toHaveAttribute("aria-pressed", "true");
    await userEvent.click(screen.getByRole("button", { name: "Center" }));
    expect(screen.getByRole("button", { name: "Left" })).toHaveAttribute("aria-pressed", "false");
    expect(onValueChange).toHaveBeenLastCalledWith("center");
    await userEvent.click(screen.getByRole("button", { name: "Center" }));
    expect(onValueChange).toHaveBeenLastCalledWith("");
  });

  it("multiple: items toggle independently", async () => {
    const onValueChange = vi.fn();
    render(
      <ToggleGroup type="multiple" aria-label="Format" defaultValue={["bold"]} onValueChange={onValueChange}>
        <ToggleGroupItem value="bold">Bold</ToggleGroupItem>
        <ToggleGroupItem value="italic">Italic</ToggleGroupItem>
      </ToggleGroup>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Italic" }));
    expect(onValueChange).toHaveBeenLastCalledWith(["bold", "italic"]);
    await userEvent.click(screen.getByRole("button", { name: "Bold" }));
    expect(onValueChange).toHaveBeenLastCalledWith(["italic"]);
  });

  it("has one tab stop and roves with arrows, skipping disabled items and wrapping", async () => {
    render(<Alignment defaultValue="center" />);
    await userEvent.tab();
    expect(screen.getByRole("button", { name: "Center" })).toHaveFocus();
    expect(screen.getByRole("button", { name: "Left" })).toHaveAttribute("tabindex", "-1");
    await userEvent.keyboard("{ArrowRight}");
    expect(screen.getByRole("button", { name: "Right" })).toHaveFocus();
    await userEvent.keyboard("{ArrowRight}");
    expect(screen.getByRole("button", { name: "Left" })).toHaveFocus();
    await userEvent.keyboard("{End}");
    expect(screen.getByRole("button", { name: "Right" })).toHaveFocus();
    await userEvent.keyboard("{Home}");
    expect(screen.getByRole("button", { name: "Left" })).toHaveFocus();
    // Focus moves without pressing.
    expect(screen.getByRole("button", { name: "Center" })).toHaveAttribute("aria-pressed", "true");
  });

  it("reverses horizontal arrows under dir=rtl", async () => {
    render(
      <div dir="rtl" style={{ direction: "rtl" }}>
        <Alignment />
      </div>,
    );
    screen.getByRole("button", { name: "Center" }).focus();
    await userEvent.keyboard("{ArrowLeft}");
    expect(screen.getByRole("button", { name: "Right" })).toHaveFocus();
  });

  it("throws outside a group", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => undefined);
    expect(() => render(<ToggleGroupItem value="x">X</ToggleGroupItem>)).toThrow(/inside <ToggleGroup>/);
    spy.mockRestore();
  });

  it("has no axe violations", async () => {
    const { container } = render(<Alignment defaultValue="left" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
