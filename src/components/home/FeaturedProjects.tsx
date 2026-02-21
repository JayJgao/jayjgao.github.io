"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getFeaturedProjects } from "@/lib/projects";
import { getMessages } from "@/lib/i18n";

const eraChipClass: Record<number, string> = {
  1: "project-era-chip--era1",
  2: "project-era-chip--era2",
  3: "project-era-chip--era3",
};

export function FeaturedProjects() {
  const { locale } = useLocale();
  const featured = getFeaturedProjects();
  const messages = getMessages(locale);
  const copy = messages.home.featured;
  const eraChipLabel: Record<number, string> = {
    1: messages.projects.eras.era1,
    2: messages.projects.eras.era2,
    3: messages.projects.eras.era3,
  };

  return (
    <section className="space-y-5 md:space-y-7">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <p className="section-kicker">{copy.sectionLabel}</p>
          <h2 className="editorial-title text-3xl md:text-5xl">{copy.title}</h2>
        </div>
        <Link href="/projects" className="btn-secondary w-fit px-4 text-xs tracking-[0.12em] uppercase md:text-sm">
          {copy.viewAll}
        </Link>
      </div>

      <div className="grid gap-4 md:gap-5 md:grid-cols-2 xl:grid-cols-3">
        {featured.map((project) => (
          <article key={project.slug} className="panel project-card group flex h-full flex-col overflow-hidden p-0">
            <div className="relative">
              <Image
                src={project.thumbnail}
                alt={`${project.title[locale]} ${messages.projects.card.thumbnailAltSuffix}`}
                width={1200}
                height={675}
                className="project-image h-44 w-full object-cover md:h-52"
              />
              <div className="absolute left-3 top-3">
                <span className="metric-chip">
                  {project.primaryMetric ?? `${copy.metricFallbackPrefix} ${project.contribution}%`}
                </span>
              </div>
              <div className="project-image-meta">
                <div className="project-image-meta-row">
                  <span className={`project-era-chip ${eraChipClass[project.era]}`}>{eraChipLabel[project.era]}</span>
                  <span className="project-company-chip">{project.company}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-1 flex-col justify-between space-y-2.5 p-4 md:space-y-3 md:p-5">
              <Link href={`/projects/${project.slug}`} className="block space-y-2.5 md:space-y-3">
                <h3 className="line-clamp-2 min-h-[2.7rem] text-base font-semibold leading-snug text-white/95 md:min-h-[3rem] md:text-lg">
                  {project.title[locale]}
                </h3>
                <p className="line-clamp-2 min-h-[2.2rem] text-sm leading-relaxed text-white/82">
                  {project.oneLiner[locale]}
                </p>
                <p className="text-xs text-white/68">{project.role}</p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="pill text-[11px]">
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
