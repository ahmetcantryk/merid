import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { Stepper } from "./Stepper";

const steps = (
  <Stepper.Root current={1}>
    <Stepper.Step title="Details" />
    <Stepper.Step title="Payment" description="Card or transfer" />
    <Stepper.Step title="Confirm" />
  </Stepper.Root>
);

describe("Stepper", () => {
  it("derives step states from current", () => {
    render(steps);
    const items = screen.getAllByRole("listitem");
    expect(items.map((li) => li.getAttribute("data-state"))).toEqual(["complete", "current", "upcoming"]);
    expect(items[1]).toHaveAttribute("aria-current", "step");
    expect(items[0]).toHaveTextContent("Completed");
    expect(screen.getByRole("list", { name: "Progress" })).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = render(steps);
    expect(await axe(container)).toHaveNoViolations();
  });
});
