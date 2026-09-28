import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { Alert } from "../alert/Alert";
import { AvatarGroup } from "../avatar/AvatarGroup";
import { Avatar } from "../avatar/Avatar";
import { Card } from "../card/Card";
import { Checkbox } from "../checkbox/Checkbox";
import { Input } from "../input/Input";
import { NativeSelect } from "../native-select/NativeSelect";
import { Progress } from "../progress/Progress";
import { Radio } from "../radio/Radio";
import { RadioGroup } from "../radio/RadioGroup";
import { SegmentedControl } from "../segmented-control/SegmentedControl";
import { Spinner } from "../spinner/Spinner";
import { Switch } from "../switch/Switch";
import { Textarea } from "../textarea/Textarea";
import { Field } from "./Field";

describe("Field wiring regressions", () => {
  it("Switch inside Field is named by the Field label and picks up description/error", async () => {
    const { container } = render(
      <Field label="Notifications" description="Email only" error="Required">
        <Switch />
      </Field>,
    );
    const control = screen.getByRole("switch", { name: "Notifications" });
    expect(control).toHaveAccessibleDescription("Email only Required");
    expect(control).toHaveAttribute("aria-invalid", "true");
    expect(control).toHaveAttribute("data-invalid");
    expect(await axe(container)).toHaveNoViolations();
  });

  it("disabled Field disables the Switch", () => {
    render(
      <Field label="Beta" disabled>
        <Switch />
      </Field>,
    );
    expect(screen.getByRole("switch", { name: "Beta" })).toBeDisabled();
  });

  it("RadioGroup inside Field is labelled by the Field label and gets invalid/required", async () => {
    const { container } = render(
      <Field label="Plan" error="Pick one" required>
        <RadioGroup>
          <Radio value="a">A</Radio>
          <Radio value="b">B</Radio>
        </RadioGroup>
      </Field>,
    );
    const group = screen.getByRole("radiogroup", { name: /Plan/ });
    expect(group).toHaveAttribute("aria-invalid", "true");
    expect(group).toHaveAttribute("aria-required", "true");
    expect(group).toHaveAccessibleDescription("Pick one");
    for (const radio of screen.getAllByRole("radio")) expect(radio).toHaveAttribute("data-invalid");
    expect(await axe(container)).toHaveNoViolations();
  });

  it("RadioGroup invalid propagates data-invalid to radios", () => {
    render(
      <RadioGroup aria-label="Size" invalid>
        <Radio value="s">S</Radio>
      </RadioGroup>,
    );
    expect(screen.getByRole("radio", { name: "S" })).toHaveAttribute("data-invalid");
  });

  it("Checkbox inside Field: Field label names it, children become the description (no double label)", async () => {
    const { container } = render(
      <Field label="Terms">
        <Checkbox>I agree to the terms</Checkbox>
      </Field>,
    );
    const box = screen.getByRole("checkbox", { name: "Terms" });
    expect(box).toHaveAccessibleDescription("I agree to the terms");
    // clicking the inline text still toggles
    await userEvent.setup().click(screen.getByText("I agree to the terms"));
    expect(box).toBeChecked();
    expect(await axe(container)).toHaveNoViolations();
  });

  it("Checkbox inside Field without children uses the Field label only", () => {
    render(
      <Field label="Subscribe">
        <Checkbox />
      </Field>,
    );
    expect(screen.getByRole("checkbox", { name: "Subscribe" })).not.toHaveAttribute("aria-labelledby");
  });
});

