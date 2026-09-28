import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { Radio } from "./Radio";
import { RadioGroup } from "./RadioGroup";

function Plans(props: Partial<Parameters<typeof RadioGroup>[0]>) {
  return (
    <RadioGroup aria-label="Plan" {...props}>
      <Radio value="free">Free</Radio>
      <Radio value="pro" description="For teams">
        Pro
      </Radio>
      <Radio value="legacy" disabled>
        Legacy
      </Radio>
      <Radio value="ent">Enterprise</Radio>
    </RadioGroup>
  );
}

describe("Radio / RadioGroup", () => {
  it("renders a radiogroup with radios sharing a name", () => {
    render(<Plans defaultValue="pro" />);
    expect(screen.getByRole("radiogroup", { name: "Plan" })).toBeInTheDocument();
    const radios = screen.getAllByRole("radio");
    expect(radios).toHaveLength(4);
    const names = new Set(radios.map((r) => r.getAttribute("name")));
    expect(names.size).toBe(1);
    expect(screen.getByRole("radio", { name: "Pro" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "Pro" })).toHaveAccessibleDescription("For teams");
  });

  it("applies orientation and invalid state", () => {
    render(<Plans orientation="horizontal" invalid className="c" />);
    const group = screen.getByRole("radiogroup");
    expect(group).toHaveAttribute("data-orientation", "horizontal");
    expect(group).toHaveAttribute("aria-invalid", "true");
    expect(group).toHaveClass("mrd-radio-group", "c");
  });

  it("moves and selects with arrow keys, skipping disabled and wrapping", async () => {
    const onValueChange = vi.fn();
    render(<Plans defaultValue="free" onValueChange={onValueChange} />);
    await userEvent.tab();
    expect(screen.getByRole("radio", { name: "Free" })).toHaveFocus();

    await userEvent.keyboard("{ArrowDown}");
    expect(screen.getByRole("radio", { name: "Pro" })).toHaveFocus();
    expect(screen.getByRole("radio", { name: "Pro" })).toBeChecked();

    await userEvent.keyboard("{ArrowRight}");
    expect(screen.getByRole("radio", { name: "Enterprise" })).toBeChecked();

    await userEvent.keyboard("{ArrowDown}");
    expect(screen.getByRole("radio", { name: "Free" })).toBeChecked();

    await userEvent.keyboard("{ArrowUp}");
    expect(screen.getByRole("radio", { name: "Enterprise" })).toBeChecked();

    await userEvent.keyboard("{Home}");
    expect(screen.getByRole("radio", { name: "Free" })).toBeChecked();
    expect(onValueChange).toHaveBeenLastCalledWith("free");
  });

  it("keeps a single tab stop on the selected radio", () => {
    render(<Plans defaultValue="pro" />);
    expect(screen.getByRole("radio", { name: "Free" })).toHaveAttribute("tabindex", "-1");
    expect(screen.getByRole("radio", { name: "Pro" })).not.toHaveAttribute("tabindex");
  });

  it("selects on click in controlled mode", async () => {
    const onValueChange = vi.fn();
    render(<Plans value="free" onValueChange={onValueChange} />);
    await userEvent.click(screen.getByText("Enterprise"));
    expect(onValueChange).toHaveBeenCalledWith("ent");
  });

  it("has no axe violations", async () => {
    const { container } = render(<Plans defaultValue="free" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
