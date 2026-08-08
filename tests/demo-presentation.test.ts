import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  getDemoBySlug,
  getDemoGroups,
  getDemoVideoMode,
  getGalleryMode,
  getYouTubeEmbedUrl,
} from "../src/lib/demos";
import type { DemoGalleryImage } from "../src/types/demo";

const repoRoot = new URL("..", import.meta.url);

function readRepoFile(path: string): string {
  return readFileSync(new URL(path, repoRoot), "utf8");
}

const oneItem: DemoGalleryImage = {
  src: "/assets/images/demos/example/one.webp",
  alt: { ko: "하나", en: "하나", zh: "하나" },
  caption: { ko: "하나", en: "하나", zh: "하나" },
  width: 16,
  height: 9,
};

const secondItem: DemoGalleryImage = {
  ...oneItem,
  src: "/assets/images/demos/example/two.webp",
};

test("gallery mode follows the empty, single-image, and multi-image contract", () => {
  assert.equal(getGalleryMode([]), "none");
  assert.equal(getGalleryMode([oneItem]), "static");
  assert.equal(getGalleryMode([oneItem, secondItem]), "slider");
});

test("video mode distinguishes an available highlight, pending skill, and intentional absence", () => {
  assert.equal(getDemoVideoMode(getDemoBySlug("prompt-enhancer")!), "available");
  assert.equal(getDemoVideoMode(getDemoBySlug("prompt-enhance-skills")!), "pending");
  assert.equal(getDemoVideoMode(getDemoBySlug("script-to-bgm")!), "none");
});

test("YouTube embeds use the privacy-enhanced host without autoplay", () => {
  const url = getYouTubeEmbedUrl("NLleH-4c5HY");

  assert.equal(
    url,
    "https://www.youtube-nocookie.com/embed/NLleH-4c5HY?rel=0&modestbranding=1",
  );
  assert.doesNotMatch(url, /autoplay/i);
});

test("proof-first groups preserve the approved product and experiment order", () => {
  const groups = getDemoGroups();

  assert.deepEqual(groups.map(({ id }) => id), ["productized", "experiments"]);
  assert.deepEqual(
    groups[0].demos.map(({ slug }) => slug),
    ["prompt-enhancer", "prompt-enhance-skills", "voice-adaptor", "reverse-storyboard"],
  );
  assert.deepEqual(
    groups[1].demos.map(({ slug }) => slug),
    ["reframer", "boundary-deduper", "iro-matcher", "loudness-matcher", "script-to-bgm"],
  );
});

test("all locale dictionaries expose the same Demos UI contract", () => {
  const dictionaries = ["ko", "en", "zh"].map((locale) =>
    JSON.parse(readRepoFile(`src/i18n/${locale}.json`)),
  );

  for (const dictionary of dictionaries) {
    assert.equal(dictionary.nav.demos, "Demos");
    assert.equal(dictionary.demos.page.title, "Tinkering with the latest AI");
    assert.equal(dictionary.demos.groups.productized.title, "Built into Products");
    assert.equal(dictionary.demos.groups.experiments.title, "Experiments and Internal Tools");
    assert.deepEqual(Object.keys(dictionary.demos).sort(), [
      "card",
      "detail",
      "groups",
      "kind",
      "page",
      "status",
    ]);
  }

  assert.deepEqual(
    Object.keys(dictionaries[0].demos),
    Object.keys(dictionaries[1].demos),
  );
  assert.deepEqual(
    Object.keys(dictionaries[0].demos),
    Object.keys(dictionaries[2].demos),
  );
});

test("list and detail source preserve proof-first markers and the exact six-block flow", () => {
  const explorer = readRepoFile("src/components/demos/DemosExplorer.tsx");
  const card = readRepoFile("src/components/demos/DemoCard.tsx");
  const detail = readRepoFile("src/components/demos/DemoDetail.tsx");

  assert.doesNotMatch(explorer, /["']use client["']/);
  assert.match(explorer, /data-demo-list-group/);
  assert.match(card, /data-demo-card/);
  assert.match(card, /data-demo-slug/);
  assert.doesNotMatch(`${explorer}\n${card}`, /<iframe|<video|DemoVideo|DemoGallery|cinev|cinamon/i);

  const blocks = ["hero", "hypothesis", "media", "how-it-works", "stack", "boundary"];
  const indexes = blocks.map((block) => detail.indexOf(`data-demo-block="${block}"`));
  assert.ok(indexes.every((index) => index >= 0), "all six detail block markers must exist");
  assert.deepEqual([...indexes].sort((a, b) => a - b), indexes, "six blocks must remain ordered");
  assert.equal((detail.match(/data-demo-block=/g) ?? []).length, 6);
  assert.match(detail, /DemoVideo/);
  assert.match(detail, /DemoGallery/);
  assert.match(detail, /DemoDiagram/);
  assert.doesNotMatch(detail, /https?:\/\/(?:www\.)?(?:cinev|cinamon)/i);
});

test("video and image gallery keep separate minimal client boundaries", () => {
  const video = readRepoFile("src/components/demos/DemoVideo.tsx");
  const gallery = readRepoFile("src/components/demos/DemoGallery.tsx");

  assert.match(video, /^"use client";/);
  assert.match(video, /data-demo-video-state="play"/);
  assert.match(video, /data-demo-video-state="pending"/);
  assert.match(video, /loading="lazy"/);
  assert.match(video, /allowFullScreen/);
  assert.doesNotMatch(video, /allow=|autoplay|youtube\.com\/embed/i);

  assert.match(gallery, /^"use client";/);
  assert.match(gallery, /data-demo-gallery-mode=/);
  assert.match(gallery, /aria-current=/);
  assert.match(gallery, /aria-live="polite"/);
  assert.doesNotMatch(gallery, /<video|<iframe|DemoVideo|aria-label=.*play/i);
});

test("localized Demos routes are static, validated, and metadata-aware", () => {
  const listRoute = readRepoFile("src/app/[locale]/demos/page.tsx");
  const detailRoute = readRepoFile("src/app/[locale]/demos/[slug]/page.tsx");

  assert.match(listRoute, /createLocalizedMetadata/);
  assert.match(listRoute, /isLocale/);
  assert.match(listRoute, /DemosExplorer/);
  assert.match(detailRoute, /export const dynamicParams = false/);
  assert.match(detailRoute, /getAllDemoSlugs\(\)/);
  assert.match(detailRoute, /getDemoBySlug/);
  assert.match(detailRoute, /createLocalizedMetadata/);
  assert.match(detailRoute, /notFound\(\)/);
});
