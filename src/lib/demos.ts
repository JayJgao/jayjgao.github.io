import demosJson from "@/data/demos.json";
import type { Demo } from "@/types/demo";

const demos = demosJson as Demo[];

function cloneDemo(demo: Demo): Demo {
  return structuredClone(demo);
}

export function getAllDemos(): Demo[] {
  return [...demos].sort((a, b) => a.order - b.order).map(cloneDemo);
}

export function getDemoBySlug(slug: string): Demo | undefined {
  const demo = demos.find((candidate) => candidate.slug === slug);
  return demo ? cloneDemo(demo) : undefined;
}

export function getAllDemoSlugs(): string[] {
  return getAllDemos().map((demo) => demo.slug);
}
