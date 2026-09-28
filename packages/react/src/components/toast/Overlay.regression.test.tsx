import { act, render, screen } from "@testing-library/react";
import type { AnchorHTMLAttributes } from "react";
import { Breadcrumb } from "../breadcrumb/Breadcrumb";
import { Portal } from "../portal/Portal";
import { Stepper } from "../stepper/Stepper";
import { Tooltip } from "../tooltip/Tooltip";
import { type ToastApi, ToastProvider, useToast } from "./Toast";

describe("Toast regressions", () => {
  it("re-toasting an existing id restarts the timer with the new duration", () => {
    vi.useFakeTimers();
    try {
      const holder: { api: ToastApi | null } = { api: null };
      function Grab() {
        holder.api = useToast();
        return null;
      }
      render(
        <ToastProvider>
          <Grab />
        </ToastProvider>,
      );
      act(() => {
        holder.api?.toast({ id: "sync", title: "Syncing", duration: 1000 });
      });
      act(() => {
        vi.advanceTimersByTime(900);
      });
      act(() => {
        holder.api?.toast({ id: "sync", title: "Synced", duration: 3000 });
      });
      act(() => {
        vi.advanceTimersByTime(2000);
      });
      // the old timer (100ms left) must not dismiss the replaced toast
      expect(screen.getByText("Synced")).toBeInTheDocument();
      act(() => {
        vi.advanceTimersByTime(1100);
      });
      expect(screen.queryByText("Synced")).not.toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });
});

describe("Portal regressions", () => {
  it("renders nothing while container is null (pending)", () => {
    render(
      <Portal container={null}>
        <span>Pending</span>
      </Portal>,
    );
    expect(screen.queryByText("Pending")).not.toBeInTheDocument();
  });
});

describe("Tooltip regressions", () => {
  it("portals into `container` when given", () => {
    const target = document.createElement("div");
    document.body.appendChild(target);
    render(
      <Tooltip content="Hint" defaultOpen container={target}>
        <button type="button">Help</button>
      </Tooltip>,
    );
    expect(target.querySelector("[role='tooltip']")).toHaveTextContent("Hint");
    target.remove();
  });
});

describe("Breadcrumb regressions", () => {
  it("Link accepts `as` for router links and forwards props", () => {
    function RouterLink({ to, ...rest }: { to: string } & AnchorHTMLAttributes<HTMLAnchorElement>) {
      return <a href={`/app${to}`} data-router="" {...rest} />;
    }
    render(
      <Breadcrumb.Root>
        <Breadcrumb.Item>
          <Breadcrumb.Link as={RouterLink} to="/docs">
            Docs
          </Breadcrumb.Link>
        </Breadcrumb.Item>
      </Breadcrumb.Root>,
    );
    const link = screen.getByRole("link", { name: "Docs" });
    expect(link).toHaveAttribute("href", "/app/docs");
    expect(link).toHaveAttribute("data-router");
    expect(link).toHaveClass("mrd-breadcrumb__link");
  });
});

describe("Stepper regressions", () => {
  it("string titles keep the full text in the title attribute", () => {
    render(
      <Stepper.Root current={0}>
        <Stepper.Step title="A very long step title that will truncate" />
        <Stepper.Step title={<em>Rich</em>} />
      </Stepper.Root>,
    );
    const title = screen.getByText("A very long step title that will truncate");
    expect(title).toHaveClass("mrd-stepper__title");
    expect(title).toHaveAttribute("title", "A very long step title that will truncate");
    expect(screen.getByText("Rich").closest(".mrd-stepper__title")).not.toHaveAttribute("title");
  });
});
