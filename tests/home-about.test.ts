import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

import * as demosModule from "../src/lib/demos";

const repoRoot = new URL("..", import.meta.url);
const locales = ["ko", "en", "zh"] as const;

function readRepoFile(path: string): string {
  return readFileSync(new URL(path, repoRoot), "utf8");
}

type PortfolioJson = {
  home: {
    hero: {
      headline: string;
      subheadline: string;
      supporting: string;
      [key: string]: unknown;
    };
    demos: {
      viewAll: string;
    };
    [key: string]: unknown;
  };
  about: {
    demosCta: string;
    [key: string]: unknown;
  };
  workingWithMe: {
    principles: string[];
    demosBridge: string;
  };
  [key: string]: unknown;
};

function readJson(path: string): PortfolioJson {
  return JSON.parse(readRepoFile(path)) as PortfolioJson;
}

function shapeOf(value: unknown): unknown {
  if (Array.isArray(value)) return value.length === 0 ? [] : [shapeOf(value[0])];
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, nested]) => [key, shapeOf(nested)]),
    );
  }
  return typeof value;
}

const expectedHero = {
  ko: {
    headline: "Tinkering with the latest AI and building it into real-world products.",
    subheadline: "Tabular ML에서 생성형 비디오까지\nAI 제품을 만들고 성장시킵니다.",
    supporting: "6+ years, AI 제품 기획·출시·스케일링을 리드한 Product 운영 이력",
  },
  en: {
    headline: "Tinkering with the latest AI and building it into real-world products.",
    subheadline: "Building and scaling AI products\nfrom tabular ML to generative video.",
    supporting: "6+ years leading AI product planning, launch, and scale across domains",
  },
  zh: {
    headline: "Tinkering with the latest AI and building it into real-world products.",
    subheadline: "从表格机器学习到生成式视频\n持续打造并规模化 AI 产品。",
    supporting: "6+ 年 AI 产品从规划、发布到增长的全周期实战经验",
  },
} as const;

test("hero copy preserves the old narrative under the exact new hierarchy", () => {
  for (const locale of locales) {
    const messages = readJson(`src/i18n/${locale}.json`);
    assert.deepEqual(messages.home.hero, {
      ...messages.home.hero,
      ...expectedHero[locale],
    });
    assert.doesNotMatch(messages.home.hero.subheadline, /^—/m);
  }

  const hero = readRepoFile("src/components/home/HeroSection.tsx");
  const hierarchy = ["copy.headline.indexOf", "{copy.subheadline}", "{copy.supporting}"].map(
    (token) => hero.indexOf(token),
  );
  assert.ok(hierarchy.every((index) => index >= 0), "hero renders all three copy levels");
  assert.deepEqual([...hierarchy].sort((a, b) => a - b), hierarchy);
});

test("productized preview accessor returns the first four records as deep copies", () => {
  const getProductizedDemos = (
    demosModule as unknown as {
      getProductizedDemos?: () => ReturnType<typeof demosModule.getAllDemos>;
    }
  ).getProductizedDemos;

  assert.equal(typeof getProductizedDemos, "function");
  const first = getProductizedDemos!();
  assert.deepEqual(first.map(({ slug }) => slug), [
    "prompt-enhancer",
    "prompt-enhance-skills",
    "voice-adaptor",
    "reverse-storyboard",
  ]);
  assert.equal(first.length, 4);
  assert.ok(first.every(({ productized }) => productized));

  first[0].summary.ko = "mutated";
  assert.notEqual(getProductizedDemos!()[0].summary.ko, "mutated");
});

test("home Demos preview is a server-only compact four-card proof section", () => {
  assert.ok(
    existsSync(new URL("src/components/home/DemosPreview.tsx", repoRoot)),
    "DemosPreview server component must exist",
  );
  const preview = readRepoFile("src/components/home/DemosPreview.tsx");

  assert.doesNotMatch(preview, /^"use client";/);
  assert.match(preview, /getProductizedDemos/);
  assert.match(preview, /copy\.page\.kicker/);
  assert.match(preview, /copy\.groups\.productized\.title/);
  assert.match(preview, /copy\.groups\.productized\.description/);
  assert.match(preview, /variant="compact"/);
  assert.match(preview, /getLocalizedPath\(locale, "\/demos\/"\)/);
  assert.match(preview, /homeCopy\.viewAll/);
  assert.doesNotMatch(preview, /iframe|video|gallery|DemoVideo|DemoGallery/i);
  assert.ok(
    preview.indexOf("<DemoCard") < preview.indexOf("{homeCopy.viewAll}"),
    "the all-Demos link follows the four compact cards",
  );

  const card = readRepoFile("src/components/demos/DemoCard.tsx");
  assert.match(card, /variant\?:\s*"default"\s*\|\s*"compact"/);
  assert.match(card, /variant\s*=\s*"default"/);
  assert.match(card, /data-demo-card/);
  assert.match(card, /data-demo-slug/);
  assert.match(card, /copy\.status\.productized/);
  assert.match(card, /demo\.name/);
  assert.match(card, /demo\.summary\[locale\]/);
  assert.match(card, /copy\.card\.openDetail/);
  assert.match(card, /demo\.outcome\[locale\]/, "default list cards retain outcome copy");
});

