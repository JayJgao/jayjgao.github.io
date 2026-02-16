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
    <article className="space-y-8">
      <header className="panel p-6 md:p-8">
        <p className="text-xs tracking-[0.16em] text-accent uppercase">{project.eraLabel}</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-5xl">{project.title.ko}</h1>
        <p className="mt-4 max-w-3xl text-lg text-white/85">{project.oneLiner.ko}</p>

        <dl className="mt-6 grid gap-4 border-t border-white/10 pt-5 text-sm md:grid-cols-3">
          <div>
            <dt className="text-muted">Role</dt>
            <dd className="mt-1 text-white/90">{project.role}</dd>
          </div>
          <div>
            <dt className="text-muted">Company</dt>
            <dd className="mt-1 text-white/90">{project.company}</dd>
          </div>
          <div>
            <dt className="text-muted">Contribution</dt>
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

      <section className="panel mdx-content p-6 md:p-8">{content}</section>

      <nav className="flex flex-col gap-3 border-t border-white/10 pt-6 text-sm md:flex-row md:items-center md:justify-between">
        <div>
          {prev ? (
            <Link href={`/projects/${prev.slug}`} className="text-muted hover:text-white">
              ← {prev.title.ko}
            </Link>
          ) : (
            <span className="text-muted">첫 프로젝트</span>
          )}
        </div>
        <Link href="/projects" className="text-accent hover:underline">
          프로젝트 목록으로
        </Link>
        <div>
          {next ? (
            <Link href={`/projects/${next.slug}`} className="text-muted hover:text-white">
              {next.title.ko} →
            </Link>
          ) : (
            <span className="text-muted">마지막 프로젝트</span>
          )}
        </div>
      </nav>
    </article>
  );
}
