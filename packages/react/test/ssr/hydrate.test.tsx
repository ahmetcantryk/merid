import { act } from "react";
import { hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { componentCases } from "../fixtures";

const HYDRATED = [
  "Dialog",
  "Dialog (open)",
  "AlertDialog (open)",
  "Drawer",
  "Popover",
  "Select",
  "DropdownMenu",
  "Tooltip",
  "Tabs",
  "Accordion",
  "Field",
  "RadioGroup",
  "ToastProvider",
  "Calendar",
  "Combobox",
  "DatePicker",
  "FileUpload",
  "NumberInput",
  "PinInput",
  "Slider",
  "Toggle",
  "ToggleGroup",
];

describe("hydration (jsdom)", () => {
  for (const name of HYDRATED) {
    it(`hydrates <${name}> without mismatch`, async () => {
      const make = componentCases[name];
      if (!make) throw new Error(`no fixture for ${name}`);
      const container = document.createElement("div");
      container.innerHTML = renderToString(make());
      document.body.appendChild(container);
      const errors: unknown[] = [];
      const spy = vi.spyOn(console, "error").mockImplementation((...args) => {
        errors.push(args.map(String).join(" "));
      });
      const root = await act(async () =>
        hydrateRoot(container, make(), { onRecoverableError: (error) => errors.push(String(error)) }),
      );
      spy.mockRestore();
      expect(errors).toEqual([]);
      await act(async () => root.unmount());
      container.remove();
    });
  }
});
