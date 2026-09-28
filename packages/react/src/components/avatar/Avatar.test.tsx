import { fireEvent, render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { Avatar, getInitials } from "./Avatar";
import { AvatarGroup } from "./AvatarGroup";

describe("Avatar", () => {
  it("shows initials when no image", () => {
    render(<Avatar name="Ada Lovelace" />);
    const avatar = screen.getByRole("img", { name: "Ada Lovelace" });
    expect(avatar).toHaveTextContent("AL");
    expect(avatar).toHaveAttribute("data-status", "fallback");
    expect(avatar).toHaveAttribute("data-size", "md");
  });

  it("renders the image and falls back on error", () => {
    const { container } = render(<Avatar name="Grace" src="/g.png" size="lg" className="c" />);
    const avatar = screen.getByRole("img", { name: "Grace" });
    expect(avatar).toHaveAttribute("data-status", "image");
    expect(avatar).toHaveClass("mrd-avatar", "c");
    fireEvent.error(container.querySelector("img") as HTMLImageElement);
    expect(avatar).toHaveAttribute("data-status", "fallback");
    expect(avatar).toHaveTextContent("G");
  });

  it("derives initials", () => {
    expect(getInitials("  mary  ann   smith ")).toBe("MS");
    expect(getInitials("")).toBe("");
  });

  it("groups with an overflow count and is not focusable", () => {
    render(
      <AvatarGroup aria-label="Team" max={2} size="sm">
        <Avatar name="A B" size="sm" />
        <Avatar name="C D" size="sm" />
        <Avatar name="E F" size="sm" />
        <Avatar name="G H" size="sm" />
      </AvatarGroup>,
    );
    expect(screen.getByRole("group", { name: "Team" })).toBeInTheDocument();
    expect(screen.getAllByRole("img")).toHaveLength(3);
    expect(screen.getByRole("img", { name: "2 more" })).toHaveTextContent("+2");
    expect(document.querySelectorAll("[tabindex]")).toHaveLength(0);
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <AvatarGroup aria-label="Team" max={1}>
        <Avatar name="Ada" />
        <Avatar name="Bob" />
      </AvatarGroup>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
