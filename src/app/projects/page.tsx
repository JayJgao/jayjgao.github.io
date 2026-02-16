import { ProjectsExplorer } from "@/components/projects/ProjectsExplorer";
import { getAllProjects } from "@/lib/projects";

export default function ProjectsPage() {
  const projects = getAllProjects();

  return (
    <main className="page-container py-10 md:py-14">
      <header className="mb-8 space-y-3">
        <p className="text-xs tracking-[0.16em] text-accent uppercase">Portfolio</p>
        <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">Projects</h1>
        <p className="max-w-2xl text-base text-muted md:text-lg">
          3-Era Narrative를 기준으로 프로젝트를 구성했습니다. Featured는 핵심 성과,
          Archive는 확장 맥락을 보여줍니다.
        </p>
      </header>

      <ProjectsExplorer projects={projects} />
    </main>
  );
}
