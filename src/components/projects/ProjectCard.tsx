import Image from "next/image";
import Link from "next/link";
import { getEraLabel } from "@/lib/eras";
import { getMessages } from "@/lib/i18n";
import type { Locale } from "@/lib/locale";
import { getProjectDisplayTitle, type Project } from "@/lib/projects";
import { getLocalizedPath } from "@/lib/routes";
import type { EraId } from "@/types/content";

const eraChipClass: Record<EraId, string> = {
  1: "project-era-chip--era1",
  2: "project-era-chip--era2",
  3: "project-era-chip--era3",
};

export function ProjectCard({
  project,
  locale,
  variant = "default",
}: {
  project: Project;
  locale: Locale;
  variant?: "default" | "featured";
}) {
  const copy = getMessages(locale).projects;
  const featured = variant === "featured";
  const title = project.title[locale];
  const subtitle = project.subtitle[locale];
  const imageAlt = getProjectDisplayTitle(project, locale);

  return (
    <article className="panel project-card group flex h-full flex-col overflow-hidden p-0">
      <div className="relative">
        <Image
          src={project.thumbnail}
          alt={`${imageAlt} ${copy.card.thumbnailAltSuffix}`}
          width={1200}
          height={675}
          className={`project-image h-44 w-full object-cover ${featured ? "md:h-52" : "md:h-48"}`}
        />
        <div className="absolute left-3 top-3">
          <span className="metric-chip">
            {project.primaryMetric ?? `${copy.card.metricFallbackPrefix} ${project.contribution}%`}
          </span>
        </div>
        <div className="project-image-meta">
          <div className="project-image-meta-row">
            <span className={`project-era-chip ${eraChipClass[project.era]}`}>{getEraLabel(project.era, locale)}</span>
            <span className="project-company-chip">{project.company}</span>
          </div>
        </div>
      </div>
      <div className={`flex flex-1 flex-col justify-between p-4 md:p-5 ${featured ? "space-y-2.5 md:space-y-3" : "space-y-3"}`}>
        <Link
          href={getLocalizedPath(locale, `/projects/${project.slug}/`)}
          className={featured ? "block space-y-2.5 md:space-y-3" : "block space-y-3"}
        >
          <div className={featured ? "min-h-[2.7rem] md:min-h-[3rem]" : "min-h-[2.7rem]"}>
            <h3 className={`line-clamp-2 text-base font-semibold leading-snug text-white/95 ${featured ? "md:text-lg" : ""}`}>
              {title}
            </h3>
            {subtitle ? (
              <p className="mt-1 line-clamp-1 text-sm font-medium leading-snug text-white/72">{subtitle}</p>
            ) : null}
          </div>
          <p
            className={`line-clamp-2 text-sm leading-relaxed ${
              featured ? "min-h-[2.2rem] text-white/82" : "min-h-[2.45rem] text-white/78"
            }`}
          >
            {project.oneLiner[locale]}
          </p>
          <p className={`text-xs ${featured ? "text-white/68" : "text-white/66"}`}>{project.role}</p>

          <div className="flex flex-wrap gap-2">
            {project.tags.slice(0, featured ? 3 : 4).map((tag) => (
              <span key={tag} className="pill text-[11px]">
                {tag}
              </span>
            ))}
          </div>
        </Link>

        {featured ? null : (
          <div className="mt-auto flex items-center justify-between rounded-xl border border-white/12 bg-white/5 px-3 py-2">
            <span className="text-[11px] tracking-[0.14em] text-white/68 uppercase">{copy.card.contributionLabel}</span>
            <span className="text-sm font-semibold text-white/95">{project.contribution}%</span>
          </div>
        )}
      </div>
    </article>
  );
}
