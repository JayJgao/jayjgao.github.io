import projectsJson from "@/data/projects.json";
import type { Locale } from "@/lib/locale";
import type { Localized } from "@/types/content";

export type Project = {
  slug: string;
  results?: { value: Localized<string>; caption: Localized<string> }[];
  featuredResult?: number;
  featuredCard?: { headline: Localized<string>; caption: Localized<string>; title: Localized<string>; description: Localized<string> };
  links?: { label: Localized<string>; url: string }[];
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
    return getProjectCompanies().indexOf(a.company) - getProjectCompanies().indexOf(b.company);
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

export function getProjectCompanies() {
  const order = ["Cinamon", "BUZZNI", "Lunit", "Solidware", "Side Project"];
  return [...new Set(projects.map((project) => project.company))].sort((a, b) => order.indexOf(a) - order.indexOf(b));
}

// Shared across locales within this tab so returning from a detail preserves context.
export const COMPANY_FILTER_KEY = "portfolio-company-filter";
export function restoreCompanyFilter(storage: Pick<Storage, "getItem">): string {
  try {
    const value = storage.getItem(COMPANY_FILTER_KEY);
    return value && getProjectCompanies().includes(value) ? value : "all";
  } catch {
    return "all";
  }
}
