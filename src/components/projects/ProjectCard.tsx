import Link from "next/link";
import { getEraLabel } from "@/lib/eras";
import { getMessages } from "@/lib/i18n";
import type { Locale } from "@/lib/locale";
import { getProjectDisplayTitle, type Project } from "@/lib/projects";
import { getLocalizedPath } from "@/lib/routes";

export function ProjectCard({
  project,
  locale,
  variant = "default",
  index,
}: {
  project: Project;
  locale: Locale;
  variant?: "default" | "featured" | "archive";
  index?: number;
}) {
  const copy = getMessages(locale).projects;
  const title = project.title[locale];
  const subtitle = project.subtitle[locale];
  const href = getLocalizedPath(locale, `/projects/${project.slug}/`);
  const displayTitle = getProjectDisplayTitle(project, locale);
  const number = String(index ?? project.showcaseOrder ?? project.era).padStart(2, "0");

  if (variant === "archive") {
    return (
      <article className="project-card project-card--archive">
        <Link href={href} className="project-archive-link" aria-label={displayTitle}>
          <span className="project-archive-index">{number}</span>
          <div className="project-archive-copy">
            <h3>{title}</h3>
            {subtitle ? <p className="project-subtitle">{subtitle}</p> : null}
            <p className="project-archive-intro">{project.oneLiner[locale]}</p>
          </div>
          <span className="project-archive-company">{project.company}</span>
          <span className="project-archive-era">{getEraLabel(project.era, locale)}</span>
          <span className="project-archive-arrow" aria-hidden="true">→</span>
        </Link>
      </article>
    );
  }

  const featured = variant === "featured";

  return (
    <article className={`project-card ${featured ? "project-card--featured" : "project-card--default"}`}>
      <Link href={href} className="project-card-link" aria-label={displayTitle}>
        <header className="project-card-meta">
          <span>{number}</span>
          <span>{project.company}</span>
          <span>{getEraLabel(project.era, locale)}</span>
        </header>

        <div className="project-card-copy">
          <h3>{title}</h3>
          {subtitle ? <p className="project-subtitle">{subtitle}</p> : null}
          <p className="project-one-liner">{project.oneLiner[locale]}</p>
        </div>

        <dl className="project-card-ledger">
          {project.primaryMetric ? (
            <div>
              <dt>{copy.card.highlightLabel}</dt>
              <dd>{project.primaryMetric}</dd>
            </div>
          ) : null}
          <div>
            <dt>Role</dt>
            <dd>{project.role}</dd>
          </div>
        </dl>

        <ul className="tag-list" aria-label="Tags">
          {project.tags.slice(0, featured ? 3 : 4).map((tag) => (
            <li key={tag} className="pill">{tag}</li>
          ))}
        </ul>
      </Link>
    </article>
  );
}
