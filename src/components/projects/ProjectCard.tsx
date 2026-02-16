import Link from "next/link";
import type { Project } from "@/lib/projects";

const eraClass: Record<number, string> = {
  1: "text-[#f59e0b]",
  2: "text-[#38bdf8]",
  3: "text-[#34d399]",
};

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="panel group p-5">
      <div className="flex items-center justify-between gap-3">
        <span className={`text-xs tracking-[0.14em] uppercase ${eraClass[project.era]}`}>
          {project.eraLabel}
        </span>
        <span className="text-xs text-muted">{project.company}</span>
      </div>

      <h3 className="mt-4 text-lg font-medium leading-snug text-white/95">
        {project.title.ko}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-white/75">{project.oneLiner.ko}</p>
      <p className="mt-2 text-xs text-muted">{project.role} · 기여도 {project.contribution}%</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {project.tags.slice(0, 4).map((tag) => (
          <span key={tag} className="pill text-[11px]">
            {tag}
          </span>
        ))}
      </div>

      <Link href={`/projects/${project.slug}`} className="mt-5 inline-flex text-sm text-accent hover:underline">
        상세 보기
      </Link>
    </article>
  );
}
