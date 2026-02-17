import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/lib/projects";

const eraClass: Record<number, string> = {
  1: "text-[#f59e0b]",
  2: "text-[#38bdf8]",
  3: "text-[#34d399]",
};

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="panel project-card group overflow-hidden p-0">
      <div className="relative">
        <Image
          src={project.thumbnail}
          alt={`${project.title.ko} thumbnail`}
          width={1200}
          height={675}
          className="project-image h-48 w-full object-cover"
        />
        <div className="absolute left-3 top-3">
          <span className="metric-chip">{project.primaryMetric ?? `${project.contribution}% ownership`}</span>
        </div>
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3">
          <div className="flex items-center justify-between gap-3 text-xs">
            <span className={`tracking-[0.14em] uppercase ${eraClass[project.era]}`}>{project.eraLabel}</span>
            <span className="text-white/80">{project.company}</span>
          </div>
        </div>
      </div>
      <div className="space-y-3 p-4 md:p-5">
        <h3 className="line-clamp-2 text-base font-semibold leading-snug text-white/95">{project.title.ko}</h3>
        <p className="line-clamp-2 text-sm leading-relaxed text-white/75">{project.oneLiner.ko}</p>
        <p className="text-xs text-muted">{project.role}</p>

        <div className="flex flex-wrap gap-2">
          {project.tags.slice(0, 4).map((tag) => (
            <span key={tag} className="pill text-[11px]">
              {tag}
            </span>
          ))}
        </div>

        <div className="pt-1">
          <Link href={`/projects/${project.slug}`} className="text-sm font-medium text-accent hover:underline">
            상세 보기
          </Link>
        </div>
      </div>
    </article>
  );
}
