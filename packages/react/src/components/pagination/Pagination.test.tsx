import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { getPageRange, Pagination } from "./Pagination";

describe("getPageRange", () => {
  it("lists every page when they fit", () => {
    expect(getPageRange(1, 5)).toEqual([1, 2, 3, 4, 5]);
    expect(getPageRange(4, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it("adds ellipses around the current window", () => {
    expect(getPageRange(1, 10)).toEqual([1, 2, 3, 4, 5, "ellipsis-end", 10]);
    expect(getPageRange(5, 10)).toEqual([1, "ellipsis-start", 4, 5, 6, "ellipsis-end", 10]);
    expect(getPageRange(10, 10)).toEqual([1, "ellipsis-start", 6, 7, 8, 9, 10]);
  });

  it("clamps out-of-range input", () => {
    expect(getPageRange(99, 3)).toEqual([1, 2, 3]);
    expect(getPageRange(1, 0)).toEqual([1]);
  });
});

describe("Pagination", () => {
  it("marks the current page and changes page", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(<Pagination pageCount={10} defaultPage={5} onPageChange={onPageChange} />);
    expect(screen.getByRole("navigation", { name: "Pagination" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Page 5" })).toHaveAttribute("aria-current", "page");
    await user.click(screen.getByRole("button", { name: "Next page" }));
    expect(onPageChange).toHaveBeenLastCalledWith(6);
    expect(screen.getByRole("button", { name: "Page 6" })).toHaveAttribute("aria-current", "page");
    await user.click(screen.getByRole("button", { name: "Page 10" }));
    expect(screen.getByRole("button", { name: "Next page" })).toBeDisabled();
  });

  it("disables Previous on the first page", () => {
    render(<Pagination pageCount={3} />);
    expect(screen.getByRole("button", { name: "Previous page" })).toBeDisabled();
  });

  it("renders links when getHref is given", () => {
    render(<Pagination pageCount={3} page={2} getHref={(p) => `?page=${p}`} />);
    expect(screen.getByRole("link", { name: "Page 3" })).toHaveAttribute("href", "?page=3");
    // the current page is plain text, not a link to itself
    expect(screen.queryByRole("link", { name: "Page 2" })).not.toBeInTheDocument();
    const current = document.querySelector("[aria-current='page']");
    expect(current?.tagName).toBe("SPAN");
    expect(current).toHaveTextContent("Page 2");
    expect(current).toHaveClass("mrd-pagination__page");
  });

  it("has no axe violations in link mode", async () => {
    const { container } = render(<Pagination pageCount={5} page={2} getHref={(p) => `?page=${p}`} />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("has no axe violations", async () => {
    const { container } = render(<Pagination pageCount={20} defaultPage={8} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
