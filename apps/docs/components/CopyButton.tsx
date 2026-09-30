"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { isInstallCommand, track, type AnalyticsEvents } from "@/lib/analytics";
import { stripLocale } from "@/lib/i18n/config";
import { useDictionary } from "@/lib/i18n/client";

type InstallLocation = AnalyticsEvents["copy_install"]["location"];

interface CopyButtonProps {
  readonly value: string;
  readonly label?: string;
  readonly className?: string;
  /** Where an install command was copied from; derived from the URL when omitted. */
  readonly eventLocation?: InstallLocation;
}

function locationFor(pathname: string): InstallLocation {
  const path = stripLocale(pathname);
  if (path.startsWith("/blog")) return "blog";
  if (path.startsWith("/compare")) return "compare";
  if (path === "/") return "hero";
  return "docs";
}

export function CopyButton({ value, label, className = "copy-btn", eventLocation }: CopyButtonProps) {
  const t = useDictionary().copy;
  const pathname = usePathname() ?? "/";
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setState("copied");
      if (isInstallCommand(value)) {
        const command = value.trim().split("\n")[0] ?? value;
        track("copy_install", { command, location: eventLocation ?? locationFor(pathname), path: pathname });
      }
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
