import { ProjectsExplorer } from "@/components/projects/ProjectsExplorer";
import { getAllProjects } from "@/lib/projects";

export default function ProjectsPage() {
  const projects = getAllProjects();

  return (
    <main className="page-container py-8 md:py-12">
      <header className="mb-7 space-y-3 md:mb-9">
        <p className="section-kicker">Portfolio</p>
        <h1 className="editorial-title text-5xl md:text-6xl">Projects</h1>
        <p className="max-w-2xl text-base leading-relaxed text-white/72 md:text-lg whitespace-pre-line">
          {`3-Era Narrative를 기준으로 포트폴리오를 구성했습니다.\nFeatured는 핵심 성과, Archive는 확장 맥락을 보여줍니다.`}
        </p>
      </header>

      <ProjectsExplorer projects={projects} />
    </main>
  );
}
