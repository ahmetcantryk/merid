import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { Field } from "../field/Field";
import { NativeSelect } from "./NativeSelect";

const options = (
  <>
    <option value="tr">Türkiye</option>
    <option value="de">Germany</option>
  </>
);

describe("NativeSelect", () => {
  it("renders a combobox with a placeholder selected", () => {
    render(
      <NativeSelect aria-label="Country" placeholder="Choose…">
        {options}
      </NativeSelect>,
    );
    const select = screen.getByRole("combobox", { name: "Country" });
    expect(select).toHaveValue("");
  });

  it("applies size, invalid and className on wrapper", () => {
    const { container } = render(
      <NativeSelect aria-label="C" size="lg" invalid className="c">
        {options}
      </NativeSelect>,
    );
    expect(container.firstChild).toHaveClass("mrd-native-select", "c");
    expect(container.firstChild).toHaveAttribute("data-size", "lg");
    expect(screen.getByRole("combobox")).toHaveAttribute("aria-invalid", "true");
  });

  it("selects with the keyboard/user interaction inside a Field", async () => {
    const onChange = vi.fn();
    render(
      <Field label="Country">
        <NativeSelect onChange={onChange}>{options}</NativeSelect>
      </Field>,
    );
    const select = screen.getByRole("combobox", { name: "Country" });
    await userEvent.tab();
    expect(select).toHaveFocus();
    await userEvent.selectOptions(select, "de");
    expect(select).toHaveValue("de");
    expect(onChange).toHaveBeenCalled();
  });

  it("has no axe violations", async () => {
    const { container } = render(<NativeSelect aria-label="Country">{options}</NativeSelect>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
