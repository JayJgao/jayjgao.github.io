import Image from "next/image";
import Link from "next/link";
import { getFeaturedProjects } from "@/lib/projects";

const eraAccent: Record<number, string> = {
  1: "text-[#f59e0b]",
  2: "text-[#38bdf8]",
  3: "text-[#34d399]",
};

export function FeaturedProjects() {
  const featured = getFeaturedProjects();

  return (
    <section className="space-y-5 md:space-y-7">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs tracking-[0.18em] text-accent uppercase">Featured Showcase</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight md:text-4xl">Productized Projects</h2>
          <p className="mt-1.5 text-xs text-muted md:mt-2 md:text-sm">
            이미지와 핵심 지표 중심으로 빠르게 스캔할 수 있게 재구성했습니다.
          </p>
        </div>
        <Link href="/projects" className="btn-secondary w-fit px-4 py-1.5 text-xs tracking-wide uppercase md:py-2">
          View All
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {featured.map((project) => (
          <article key={project.slug} className="panel project-card group overflow-hidden p-0">
            <div className="relative">
              <Image
                src={project.thumbnail}
                alt={`${project.title.ko} thumbnail`}
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
              <h3 className="line-clamp-2 text-base font-semibold leading-snug text-white/95 md:text-lg">{project.title.ko}</h3>
              <p className="line-clamp-2 text-xs leading-relaxed text-white/80 md:text-sm">{project.oneLiner.ko}</p>
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
                  케이스 스터디
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
