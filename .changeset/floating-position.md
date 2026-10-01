---
"@meridui/react": patch
---

Menus, popovers, selects, comboboxes, hover cards and tooltips open next to their trigger again. They were positioned with `transform`, which the open animation overrode, so outside the docs site they could appear in the top-left corner of the page. They are now placed with `left`/`top`.
