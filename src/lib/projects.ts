import projectsJson from "@/data/projects.json";
import type { Locale } from "@/lib/locale";
import type { EraId, Localized } from "@/types/content";

export type Project = {
  slug: string;
  era: EraId;
  featured: boolean;
  showcaseOrder: number | null;
  title: Localized<string>;
  subtitle: Localized<string>;
  oneLiner: Localized<string>;
  company: string;
  role: string;
  contribution: number;
  tags: string[];
  thumbnail: string;
  primaryMetric?: string | null;
  demoUrl?: string | null;
};

const projects = projectsJson as Project[];

export function getProjectDisplayTitle(project: Project, locale: Locale): string {
  const subtitle = project.subtitle[locale];
  return subtitle ? `${project.title[locale]} — ${subtitle}` : project.title[locale];
}

export function getAllProjects() {
  return [...projects].sort((a, b) => {
    if (a.featured && b.featured) {
      return (a.showcaseOrder ?? 99) - (b.showcaseOrder ?? 99);
    }
    if (a.featured) return -1;
    if (b.featured) return 1;
    return b.era - a.era;
  });
}

export function getFeaturedProjects() {
  return getAllProjects().filter((project) => project.featured);
}

export function getArchiveProjects() {
  return getAllProjects().filter((project) => !project.featured);
}

export function getProjectBySlug(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export function getAllProjectSlugs() {
  return projects.map((project) => project.slug);
}
