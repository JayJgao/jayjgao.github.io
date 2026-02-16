import fs from "node:fs/promises";
import path from "node:path";
import { compileMDX } from "next-mdx-remote/rsc";
import { notFound } from "next/navigation";
import { CaseStudy } from "@/components/projects/CaseStudy";
import { getAllProjectSlugs, getAllProjects, getProjectBySlug } from "@/lib/projects";

async function readProjectMdx(slug: string) {
  const mdxPath = path.join(
    process.cwd(),
    "src",
    "content",
    "projects",
    "ko",
    `${slug}.mdx`,
  );

  try {
    return await fs.readFile(mdxPath, "utf8");
  } catch {
    return null;
  }
}

export function generateStaticParams() {
  return getAllProjectSlugs().map((slug) => ({ slug }));
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const source = await readProjectMdx(slug);
  if (!source) notFound();

  const { content } = await compileMDX({
    source,
    options: {
      parseFrontmatter: true,
    },
  });

  const projectList = getAllProjects();
  const index = projectList.findIndex((item) => item.slug === slug);
  const prev = index > 0 ? projectList[index - 1] : undefined;
  const next = index < projectList.length - 1 ? projectList[index + 1] : undefined;

  return (
    <main className="page-container py-10 md:py-14">
      <CaseStudy project={project} content={content} prev={prev} next={next} />
    </main>
  );
}
