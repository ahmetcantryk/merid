import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { axe } from "vitest-axe";
import { Checkbox } from "./Checkbox";

describe("Checkbox", () => {
  it("renders a labelled checkbox", () => {
    render(<Checkbox>Accept terms</Checkbox>);
    expect(screen.getByRole("checkbox", { name: "Accept terms" })).not.toBeChecked();
  });

  it("supports indeterminate, invalid, description and ref", () => {
    const ref = createRef<HTMLInputElement>();
    render(
      <Checkbox ref={ref} indeterminate invalid description="Applies to all" className="c">
        Select all
      </Checkbox>,
    );
    const box = screen.getByRole("checkbox", { name: "Select all" });
    expect(box).toBePartiallyChecked();
    expect(box).toHaveAttribute("aria-invalid", "true");
    expect(box).toHaveAccessibleDescription("Applies to all");
    expect(ref.current).toBe(box);
    expect(box.closest(".mrd-checkbox")).toHaveClass("mrd-checkbox", "c");
  });

  it("toggles with Space", async () => {
    const onChange = vi.fn();
    render(<Checkbox onChange={onChange}>Email me</Checkbox>);
    await userEvent.tab();
    const box = screen.getByRole("checkbox");
    expect(box).toHaveFocus();
    await userEvent.keyboard(" ");
    expect(box).toBeChecked();
    expect(onChange).toHaveBeenCalledOnce();
  });

  it("does not toggle when disabled", async () => {
    render(<Checkbox disabled>Off</Checkbox>);
    await userEvent.click(screen.getByText("Off"));
    expect(screen.getByRole("checkbox")).not.toBeChecked();
  });

  it("has no axe violations", async () => {
    const { container } = render(<Checkbox defaultChecked>Remember me</Checkbox>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
