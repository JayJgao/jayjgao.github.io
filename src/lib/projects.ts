import projectsJson from "@/data/projects.json";

export type Locale = "ko" | "en" | "zh";

export type Project = {
  slug: string;
  era: 1 | 2 | 3;
  eraLabel: string;
  featured: boolean;
  showcaseOrder: number | null;
  title: Record<Locale, string>;
  oneLiner: Record<Locale, string>;
  company: string;
  role: string;
  contribution: number;
  tags: string[];
  thumbnail: string;
  primaryMetric?: string | null;
  demoUrl?: string;
};

const projects = projectsJson as Project[];

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
