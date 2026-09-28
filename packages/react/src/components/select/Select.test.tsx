import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { Field } from "../field/Field";
import { Select } from "./Select";

function Fruit(props: { onValueChange?: (v: string) => void; defaultValue?: string }) {
  return (
    <form data-testid="form">
      <Select.Root name="fruit" placeholder="Pick a fruit" {...props}>
        <Select.Trigger aria-label="Fruit" />
        <Select.Content>
          <Select.Item value="apple">Apple</Select.Item>
          <Select.Item value="banana" disabled>
            Banana
          </Select.Item>
          <Select.Item value="blueberry">Blueberry</Select.Item>
          <Select.Item value="cherry">Cherry</Select.Item>
        </Select.Content>
      </Select.Root>
    </form>
  );
}

const formValue = () => new FormData(screen.getByTestId("form") as HTMLFormElement).get("fruit");

describe("Select", () => {
  it("renders the placeholder and label of the default value", () => {
    const { unmount } = render(<Fruit />);
    expect(screen.getByRole("combobox", { name: "Fruit" })).toHaveTextContent("Pick a fruit");
    unmount();
    render(<Fruit defaultValue="cherry" />);
    expect(screen.getByRole("combobox")).toHaveTextContent("Cherry");
    expect(formValue()).toBe("cherry");
  });

  it("opens with ArrowDown, navigates with aria-activedescendant skipping disabled, selects with Enter", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Fruit onValueChange={onValueChange} />);
    const combobox = screen.getByRole("combobox");
    combobox.focus();
    await user.keyboard("{ArrowDown}");
    expect(combobox).toHaveAttribute("aria-expanded", "true");
    const listbox = screen.getByRole("listbox");
    expect(listbox).toBeVisible();
    expect(combobox).toHaveAttribute("aria-activedescendant", screen.getByRole("option", { name: "Apple" }).id);
    await user.keyboard("{ArrowDown}");
    expect(combobox).toHaveAttribute("aria-activedescendant", screen.getByRole("option", { name: "Blueberry" }).id);
    await user.keyboard("{Enter}");
    expect(onValueChange).toHaveBeenCalledWith("blueberry");
    expect(combobox).toHaveAttribute("aria-expanded", "false");
    expect(combobox).toHaveTextContent("Blueberry");
    expect(combobox).toHaveFocus();
    expect(formValue()).toBe("blueberry");
  });

  it("supports Home/End, Escape and typeahead", async () => {
    const user = userEvent.setup();
    render(<Fruit />);
    const combobox = screen.getByRole("combobox");
    combobox.focus();
    await user.keyboard("{Enter}{End}");
    expect(combobox).toHaveAttribute("aria-activedescendant", screen.getByRole("option", { name: "Cherry" }).id);
    await user.keyboard("{Home}");
    expect(combobox).toHaveAttribute("aria-activedescendant", screen.getByRole("option", { name: "Apple" }).id);
    await user.keyboard("{Escape}");
    expect(combobox).toHaveAttribute("aria-expanded", "false");
    expect(combobox).toHaveFocus();
    // closed typeahead selects directly
    await user.keyboard("c");
    expect(combobox).toHaveTextContent("Cherry");
  });

  it("selects by click and closes on outside press", async () => {
    const user = userEvent.setup();
    render(
      <>
        <Fruit />
        <button type="button">Outside</button>
      </>,
    );
    const combobox = screen.getByRole("combobox");
    await user.click(combobox);
    await user.click(screen.getByRole("option", { name: "Cherry" }));
    expect(combobox).toHaveTextContent("Cherry");
    await user.click(combobox);
    await user.click(screen.getByRole("button", { name: "Outside" }));
    expect(combobox).toHaveAttribute("aria-expanded", "false");
  });

  it("has no axe violations when open", async () => {
    const user = userEvent.setup();
    render(<Fruit />);
    await user.click(screen.getByRole("combobox"));
    // "region" is a page-level landmark rule; a lone widget in a test body is not a page.
    expect(await axe(document.body, { rules: { region: { enabled: false } } })).toHaveNoViolations();
  });

  it("picks up Field wiring: label, description, error, required, disabled", () => {
    const { rerender } = render(
      <Field label="Plan" description="Billed monthly" error="Pick a plan" required>
        <Select.Root>
          <Select.Trigger />
          <Select.Content>
            <Select.Item value="pro">Pro</Select.Item>
          </Select.Content>
        </Select.Root>
      </Field>,
    );
    const trigger = screen.getByRole("combobox", { name: "Plan" });
    expect(trigger.id).toBe(screen.getByText("Plan").closest("label")!.getAttribute("for"));
    expect(trigger).toHaveAttribute("aria-invalid", "true");
    expect(trigger).toHaveAttribute("data-invalid");
    expect(trigger).toHaveAttribute("aria-required", "true");
    expect(trigger).toHaveAccessibleDescription(/Billed monthly/);
    expect(trigger).toHaveAccessibleDescription(/Pick a plan/);
    rerender(
      <Field label="Plan" disabled>
        <Select.Root>
          <Select.Trigger />
          <Select.Content>
            <Select.Item value="pro">Pro</Select.Item>
          </Select.Content>
        </Select.Root>
      </Field>,
    );
    expect(screen.getByRole("combobox", { name: "Plan" })).toBeDisabled();
  });
});
