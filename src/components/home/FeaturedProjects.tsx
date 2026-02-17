"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getFeaturedProjects } from "@/lib/projects";
import type { Locale } from "@/lib/locale";

const eraAccent: Record<number, string> = {
  1: "text-[#f59e0b]",
  2: "text-[#38bdf8]",
  3: "text-[#34d399]",
};

const copyByLocale: Record<
  Locale,
  { sectionLabel: string; title: string; viewAll: string; detail: string }
> = {
  ko: {
    sectionLabel: "Featured Showcase",
    title: "Notable Projects",
    viewAll: "전체 보기",
    detail: "케이스 스터디",
  },
  en: {
    sectionLabel: "Featured Showcase",
    title: "Notable Projects",
    viewAll: "View All",
    detail: "Case Study",
  },
  zh: {
    sectionLabel: "精选项目",
    title: "产品化项目",
    viewAll: "查看全部",
    detail: "案例详情",
  },
};

export function FeaturedProjects() {
  const { locale } = useLocale();
  const featured = getFeaturedProjects();
  const copy = copyByLocale[locale];

  return (
    <section className="space-y-5 md:space-y-7">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs tracking-[0.18em] text-accent uppercase">{copy.sectionLabel}</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight md:text-4xl">{copy.title}</h2>
        </div>
        <Link href="/projects" className="btn-secondary w-fit px-4 py-1.5 text-xs tracking-wide uppercase md:py-2">
          {copy.viewAll}
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {featured.map((project) => (
          <article key={project.slug} className="panel project-card group overflow-hidden p-0">
            <div className="relative">
              <Image
                src={project.thumbnail}
                alt={`${project.title[locale]} thumbnail`}
                width={1200}
                height={675}
                className="project-image h-44 w-full object-cover md:h-48"
              />
              <div className="absolute left-3 top-3">
                <span className="metric-chip">{project.primaryMetric ?? `기여 ${project.contribution}%`}</span>
              </div>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-3">
                <span className={`text-[11px] tracking-[0.14em] uppercase ${eraAccent[project.era]}`}>
                  {project.eraLabel}
                </span>
              </div>
            </div>
            <div className="space-y-2.5 p-4 md:space-y-3 md:p-5">
              <h3 className="line-clamp-2 text-base font-semibold leading-snug text-white/95 md:text-lg">
                {project.title[locale]}
              </h3>
              <p className="line-clamp-2 text-xs leading-relaxed text-white/80 md:text-sm">{project.oneLiner[locale]}</p>
              <p className="text-xs text-muted">{project.company} · {project.role}</p>
              <div className="flex flex-wrap gap-2">
                {project.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="pill text-[11px]">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="pt-1">
                <Link href={`/projects/${project.slug}`} className="text-sm font-medium text-accent hover:underline">
                  {copy.detail}
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
