import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

import projects from "../src/data/projects.json";
import frozenProjectFacts from "./fixtures/project-facts.json";
import originalProjectHeadings from "./fixtures/project-headings.json";
import { SUPPORTED_LOCALES, type Locale } from "../src/lib/locale";
import type { Project } from "../src/lib/projects";
import type { EraId } from "../src/types/content";

const dataUrl = (name: string) => new URL(`../src/data/${name}`, import.meta.url);
const messagesUrl = (locale: Locale) => new URL(`../src/i18n/${locale}.json`, import.meta.url);

function readJson(url: URL): unknown {
  return JSON.parse(readFileSync(url, "utf8")) as unknown;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function assertLocalizedText(value: unknown, context: string): asserts value is Record<Locale, string> {
  assert.ok(isRecord(value), `${context} must be a localized object`);

  for (const locale of SUPPORTED_LOCALES) {
    assert.equal(typeof value[locale], "string", `${context}.${locale} must be text`);
  }
}

function freezeProject(project: (typeof projects)[number]) {
  const oneLiner = ["cinev-ai-po-leadership", "cinev-ai-enablement"].includes(project.slug)
    ? { ko: project.oneLiner.ko }
    : project.oneLiner;

  return {
    slug: project.slug,
    era: project.era,
    featured: project.featured,
    showcaseOrder: project.showcaseOrder,
    company: project.company,
    role: project.role,
    contribution: project.contribution,
    tags: project.tags,
    thumbnail: project.thumbnail,
    primaryMetric: project.primaryMetric,
    demoUrl: project.demoUrl ?? null,
    oneLiner,
  };
}

const expectedEras = [
  {
    id: 1,
    name: { ko: "Classical ML", en: "Classical ML", zh: "Classical ML" },
    period: "2018-2022",
  },
  {
    id: 2,
    name: { ko: "LLM Application", en: "LLM Application", zh: "LLM Application" },
    period: "2023-2024",
  },
  {
    id: 3,
    name: {
      ko: "Generative AI Native",
      en: "Generative AI Native",
      zh: "Generative AI Native",
    },
    period: "2025–",
  },
] as const;

const expectedTimelineItems: Record<Locale, Record<"era1" | "era2", string[]>> = {
  ko: {
    era1: [
      "Solidware (Ailys)에서 일본 엔터프라이즈 13개 고객 확보, 연매출 100% 신장",
      "Lunit에서 비전 바이오마커 분석 SW 초기 기획",
    ],
    era2: [
      "BUZZNI에서 AIaaS 사업부 0명→20명 팀빌딩, MRR 10x 성장",
      "BUZZNI에서 Long→Short-form AI 비디오 편집기와 쇼핑 어시스턴트 챗봇 출시",
      "Dasan E&E에서 AI 과제개발 워크플로우 통합으로 사업 효율화 및 경영정상화 지원",
    ],
  },
  en: {
    era1: [
      "Solidware (Ailys) — Won 13 Japanese enterprise clients, YoY revenue +100%",
      "Lunit — Early product planning for vision biomarker analysis software",
    ],
    era2: [
      "BUZZNI — Built AIaaS unit from 0 to 20 members, MRR 10x growth",
      "BUZZNI — Launched Long→Short-form AI video editor and shopping assistant chatbot",
      "Dasan E&E — Integrated AI task development workflow for business efficiency and recovery support",
    ],
  },
  zh: {
    era1: [
      "Solidware (Ailys) — 拿下 13 家日本企业客户，年营收同比增长 100%",
      "Lunit — 视觉生物标志物分析软件早期产品规划",
    ],
    era2: [
      "BUZZNI — AIaaS 事业部从 0 到 20 人，MRR 增长 10 倍",
      "BUZZNI — 上线 Long→Short-form AI 视频编辑器与购物助手聊天机器人",
      "Dasan E&E — 整合 AI 课题开发流程，提升业务效率并支持经营恢复",
    ],
  },
};

const expectedEra3Ko = [
  "Cinamon AI PO Leadership → Web CineV 공식 출시, 실험 기능 3건 제품 통합",
  "Cinamon AI Technology & Org Enablement → AI Literacy와 비저닝 세션 13회, 웹팀 주도 Product Discovery",
  "Chroma Awards → Sponsor Award Top 11 Finalist",
] as const;

const expectedEra3Facts = [
  ["Cinamon", "AI PO Leadership", "CineV", "3"],
  ["Cinamon", "AI Technology & Org Enablement", "13", "Product Discovery"],
  ["Chroma Awards", "Sponsor Award", "Top 11 Finalist"],
] as const;

const expectedSpotlights = [
  {
    slug: "chroma-awards",
    provider: "vimeo",
    videoId: "1137973544",
    title: {
      ko: "Chroma Awards Top11 Finalist\nHappyend",
      en: "Chroma Awards Top11 Finalist\nHappyend",
      zh: "Chroma Awards Top11 Finalist\nHappyend",
    },
    workTitle: { ko: "Happyend", en: "Happyend", zh: "Happyend" },
    caption: {
      ko: "Sponsor Award Top 11 Finalist 작품",
      en: "Sponsor Award Top 11 Finalist selection",
      zh: "Sponsor Award Top 11 Finalist 入围作品",
    },
    poster: "/assets/images/projects/chroma/chroma-happyend-thumb.webp",
  },
  {
    slug: "chroma-awards",
    provider: "vimeo",
    videoId: "1137947360",
    title: {
      ko: "Chroma Awards\nMystery Invitation",
      en: "Chroma Awards\nMystery Invitation",
      zh: "Chroma Awards\nMystery Invitation",
    },
    workTitle: {
      ko: "Mystery Invitation",
      en: "Mystery Invitation",
      zh: "Mystery Invitation",
    },
    caption: {
      ko: "Chroma Awards Romance 트랙 본선 진출작",
      en: "Finalist entry in the Chroma Awards Romance track",
      zh: "Chroma Awards Romance 赛道入围作品",
    },
    poster: "/assets/images/projects/chroma/chroma-mystery-thumb.webp",
  },
  {
    slug: "chroma-awards",
    provider: "youtube",
    videoId: "4ngeQ9EJew4",
    title: {
      ko: "WAIFF\nGUHO Advertisement",
      en: "WAIFF\nGUHO Advertisement",
      zh: "WAIFF\nGUHO Advertisement",
    },
    workTitle: {
      ko: "GUHO Advertisement",
      en: "GUHO Advertisement",
      zh: "GUHO Advertisement",
    },
    caption: {
      ko: "WAIFF 2026 광고부문 출품작",
      en: "Submitted to WAIFF 2026 Ad category",
      zh: "WAIFF 2026 广告单元参赛作品",
    },
    poster: "/assets/images/projects/chroma/waiff-thumb.webp",
  },
  {
    slug: "chroma-awards",
    provider: "youtube",
    videoId: "hB03aGbuG04",
    title: {
      ko: "APEC AI 영상 공모전\n다시 여기, 경주",
      en: "APEC AI Video Contest\nBack Here, Gyeongju",
      zh: "APEC AI 视频大赛\n再次来到庆州",
    },
    workTitle: {
      ko: "다시 여기, 경주",
      en: "Back Here, Gyeongju",
      zh: "再次来到庆州",
    },
    caption: {
      ko: "2025APEC AI 영상 공모전 출품작",
      en: "Submitted to the 2025 APEC AI Video Contest",
      zh: "2025 APEC AI 视频大赛参赛作品",
    },
    poster: "/assets/images/projects/chroma/chroma-apec-thumb.webp",
  },
] as const;

test("projects preserve all frozen facts while owning normalized localized headings", () => {
  assert.equal(projects.length, 15);
  assert.equal(new Set(projects.map((project) => project.slug)).size, 15);
  assert.deepEqual(projects.map(freezeProject), frozenProjectFacts);
  assert.equal(originalProjectHeadings.length, 15);
  assert.equal(new Set(originalProjectHeadings.map((heading) => heading.slug)).size, 15);

  for (const project of projects) {
    const record = project as unknown as Record<string, unknown>;
    assert.equal(Object.hasOwn(record, "eraLabel"), false, `${project.slug} must not own eraLabel`);
    assertLocalizedText(record.title, `${project.slug}.title`);
    assertLocalizedText(record.subtitle, `${project.slug}.subtitle`);

    for (const locale of SUPPORTED_LOCALES) {
      assert.equal(
        record.title[locale].includes("—"),
        false,
        `${project.slug}.title.${locale} must not contain an em dash separator`,
      );
    }
  }

  for (const heading of originalProjectHeadings) {
    assert.deepEqual(Object.keys(heading), ["slug", "title"]);
    const project = projects.find((candidate) => candidate.slug === heading.slug);
    assert.ok(project, `${heading.slug} must exist`);

    for (const locale of SUPPORTED_LOCALES) {
      const original = heading.title[locale];
      const separatorIndex = original.indexOf(" — ");
      const expectedTitle = separatorIndex === -1 ? original : original.slice(0, separatorIndex);
      const expectedSubtitle = separatorIndex === -1 ? "" : original.slice(separatorIndex + 3);

      assert.equal(project.title[locale], expectedTitle, `${heading.slug}.title.${locale}`);
      assert.equal(project.subtitle[locale], expectedSubtitle, `${heading.slug}.subtitle.${locale}`);

      const recomposed: string = project.subtitle[locale]
        ? `${project.title[locale]} — ${project.subtitle[locale]}`
        : project.title[locale];
      assert.equal(recomposed, original, `${heading.slug}.${locale} must recompose exactly`);
    }
  }
});

test("project display titles reproduce every original localized heading", async () => {
  const projectsModule = await import("../src/lib/projects");
  const displayTitle = Reflect.get(projectsModule, "getProjectDisplayTitle") as unknown;
  assert.equal(typeof displayTitle, "function", "getProjectDisplayTitle must be exported");
  if (typeof displayTitle !== "function") return;

  const projectBySlug = new Map(
    (projects as unknown as Project[]).map((project) => [project.slug, project]),
  );

  for (const heading of originalProjectHeadings) {
    const project = projectBySlug.get(heading.slug);
    assert.ok(project, `${heading.slug} must exist`);

    for (const locale of SUPPORTED_LOCALES) {
      assert.equal(displayTitle(project, locale), heading.title[locale]);
    }
  }
});

test("required single-string project consumers use the canonical display title helper", () => {
  const metadataSource = readFileSync(
    new URL("../src/app/[locale]/projects/[slug]/page.tsx", import.meta.url),
    "utf8",
  );
  const caseStudySource = readFileSync(
    new URL("../src/components/projects/CaseStudy.tsx", import.meta.url),
    "utf8",
  );
  const projectCardSource = readFileSync(
    new URL("../src/components/projects/ProjectCard.tsx", import.meta.url),
    "utf8",
  );

  assert.match(metadataSource, /getProjectDisplayTitle\(project, locale\)/);
  assert.match(caseStudySource, /getProjectDisplayTitle\(prev, locale\)/);
  assert.match(caseStudySource, /getProjectDisplayTitle\(next, locale\)/);
  assert.match(projectCardSource, /getProjectDisplayTitle\(project, locale\)/);
  assert.doesNotMatch(projectCardSource, /\.join\(" — "\)/);
});

test("BUZZNI AIaaS and branding media have distinct highlight and Execution roles", () => {
  const aiaas = projects.find((project) => project.slug === "buzzni-aiaas-biz");
  const branding = projects.find((project) => project.slug === "buzzni-branding-marketing");
  assert.ok(aiaas);
  assert.ok(branding);

  assert.equal(aiaas.thumbnail, "/assets/images/projects/buzzni/aiaas-thumb.webp");
  assert.equal(
    branding.thumbnail,
    "/assets/images/projects/buzzni/buzzni-aiaas-biz-thumb.webp",
  );

  const aiaasMdx = readFileSync(
    new URL("../src/content/projects/ko/buzzni-aiaas-biz.mdx", import.meta.url),
    "utf8",
  );
  const brandingMdx = readFileSync(
    new URL("../src/content/projects/ko/buzzni-branding-marketing.mdx", import.meta.url),
    "utf8",
  );

  assert.doesNotMatch(aiaasMdx, /buzzni-aiaas-biz-thumb\.webp/);
  assert.equal(
    brandingMdx.match(/buzzni-branding-marketing-shot-02\.jpg/g)?.length,
    1,
    "the former branding highlight must appear once at the end of Execution",
  );
  const brandingExecution = brandingMdx.indexOf("## Execution");
  const brandingEvidence = brandingMdx.indexOf("buzzni-branding-marketing-shot-02.jpg");
  const brandingResults = brandingMdx.indexOf("## Results");
  assert.ok(brandingExecution < brandingEvidence && brandingEvidence < brandingResults);

  const assetManifest = readJson(dataUrl("asset-manifest.json"));
  assert.ok(isRecord(assetManifest));
  assert.ok(Array.isArray(assetManifest.projects));
  const aiaasAssets = assetManifest.projects.find(
    (entry) => isRecord(entry) && entry.slug === "buzzni-aiaas-biz",
  );
  const brandingAssets = assetManifest.projects.find(
    (entry) => isRecord(entry) && entry.slug === "buzzni-branding-marketing",
  );
  assert.ok(isRecord(aiaasAssets));
  assert.ok(isRecord(brandingAssets));
  assert.equal(aiaasAssets.thumbnail, "/assets/images/projects/buzzni/aiaas-thumb.webp");
  assert.equal(Object.hasOwn(aiaasAssets, "shot"), false);
  assert.equal(
    brandingAssets.thumbnail,
    "/assets/images/projects/buzzni/buzzni-aiaas-biz-thumb.webp",
  );
  assert.equal(
    brandingAssets.shot,
    "/assets/images/projects/buzzni/buzzni-branding-marketing-shot-02.jpg",
  );
});

test("Solidware Archive cards use the current company name consistently", () => {
  for (const slug of ["solidware-automl", "solidware-product-marketing"]) {
    const project = projects.find((candidate) => candidate.slug === slug);
    assert.ok(project);
    assert.equal(project.company, "Solidware");
  }
});

test("every project era resolves through the canonical localized Era data", async () => {
  const erasPath = dataUrl("eras.json");
  const erasModulePath = new URL("../src/lib/eras.ts", import.meta.url);
  assert.equal(existsSync(erasPath), true, "eras.json must exist");
  assert.equal(existsSync(erasModulePath), true, "eras.ts must exist");
  assert.deepEqual(readJson(erasPath), expectedEras);

  const { getAllEras, getEraById, getEraLabel } = await import("../src/lib/eras");
  assert.deepEqual(getAllEras(), expectedEras);

  for (const project of projects) {
    const eraId = project.era as EraId;
    const era = getEraById(eraId);
    assert.ok(era, `${project.slug} must resolve Era ${project.era}`);

    for (const locale of SUPPORTED_LOCALES) {
      assert.equal(getEraLabel(eraId, locale), `${era.name[locale]} (${era.period})`);
    }
  }
});

test("Era accessors isolate canonical data from returned-object mutations", async () => {
  const { getAllEras, getEraById, getEraLabel } = await import("../src/lib/eras");
  const canonical = expectedEras[0];
  const fromAll = getAllEras()[0];
  const fromById = getEraById(1);
  assert.ok(fromAll);
  assert.ok(fromById);

  try {
    fromAll.period = "mutated-period";
    fromAll.name.en = "Mutated from getAllEras";
    fromById.name.ko = "Mutated from getEraById";
    fromById.name.zh = "Mutated from getEraById";

    const freshAll = getAllEras()[0];
    const freshById = getEraById(1);
    assert.deepEqual(freshAll, canonical);
    assert.deepEqual(freshById, canonical);
    assert.equal(getEraLabel(1, "ko"), "Classical ML (2018-2022)");
    assert.notEqual(freshAll, fromAll);
    assert.notEqual(freshAll?.name, fromAll.name);
    assert.notEqual(freshById, fromById);
    assert.notEqual(freshById?.name, fromById.name);
  } finally {
    for (const era of [fromAll, fromById]) {
      era.period = canonical.period;
      era.name.ko = canonical.name.ko;
      era.name.en = canonical.name.en;
      era.name.zh = canonical.name.zh;
    }
  }
});

test("UI dictionaries keep only the all-project filter and localized timeline items", () => {
  for (const locale of SUPPORTED_LOCALES) {
    const messages = readJson(messagesUrl(locale));
    assert.ok(isRecord(messages));
    assert.ok(isRecord(messages.projects));
    assert.ok(isRecord(messages.projects.filter));
    assert.deepEqual(Object.keys(messages.projects.filter), ["all"]);
    assert.equal(Object.hasOwn(messages.projects, "eras"), false);

    assert.ok(isRecord(messages.home));
    assert.ok(isRecord(messages.home.timeline));
    assert.ok(isRecord(messages.home.timeline.eras));

    for (const eraKey of ["era1", "era2", "era3"] as const) {
      const timelineEra: unknown = messages.home.timeline.eras[eraKey];
      assert.ok(isRecord(timelineEra));
      assert.deepEqual(Object.keys(timelineEra), ["items"]);
      if (eraKey !== "era3") {
        assert.deepEqual(timelineEra.items, expectedTimelineItems[locale][eraKey]);
      } else if (locale === "ko") {
        assert.deepEqual(timelineEra.items, expectedEra3Ko);
      } else {
        assert.ok(Array.isArray(timelineEra.items));
        assert.equal(timelineEra.items.length, expectedEra3Facts.length);
        timelineEra.items.forEach((item, index) => {
          assert.equal(typeof item, "string");
          for (const fact of expectedEra3Facts[index]) assert.match(item, new RegExp(fact));
        });
      }
    }
  }
});

test("Korean Projects Archive presents the user-approved description", () => {
  const messages = readJson(messagesUrl("ko"));
  assert.ok(isRecord(messages));
  assert.ok(isRecord(messages.projects));
  assert.ok(isRecord(messages.projects.explorer));
  assert.equal(
    messages.projects.explorer.archiveDescription,
    "다양한 도메인에서 진행했던 프로젝트들의 목록입니다.",
  );
  assert.notEqual(
    messages.projects.explorer.archiveDescription,
    "축적된 실행 이력과 도메인 확장 트랙입니다.",
  );
});

test("spotlights move to the canonical filename without changing any record", () => {
  const currentPath = dataUrl("spotlights.json");
  const legacyPath = dataUrl("home-spotlights.json");
  assert.equal(existsSync(currentPath), true, "spotlights.json must exist");
  assert.deepEqual(readJson(currentPath), expectedSpotlights);
  assert.equal(existsSync(legacyPath), false, "home-spotlights.json must be deleted");
});
