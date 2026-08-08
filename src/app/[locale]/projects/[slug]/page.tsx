import type { Metadata } from "next";
import { compileMDX } from "next-mdx-remote/rsc";
import { notFound } from "next/navigation";
import { CaseStudy } from "@/components/projects/CaseStudy";
import { isLocale } from "@/lib/locale";
import { createLocalizedMetadata } from "@/lib/metadata";
import { readProjectMdx } from "@/lib/mdx";
import {
  getAllProjectSlugs,
  getAllProjects,
  getProjectBySlug,
} from "@/lib/projects";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllProjectSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();

  const project = getProjectBySlug(slug);
  if (!project) notFound();

  return createLocalizedMetadata({
    locale,
    path: `/projects/${slug}/`,
    title: `${project.title[locale]} | Jay Ko`,
    description: project.oneLiner[locale],
  });
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();

  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const { source, contentLocale } = await readProjectMdx(locale, slug);

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
      <CaseStudy
        project={project}
        content={content}
        contentLocale={contentLocale}
        prev={prev}
        next={next}
      />
    </main>
  );
}
