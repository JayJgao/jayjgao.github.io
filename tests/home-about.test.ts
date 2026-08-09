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
    principles: Array<{ title: string; body: string }>;
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
    supporting: "7+ years, AI 제품을 기획하고 출시해 스케일링까지 리드한 Product 운영 이력",
  },
  en: {
    headline: "Tinkering with the latest AI and building it into real-world products.",
    subheadline: "Building and scaling AI products\nfrom tabular ML to generative video.",
    supporting: "7+ years leading AI product planning, launch, and scale across domains",
  },
  zh: {
    headline: "Tinkering with the latest AI and building it into real-world products.",
    subheadline: "从表格机器学习到生成式视频\n持续打造并规模化 AI 产品。",
    supporting: "7+ 年 AI 产品从规划、发布到增长的全周期实战经验",
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

test("productized preview accessor returns the exact three productized records as deep copies", () => {
  const getProductizedDemos = (
    demosModule as unknown as {
      getProductizedDemos?: () => ReturnType<typeof demosModule.getAllDemos>;
    }
  ).getProductizedDemos;

  assert.equal(typeof getProductizedDemos, "function");
  const first = getProductizedDemos!();
  assert.deepEqual(first.map(({ slug }) => slug), [
    "prompt-enhancer",
    "voice-adaptor",
    "reverse-storyboard",
  ]);
  assert.equal(first.length, 3);
  assert.ok(first.every(({ productized }) => productized));

  first[0].summary.ko = "mutated";
  assert.notEqual(getProductizedDemos!()[0].summary.ko, "mutated");
});

test("home Demos preview is a server-only compact three-card proof section", () => {
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
    "the all-Demos link follows the three compact cards",
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

test("About data keeps the approved two-principle structure and Demos bridge", () => {
  const aboutNarratives = locales.map((locale) => readJson(`src/data/about.${locale}.json`));
  const messages = locales.map((locale) => readJson(`src/i18n/${locale}.json`));
  const expectedBridge = "프로토타입 검증 사례는 Demos에서 확인할 수 있습니다.";
  const expectedKoreanPrinciples = [
    {
      title: "먼저 문제와 성공 기준을 선명하게 만듭니다.",
      body: "제품의 인프라와 시스템, 시장을 구조화하고 C-level의 비전을 KPI, OKR, 제품 성공 기준으로 번역합니다. 직접 자사와 경쟁사 제품을 사용하며 아직 정의되지 않은 빈틈을 찾습니다.",
    },
    {
      title: "문제의 성격에 맞는 검증 방식을 선택합니다.",
      body: "코어 시스템과 맞물린 문제는 팀이 함께 풀 수 있는 화두로 만들고, 독립적으로 검증할 수 있는 사용자 마찰은 직접 프로토타이핑합니다. 결과가 가설을 지지하지 않으면 빠르게 멈추고, 증명된 과제에 실행을 집중합니다.",
    },
  ] as const;

  for (const narrative of aboutNarratives) {
    assert.equal(narrative.workingWithMe.principles.length, 2);
    assert.ok(narrative.workingWithMe.demosBridge.trim());
  }
  assert.deepEqual(aboutNarratives[0].workingWithMe.principles, expectedKoreanPrinciples);
  assert.equal(aboutNarratives[0].workingWithMe.demosBridge, expectedBridge);
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

test("About subsection headings stay language-invariant English across all locales", () => {
  for (const locale of locales) {
    const narrative = JSON.parse(
      readRepoFile(`src/data/about.${locale}.json`),
    ) as {
      markets: { kicker: string };
      workingWithMe: { kicker: string };
    };
    const messages = JSON.parse(
      readRepoFile(`src/i18n/${locale}.json`),
    ) as { about: { motivationKicker: string } };

    assert.equal(narrative.workingWithMe.kicker, "Working with Me");
    assert.equal(narrative.markets.kicker, "Three Languages, Three Markets");
    assert.equal(messages.about.motivationKicker, "What Moves Me");
  }
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

test("About renders structured Korean principles with a string fallback for untranslated locales", () => {
  const about = readRepoFile("src/app/[locale]/about/page.tsx");
  const aboutTypes = readRepoFile("src/types/about.ts");
  const styles = readRepoFile("src/styles/globals.css");

  assert.match(about, /typeof item === "string"/);
  assert.match(about, /item\.title/);
  assert.match(about, /item\.body/);
  assert.match(about, /className="about-principle-copy"/);
  assert.doesNotMatch(about, /<p>\{item\}<\/p>/);
  assert.match(aboutTypes, /Array<string \| \{ title: string; body: string \}>/);
  assert.match(styles, /\.about-principle-copy/);
  assert.match(styles, /text-wrap:\s*pretty/);
  assert.match(styles, /\.about-principle-copy p \{[\s\S]*?color:\s*var\(--muted\)/);
  assert.doesNotMatch(styles, /var\(--color-ink-muted\)/);
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
