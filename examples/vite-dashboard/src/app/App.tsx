import { ToastProvider } from "@meridui/react";
import { ProjectsProvider } from "../lib/projects-store";
import { useHashRoute, type Route } from "../lib/router";
import { OverviewPage } from "../pages/OverviewPage";
import { ProjectsPage } from "../pages/ProjectsPage";
import { SettingsPage } from "../pages/settings/SettingsPage";
import { AppShell } from "./AppShell";

const PAGES: Record<Route, () => React.JSX.Element> = {
  overview: OverviewPage,
  projects: ProjectsPage,
  settings: SettingsPage,
};

export function App() {
  const { route, hash } = useHashRoute();
  const Page = PAGES[route];

  return (
    <ToastProvider>
      <ProjectsProvider>
        <AppShell route={route}>
          {/* Keyed by hash so query-driven pages (e.g. ?q=) start from the URL state. */}
          <Page key={hash} />
        </AppShell>
      </ProjectsProvider>
    </ToastProvider>
  );
}
