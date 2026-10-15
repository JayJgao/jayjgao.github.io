"use client";

import { ImagePreview } from "@/components/projects/ImagePreview";
import Link from "next/link";
import type { ReactNode } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { ResultBand } from "@/components/ResultBand";
import { getCompanyPeriod } from "@/lib/career";
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
  const isFallback = contentLocale !== locale;
  const period = getCompanyPeriod(project.company, locale);
  const relatedLinks = project.links?.length ? <section className="project-related-links"><h2>{copy.relatedLinks}</h2><ul>{project.links.map((link) => <li key={link.url}><a href={link.url}>{link.label[locale]} ↗</a></li>)}</ul></section> : null;

  return (
    <article className="project-detail">
      <header className="project-detail-hero" data-project-section="hero">
        <div className="project-detail-heading">
          <nav className="project-breadcrumb" aria-label={copy.backToList}><Link href={getLocalizedPath(locale, "/projects/")}>{messages.projects.page.title}</Link> / {project.company}</nav>
          <p className="project-detail-company">{project.company}{period ? <span className="num"> · {period}</span> : null}</p>
          <h1 className="page-display">{project.title[locale]}</h1>
          {subtitle ? <p className="project-detail-subtitle">{subtitle}</p> : null}
          <p className="project-detail-intro">{project.oneLiner[locale]}</p>
        </div>
        <figure className="project-detail-media" data-project-section="media">
          <ImagePreview src={project.thumbnail} alt={getProjectDisplayTitle(project, locale)} locale={locale} />
        </figure>
      </header>
      <div className="project-detail-layout">
        <aside className="project-detail-rail">
          <dl className="project-detail-ledger">
            <div><dt>{copy.company}</dt><dd>{project.company}</dd></div>
            {period ? <div><dt>{copy.period}</dt><dd className="num">{period}</dd></div> : null}
            <div><dt>{copy.role}</dt><dd>{project.role}</dd></div>
            <div><dt>{copy.contribution}</dt><dd><span className="num">{project.contribution}%</span></dd></div>
          </dl>
          <ul className="tag-list" aria-label="Tags">{project.tags.map((tag) => <li key={tag} className="tag">{tag}</li>)}</ul>
        </aside>
        <section className="project-content" data-project-section="content">
          {project.results?.length ? <div data-project-section="results"><ResultBand results={project.results.map((result) => ({ value: result.value[locale], caption: result.caption[locale] }))} /></div> : null}
          {isFallback ? <p className="project-fallback-notice" data-project-fallback-notice={contentLocale} lang={locale} role="note">{copy.fallbackNotice}</p> : null}
          <div lang={contentLocale} className="mdx-content" data-project-content-locale={contentLocale}>{content}</div>
        </section>
        {relatedLinks}
      </div>

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
