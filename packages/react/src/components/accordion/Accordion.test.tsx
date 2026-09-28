import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { Accordion, type AccordionRootProps } from "./Accordion";

function Faq(props: Partial<AccordionRootProps>) {
  const rootProps = { type: "single", ...props } as AccordionRootProps;
  return (
    <Accordion.Root {...rootProps}>
      <Accordion.Item value="one">
        <Accordion.Trigger>What is it?</Accordion.Trigger>
        <Accordion.Content>A library.</Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="two">
        <Accordion.Trigger>Is it free?</Accordion.Trigger>
        <Accordion.Content>Yes, MIT.</Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="three" disabled>
        <Accordion.Trigger>Locked</Accordion.Trigger>
        <Accordion.Content>Nope.</Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
}

describe("Accordion", () => {
  it("renders heading-wrapped buttons controlling regions", async () => {
    const user = userEvent.setup();
    render(<Faq />);
    const trigger = screen.getByRole("button", { name: "What is it?" });
    expect(trigger.parentElement?.tagName).toBe("H3");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("region", { name: "What is it?" })).toHaveTextContent("A library.");
  });

  it("single: opening one closes the other; collapsible by default", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Faq onValueChange={onValueChange as never} />);
    await user.click(screen.getByRole("button", { name: "What is it?" }));
    await user.click(screen.getByRole("button", { name: "Is it free?" }));
    expect(screen.getByRole("button", { name: "What is it?" })).toHaveAttribute("aria-expanded", "false");
    expect(onValueChange).toHaveBeenLastCalledWith("two");
    await user.click(screen.getByRole("button", { name: "Is it free?" }));
    expect(onValueChange).toHaveBeenLastCalledWith("");
  });

  it("single non-collapsible keeps the open item", async () => {
    const user = userEvent.setup();
    render(<Faq defaultValue="one" collapsible={false} />);
    await user.click(screen.getByRole("button", { name: "What is it?" }));
    expect(screen.getByRole("button", { name: "What is it?" })).toHaveAttribute("aria-expanded", "true");
  });

  it("multiple: items open independently", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Faq type="multiple" onValueChange={onValueChange as never} />);
    await user.click(screen.getByRole("button", { name: "What is it?" }));
    await user.click(screen.getByRole("button", { name: "Is it free?" }));
    expect(onValueChange).toHaveBeenLastCalledWith(["one", "two"]);
  });

  it("disabled items do not toggle; arrows move between headers", async () => {
    const user = userEvent.setup();
    render(<Faq />);
    const locked = screen.getByRole("button", { name: "Locked" });
    await user.click(locked);
    expect(locked).toHaveAttribute("aria-expanded", "false");
    screen.getByRole("button", { name: "What is it?" }).focus();
    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("button", { name: "Is it free?" })).toHaveFocus();
    await user.keyboard("{ArrowUp}{ArrowUp}");
    // disabled headers are skipped by arrows (consistent with Tabs/Menu), so Up wraps to "Is it free?"
    expect(screen.getByRole("button", { name: "Is it free?" })).toHaveFocus();
    expect(locked).toHaveAttribute("data-disabled");
    await user.keyboard("{End}");
    expect(screen.getByRole("button", { name: "Is it free?" })).toHaveFocus();
    await user.keyboard("{Home}");
    expect(screen.getByRole("button", { name: "What is it?" })).toHaveFocus();
  });

  it("has no axe violations", async () => {
    const { container } = render(<Faq defaultValue="one" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
