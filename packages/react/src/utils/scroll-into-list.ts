/**
 * Scrolls `list` just enough to show `item`, honouring the list's `scroll-padding`.
 * Unlike `item.scrollIntoView()`, it never moves any other scroll container or the page:
 * a list that renders its active option below the fold must not drag the page down to it.
 */
export function scrollIntoList(list: HTMLElement, item: HTMLElement): void {
  const style = getComputedStyle(list);
  const listRect = list.getBoundingClientRect();
  const itemRect = item.getBoundingClientRect();
  const top = listRect.top + list.clientTop + (parseFloat(style.scrollPaddingTop) || 0);
  const bottom = listRect.top + list.clientTop + list.clientHeight - (parseFloat(style.scrollPaddingBottom) || 0);
  if (itemRect.top < top) list.scrollTop -= top - itemRect.top;
  else if (itemRect.bottom > bottom) list.scrollTop += itemRect.bottom - bottom;
}
