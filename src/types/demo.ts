import type { Localized } from "@/types/content";

export type DemoKind = "prototype" | "workflow" | "skill" | "service";

export type DemoStackGroup = {
  label: Localized<string>;
  items: Array<Localized<string>>;
};

export type DemoVideo = {
  provider: "youtube";
  videoId: string | null;
};

export type DemoGalleryImage = {
  src: string;
  alt: Localized<string>;
  caption: Localized<string>;
  width: number;
  height: number;
};

export type Demo = {
  slug: string;
  kind: DemoKind;
  order: number;
  name: string;
  summary: Localized<string>;
  observation: Localized<string>;
  problem: Localized<string>;
  hypothesis: Localized<string>;
  outcome: Localized<string>;
  productized: boolean;
  howItWorks: Array<Localized<string>>;
  stack: DemoStackGroup[];
  boundary: Localized<string>;
  video: DemoVideo;
  gallery: DemoGalleryImage[];
  diagram: string;
  relatedDemo: string | null;
};
