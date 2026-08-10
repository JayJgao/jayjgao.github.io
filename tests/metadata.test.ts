import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

import * as metadataModule from "../src/lib/metadata";

const {
  createLegacyMetadata,
  createLocalizedMetadata,
  KOREAN_HOME_DESCRIPTION,
  SITE_URL,
} = metadataModule;

test("legacy redirect metadata has a descriptive title", () => {
  const metadata = createLegacyMetadata("/");

  assert.equal(typeof metadata.title, "string");
  if (typeof metadata.title !== "string") assert.fail("legacy title must be text");
  assert.ok(metadata.title.trim().length > 0);
});

test("localized metadata uses absolute canonical and language alternate URLs", () => {
  const metadata = createLocalizedMetadata({
    locale: "en",
    path: "/projects/cinev-s2m/",
    title: "S2M | Jay Ko",
    description: "An AI product case study.",
  });

  assert.equal(SITE_URL, "https://jayjgao.github.io");
  assert.equal(
    metadata.alternates?.canonical,
    "https://jayjgao.github.io/en/projects/cinev-s2m/",
  );
  assert.deepEqual(metadata.alternates?.languages, {
    ko: "https://jayjgao.github.io/ko/projects/cinev-s2m/",
    en: "https://jayjgao.github.io/en/projects/cinev-s2m/",
    zh: "https://jayjgao.github.io/zh/projects/cinev-s2m/",
    "x-default": "https://jayjgao.github.io/ko/projects/cinev-s2m/",
  });
  assert.equal(metadata.title, "S2M | Jay Ko");
  assert.equal(metadata.description, "An AI product case study.");
  assert.equal(
    metadata.openGraph?.url,
    "https://jayjgao.github.io/en/projects/cinev-s2m/",
  );
  assert.equal(metadata.openGraph?.title, "S2M | Jay Ko");
  assert.equal(metadata.openGraph?.description, "An AI product case study.");
});

test("Home metadata uses the approved Korean share description without changing other locales", () => {
  const createHomeDescription = (
    metadataModule as typeof metadataModule & {
      createHomeDescription?: (
        locale: "ko" | "en" | "zh",
        copy: { headline: string; subheadline: string; supporting: string },
      ) => string;
    }
  ).createHomeDescription;

  assert.equal(typeof createHomeDescription, "function");

  const copy = {
    headline: "Headline",
    subheadline: "Line one\nLine two",
    supporting: "Supporting",
  };
  assert.equal(
    createHomeDescription!("ko", copy),
    "Tabular ML에서 생성형 비디오까지, AI 제품을 만들고 성장시키는 Jay Ko 입니다.",
  );
  assert.equal(
    createHomeDescription!("en", copy),
    "Headline Line one\nLine two Supporting",
  );
  assert.equal(
    createHomeDescription!("zh", copy),
    "Headline Line one\nLine two Supporting",
  );
});

test("the root locale redirect shares Korean Home metadata with crawlers", async () => {
  const route = await import("../src/app/(redirect)/page");

  assert.equal(route.metadata.title, "고재현 | AI Product Leader");
  assert.equal(route.metadata.description, KOREAN_HOME_DESCRIPTION);
  assert.equal(
    route.metadata.alternates?.canonical,
    "https://jayjgao.github.io/ko/",
  );
  assert.equal(route.metadata.openGraph?.title, "고재현 | AI Product Leader");
  assert.equal(
    route.metadata.openGraph?.description,
    KOREAN_HOME_DESCRIPTION,
  );
  assert.equal(
    route.metadata.openGraph?.url,
    "https://jayjgao.github.io/ko/",
  );
  assert.deepEqual(route.metadata.robots, {
    index: false,
    follow: true,
  });
});

test("the app ships the approved self-contained Jay Ko SVG favicon", () => {
  const iconUrl = new URL("../src/app/icon.svg", import.meta.url);
  const legacyFaviconUrl = new URL("../src/app/favicon.ico", import.meta.url);

  assert.equal(existsSync(iconUrl), true, "the custom SVG favicon must exist");
  assert.equal(existsSync(legacyFaviconUrl), false, "the default favicon must be removed");

  const icon = readFileSync(iconUrl, "utf8");
  assert.match(icon, /viewBox="0 0 64 64"/);
  for (const color of ["#f4e9e1", "#0e0e0e", "#2835f8", "#ff5c00"]) {
    assert.match(icon, new RegExp(color));
  }
  assert.match(icon, /<path[^>]+fill="#2835f8"/);
  assert.match(icon, /<circle[^>]+fill="#ff5c00"/);
  assert.doesNotMatch(icon, /<text|<script|data:|\b(?:href|src)=["']https?:/i);
});
