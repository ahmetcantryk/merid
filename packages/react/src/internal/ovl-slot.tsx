"use client";

import {
  Children,
  cloneElement,
  type CSSProperties,
  type HTMLAttributes,
  isValidElement,
  type ReactElement,
  type ReactNode,
  type Ref,
} from "react";
import { composeRefs } from "./ovl-compose-refs";
import { getElementRef, withRef } from "./ovl-with-ref";
import { cx } from "./ovl-cx";

type AnyProps = Record<string, unknown>;

export interface SlotProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
  ref?: Ref<HTMLElement>;
}

const HANDLER = /^on[A-Z]/;

/** Merges slot props onto child props: handlers compose (child first), className joins, style merges. */
export function mergeSlotProps(slotProps: AnyProps, childProps: AnyProps): AnyProps {
  const merged: AnyProps = { ...slotProps, ...childProps };
  for (const key of Object.keys(slotProps)) {
    const slotValue = slotProps[key];
    const childValue = childProps[key];
    if (HANDLER.test(key) && typeof slotValue === "function" && typeof childValue === "function") {
      merged[key] = (...args: unknown[]) => {
        (childValue as (...a: unknown[]) => void)(...args);
        (slotValue as (...a: unknown[]) => void)(...args);
      };
    } else if (key === "className") {
      merged[key] = cx(slotValue as string | undefined, childValue as string | undefined) || undefined;
    } else if (key === "style") {
      merged[key] = { ...(slotValue as CSSProperties), ...(childValue as CSSProperties) };
    } else if (childValue === undefined) {
      merged[key] = slotValue;
    }
  }
  return merged;
}

/**
 * Renders its single child element with the slot's props, ref, handlers and className merged in.
 * Powers `asChild` on triggers and close buttons.
 */
function SlotImpl({ children, ref, ...slotProps }: SlotProps) {
  const child = Children.only(children);
  if (!isValidElement(child)) {
    throw new Error("asChild expects a single React element child.");
  }
  const element = child as ReactElement<AnyProps>;
  const childRef = getElementRef<HTMLElement>(element);
  const props = mergeSlotProps(slotProps as AnyProps, element.props);
  props.ref = ref || childRef ? composeRefs(ref, childRef) : undefined;
  return cloneElement(element, props);
}

export const Slot = withRef("Slot", SlotImpl);
