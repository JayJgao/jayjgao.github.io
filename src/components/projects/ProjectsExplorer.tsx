"use client";

import { useMemo, useState } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { EraFilter } from "@/components/projects/EraFilter";
import { ProjectCard } from "@/components/projects/ProjectCard";
import type { EraFilterValue } from "@/lib/eras";
import { getMessages } from "@/lib/i18n";
import type { Project } from "@/lib/projects";

export function ProjectsExplorer({ projects }: { projects: Project[] }) {
  const { locale } = useLocale();
  const [filter, setFilter] = useState<EraFilterValue>("all");
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
    <div className="project-index">
      <header className="project-list-hero" data-project-section="hero">
        <div className="chapter-inner">
          <p className="section-kicker">{pageCopy.kicker}</p>
          <h1 className="page-display">{pageCopy.title}</h1>
          <p className="chapter-description">{pageCopy.description}</p>
        </div>
      </header>

      <div className="project-index__body">
        <EraFilter value={filter} onChange={setFilter} />

        <section className="project-group" data-project-section="featured" aria-labelledby="featured-projects-title">
          <header className="project-group__heading">
            <div>
              <h2 id="featured-projects-title" className="section-display">{copy.featuredTitle}</h2>
              <p>{copy.featuredDescription}</p>
            </div>
            <span className="pill">{featured.length} {messages.common.projectsUnit}</span>
          </header>
          <div className="featured-project-grid">
            {featured.map((project, index) => (
              <ProjectCard
                key={project.slug}
                project={project}
                locale={locale}
                variant="featured"
                index={index + 1}
              />
            ))}
          </div>
          {featured.length === 0 ? <p className="empty-state">{copy.emptyFeatured}</p> : null}
        </section>

        <section className="project-group" data-project-section="archive" aria-labelledby="archive-projects-title">
          <header className="project-group__heading">
            <div>
              <h2 id="archive-projects-title" className="section-display">{copy.archiveTitle}</h2>
              <p>{copy.archiveDescription}</p>
            </div>
            <span className="pill">{archive.length} {messages.common.projectsUnit}</span>
          </header>
          <div className="project-archive-list">
            {archive.map((project, index) => (
              <ProjectCard
                key={project.slug}
                project={project}
                locale={locale}
                variant="archive"
                index={featured.length + index + 1}
              />
            ))}
          </div>
          {archive.length === 0 ? <p className="empty-state">{copy.emptyArchive}</p> : null}
        </section>
      </div>
    </div>
  );
}
