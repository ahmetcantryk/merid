import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { ToastProvider, useToast } from "./Toast";

function Emitter({ duration }: { duration?: number }) {
  const { toast, dismiss } = useToast();
  return (
    <>
      <button type="button" onClick={() => toast({ title: "Saved", description: "All good.", tone: "success", duration })}>
        Save
      </button>
      <button type="button" onClick={() => dismiss()}>
        Clear
      </button>
    </>
  );
}

describe("Toast", () => {
  it("renders into a polite live region with tone", async () => {
    const user = userEvent.setup();
    render(
      <ToastProvider>
        <Emitter />
      </ToastProvider>,
    );
    const region = screen.getByRole("region", { name: "Notifications" });
    expect(region.querySelector("[aria-live='polite']")).not.toBeNull();
    await user.click(screen.getByRole("button", { name: "Save" }));
    const item = screen.getByText("Saved").closest("li");
    expect(item).toHaveAttribute("data-tone", "success");
    expect(item).toHaveTextContent("All good.");
  });

  it("dismisses via the close button and dismiss()", async () => {
    const user = userEvent.setup();
    render(
      <ToastProvider>
        <Emitter />
      </ToastProvider>,
    );
    await user.click(screen.getByRole("button", { name: "Save" }));
    await user.click(screen.getByRole("button", { name: "Dismiss notification" }));
    expect(screen.queryByText("Saved")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Save" }));
    await user.click(screen.getByRole("button", { name: "Clear" }));
    expect(screen.queryByText("Saved")).not.toBeInTheDocument();
  });

  it("localises the close button with dismissLabel", async () => {
    const user = userEvent.setup();
    render(
      <ToastProvider label="Bildirimler" dismissLabel="Bildirimi kapat">
        <Emitter />
      </ToastProvider>,
    );
    expect(screen.getByRole("region", { name: "Bildirimler" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Save" }));
    await user.click(screen.getByRole("button", { name: "Bildirimi kapat" }));
    expect(screen.queryByText("Saved")).not.toBeInTheDocument();
  });

  it("auto-dismisses and pauses while hovered", () => {
    vi.useFakeTimers();
    try {
      render(
        <ToastProvider duration={1000}>
          <Emitter />
        </ToastProvider>,
      );
      fireEvent.click(screen.getByRole("button", { name: "Save" }));
      const item = screen.getByText("Saved").closest("li")!;
      act(() => {
        vi.advanceTimersByTime(600);
      });
      fireEvent.pointerEnter(item);
      act(() => {
        vi.advanceTimersByTime(2000);
      });
      expect(screen.getByText("Saved")).toBeInTheDocument();
      fireEvent.pointerLeave(item);
      act(() => {
        vi.advanceTimersByTime(300);
      });
      expect(screen.getByText("Saved")).toBeInTheDocument();
      act(() => {
        vi.advanceTimersByTime(200);
      });
      expect(screen.queryByText("Saved")).not.toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });

  it("useToast throws outside the provider", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => undefined);
    expect(() => render(<Emitter />)).toThrow(/ToastProvider/);
    spy.mockRestore();
  });

  it("has no axe violations", async () => {
    const user = userEvent.setup();
    render(
      <ToastProvider>
        <main>
          <Emitter />
        </main>
      </ToastProvider>,
    );
    await user.click(screen.getByRole("button", { name: "Save" }));
    expect(await axe(document.body)).toHaveNoViolations();
  });
});
