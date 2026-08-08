"use client";

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
    <article className="space-y-7 md:space-y-8">
      <header className="panel p-5 md:p-8">
        <p className="section-kicker">{getEraLabel(project.era, locale)}</p>
        <h1 className="editorial-title mt-3 text-4xl md:text-6xl">{project.title[locale]}</h1>
        {subtitle ? <p className="mt-2 text-xl font-semibold leading-snug text-white/78 md:text-2xl">{subtitle}</p> : null}
        <p className="mt-4 max-w-3xl text-lg leading-relaxed text-white/86">{project.oneLiner[locale]}</p>

        <dl className="mt-6 grid gap-4 border-t border-white/10 pt-5 text-sm md:grid-cols-3 md:gap-6">
          <div>
            <dt className="text-white/64">{copy.role}</dt>
            <dd className="mt-1 text-white/90">{project.role}</dd>
          </div>
          <div>
            <dt className="text-white/64">{copy.company}</dt>
            <dd className="mt-1 text-white/90">{project.company}</dd>
          </div>
          <div>
            <dt className="text-white/64">{copy.contribution}</dt>
            <dd className="mt-1 text-white/90">{project.contribution}%</dd>
          </div>
        </dl>

        <div className="mt-4 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span key={tag} className="pill text-xs">
              {tag}
            </span>
          ))}
        </div>
      </header>

      <section className="panel mdx-content p-5 md:p-8">
        <div lang={contentLocale} className="mx-auto max-w-[860px]">
          {content}
        </div>
      </section>

      <nav className="flex flex-col gap-3 border-t border-white/10 pt-6 text-sm md:flex-row md:items-center md:justify-between">
        <div>
          {prev ? (
            <Link href={getLocalizedPath(locale, `/projects/${prev.slug}/`)} className="text-white/66 hover:text-white">
              ← {getProjectDisplayTitle(prev, locale)}
            </Link>
          ) : (
            <span className="text-white/56">{copy.firstProject}</span>
          )}
        </div>
        <Link href={getLocalizedPath(locale, "/projects/")} className="text-accent/95 hover:underline">
          {copy.backToList}
        </Link>
        <div>
          {next ? (
            <Link href={getLocalizedPath(locale, `/projects/${next.slug}/`)} className="text-white/66 hover:text-white">
              {getProjectDisplayTitle(next, locale)} →
            </Link>
          ) : (
            <span className="text-white/56">{copy.lastProject}</span>
          )}
        </div>
      </nav>
    </article>
  );
}
