"use client";

import { useMemo, useState } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import type { Project } from "@/lib/projects";
import { EraFilter } from "@/components/projects/EraFilter";
import { ProjectCard } from "@/components/projects/ProjectCard";
import type { Locale } from "@/lib/locale";

const copyByLocale: Record<
  Locale,
  {
    featuredTitle: string;
    featuredDescription: string;
    archiveTitle: string;
    archiveDescription: string;
    emptyFeatured: string;
    emptyArchive: string;
    projectsUnit: string;
  }
> = {
  ko: {
    featuredTitle: "Featured",
    featuredDescription: "핵심 성과가 선명한 프로젝트만 우선 배치했습니다.",
    archiveTitle: "Archive",
    archiveDescription: "축적된 실행 이력과 도메인 확장 트랙입니다.",
    emptyFeatured: "선택한 Era에 해당하는 Featured 프로젝트가 없습니다.",
    emptyArchive: "선택한 Era에 해당하는 Archive 프로젝트가 없습니다.",
    projectsUnit: "projects",
  },
  en: {
    featuredTitle: "Featured",
    featuredDescription: "Only high-signal projects are highlighted first.",
    archiveTitle: "Archive",
    archiveDescription: "Execution history and domain expansion tracks.",
    emptyFeatured: "No featured projects in the selected era.",
    emptyArchive: "No archive projects in the selected era.",
    projectsUnit: "projects",
  },
  zh: {
    featuredTitle: "精选",
    featuredDescription: "优先展示核心成果最清晰的项目。",
    archiveTitle: "归档",
    archiveDescription: "累计执行记录与领域扩展轨迹。",
    emptyFeatured: "所选 Era 下没有 Featured 项目。",
    emptyArchive: "所选 Era 下没有 Archive 项目。",
    projectsUnit: "项目",
  },
};

export function ProjectsExplorer({
  projects,
}: {
  projects: Project[];
}) {
  const { locale } = useLocale();
  const [filter, setFilter] = useState<"all" | "1" | "2" | "3">("all");
  const copy = copyByLocale[locale];

  const featured = useMemo(() => {
    const base = projects.filter((project) => project.featured);
    if (filter === "all") return base;
    return base.filter((project) => String(project.era) === filter);
  }, [projects, filter]);

  const archive = useMemo(() => {
    const base = projects.filter((project) => !project.featured);
    if (filter === "all") return base;
    return base.filter((project) => String(project.era) === filter);
  }, [projects, filter]);

  return (
    <div className="space-y-10">
      <EraFilter value={filter} onChange={setFilter} />

      <section className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">{copy.featuredTitle}</h2>
            <p className="mt-1 text-sm text-muted">{copy.featuredDescription}</p>
          </div>
          <span className="pill text-[11px]">{featured.length} {copy.projectsUnit}</span>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {featured.map((project) => (
            <ProjectCard key={project.slug} project={project} locale={locale} />
          ))}
        </div>
        {featured.length === 0 ? (
          <div className="panel p-5 text-sm text-muted">{copy.emptyFeatured}</div>
        ) : null}
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">{copy.archiveTitle}</h2>
            <p className="mt-1 text-sm text-muted">{copy.archiveDescription}</p>
          </div>
          <span className="pill text-[11px]">{archive.length} {copy.projectsUnit}</span>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {archive.map((project) => (
            <ProjectCard key={project.slug} project={project} locale={locale} />
          ))}
        </div>
        {archive.length === 0 ? (
          <div className="panel p-5 text-sm text-muted">{copy.emptyArchive}</div>
        ) : null}
      </section>
    </div>
  );
}
