---
"@meridui/react": minor
---

Form and input components, and translatable screen reader text.

- New components: `Combobox` (searchable, single or multiple, async options), `Calendar` (keyboard grid, min/max, disabled days, `Intl` locales with the locale's week start), `DatePicker` (typed field + calendar popover, single day or range), `Slider` (single or range, steps, keyboard, RTL), `NumberInput` (steppers, min/max/step, `Intl.NumberFormat` formatting and parsing), `Toggle`, `ToggleGroup` / `ToggleGroupItem`, `PinInput` (one-time codes, paste and autofill) and `FileUpload` (accessible dropzone with validation).
- Every screen reader string in the new components can be replaced through props (e.g. `previousMonthLabel`, `incrementLabel`, `getCellLabel`, `getRemoveLabel`, `getStatusText`).
- `ToastProvider` `dismissLabel`, `Link` `externalLabel` and `AvatarGroup` `formatOverflowLabel` replace hard-coded English text. Defaults are unchanged.
