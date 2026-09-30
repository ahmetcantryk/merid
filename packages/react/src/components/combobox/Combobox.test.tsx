import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { axe } from "vitest-axe";
import { Field } from "../field/Field";
import { Combobox, type ComboboxOption } from "./Combobox";

const fruits: ComboboxOption[] = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana", disabled: true },
  { value: "blueberry", label: "Blueberry" },
  { value: "cherry", label: "Cherry", description: "Stone fruit" },
];

const input = () => screen.getByRole("combobox");
const formValues = (name: string) => new FormData(screen.getByTestId("form") as HTMLFormElement).getAll(name);

describe("Combobox", () => {
  it("renders an editable combobox wired to a listbox", () => {
    render(<Combobox aria-label="Fruit" options={fruits} placeholder="Search…" />);
    const box = screen.getByRole("combobox", { name: "Fruit" });
    expect(box.tagName).toBe("INPUT");
    expect(box).toHaveAttribute("aria-autocomplete", "list");
    expect(box).toHaveAttribute("aria-expanded", "false");
    expect(box).toHaveAttribute("aria-controls", screen.getByRole("listbox", { hidden: true }).id);
    expect(box).toHaveAttribute("placeholder", "Search…");
  });

  it("filters while typing and selects with the keyboard", async () => {
    const onValueChange = vi.fn();
    render(
      <form data-testid="form">
        <Combobox aria-label="Fruit" options={fruits} onValueChange={onValueChange} name="fruit" />
      </form>,
    );
    await userEvent.type(input(), "b");
    expect(input()).toHaveAttribute("aria-expanded", "true");
    expect(screen.getAllByRole("option").map((o) => o.textContent)).toEqual(["Banana", "Blueberry"]);
    // Disabled Banana is skipped: the first enabled match is active.
    expect(input()).toHaveAttribute("aria-activedescendant", screen.getByRole("option", { name: "Blueberry" }).id);
    await userEvent.keyboard("{Enter}");
    expect(onValueChange).toHaveBeenCalledWith("blueberry");
    expect(input()).toHaveValue("Blueberry");
    expect(input()).toHaveAttribute("aria-expanded", "false");
    expect(formValues("fruit")).toEqual(["blueberry"]);
  });

  it("ArrowDown opens and moves, ArrowUp wraps, Escape closes and restores the label", async () => {
    render(<Combobox aria-label="Fruit" options={fruits} defaultValue="cherry" />);
    expect(input()).toHaveValue("Cherry");
    input().focus();
    await userEvent.keyboard("{ArrowDown}");
    expect(input()).toHaveAttribute("aria-activedescendant", screen.getByRole("option", { name: /Cherry/ }).id);
    await userEvent.keyboard("{ArrowDown}");
    expect(input()).toHaveAttribute("aria-activedescendant", screen.getByRole("option", { name: "Apple" }).id);
    await userEvent.keyboard("{ArrowUp}");
    expect(input()).toHaveAttribute("aria-activedescendant", screen.getByRole("option", { name: /Cherry/ }).id);
    await userEvent.type(input(), "zz");
    expect(screen.getByRole("status")).toHaveTextContent("No results");
    await userEvent.keyboard("{Escape}");
    expect(input()).toHaveAttribute("aria-expanded", "false");
    expect(input()).toHaveValue("Cherry");
  });

  it("selects by click; clearing the text clears the value on blur", async () => {
    const onValueChange = vi.fn();
    render(<Combobox aria-label="Fruit" options={fruits} onValueChange={onValueChange} />);
    await userEvent.click(screen.getByRole("button", { name: "Show options" }));
    await userEvent.click(screen.getByRole("option", { name: "Apple" }));
    expect(onValueChange).toHaveBeenLastCalledWith("apple");
    await userEvent.clear(input());
    await userEvent.tab();
    expect(onValueChange).toHaveBeenLastCalledWith("");
  });

  it("multiple: toggles values, shows chips, Backspace removes the last one", async () => {
    const onValueChange = vi.fn();
    render(
      <form data-testid="form">
        <Combobox
          multiple
          aria-label="Fruits"
          options={fruits}
          defaultValue={["apple"]}
          onValueChange={onValueChange}
          name="fruits"
          getRemoveLabel={(label) => `${label} kaldır`}
        />
      </form>,
    );
    expect(screen.getByRole("button", { name: "Apple kaldır" })).toBeInTheDocument();
    await userEvent.type(input(), "cher");
    await userEvent.keyboard("{Enter}");
    expect(onValueChange).toHaveBeenLastCalledWith(["apple", "cherry"]);
    expect(input()).toHaveValue("");
    // Stays open for more picks.
    expect(input()).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("listbox")).toHaveAttribute("aria-multiselectable", "true");
    expect(formValues("fruits")).toEqual(["apple", "cherry"]);
    await userEvent.keyboard("{Backspace}");
    expect(onValueChange).toHaveBeenLastCalledWith(["apple"]);
    await userEvent.click(screen.getByRole("button", { name: "Apple kaldır" }));
    expect(onValueChange).toHaveBeenLastCalledWith([]);
  });

  it("async: filter={false} shows given options and a loading status", async () => {
    function Async() {
      const [options, setOptions] = useState<ComboboxOption[]>([]);
      const [loading, setLoading] = useState(false);
      return (
        <Combobox
          aria-label="City"
          options={options}
          filter={false}
          loading={loading}
          loadingMessage="Aranıyor…"
          onInputValueChange={(text) => {
            setLoading(true);
            setTimeout(() => {
              setOptions([{ value: `${text}-1`, label: `${text} City` }]);
              setLoading(false);
            }, 10);
          }}
        />
      );
    }
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<Async />);
    await user.type(input(), "x");
    expect(screen.getByRole("status")).toHaveTextContent("Aranıyor…");
    expect(screen.getByRole("listbox")).toHaveAttribute("aria-busy", "true");
    await act(async () => {
      vi.advanceTimersByTime(20);
    });
    expect(screen.getByRole("option", { name: "x City" })).toBeInTheDocument();
    vi.useRealTimers();
  });

  it("matches with the given locale (Turkish dotted I)", async () => {
    render(<Combobox aria-label="Şehir" locale="tr-TR" options={[{ value: "izmir", label: "İzmir" }, { value: "ankara", label: "Ankara" }]} />);
    await userEvent.type(input(), "iz");
    expect(screen.getAllByRole("option").map((o) => o.textContent)).toEqual(["İzmir"]);
  });

  it("wires into Field", () => {
    render(
      <Field label="Fruit" error="Pick one" required>
        <Combobox options={fruits} />
      </Field>,
    );
    const box = screen.getByRole("combobox", { name: "Fruit" });
    expect(box).toHaveAttribute("aria-invalid", "true");
    expect(box).toBeRequired();
  });

  it("has no axe violations (closed and open)", async () => {
    const { container } = render(<Combobox aria-label="Fruit" options={fruits} />);
    expect(await axe(container)).toHaveNoViolations();
    await userEvent.click(input());
    expect(await axe(document.body, { rules: { region: { enabled: false } } })).toHaveNoViolations();
  });
});
