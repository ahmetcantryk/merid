"use client";

import { useEffect, useRef, useState } from "react";
import { useDictionary } from "@/lib/i18n/client";

interface CopyButtonProps {
  readonly value: string;
  readonly label?: string;
  readonly className?: string;
}

export function CopyButton({ value, label, className = "copy-btn" }: CopyButtonProps) {
  const t = useDictionary().copy;
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setState("copied");
    } catch (error) {
      console.error("[docs] clipboard write failed", error);
      setState("failed");
    }
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setState("idle"), 1600);
  }

  const text = state === "copied" ? t.copied : state === "failed" ? t.failed : (label ?? t.copy);

  return (
    <button type="button" className={className} onClick={copy}>
      <span aria-live="polite">{text}</span>
    </button>
  );
}
