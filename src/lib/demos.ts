import demosJson from "@/data/demos.json";
import type { Demo, DemoGalleryImage } from "@/types/demo";

export type GalleryMode = "none" | "static" | "slider";
export type DemoVideoMode = "available" | "none";
export type YouTubeThumbnailQuality = "maxresdefault" | "hqdefault";
export type DemoGroup = {
  id: "productized" | "experiments";
  demos: Demo[];
};

const demos = demosJson as Demo[];

function cloneDemo(demo: Demo): Demo {
  return structuredClone(demo);
}

export function getAllDemos(): Demo[] {
  return [...demos].sort((a, b) => a.order - b.order).map(cloneDemo);
}

export function getProductizedDemos(): Demo[] {
  return getAllDemos().filter((demo) => demo.productized);
}

export function getDemoBySlug(slug: string): Demo | undefined {
  const demo = demos.find((candidate) => candidate.slug === slug);
  return demo ? cloneDemo(demo) : undefined;
}

export function getAllDemoSlugs(): string[] {
  return getAllDemos().map((demo) => demo.slug);
}

export function getGalleryMode(items: DemoGalleryImage[]): GalleryMode {
  if (items.length === 0) return "none";
  return items.length === 1 ? "static" : "slider";
}

export function getDemoVideoMode(demo: Demo): DemoVideoMode {
  return demo.video.videoId ? "available" : "none";
}

export function getYouTubeEmbedUrl(videoId: string): string {
  return `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`;
}

export function getYouTubeThumbnailUrl(
  videoId: string,
  quality: YouTubeThumbnailQuality,
): string {
  return `https://i.ytimg.com/vi/${videoId}/${quality}.jpg`;
}

export function getDemoGroups(): DemoGroup[] {
  const orderedDemos = getAllDemos();

  return [
    {
      id: "productized",
      demos: orderedDemos.filter((demo) => demo.productized),
    },
    {
      id: "experiments",
      demos: orderedDemos.filter((demo) => !demo.productized),
    },
  ];
}
