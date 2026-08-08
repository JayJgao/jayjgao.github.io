"use client";

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getEraLabel } from "@/lib/eras";
import { getMessages } from "@/lib/i18n";
import type { Locale } from "@/lib/locale";
import { getProjectDisplayTitle, type Project } from "@/lib/projects";
import { getLocalizedPath } from "@/lib/routes";

export function CaseStudy({
  project,
  content,
  contentLocale,
  prev,
  next,
}: {
  project: Project;
  content: ReactNode;
  contentLocale: Locale;
  prev?: Project;
  next?: Project;
}) {
  const { locale } = useLocale();
  const messages = getMessages(locale);
  const copy = messages.projects.caseStudy;
  const subtitle = project.subtitle[locale];

  return (
    <article className="project-detail">
      <header className="project-detail-hero" data-project-section="hero">
        <div className="chapter-inner">
          <p className="section-kicker">{getEraLabel(project.era, locale)}</p>
          <h1 className="page-display">{project.title[locale]}</h1>
          {subtitle ? <p className="project-detail-subtitle">{subtitle}</p> : null}
          <p className="project-detail-intro">{project.oneLiner[locale]}</p>

          <dl className="project-detail-ledger">
            <div>
              <dt>{copy.role}</dt>
              <dd>{project.role}</dd>
            </div>
            <div>
              <dt>{copy.company}</dt>
              <dd>{project.company}</dd>
            </div>
            <div>
              <dt>{copy.contribution}</dt>
              <dd>{project.contribution}%</dd>
            </div>
          </dl>

          <ul className="tag-list" aria-label="Tags">
            {project.tags.map((tag) => (
              <li key={tag} className="pill">{tag}</li>
            ))}
          </ul>
        </div>
      </header>

      <figure className="project-detail-media" data-project-section="media">
        <Image
          src={project.thumbnail}
          alt={getProjectDisplayTitle(project, locale)}
          width={1200}
          height={675}
          sizes="100vw"
          className="project-detail-image"
          priority
        />
      </figure>

      <section className="project-content" data-project-section="content">
        <div lang={contentLocale} className="mdx-content">
          {content}
        </div>
      </section>

      <nav className="project-detail-nav" data-project-section="navigation" aria-label="Project navigation">
        <div>
          {prev ? (
            <Link href={getLocalizedPath(locale, `/projects/${prev.slug}/`)}>
              <span aria-hidden="true">←</span> {getProjectDisplayTitle(prev, locale)}
            </Link>
          ) : (
            <span>{copy.firstProject}</span>
          )}
        </div>
        <div>
          <Link href={getLocalizedPath(locale, "/projects/")}>{copy.backToList}</Link>
        </div>
        <div>
          {next ? (
            <Link href={getLocalizedPath(locale, `/projects/${next.slug}/`)}>
              {getProjectDisplayTitle(next, locale)} <span aria-hidden="true">→</span>
            </Link>
          ) : (
            <span>{copy.lastProject}</span>
          )}
        </div>
      </nav>
    </article>
  );
}
