"use client";

import Link from "next/link";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { getMessages } from "@/lib/i18n";
import { getFeaturedProjects } from "@/lib/projects";
import { getLocalizedPath } from "@/lib/routes";

export function FeaturedProjects() {
  const { locale } = useLocale();
  const featured = getFeaturedProjects();
  const copy = getMessages(locale).home.featured;

  return (
    <section className="featured-chapter">
      <header className="featured-heading">
        <div>
          <p className="section-kicker">{copy.sectionLabel}</p>
          <h2 className="section-display">{copy.title}</h2>
        </div>
        <Link href={getLocalizedPath(locale, "/projects/")} className="btn-on-cobalt">
          {copy.viewAll}
        </Link>
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
    </section>
  );
}