describe("Form control conventions", () => {
  it("aria-invalid carries semantics and data-invalid drives styling on every control", () => {
    render(
      <>
        <Input aria-label="i" invalid />
        <Textarea aria-label="t" invalid />
        <NativeSelect aria-label="n" invalid>
          <option value="x">x</option>
        </NativeSelect>
        <Checkbox aria-label="c" invalid />
        <Switch aria-label="s" invalid />
        <Input aria-label="aria-only" aria-invalid="true" />
      </>,
    );
    for (const name of ["i", "t", "n", "c", "s", "aria-only"]) {
      const el = screen.getByLabelText(name);
      expect(el).toHaveAttribute("aria-invalid", "true");
      expect(el).toHaveAttribute("data-invalid");
    }
  });

  it("Input: className and style always go on the root element", () => {
    const { rerender, container } = render(<Input aria-label="plain" className="c" style={{ width: 10 }} />);
    const plain = screen.getByLabelText("plain");
    expect(plain).toHaveClass("c");
    expect(plain).toHaveStyle({ width: "10px" });
    rerender(<Input aria-label="plain" className="c" style={{ width: 10 }} leading="$" />);
    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveClass("mrd-input-group", "c");
    expect(root).toHaveStyle({ width: "10px" });
    const input = screen.getByLabelText("plain");
    expect(input).not.toHaveClass("c");
    expect(input.getAttribute("style")).toBeNull();
  });

  it("NativeSelect: className and style on the wrapper; placeholder shows for a controlled empty value", () => {
    const { container, rerender } = render(
      <NativeSelect aria-label="Fruit" className="w" style={{ width: 20 }} placeholder="Pick" value="" onChange={() => {}}>
        <option value="a">Apple</option>
      </NativeSelect>,
    );
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper).toHaveClass("mrd-native-select", "w");
    expect(wrapper).toHaveStyle({ width: "20px" });
    const select = screen.getByLabelText<HTMLSelectElement>("Fruit");
    expect(select.getAttribute("style")).toBeNull();
    expect(select.value).toBe("");
    const placeholder = select.querySelector("option[value='']");
    expect(placeholder).toHaveAttribute("hidden");
    expect(placeholder).toBeDisabled();
    rerender(
      <NativeSelect aria-label="Fruit" placeholder="Pick" value="a" onChange={() => {}}>
        <option value="a">Apple</option>
      </NativeSelect>,
    );
    expect(screen.getByLabelText<HTMLSelectElement>("Fruit").value).toBe("a");
  });

  it("SegmentedControl keeps a tab stop when the controlled value matches no enabled option", () => {
    const options = [
      { value: "a", label: "A", disabled: true },
      { value: "b", label: "B" },
      { value: "c", label: "C" },
    ];
    const { rerender } = render(<SegmentedControl aria-label="View" options={options} value="zzz" />);
    expect(screen.getByRole("radio", { name: "B" })).toHaveAttribute("tabindex", "0");
    rerender(<SegmentedControl aria-label="View" options={options} value="a" />);
    expect(screen.getByRole("radio", { name: "B" })).toHaveAttribute("tabindex", "0");
    expect(screen.getByRole("radio", { name: "A" })).toHaveAttribute("tabindex", "-1");
  });
});

describe("Display component regressions", () => {
  it("Spinner renders no unstyled arc class", () => {
    const { container } = render(<Spinner />);
    expect(container.querySelector(".mrd-spinner__arc")).toBeNull();
  });

  it("Progress drops aria-value* when indeterminate", () => {
    render(<Progress aria-label="Loading" />);
    const bar = screen.getByRole("progressbar");
    expect(bar).not.toHaveAttribute("aria-valuemin");
    expect(bar).not.toHaveAttribute("aria-valuemax");
    expect(bar).not.toHaveAttribute("aria-valuenow");
  });

  it("AvatarGroup takes a label and warns when unnamed", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(
      <AvatarGroup label="Team">
        <Avatar name="Ada Lovelace" />
      </AvatarGroup>,
    );
    expect(screen.getByRole("group", { name: "Team" })).toBeInTheDocument();
    expect(warn).not.toHaveBeenCalled();
    render(
      <AvatarGroup>
        <Avatar name="Ada Lovelace" />
      </AvatarGroup>,
    );
    expect(warn).toHaveBeenCalledWith(expect.stringContaining("AvatarGroup"));
    warn.mockRestore();
  });

  it("Card: aria-pressed only for an interactive button card with explicit selected", () => {
    render(
      <>
        <Card as="button" interactive selected>
          Pressed
        </Card>
        <Card as="button" interactive>
          Plain
        </Card>
        <Card selected>Div</Card>
      </>,
    );
    expect(screen.getByRole("button", { name: "Pressed" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Plain" })).not.toHaveAttribute("aria-pressed");
    expect(screen.getByText("Div")).not.toHaveAttribute("aria-pressed");
  });

  it("Alert renders a falsy-but-present title such as 0", () => {
    const { container } = render(<Alert title={0}>Body</Alert>);
    expect(container.querySelector(".mrd-alert__title")).toHaveTextContent("0");
  });
});
