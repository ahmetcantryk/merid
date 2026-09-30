import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { Slider } from "./Slider";

function mockTrack(width = 100) {
  const track = document.querySelector(".mrd-slider__track") as HTMLElement;
  track.getBoundingClientRect = () => ({ left: 0, right: width, width, top: 0, bottom: 4, height: 4, x: 0, y: 0, toJSON: () => ({}) });
  track.setPointerCapture = () => undefined;
  track.hasPointerCapture = () => true;
  track.releasePointerCapture = () => undefined;
  return track;
}

describe("Slider", () => {
  it("renders a labelled slider thumb with value attributes", () => {
    render(<Slider aria-label="Volume" defaultValue={[40]} />);
    const thumb = screen.getByRole("slider", { name: "Volume" });
    expect(thumb).toHaveAttribute("aria-valuenow", "40");
    expect(thumb).toHaveAttribute("aria-valuemin", "0");
    expect(thumb).toHaveAttribute("aria-valuemax", "100");
    expect(thumb).toHaveStyle({ insetInlineStart: "40%" });
  });

  it("moves with arrows, Page keys, Home and End", async () => {
    const onValueChange = vi.fn();
    const onValueCommit = vi.fn();
    render(<Slider aria-label="V" defaultValue={[50]} step={5} onValueChange={onValueChange} onValueCommit={onValueCommit} />);
    const thumb = screen.getByRole("slider");
    thumb.focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(onValueChange).toHaveBeenLastCalledWith([55]);
    expect(onValueCommit).toHaveBeenLastCalledWith([55]);
    await userEvent.keyboard("{ArrowDown}");
    expect(thumb).toHaveAttribute("aria-valuenow", "50");
    await userEvent.keyboard("{PageUp}");
    expect(thumb).toHaveAttribute("aria-valuenow", "100");
    await userEvent.keyboard("{Home}");
    expect(thumb).toHaveAttribute("aria-valuenow", "0");
    await userEvent.keyboard("{End}");
    expect(thumb).toHaveAttribute("aria-valuenow", "100");
  });

  it("flips horizontal arrows in RTL", async () => {
    render(
      <div dir="rtl" style={{ direction: "rtl" }}>
        <Slider aria-label="V" defaultValue={[50]} />
      </div>,
    );
    const thumb = screen.getByRole("slider");
    thumb.focus();
    await userEvent.keyboard("{ArrowLeft}");
    expect(thumb).toHaveAttribute("aria-valuenow", "51");
  });

  it("range thumbs cannot cross and keep minStepsBetweenThumbs apart", async () => {
    const onValueChange = vi.fn();
    render(<Slider defaultValue={[20, 30]} minStepsBetweenThumbs={5} onValueChange={onValueChange} name="price" />);
    const [low, high] = screen.getAllByRole("slider");
    expect(low).toHaveAccessibleName("Minimum");
    expect(high).toHaveAccessibleName("Maximum");
    expect(low).toHaveAttribute("aria-valuemax", "25");
    low!.focus();
    await userEvent.keyboard("{PageUp}");
    expect(low).toHaveAttribute("aria-valuenow", "25");
    const hidden = document.querySelectorAll("input[type=hidden][name='price[]']");
    expect(Array.from(hidden).map((i) => (i as HTMLInputElement).value)).toEqual(["25", "30"]);
  });

  it("uses thumbLabels and getValueText", () => {
    render(<Slider defaultValue={[10, 90]} thumbLabels={["En düşük", "En yüksek"]} getValueText={(v) => `${v} TL`} />);
    expect(screen.getByRole("slider", { name: "En düşük" })).toHaveAttribute("aria-valuetext", "10 TL");
    expect(screen.getByRole("slider", { name: "En yüksek" })).toHaveAttribute("aria-valuetext", "90 TL");
  });

  it("pointer press on the track moves the closest thumb and commits on release", () => {
    const onValueCommit = vi.fn();
    render(<Slider aria-label="V" defaultValue={[10, 90]} onValueCommit={onValueCommit} />);
    const track = mockTrack();
    fireEvent.pointerDown(track, { clientX: 70, button: 0, pointerId: 1 });
    fireEvent.pointerMove(track, { clientX: 75, pointerId: 1 });
    fireEvent.pointerUp(track, { clientX: 75, pointerId: 1 });
    expect(onValueCommit).toHaveBeenCalledWith([10, 75]);
  });

  it("ignores input when disabled", async () => {
    const onValueChange = vi.fn();
    render(<Slider aria-label="V" defaultValue={[10]} disabled onValueChange={onValueChange} />);
    const thumb = screen.getByRole("slider");
    expect(thumb).toHaveAttribute("aria-disabled", "true");
    expect(thumb).toHaveAttribute("tabindex", "-1");
    fireEvent.keyDown(thumb, { key: "ArrowRight" });
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <>
        <Slider aria-label="Volume" defaultValue={[30]} />
        <Slider defaultValue={[20, 80]} />
      </>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
