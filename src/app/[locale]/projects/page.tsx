import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectsExplorer } from "@/components/projects/ProjectsExplorer";
import { getMessages } from "@/lib/i18n";
import { isLocale } from "@/lib/locale";
import { createLocalizedMetadata } from "@/lib/metadata";
import { getAllProjects } from "@/lib/projects";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const copy = getMessages(locale).projects.page;
  return createLocalizedMetadata({
    locale,
    path: "/projects/",
    title: `${copy.title} | Jay Ko`,
    description: copy.description,
  });
}

export default function ProjectsPage() {
  const projects = getAllProjects();

  return (
    <main id="main-content">
      <ProjectsExplorer projects={projects} />
    </main>
  );
}
