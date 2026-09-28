"use client";

import { useEffect, useState } from "react";
import { IconButton, Tooltip } from "@merid/react";
import { Moon, Sun } from "lucide-react";

type Theme = "light" | "dark";

function currentTheme(): Theme {
  const explicit = document.documentElement.dataset.theme;
  if (explicit === "light" || explicit === "dark") return explicit;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function ThemeToggle() {
  // null until mounted: the server cannot know the theme, so render a stable icon first.
  const [theme, setTheme] = useState<Theme | null>(null);
  useEffect(() => setTheme(currentTheme()), []);

  const toggle = () => {
    const next: Theme = (theme ?? currentTheme()) === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("nw-theme", next);
    } catch {
      // Storage may be blocked; the theme still applies to this page view.
    }
    setTheme(next);
  };

  const label = theme === "dark" ? "Switch to light theme" : "Switch to dark theme";
  return (
    <Tooltip content={label}>
      <IconButton label="Toggle theme" aria-pressed={theme === "dark"} icon={theme === "dark" ? <Sun size={18} /> : <Moon size={18} />} onClick={toggle} />
    </Tooltip>
  );
}
