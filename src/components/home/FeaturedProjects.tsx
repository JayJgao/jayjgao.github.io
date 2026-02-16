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
    <section className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs tracking-[0.16em] text-accent uppercase">Showcase</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">Featured Projects</h2>
        </div>
        <Link href="/projects" className="text-sm text-muted hover:text-white">
          View All Projects →
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {featured.map((project) => (
          <article key={project.slug} className="panel group p-5">
            <div className="flex items-center justify-between">
              <span className={`text-xs tracking-[0.14em] uppercase ${eraAccent[project.era]}`}>
                {project.eraLabel}
              </span>
              <span className="text-xs text-muted">기여 {project.contribution}%</span>
            </div>
            <h3 className="mt-3 text-lg font-medium leading-snug text-white/95">{project.oneLiner.ko}</h3>
            <p className="mt-2 text-sm text-muted">{project.company} · {project.role}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {project.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="pill text-[11px]">{tag}</span>
              ))}
            </div>
            <Link href={`/projects/${project.slug}`} className="mt-5 inline-flex text-sm text-accent hover:underline">
              케이스 스터디 보기
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
