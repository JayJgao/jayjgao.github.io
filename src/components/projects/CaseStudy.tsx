import Link from "next/link";
import type { ReactNode } from "react";
import type { Project } from "@/lib/projects";

export function CaseStudy({
  project,
  content,
  prev,
  next,
}: {
  project: Project;
  content: ReactNode;
  prev?: Project;
  next?: Project;
}) {
  return (
    <article className="space-y-7 md:space-y-8">
      <header className="panel p-5 md:p-8">
        <p className="section-kicker">{project.eraLabel}</p>
        <h1 className="editorial-title mt-3 text-4xl md:text-6xl">{project.title.ko}</h1>
        <p className="mt-4 max-w-3xl text-lg leading-relaxed text-white/86">{project.oneLiner.ko}</p>

        <dl className="mt-6 grid gap-4 border-t border-white/10 pt-5 text-sm md:grid-cols-3 md:gap-6">
          <div>
            <dt className="text-white/64">Role</dt>
            <dd className="mt-1 text-white/90">{project.role}</dd>
          </div>
          <div>
            <dt className="text-white/64">Company</dt>
            <dd className="mt-1 text-white/90">{project.company}</dd>
          </div>
          <div>
            <dt className="text-white/64">Contribution</dt>
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
        <div className="mx-auto max-w-[860px]">{content}</div>
      </section>

      <nav className="flex flex-col gap-3 border-t border-white/10 pt-6 text-sm md:flex-row md:items-center md:justify-between">
        <div>
          {prev ? (
            <Link href={`/projects/${prev.slug}`} className="text-white/66 hover:text-white">
              ← {prev.title.ko}
            </Link>
          ) : (
            <span className="text-white/56">첫 프로젝트</span>
          )}
        </div>
        <Link href="/projects" className="text-accent/95 hover:underline">
          프로젝트 목록으로
        </Link>
        <div>
          {next ? (
            <Link href={`/projects/${next.slug}`} className="text-white/66 hover:text-white">
              {next.title.ko} →
            </Link>
          ) : (
            <span className="text-white/56">마지막 프로젝트</span>
          )}
        </div>
      </nav>
    </article>
  );
}
