import Link from "next/link";
import { MetricValue } from "@/components/ResultBand";
import { getCompanyPeriod } from "@/lib/career";
import { getMessages } from "@/lib/i18n";
import type { Locale } from "@/lib/locale";
import { getProjectDisplayTitle, type Project } from "@/lib/projects";
import { getLocalizedPath } from "@/lib/routes";
export function ProjectCard({ project, locale, variant = "default", index }: { project: Project; locale: Locale; variant?: "default" | "featured" | "archive"; index?: number }) {
  const copy = getMessages(locale).projects;
  const href = getLocalizedPath(locale, `/projects/${project.slug}/`);
  const period = getCompanyPeriod(project.company, locale);
  const card = variant === "featured" ? project.featuredCard : undefined;
  const result = card ? { value: card.headline, caption: card.caption } : project.results?.[project.featuredResult ?? 0];
  if (variant === "archive") return <article className="project-card project-card--archive">
    <Link href={href} className="project-archive-link" aria-label={getProjectDisplayTitle(project, locale)}>
      <span className="project-archive-index">{String(index ?? 1).padStart(2, "0")}</span>
      <div className="project-archive-copy"><h3>{project.title[locale]}</h3><p className="project-archive-intro">{project.oneLiner[locale]}</p></div>
      <span className="project-archive-company">{project.company}</span><span className="project-archive-period num">{period}</span><span aria-hidden="true">→</span>
    </Link>
  </article>;
  return <article className={`project-card project-card--${variant}`}>
    <Link href={href} className="project-card-link" aria-label={card?.title[locale] ?? getProjectDisplayTitle(project, locale)}>
      <header className="project-card-meta"><span>{project.company}</span>{period ? <span className="num">{period}</span> : null}</header>
      {result ? <div className="project-card-result"><p className="project-card-result__value"><MetricValue value={result.value[locale]} /></p><p>{result.caption[locale]}</p></div> : null}
      <div className="project-card-copy"><h3>{card?.title[locale] ?? project.title[locale]}</h3><p className="project-one-liner">{card?.description[locale] ?? project.oneLiner[locale]}</p></div>
      <div className="project-card-bottom"><p>{project.role}</p><span>{copy.card.viewCase}</span></div>
    </Link>
  </article>;
}
