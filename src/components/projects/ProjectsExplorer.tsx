"use client";

import { useMemo, useState } from "react";
import type { Project } from "@/lib/projects";
import { EraFilter } from "@/components/projects/EraFilter";
import { ProjectCard } from "@/components/projects/ProjectCard";

export function ProjectsExplorer({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<"all" | "1" | "2" | "3">("all");

  const featured = useMemo(() => {
    const base = projects.filter((project) => project.featured);
    if (filter === "all") return base;
    return base.filter((project) => String(project.era) === filter);
  }, [projects, filter]);

  const archive = useMemo(() => {
    const base = projects.filter((project) => !project.featured);
    if (filter === "all") return base;
    return base.filter((project) => String(project.era) === filter);
  }, [projects, filter]);

  return (
    <div className="space-y-8">
      <EraFilter value={filter} onChange={setFilter} />

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Featured</h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {featured.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Archive</h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {archive.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </section>
    </div>
  );
}
