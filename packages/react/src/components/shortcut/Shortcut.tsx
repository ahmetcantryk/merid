"use client";

import { type HTMLAttributes, type Ref, useSyncExternalStore } from "react";
import { cx } from "../../internal/ovl-cx";
import { withRef } from "../../internal/ovl-with-ref";
import {
  detectPlatform,
  keyLabel,
  keySymbol,
  type ShortcutKeyLabels,
  type ShortcutPlatform,
} from "./shortcut-keys";

const subscribe = () => () => undefined;

/** The detected platform after hydration; `"other"` on the server and during hydration. */
export function usePlatform(): ShortcutPlatform {
  return useSyncExternalStore(subscribe, detectPlatform, () => "other");
}

export interface ShortcutProps extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  /** Keys pressed together, e.g. `["mod", "k"]`. `mod` is ⌘ on macOS and Ctrl elsewhere. */
  keys: readonly string[];
  /** Force a platform; defaults to detecting it after hydration (`"other"` during SSR). */
  platform?: ShortcutPlatform | "auto";
  /** Key cap size. Defaults to `md`. */
  size?: "sm" | "md";
  /** Spoken key names, merged over the English defaults (`{ shift: "Üst karakter" }`). Keys ending in `.mac` / `.other` apply to one platform. */
  labels?: ShortcutKeyLabels;
  /** Word read between keys by screen readers. Defaults to `"+"`. */
  joiner?: string;
  /** Forwarded ref to the outer `<kbd>`. */
  ref?: Ref<HTMLElement>;
}

/**
 * A key combination as nested `<kbd>` caps (the HTML pattern for a chord). Symbols are shown
 * visually; screen readers hear the full key names instead ("Command + K").
 */
function ShortcutImpl({
  keys,
  platform: platformProp = "auto",
  size = "md",
  labels,
  joiner = "+",
  className,
  ref,
  ...rest
}: ShortcutProps) {
  const detected = usePlatform();
  const platform = platformProp === "auto" ? detected : platformProp;
  const spoken = keys.map((key) => keyLabel(key, platform, labels)).join(` ${joiner} `);
  return (
    <kbd ref={ref} className={cx("mrd-kbd", "mrd-shortcut", className)} data-size={size} data-platform={platform} {...rest}>
      <span className="mrd-shortcut__keys" aria-hidden="true">
        {keys.map((key, index) => (
          <kbd key={`${key}-${index}`} className="mrd-shortcut__key">
            {keySymbol(key, platform)}
          </kbd>
        ))}
      </span>
      <span className="mrd-visually-hidden">{spoken}</span>
    </kbd>
  );
}

export const Shortcut = withRef("Shortcut", ShortcutImpl);
