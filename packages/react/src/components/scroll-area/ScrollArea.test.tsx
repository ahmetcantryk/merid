import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { ScrollArea } from "./ScrollArea";

function mockOverflow(overflowing: boolean) {
  const height = vi.spyOn(HTMLElement.prototype, "scrollHeight", "get").mockReturnValue(overflowing ? 400 : 100);
  const client = vi.spyOn(HTMLElement.prototype, "clientHeight", "get").mockReturnValue(100);
  return () => {
    height.mockRestore();
    client.mockRestore();
  };
}

describe("ScrollArea", () => {
  it("is a plain native scroll container when content fits", () => {
    const restore = mockOverflow(false);
    render(<ScrollArea data-testid="area" maxHeight={100}>Short</ScrollArea>);
    const area = screen.getByTestId("area");
    expect(area).toHaveClass("mrd-scroll-area");
    expect(area).toHaveAttribute("data-orientation", "vertical");
    expect(area).toHaveStyle({ maxHeight: "100px" });
    expect(area).not.toHaveAttribute("tabindex");
    expect(area).not.toHaveAttribute("role");
    restore();
  });

  it("becomes a focusable, labelled region when it overflows with nothing focusable inside", () => {
    const restore = mockOverflow(true);
    render(<ScrollArea label="Release notes">Long text</ScrollArea>);
    const region = screen.getByRole("region", { name: "Release notes" });
    expect(region).toHaveAttribute("tabindex", "0");
    restore();
  });

  it("stays out of the tab order when it holds focusable content", () => {
    const restore = mockOverflow(true);
    render(
      <ScrollArea data-testid="area">
        <a href="#one">One</a>
      </ScrollArea>,
    );
    expect(screen.getByTestId("area")).not.toHaveAttribute("tabindex");
    restore();
  });

  it("forwards ref and sets orientation / autoHide hooks", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<ScrollArea ref={ref} orientation="horizontal" autoHide>Row</ScrollArea>);
    expect(ref.current).toHaveAttribute("data-orientation", "horizontal");
    expect(ref.current).toHaveAttribute("data-autohide", "true");
  });

  it("has no axe violations as a region", async () => {
    const restore = mockOverflow(true);
    const { container } = render(<ScrollArea>Long text</ScrollArea>);
    expect(await axe(container)).toHaveNoViolations();
    restore();
  });
});
