import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { Switch } from "./Switch";

describe("Switch", () => {
  it("renders an unchecked switch named by its label", () => {
    render(<Switch>Dark mode</Switch>);
    const sw = screen.getByRole("switch", { name: "Dark mode" });
    expect(sw).toHaveAttribute("aria-checked", "false");
    expect(sw).toHaveAttribute("data-state", "off");
  });

  it("supports defaultChecked, label position and className", () => {
    const { container } = render(
      <Switch defaultChecked labelPosition="start" className="c" aria-label="Wifi" />,
    );
    expect(screen.getByRole("switch", { name: "Wifi" })).toHaveAttribute("aria-checked", "true");
    expect(container.firstChild).toHaveAttribute("data-label-position", "start");
    expect(container.firstChild).toHaveClass("mrd-switch", "c");
  });

  it("toggles with Space and Enter", async () => {
    const onCheckedChange = vi.fn();
    render(<Switch onCheckedChange={onCheckedChange}>Alerts</Switch>);
    await userEvent.tab();
    const sw = screen.getByRole("switch");
    expect(sw).toHaveFocus();
    await userEvent.keyboard(" ");
    expect(sw).toHaveAttribute("aria-checked", "true");
    await userEvent.keyboard("{Enter}");
    expect(sw).toHaveAttribute("aria-checked", "false");
    expect(onCheckedChange).toHaveBeenNthCalledWith(1, true);
    expect(onCheckedChange).toHaveBeenNthCalledWith(2, false);
  });

  it("respects controlled value and submits a hidden input", async () => {
    const onCheckedChange = vi.fn();
    const { container } = render(
      <Switch checked name="news" onCheckedChange={onCheckedChange}>
        News
      </Switch>,
    );
    await userEvent.click(screen.getByRole("switch"));
    expect(onCheckedChange).toHaveBeenCalledWith(false);
    expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "true");
    expect(container.querySelector('input[name="news"]')).toHaveValue("on");
  });

  it("has no axe violations", async () => {
    const { container } = render(<Switch defaultChecked>Sync</Switch>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
