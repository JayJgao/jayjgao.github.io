import { ProjectsExplorer } from "@/components/projects/ProjectsExplorer";
import { getAllProjects } from "@/lib/projects";

export default function ProjectsPage() {
  const projects = getAllProjects();

  return (
    <main className="page-container py-8 md:py-12">
      <ProjectsExplorer projects={projects} />
    </main>
  );
}
