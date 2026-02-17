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
    <div className="space-y-10">
      <EraFilter value={filter} onChange={setFilter} />

      <section className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Featured</h2>
            <p className="mt-1 text-sm text-muted">핵심 성과가 선명한 프로젝트만 우선 배치했습니다.</p>
          </div>
          <span className="pill text-[11px]">{featured.length} projects</span>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {featured.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
        {featured.length === 0 ? (
          <div className="panel p-5 text-sm text-muted">선택한 Era에 해당하는 Featured 프로젝트가 없습니다.</div>
        ) : null}
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Archive</h2>
            <p className="mt-1 text-sm text-muted">축적된 실행 이력과 도메인 확장 트랙입니다.</p>
          </div>
          <span className="pill text-[11px]">{archive.length} projects</span>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {archive.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
        {archive.length === 0 ? (
          <div className="panel p-5 text-sm text-muted">선택한 Era에 해당하는 Archive 프로젝트가 없습니다.</div>
        ) : null}
      </section>
    </div>
  );
}
