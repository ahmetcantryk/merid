import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { axe } from "vitest-axe";
import { Button } from "./Button";

describe("Button", () => {
  it("renders a button with defaults", () => {
    render(<Button>Save</Button>);
    const button = screen.getByRole("button", { name: "Save" });
    expect(button).toHaveAttribute("type", "button");
    expect(button).toHaveAttribute("data-variant", "secondary");
    expect(button).toHaveAttribute("data-size", "md");
    expect(button).toHaveClass("mrd-button");
  });

  it("applies variant, size, className and forwards ref", () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <Button ref={ref} variant="primary" size="lg" className="extra">
        Go
      </Button>,
    );
    const button = screen.getByRole("button", { name: "Go" });
    expect(button).toHaveAttribute("data-variant", "primary");
    expect(button).toHaveAttribute("data-size", "lg");
    expect(button).toHaveClass("mrd-button", "extra");
    expect(ref.current).toBe(button);
  });

  it("activates with keyboard", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Press</Button>);
    await userEvent.tab();
    expect(screen.getByRole("button")).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await userEvent.keyboard(" ");
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it("is busy and inert while loading", async () => {
    const onClick = vi.fn();
    render(
      <Button loading onClick={onClick}>
        Send
      </Button>,
    );
    const button = screen.getByRole("button", { name: "Send" });
    expect(button).toHaveAttribute("aria-busy", "true");
    await userEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <Button variant="primary" leadingIcon={<svg />}>
        OK
      </Button>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
