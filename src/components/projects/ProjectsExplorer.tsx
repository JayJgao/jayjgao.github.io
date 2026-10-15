"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { CompanyFilter } from "@/components/projects/CompanyFilter";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { getMessages } from "@/lib/i18n";
import { COMPANY_FILTER_KEY, restoreCompanyFilter, type Project } from "@/lib/projects";

export function ProjectsExplorer({ projects }: { projects: Project[] }) {
  const { locale } = useLocale();
  const [filter, setFilter] = useState<string>("all");
  useEffect(() => {
    try { setFilter(restoreCompanyFilter(window.sessionStorage)); } catch { /* Storage can be unavailable. */ }
  }, []);
  function selectCompany(value: string) {
    setFilter(value);
    try { window.sessionStorage.setItem(COMPANY_FILTER_KEY, value); } catch { /* Filtering still works without persistence. */ }
  }
  const messages = getMessages(locale);
  const pageCopy = messages.projects.page;
  const copy = messages.projects.explorer;

  const featured = useMemo(() => {
    const base = projects.filter((project) => project.featured);
    if (filter === "all") return base;
    return base.filter((project) => project.company === filter);
  }, [projects, filter]);

  const archive = useMemo(() => {
    const base = projects.filter((project) => !project.featured);
    if (filter === "all") return base;
    return base.filter((project) => project.company === filter);
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
        <CompanyFilter value={filter} onChange={selectCompany} />

        <section className="project-group" data-project-section="featured" aria-labelledby="featured-projects-title">
          <header className="project-group__heading">
            <div>
              <h2 id="featured-projects-title" className="section-display">{copy.featuredTitle}</h2>
              <p>{copy.featuredDescription}</p>
            </div>
            <span className="tag"><span className="num">{featured.length}</span> {messages.common.projectsUnit}</span>
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
            <span className="tag"><span className="num">{archive.length}</span> {messages.common.projectsUnit}</span>
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
