import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { Field } from "../field/Field";
import { FileUpload } from "./FileUpload";
import { formatBytes, matchesAccept, validateFiles } from "./file-utils";

const file = (name: string, size = 10, type = "") => new File([new Uint8Array(size)], name, { type });
const fileInput = () => document.querySelector<HTMLInputElement>("input[type=file]")!;

describe("file-utils", () => {
  it("matches accept tokens", () => {
    expect(matchesAccept(file("a.PNG", 1, "image/png"), "image/*")).toBe(true);
    expect(matchesAccept(file("a.pdf", 1, "application/pdf"), ".png,.pdf")).toBe(true);
    expect(matchesAccept(file("a.txt", 1, "text/plain"), "image/*,application/pdf")).toBe(false);
    expect(matchesAccept(file("a.txt"), undefined)).toBe(true);
  });

  it("validates type, size and count", () => {
    const { accepted, rejected } = validateFiles([file("a.png", 5, "image/png"), file("b.png", 50, "image/png"), file("c.txt", 1)], 0, {
      accept: "image/*",
      maxSize: 10,
      multiple: true,
    });
    expect(accepted.map((f) => f.name)).toEqual(["a.png"]);
    expect(rejected.map((r) => r.reasons)).toEqual([["file-too-large"], ["file-invalid-type"]]);
    const limited = validateFiles([file("x"), file("y")], 1, { multiple: true, maxFiles: 2 });
    expect(limited.rejected[0]?.reasons).toEqual(["too-many-files"]);
  });

  it("formats sizes in a locale", () => {
    expect(formatBytes(1_500_000, "en-US")).toBe("1.5 MB");
    expect(formatBytes(512, "en-US")).toBe("512 byte");
  });
});

describe("FileUpload", () => {
  it("renders a dropzone with a browse button described by the hint", () => {
    render(<FileUpload description="PNG up to 2 MB" />);
    const button = screen.getByRole("button", { name: "Browse files" });
    expect(button).toHaveAccessibleDescription("PNG up to 2 MB");
    expect(screen.getByText("Drag and drop files here")).toBeInTheDocument();
    expect(fileInput()).not.toBeVisible();
  });

  it("the button opens the native picker", async () => {
    render(<FileUpload />);
    const click = vi.spyOn(fileInput(), "click");
    await userEvent.click(screen.getByRole("button", { name: "Browse files" }));
    expect(click).toHaveBeenCalled();
  });

  it("adds picked files, lists them and announces the count", async () => {
    const onValueChange = vi.fn();
    render(<FileUpload multiple onValueChange={onValueChange} locale="en-US" />);
    await userEvent.upload(fileInput(), [file("a.txt", 2000), file("b.txt")]);
    expect(onValueChange).toHaveBeenLastCalledWith([expect.objectContaining({ name: "a.txt" }), expect.objectContaining({ name: "b.txt" })]);
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    expect(screen.getByText("a.txt")).toBeInTheDocument();
    expect(screen.getByText("2 kB")).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("2 files selected");
  });

  it("removes a file and returns focus to the button", async () => {
    const onValueChange = vi.fn();
    render(<FileUpload multiple defaultValue={[file("a.txt"), file("b.txt")]} onValueChange={onValueChange} getRemoveLabel={(f) => `${f.name} dosyasını kaldır`} />);
    await userEvent.click(screen.getByRole("button", { name: "a.txt dosyasını kaldır" }));
    expect(onValueChange).toHaveBeenLastCalledWith([expect.objectContaining({ name: "b.txt" })]);
    expect(screen.getByRole("button", { name: "Browse files" })).toHaveFocus();
  });

  it("accepts dropped files, rejects invalid ones and shows the drag state", () => {
    const onValueChange = vi.fn();
    const onReject = vi.fn();
    render(<FileUpload accept="image/*" onValueChange={onValueChange} onReject={onReject} />);
    const zone = document.querySelector(".mrd-file-upload__dropzone")!;
    fireEvent.dragEnter(zone, { dataTransfer: { files: [] } });
    expect(document.querySelector(".mrd-file-upload")).toHaveAttribute("data-dragging", "true");
    fireEvent.drop(zone, { dataTransfer: { files: [file("a.png", 1, "image/png"), file("b.txt", 1, "text/plain")] } });
    expect(document.querySelector(".mrd-file-upload")).not.toHaveAttribute("data-dragging");
    expect(onValueChange).toHaveBeenLastCalledWith([expect.objectContaining({ name: "a.png" })]);
    expect(onReject).toHaveBeenCalledWith([expect.objectContaining({ reasons: ["file-invalid-type"] })]);
  });

  it("single mode replaces the file", async () => {
    const onValueChange = vi.fn();
    render(<FileUpload defaultValue={[file("old.txt")]} onValueChange={onValueChange} />);
    await userEvent.upload(fileInput(), file("new.txt"));
    expect(onValueChange).toHaveBeenLastCalledWith([expect.objectContaining({ name: "new.txt" })]);
  });

  it("custom labels and Field wiring", () => {
    render(
      <Field label="Avatar" error="Required" disabled>
        <FileUpload label="Dosyaları buraya sürükle" buttonLabel="Dosya seç" />
      </Field>,
    );
    // Label in name: the visible button text comes first, then the field label.
    const button = screen.getByRole("button", { name: "Dosya seç Avatar" });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByText("Dosyaları buraya sürükle")).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = render(<FileUpload multiple description="Up to 5 files" defaultValue={[file("a.txt")]} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
