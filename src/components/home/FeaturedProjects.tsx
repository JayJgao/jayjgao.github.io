"use client";

import Link from "next/link";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { getFeaturedProjects } from "@/lib/projects";
import { getMessages } from "@/lib/i18n";
import { getLocalizedPath } from "@/lib/routes";

export function FeaturedProjects() {
  const { locale } = useLocale();
  const featured = getFeaturedProjects();
  const messages = getMessages(locale);
  const copy = messages.home.featured;

  return (
    <section className="space-y-5 md:space-y-7">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <p className="section-kicker">{copy.sectionLabel}</p>
          <h2 className="editorial-title text-3xl md:text-5xl">{copy.title}</h2>
        </div>
        <Link href={getLocalizedPath(locale, "/projects/")} className="btn-secondary w-fit px-4 text-xs tracking-[0.12em] uppercase md:text-sm">
          {copy.viewAll}
        </Link>
      </div>

      <div className="grid gap-4 md:gap-5 md:grid-cols-2 xl:grid-cols-3">
        {featured.map((project) => (
          <ProjectCard key={project.slug} project={project} locale={locale} variant="featured" />
        ))}
      </div>
    </section>
  );
}
