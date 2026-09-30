import { render } from "@testing-library/react";
import { axe } from "vitest-axe";
import { Shortcut } from "./Shortcut";
import { formatShortcut, keyLabel, matchesShortcut } from "./shortcut-keys";

const press = (key: string, mods: Partial<Record<"metaKey" | "ctrlKey" | "altKey" | "shiftKey", boolean>> = {}) => ({
  key,
  metaKey: false,
  ctrlKey: false,
  altKey: false,
  shiftKey: false,
  ...mods,
});

describe("Shortcut", () => {
  it("renders nested key caps with symbols hidden and full names for screen readers", () => {
    const { container } = render(<Shortcut keys={["mod", "shift", "k"]} platform="mac" />);
    const outer = container.querySelector("kbd.mrd-shortcut");
    expect(outer).toHaveAttribute("data-platform", "mac");
    const keys = Array.from(container.querySelectorAll(".mrd-shortcut__key")).map((k) => k.textContent);
    expect(keys).toEqual(["⌘", "⇧", "K"]);
    expect(container.querySelector(".mrd-shortcut__keys")).toHaveAttribute("aria-hidden", "true");
    expect(container.querySelector(".mrd-visually-hidden")).toHaveTextContent("Command + Shift + K");
  });

  it("uses Ctrl names on other platforms and accepts custom labels", () => {
    const { container } = render(
      <Shortcut keys={["mod", "shift", "p"]} platform="other" labels={{ "mod.other": "Kontrol", shift: "Üst karakter" }} joiner="artı" />,
    );
    expect(container.querySelector(".mrd-shortcut__keys")).toHaveTextContent("CtrlShiftP");
    expect(container.querySelector(".mrd-visually-hidden")).toHaveTextContent("Kontrol artı Üst karakter artı P");
  });

  it("forwards ref and className", () => {
    const ref = { current: null as HTMLElement | null };
    render(<Shortcut ref={ref} keys={["esc"]} className="x" size="sm" />);
    expect(ref.current).toHaveClass("mrd-kbd", "mrd-shortcut", "x");
    expect(ref.current).toHaveAttribute("data-size", "sm");
  });

  it("has no axe violations", async () => {
    const { container } = render(<p>Press <Shortcut keys={["mod", "k"]} /> to search.</p>);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("shortcut helpers", () => {
  it("formats per platform", () => {
    expect(formatShortcut(["mod", "k"], "mac")).toBe("⌘K");
    expect(formatShortcut(["mod", "k"], "other")).toBe("Ctrl+K");
    expect(formatShortcut(["alt", "arrowup"], "other")).toBe("Alt+↑");
  });

  it("names keys", () => {
    expect(keyLabel("alt", "mac")).toBe("Option");
    expect(keyLabel("alt", "other")).toBe("Alt");
    expect(keyLabel("f2", "other")).toBe("f2");
  });

  it("matches mod as meta on mac and ctrl elsewhere, with exact modifiers", () => {
    expect(matchesShortcut(press("k", { metaKey: true }), ["mod", "k"], "mac")).toBe(true);
    expect(matchesShortcut(press("k", { ctrlKey: true }), ["mod", "k"], "mac")).toBe(false);
    expect(matchesShortcut(press("k", { ctrlKey: true }), ["mod", "k"], "other")).toBe(true);
    expect(matchesShortcut(press("K", { ctrlKey: true, shiftKey: true }), ["mod", "k"], "other")).toBe(false);
    expect(matchesShortcut(press("K", { ctrlKey: true, shiftKey: true }), ["mod", "shift", "k"], "other")).toBe(true);
    expect(matchesShortcut(press("k"), ["mod", "k"], "other")).toBe(false);
    expect(matchesShortcut(press("?", { shiftKey: true }), ["?"], "other")).toBe(true);
    expect(matchesShortcut(press(" ", { ctrlKey: true }), ["ctrl", "space"], "other")).toBe(true);
    expect(matchesShortcut(press("k", { ctrlKey: true }), ["ctrl"], "other")).toBe(false);
  });
});
