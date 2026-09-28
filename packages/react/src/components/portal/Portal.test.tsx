import { render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { Portal } from "./Portal";

describe("Portal", () => {
  it("renders into document.body by default", () => {
    const { container } = render(
      <div>
        <Portal>
          <span>Portalled</span>
        </Portal>
      </div>,
    );
    const node = screen.getByText("Portalled");
    expect(container.contains(node)).toBe(false);
    expect(node.parentElement).toBe(document.body);
  });

  it("renders into a custom container", () => {
    const target = document.createElement("div");
    document.body.appendChild(target);
    render(
      <Portal container={target}>
        <span>Inside</span>
      </Portal>,
    );
    expect(target).toHaveTextContent("Inside");
    target.remove();
  });

  it("renders nothing on the server", () => {
    expect(
      renderToString(
        <Portal>
          <span>Server</span>
        </Portal>,
      ),
    ).toBe("");
  });
});
