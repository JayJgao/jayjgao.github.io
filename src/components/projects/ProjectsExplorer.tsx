"use client";

import { useMemo, useState } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import type { Project } from "@/lib/projects";
import { EraFilter } from "@/components/projects/EraFilter";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { getMessages } from "@/lib/i18n";

export function ProjectsExplorer({
  projects,
}: {
  projects: Project[];
}) {
  const { locale } = useLocale();
  const [filter, setFilter] = useState<"all" | "1" | "2" | "3">("all");
  const messages = getMessages(locale);
  const pageCopy = messages.projects.page;
  const copy = messages.projects.explorer;

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
    <div className="space-y-10 md:space-y-12">
      <header className="space-y-3">
        <p className="section-kicker">{pageCopy.kicker}</p>
        <h1 className="editorial-title text-5xl md:text-6xl">{pageCopy.title}</h1>
        <p className="max-w-2xl text-base leading-relaxed text-white/72 md:text-lg whitespace-pre-line">
          {pageCopy.description}
        </p>
      </header>

      <EraFilter value={filter} onChange={setFilter} />

      <section className="space-y-4 md:space-y-5">
        <div className="flex flex-wrap items-end justify-between gap-2.5">
          <div>
            <h2 className="editorial-title text-2xl md:text-4xl">{copy.featuredTitle}</h2>
            <p className="mt-1.5 text-sm text-white/72">{copy.featuredDescription}</p>
          </div>
          <span className="pill bg-white/8 text-[11px] text-white/78">
            {featured.length} {messages.common.projectsUnit}
          </span>
        </div>
        <div className="grid gap-4 md:gap-5 md:grid-cols-2 xl:grid-cols-3">
          {featured.map((project) => (
            <ProjectCard key={project.slug} project={project} locale={locale} />
          ))}
        </div>
        {featured.length === 0 ? (
          <div className="panel p-5 text-sm text-white/68">{copy.emptyFeatured}</div>
        ) : null}
      </section>

      <section className="space-y-4 md:space-y-5">
        <div className="flex flex-wrap items-end justify-between gap-2.5">
          <div>
            <h2 className="editorial-title text-2xl md:text-4xl">{copy.archiveTitle}</h2>
            <p className="mt-1.5 text-sm text-white/72">{copy.archiveDescription}</p>
          </div>
          <span className="pill bg-white/8 text-[11px] text-white/78">
            {archive.length} {messages.common.projectsUnit}
          </span>
        </div>
        <div className="grid gap-4 md:gap-5 md:grid-cols-2 xl:grid-cols-3">
          {archive.map((project) => (
            <ProjectCard key={project.slug} project={project} locale={locale} />
          ))}
        </div>
        {archive.length === 0 ? (
          <div className="panel p-5 text-sm text-white/68">{copy.emptyArchive}</div>
        ) : null}
      </section>
    </div>
  );
}
