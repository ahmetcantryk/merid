import { useEffect, useRef, useState } from "react";
import { Drawer, IconButton, Input, Kbd, Tooltip } from "@meridui/react";
import { Menu, Moon, Search, Sun } from "lucide-react";
import { useTheme } from "../lib/theme";
import { hrefFor, type Route } from "../lib/router";
import { AccountMenu } from "./AccountMenu";
import { AppNav } from "./nav";

export function AppHeader({ route }: { route: Route }) {
  const { theme, toggle } = useTheme();
  const [navOpen, setNavOpen] = useState(false);

  return (
    <header className="header">
      <Drawer.Root open={navOpen} onOpenChange={setNavOpen}>
        <Drawer.Trigger asChild>
          <IconButton className="header__menu" label="Open navigation" icon={<Menu size={18} />} />
        </Drawer.Trigger>
        <Drawer.Content side="left" size="sm">
          <Drawer.Close icon aria-label="Close navigation" />
          <Drawer.Title>Northwind Cloud</Drawer.Title>
          <AppNav route={route} onNavigate={() => setNavOpen(false)} />
        </Drawer.Content>
      </Drawer.Root>

      <GlobalSearch />

      <div className="header__actions">
        <Tooltip content={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}>
          <IconButton
            label="Toggle theme"
            aria-pressed={theme === "dark"}
            icon={theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            onClick={toggle}
          />
        </Tooltip>
        <AccountMenu />
      </div>
    </header>
  );
}

/** Enter jumps to Projects filtered by the query; "/" focuses the field from anywhere. */
function GlobalSearch() {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      const typing = target.closest("input, textarea, select, [contenteditable='true']");
      if (event.key === "/" && !typing) {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <form
      role="search"
      className="header__search"
      onSubmit={(event) => {
        event.preventDefault();
        const q = inputRef.current?.value.trim() ?? "";
        window.location.hash = hrefFor("projects", q ? { q } : undefined);
      }}
    >
      <Input
        ref={inputRef}
        type="search"
        aria-label="Search projects"
        placeholder="Search projects"
        leading={<Search size={16} />}
        trailing={<Kbd size="sm">/</Kbd>}
      />
    </form>
  );
}
