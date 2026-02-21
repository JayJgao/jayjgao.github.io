import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/lib/projects";
import type { Locale } from "@/lib/locale";

const eraChipClass: Record<number, string> = {
  1: "project-era-chip--era1",
  2: "project-era-chip--era2",
  3: "project-era-chip--era3",
};

const eraChipLabel: Record<number, string> = {
  1: "Classical ML Era",
  2: "LLM Application Era",
  3: "Generative AI Native Era",
};

const contributionLabel: Record<Locale, string> = {
  ko: "기여도",
  en: "Contribution",
  zh: "贡献度",
};

export function ProjectCard({ project, locale }: { project: Project; locale: Locale }) {
  return (
    <article className="panel project-card group flex h-full flex-col overflow-hidden p-0">
      <div className="relative">
        <Image
          src={project.thumbnail}
          alt={`${project.title[locale]} thumbnail`}
          width={1200}
          height={675}
          className="project-image h-44 w-full object-cover md:h-48"
        />
        <div className="absolute left-3 top-3">
          <span className="metric-chip">{project.primaryMetric ?? `${project.contribution}% ownership`}</span>
        </div>
        <div className="project-image-meta">
          <div className="project-image-meta-row">
            <span className={`project-era-chip ${eraChipClass[project.era]}`}>{eraChipLabel[project.era]}</span>
            <span className="project-company-chip">{project.company}</span>
          </div>
        </div>
      </div>
      <div className="flex flex-1 flex-col justify-between space-y-3 p-4 md:p-5">
        <Link href={`/projects/${project.slug}`} className="block space-y-3">
          <h3 className="line-clamp-2 min-h-[2.7rem] text-base font-semibold leading-snug text-white/95">{project.title[locale]}</h3>
          <p className="line-clamp-2 min-h-[2.45rem] text-sm leading-relaxed text-white/78">{project.oneLiner[locale]}</p>
          <p className="text-xs text-white/66">{project.role}</p>

          <div className="flex flex-wrap gap-2">
            {project.tags.slice(0, 4).map((tag) => (
              <span key={tag} className="pill text-[11px]">
                {tag}
              </span>
            ))}
          </div>
        </Link>

        <div className="mt-auto flex items-center justify-between rounded-xl border border-white/12 bg-white/5 px-3 py-2">
          <span className="text-[11px] tracking-[0.14em] text-white/68 uppercase">{contributionLabel[locale]}</span>
          <span className="text-sm font-semibold text-white/95">{project.contribution}%</span>
        </div>
      </div>
    </article>
  );
}
