import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { SegmentedControl, type SegmentedControlOption } from "./SegmentedControl";

const options: SegmentedControlOption[] = [
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
  { value: "lifetime", label: "Lifetime", disabled: true },
  { value: "weekly", label: "Weekly" },
];

describe("SegmentedControl", () => {
  it("renders a radiogroup with the first option selected", () => {
    render(<SegmentedControl aria-label="Billing" options={options} />);
    expect(screen.getByRole("radiogroup", { name: "Billing" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Monthly" })).toHaveAttribute("aria-checked", "true");
    expect(screen.getByRole("radio", { name: "Yearly" })).toHaveAttribute("tabindex", "-1");
  });

  it("applies fullWidth and className", () => {
    render(<SegmentedControl aria-label="B" options={options} fullWidth className="c" defaultValue="yearly" />);
    const group = screen.getByRole("radiogroup");
    expect(group).toHaveAttribute("data-full-width", "true");
    expect(group).toHaveClass("mrd-segmented", "c");
    expect(screen.getByRole("radio", { name: "Yearly" })).toHaveAttribute("data-state", "on");
  });

  it("moves selection with arrow keys, skipping disabled and wrapping", async () => {
    const onValueChange = vi.fn();
    render(<SegmentedControl aria-label="B" options={options} onValueChange={onValueChange} />);
    await userEvent.tab();
    expect(screen.getByRole("radio", { name: "Monthly" })).toHaveFocus();
    await userEvent.keyboard("{ArrowRight}");
    expect(screen.getByRole("radio", { name: "Yearly" })).toHaveFocus();
    await userEvent.keyboard("{ArrowRight}");
    expect(screen.getByRole("radio", { name: "Weekly" })).toHaveAttribute("aria-checked", "true");
    await userEvent.keyboard("{ArrowRight}");
    expect(screen.getByRole("radio", { name: "Monthly" })).toHaveAttribute("aria-checked", "true");
    await userEvent.keyboard("{End}");
    expect(onValueChange).toHaveBeenLastCalledWith("weekly");
  });

  it("selects on click", async () => {
    const onValueChange = vi.fn();
    render(<SegmentedControl aria-label="B" options={options} value="monthly" onValueChange={onValueChange} />);
    await userEvent.click(screen.getByRole("radio", { name: "Yearly" }));
    expect(onValueChange).toHaveBeenCalledWith("yearly");
  });

  it("has no axe violations", async () => {
    const { container } = render(<SegmentedControl aria-label="Billing" options={options} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
