import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { Alert } from "./Alert";

describe("Alert", () => {
  it("renders an info status by default", () => {
    render(<Alert title="Heads up">Maintenance tonight.</Alert>);
    const alert = screen.getByRole("status");
    expect(alert).toHaveAttribute("data-tone", "info");
    expect(alert).toHaveTextContent("Heads up");
    expect(alert).toHaveTextContent("Maintenance tonight.");
  });

  it("uses role=alert for danger and supports className / hidden icon", () => {
    const { container } = render(
      <Alert tone="danger" icon={null} className="c">
        Payment failed
      </Alert>,
    );
    const alert = screen.getByRole("alert");
    expect(alert).toHaveAttribute("data-tone", "danger");
    expect(alert).toHaveClass("mrd-alert", "c");
    expect(container.querySelector(".mrd-alert__icon")).toBeNull();
  });

  it("can be a plain note and hosts a keyboard-reachable action", async () => {
    const onClick = vi.fn();
    render(
      <Alert
        tone="success"
        live="off"
        action={
          <button type="button" onClick={onClick}>
            Undo
          </button>
        }
      >
        Saved
      </Alert>,
    );
    expect(screen.queryByRole("status")).toBeNull();
    await userEvent.tab();
    await userEvent.keyboard("{Enter}");
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <Alert tone="warning" title="Check">
        Almost out of quota.
      </Alert>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