test("localized Home uses the exact approved section order and markers", () => {
  const home = readRepoFile("src/app/[locale]/page.tsx");
  const components = [
    "<HeroSection",
    "<DemosPreview",
    "<FeaturedProjects",
    "<VideoSpotlightCarousel",
    "<CareerTimeline",
  ];
  const componentIndexes = components.map((component) => home.indexOf(component));
  assert.ok(componentIndexes.every((index) => index >= 0));
  assert.deepEqual([...componentIndexes].sort((a, b) => a - b), componentIndexes);

  const markers = ["hero", "demos", "featured", "spotlight", "timeline"];
  const markerIndexes = markers.map((marker) =>
    home.indexOf(`data-home-section="${marker}"`),
  );
  assert.ok(markerIndexes.every((index) => index >= 0));
  assert.deepEqual([...markerIndexes].sort((a, b) => a - b), markerIndexes);
  assert.equal((home.match(/data-home-section=/g) ?? []).length, 5);
  assert.match(home, /params:\s*Promise<\{ locale: string \}>/);
  assert.match(home, /isLocale\(locale\)/);
  assert.match(home, /<DemosPreview locale=\{locale\}/);
  assert.match(home, /description:\s*`\$\{copy\.headline\} \$\{copy\.subheadline\} \$\{copy\.supporting\}`/);
});

test("About data keeps two principles and replaces the third with the exact Demos bridge", () => {
  const aboutNarratives = locales.map((locale) => readJson(`src/data/about.${locale}.json`));
  const messages = locales.map((locale) => readJson(`src/i18n/${locale}.json`));
  const expectedBridge = "프로토타입 검증 사례는 Demos에서 확인할 수 있습니다.";
  const expectedPrinciples = {
    ko: [
      "시장과 제품에 대한 이해가 최우선입니다. 모호한 채로 실행하지 않습니다.",
      "영역이 어디든 막힌 곳에 개입해 사이클을 돌립니다. 제품부터 영업·조직까지.",
    ],
    en: [
      "I prioritize understanding market and product context first. I do not execute under ambiguity.",
      "Wherever bottlenecks appear, I step in and move cycles forward, across product, sales, and team operations.",
    ],
    zh: [
      "我优先对齐市场与产品理解，不在模糊状态下推进执行。",
      "无论瓶颈出现在何处，我都会介入并推动循环，从产品到销售再到组织协作。",
    ],
  } as const;

  for (const [index, narrative] of aboutNarratives.entries()) {
    assert.equal(narrative.workingWithMe.principles.length, 2);
    assert.deepEqual(narrative.workingWithMe.principles, expectedPrinciples[locales[index]]);
    assert.equal(narrative.workingWithMe.demosBridge, expectedBridge);
  }
  for (const dictionary of messages) {
    assert.equal(dictionary.about.demosCta, "View Demos");
    assert.equal(dictionary.home.demos.viewAll, "View All Demos");
  }

  assert.deepEqual(shapeOf(aboutNarratives[0]), shapeOf(aboutNarratives[1]));
  assert.deepEqual(shapeOf(aboutNarratives[0]), shapeOf(aboutNarratives[2]));
  assert.deepEqual(shapeOf(messages[0].home), shapeOf(messages[1].home));
  assert.deepEqual(shapeOf(messages[0].home), shapeOf(messages[2].home));
  assert.deepEqual(shapeOf(messages[0].about), shapeOf(messages[1].about));
  assert.deepEqual(shapeOf(messages[0].about), shapeOf(messages[2].about));
});

test("About renders the exact approved order, markers, and locale-aware Demos bridge", () => {
  const about = readRepoFile("src/app/[locale]/about/page.tsx");
  const markers = ["opening", "how-i-work", "markets", "why-ai"];
  const indexes = markers.map((marker) =>
    about.indexOf(`data-about-section="${marker}"`),
  );

  assert.ok(indexes.every((index) => index >= 0));
  assert.deepEqual([...indexes].sort((a, b) => a - b), indexes);
  assert.equal((about.match(/data-about-section=/g) ?? []).length, 4);
  assert.match(about, /narrative\.workingWithMe\.demosBridge/);
  assert.match(about, /getLocalizedPath\(locale, "\/demos\/"\)/);
  assert.match(about, /messages\.about\.demosCta/);
  assert.doesNotMatch(about, /바이브코딩으로 프로토타입을 먼저 만들고 설득합니다/);
});

test("About exposes three post-opening section headings through its accessible outline", () => {
  const about = readRepoFile("src/app/[locale]/about/page.tsx");
  const h1Index = about.indexOf("<h1");
  const sections = [
    {
      marker: "how-i-work",
      id: "about-how-i-work-title",
      copy: "{narrative.workingWithMe.kicker}",
    },
    {
      marker: "markets",
      id: "about-markets-title",
      copy: "{narrative.markets.kicker}",
    },
    {
      marker: "why-ai",
      id: "about-why-ai-title",
      copy: "{messages.about.motivationKicker}",
    },
  ] as const;

  assert.ok(h1Index >= 0, "Opening keeps the page h1");
  assert.equal((about.match(/<h2\b/g) ?? []).length, 3);

  for (const { marker, id, copy } of sections) {
    const sectionIndex = about.indexOf(`data-about-section="${marker}"`);
    const sectionOpenEnd = about.indexOf(">", sectionIndex);
    const headingIndex = about.indexOf(
      `<h2 id="${id}" className="section-kicker">${copy}</h2>`,
    );

    assert.ok(sectionIndex > h1Index, `${marker} follows the Opening h1`);
    assert.match(
      about.slice(sectionIndex, sectionOpenEnd),
      new RegExp(`aria-labelledby="${id}"`),
      `${marker} is labelled by its h2`,
    );
    assert.ok(headingIndex > sectionOpenEnd, `${marker} renders the associated h2`);
  }
});
