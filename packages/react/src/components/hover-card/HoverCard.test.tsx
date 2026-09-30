import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { HoverCard } from "./HoverCard";

function Example({ onOpenChange }: { onOpenChange?: (o: boolean) => void }) {
  return (
    <HoverCard.Root openDelay={200} closeDelay={100} onOpenChange={onOpenChange}>
      <HoverCard.Trigger href="/people/ada">@ada</HoverCard.Trigger>
      <HoverCard.Content>
        <p>Ada Lovelace</p>
      </HoverCard.Content>
    </HoverCard.Root>
  );
}

describe("HoverCard", () => {
  afterEach(() => vi.useRealTimers());

  it("opens after the hover delay and closes after leaving", () => {
    vi.useFakeTimers();
    render(<Example />);
    const trigger = screen.getByRole("link", { name: "@ada" });
    fireEvent.pointerEnter(trigger, { pointerType: "mouse" });
    act(() => vi.advanceTimersByTime(150));
    expect(screen.queryByText("Ada Lovelace")).not.toBeInTheDocument();
    act(() => vi.advanceTimersByTime(60));
    expect(screen.getByText("Ada Lovelace")).toBeInTheDocument();
    expect(trigger).toHaveAttribute("data-state", "open");

    fireEvent.pointerLeave(trigger, { pointerType: "mouse" });
    act(() => vi.advanceTimersByTime(120));
    expect(screen.queryByText("Ada Lovelace")).not.toBeInTheDocument();
  });

  it("stays open while the pointer moves onto the card", () => {
    vi.useFakeTimers();
    render(<Example />);
    const trigger = screen.getByRole("link", { name: "@ada" });
    fireEvent.pointerEnter(trigger, { pointerType: "mouse" });
    act(() => vi.advanceTimersByTime(250));
    fireEvent.pointerLeave(trigger, { pointerType: "mouse" });
    fireEvent.pointerEnter(screen.getByText("Ada Lovelace").parentElement as HTMLElement);
    act(() => vi.advanceTimersByTime(500));
    expect(screen.getByText("Ada Lovelace")).toBeInTheDocument();
  });

  it("ignores touch hover", () => {
    vi.useFakeTimers();
    render(<Example />);
    fireEvent.pointerEnter(screen.getByRole("link", { name: "@ada" }), { pointerType: "touch" });
    act(() => vi.advanceTimersByTime(500));
    expect(screen.queryByText("Ada Lovelace")).not.toBeInTheDocument();
  });

  it("opens on keyboard focus and closes on Escape", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(<Example onOpenChange={onOpenChange} />);
    await user.tab();
    expect(await screen.findByText("Ada Lovelace")).toBeInTheDocument();
    await user.keyboard("{Escape}");
    expect(screen.queryByText("Ada Lovelace")).not.toBeInTheDocument();
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
  });

  it("supports asChild on the trigger", () => {
    render(
      <HoverCard.Root defaultOpen>
        <HoverCard.Trigger asChild>
          <button type="button">Profile</button>
        </HoverCard.Trigger>
        <HoverCard.Content>Card</HoverCard.Content>
      </HoverCard.Root>,
    );
    expect(screen.getByRole("button", { name: "Profile" })).toHaveAttribute("data-state", "open");
    expect(screen.getByText("Card")).toHaveClass("mrd-hover-card");
  });

  it("has no axe violations when open", async () => {
    render(
      <HoverCard.Root defaultOpen>
        <HoverCard.Trigger href="/people/ada">@ada</HoverCard.Trigger>
        <HoverCard.Content>Ada Lovelace</HoverCard.Content>
      </HoverCard.Root>,
    );
    expect(await axe(document.body, { rules: { region: { enabled: false } } })).toHaveNoViolations();
  });
});
