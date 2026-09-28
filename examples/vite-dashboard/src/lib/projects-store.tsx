import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { INITIAL_PROJECTS, type Project } from "./data";

export type NewProject = Pick<Project, "name" | "region"> & { description?: string };

interface ProjectsStore {
  projects: readonly Project[];
  create: (input: NewProject) => Project;
  remove: (ids: readonly string[]) => void;
}

const ProjectsContext = createContext<ProjectsStore | null>(null);

/** In-memory store standing in for an API. Every update returns a new array. */
export function ProjectsProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<readonly Project[]>(INITIAL_PROJECTS);

  const create = useCallback((input: NewProject) => {
    const project: Project = {
      id: `prj_${Date.now().toString(36)}`,
      name: input.name,
      region: input.region,
      owner: "Mara Lindqvist",
      status: "healthy",
      requests: 0,
      updated: new Date().toISOString(),
    };
    setProjects((current) => [project, ...current]);
    return project;
  }, []);

  const remove = useCallback((ids: readonly string[]) => {
    const drop = new Set(ids);
    setProjects((current) => current.filter((p) => !drop.has(p.id)));
  }, []);

  const value = useMemo(() => ({ projects, create, remove }), [projects, create, remove]);
  return <ProjectsContext.Provider value={value}>{children}</ProjectsContext.Provider>;
}

export function useProjects(): ProjectsStore {
  const store = useContext(ProjectsContext);
  if (!store) throw new Error("useProjects must be used inside <ProjectsProvider>");
  return store;
}
