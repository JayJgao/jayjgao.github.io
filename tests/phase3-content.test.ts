import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { extname, join } from "node:path";
import test from "node:test";
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { LocaleProvider } from "../src/components/i18n/LocaleProvider";
import { ResumeRenderer } from "../src/components/resume/ResumeRenderer";
import aboutKo from "../src/data/about.ko.json";
import demosJson from "../src/data/demos.json";
import eras from "../src/data/eras.json";
import projects from "../src/data/projects.json";
import resumeKo from "../src/data/resume.ko.json";
import spotlights from "../src/data/spotlights.json";
import messagesKo from "../src/i18n/ko.json";
import { getDemoVideoMode } from "../src/lib/demos";
import type { Demo } from "../src/types/demo";

const repoRoot = new URL("..", import.meta.url);

Object.assign(globalThis, { React });

type LocalizedCopy = Record<"ko" | "en" | "zh", string>;
type ContractDemo = {
  slug: string;
  order: number;
  productized: boolean;
  kind: string;
  observation: LocalizedCopy;
  hypothesis: LocalizedCopy;
  outcome: LocalizedCopy;
  stack: Array<{ items: LocalizedCopy[] }>;
  [key: string]: unknown;
};

function readRepoFile(path: string): string {
  return readFileSync(new URL(path, repoRoot), "utf8");
}

function readRepoBytes(path: string): Buffer {
  return readFileSync(new URL(path, repoRoot));
}

function sha256(bytes: Uint8Array): string {
  return createHash("sha256").update(bytes).digest("hex");
}

function collectPublicCopyFiles(directory: string): string[] {
  const absoluteDirectory = new URL(directory, repoRoot).pathname;
  const files: string[] = [];

  function visit(current: string): void {
    for (const entry of readdirSync(current, { withFileTypes: true })) {
      const path = join(current, entry.name);
      if (entry.isDirectory()) visit(path);
      else if ([".json", ".mdx"].includes(extname(entry.name))) files.push(path);
    }
  }

  visit(absoluteDirectory);
  return files;
}

const forbiddenPublicCopyPatterns = [
  /\bMAU\b/i,
  /1\.5\s*만/,
  /NDA\s*%/i,
  /(?:NDA[^\n.]{0,100}\d+(?:\.\d+)?\s*%|\d+(?:\.\d+)?\s*%[^\n.]{0,100}(?:under\s+)?NDA)/i,
  /(?:(?:내부\s*)?실패율|(?:private\s+)?failure rates?)[^\n.]{0,100}\d+(?:\.\d+)?\s*%|\d+(?:\.\d+)?\s*%[^\n.]{0,100}(?:(?:내부\s*)?실패율|(?:private\s+)?failure rates?)/i,
  /github\.com\/CINEV/i,
  /(?:[a-z0-9-]+\.)?cinamon\.(?:io|internal)/i,
  /cinev-s2m-shot-01\.webp/i,
  /3D Proxy[^\n.]{0,100}(?:내부 구조|실패율|failure rate)/i,
  /Asset 관리 시스템[^\n.]{0,120}(?:데이터 구조|생성 방식|연결 규칙|내부 화면)/i,
  /(?:데이터 구조|생성 방식|연결 규칙|내부 화면)[^\n.]{0,120}Asset 관리 시스템/i,
] as const;

function assertPublicCopySafe(copy: string): void {
  for (const forbidden of forbiddenPublicCopyPatterns) assert.doesNotMatch(copy, forbidden);
}

const expectedFeaturedSlugs = [
  "cinev-ai-po-leadership",
  "cinev-ai-enablement",
  "chroma-awards",
  "buzzni-shortform-ai",
  "buzzni-aiaas-biz",
  "solidware-mlaas",
] as const;

const expectedDemoSlugs = [
  "prompt-enhancer",
  "voice-adaptor",
  "reverse-storyboard",
  "reframer",
  "boundary-deduper",
  "iro-matcher",
  "loudness-matcher",
  "script-to-bgm",
] as const;

const expectedEra3Items = [
  "Cinamon AI PO Leadership → Web CineV 공식 출시, 실험 기능 3건 제품 통합",
  "Cinamon AI Technology & Org Enablement → AI Literacy와 비저닝 세션 13회, 웹팀 주도 Product Discovery",
  "Chroma Awards → Sponsor Award Top 11 Finalist",
] as const;

const expectedAboutKo = {
  title: "About Jay Ko",
  opening: {
    quote: "아직 언어로서 규명되지 않은 문제를 찾고, 기술의 언어로 번역해 성과로 연결합니다.",
    body: [
      "핀테크 AutoML, 의료 Computer Vision, 이커머스 LLM Application, 생성형 AI 영상 제품을 거치며 팀 빌딩, 엔터프라이즈 계약, MRR 10배 성장, 웹 제품 공식 출시까지 일관된 성과를 만들어왔습니다.",
      "새로운 도메인에서는 제품의 인프라와 시스템, 시장을 먼저 구조화한 뒤 직접 자사와 경쟁사 제품을 사용하며 정의되지 않은 빈틈을 찾습니다. 문제의 성격에 따라 조직의 화두로 만들거나 직접 프로토타이핑하고, 실제 성과가 나올 때까지 팀과 함께 실행합니다.",
    ],
  },
  markets: {
    kicker: "Three Languages, Three Markets",
    intro: "세 언어로 서로 다른 시장의 제품과 사업을 직접 다뤄왔습니다.",
    items: [
      { language: "중국어", detail: "네이티브 수준. 칭화대 최우수 졸업논문 수상." },
      { language: "영어", detail: "비즈니스 프로페셔널. 글로벌 프로젝트와 국제 대회 경험." },
      { language: "일본어", detail: "비즈니스 기초. 일본 엔터프라이즈 고객 대상 제품과 사업 경험." },
    ],
  },
  motivation: {
    body: [
      "인간이 이해하고 개념으로 정의할 수 있는 범위가 넓어질수록, 해결할 수 있는 문제의 범위도 넓어진다고 믿습니다. 새로운 산업과 기술을 배우며 지식의 너비와 깊이를 확장하는 일은 제게 성장의 방식이자 더 나은 성과를 만들기 위한 조건입니다.",
      "저는 문제를 정의하는 일을 즐깁니다. AI는 혼자라면 정의에 머물렀을 문제를 실제 실험과 해결로 이어지게 하는 파트너입니다. 더 많은 기업에서 이 정의와 해결의 즐거움을 팀과 함께 경험하고 싶어 이 일을 계속합니다.",
    ],
    belief: "AI는 문제 정의의 즐거움을 해결의 즐거움으로 확장합니다.",
  },
  workingWithMe: {
    kicker: "Working with Me",
    lead: "Clarity first. Then speed.",
    principles: [
      {
        title: "먼저 문제와 성공 기준을 선명하게 만듭니다.",
        body: "제품의 인프라와 시스템, 시장을 구조화하고 C-level의 비전을 KPI, OKR, 제품 성공 기준으로 번역합니다. 직접 자사와 경쟁사 제품을 사용하며 아직 정의되지 않은 빈틈을 찾습니다.",
      },
      {
        title: "문제의 성격에 맞는 검증 방식을 선택합니다.",
        body: "코어 시스템과 맞물린 문제는 팀이 함께 풀 수 있는 화두로 만들고, 독립적으로 검증할 수 있는 사용자 마찰은 직접 프로토타이핑합니다. 결과가 가설을 지지하지 않으면 빠르게 멈추고, 증명된 과제에 실행을 집중합니다.",
      },
    ],
    demosBridge: "프로토타입 검증 사례는 Demos에서 확인할 수 있습니다.",
  },
} as const;

const expectedResumeSkills = {
  "AI Product Leadership": [
    "Product Strategy and KPI/OKR",
    "Product Discovery and Hypothesis Validation",
    "Cross-functional Leadership and Team Building",
    "B2B Go-to-Market",
  ],
  "AI Systems": [
    "LLM Applications and Agents",
    "Context Engineering and AI Evals",
    "Generative Media and Computer Vision",
    "Model Routing and Integration",
  ],
  "Technical Execution": [
    "Rapid Prototyping",
    "System Architecture",
    "API Design",
    "Product Analytics",
  ],
  "Selected Tools": ["SQL", "Google Analytics", "LangChain / LangGraph"],
} as const;

const expectedCinamonHighlights = [
  "Film Agent E2E 통합에서 시작한 방향 전환, 3년 레거시 정리 합의, 2026년 7월 웹 CineV 공식 출시",
  "Conditioning과 컨텍스트 관리, 서사와 비주얼 일관성 연구, 120+ 동일 장면 검증, Asset 관리 시스템 제품 통합",
  "실험 기능 3건 제품 통합, 내부 Eval 플랫폼을 통한 모델 2건 통합과 유저스터디 6회 운영, AI Literacy와 비저닝 세션 13회 진행, 웹팀 주도 Product Discovery 프로그램 설계와 운영",
  "외부 모델 라우팅을 통한 7개 이상 영역과 모델 30종 이상 제품 통합",
] as const;

const expectedResumeSummaryParagraphs = [
  "산업과 제품의 구조를 빠르게 파악하고, 아직 언어로서 규명되지 않은 문제를 기술의 언어로 번역해 제품과 사업 성과로 연결하는 AI Product Leader입니다.",
  "핀테크 AutoML, 의료 Computer Vision, 이커머스 LLM Application, 생성형 AI 영상 제품을 거치며 팀 빌딩, 엔터프라이즈 계약, MRR 10배 성장, 웹 제품 공식 출시까지 일관된 성과를 만들어왔습니다.",
  "새로운 도메인에서는 제품의 인프라와 시스템, 시장을 먼저 구조화한 뒤 직접 자사와 경쟁사 제품을 사용하며 정의되지 않은 빈틈을 찾습니다. 코어 시스템과 강하게 맞물린 문제는 조직의 화두로 만들고, 독립적으로 검증할 수 있는 사용자 마찰은 직접 프로토타이핑합니다. 구현에 머물지 않고 계약과 결제 전환, Golden Path를 이탈하지 않은 채 FSO (First Satisfactory Output)에 도달하는 것처럼 실제 성과가 나올 때까지 팀과 함께 실행합니다.",
] as const;

const expectedUnchangedResumeExperience = [
  {
    company: "BUZZNI",
    role: "AI PM / Team Lead",
    period: "2023.04 - 2025.03",
    highlights: [
      "AIaaS 사업부를 제로에서 20명 규모로 빌딩 및 리딩",
      "MRR 500만 원에서 5,200만 원으로 10배 성장, 신규 고객사 12개 확보",
      "Long→Short-form AI 비디오 편집기와 쇼핑 챗봇 2개 서비스 0→1 출시",
    ],
  },
  {
    company: "Dasan E&E",
    role: "Business Operations Manager",
    period: "2022.06 - 2023.03",
    highlights: [
      "가업(HR 컨설팅) 사업운영 고도화 및 경영정상화 지원",
      "운영 프로세스 재정비와 사업 전략 실행 체계 수립",
    ],
  },
  {
    company: "Lunit",
    role: "AI Product Manager",
    period: "2022.01 - 2022.04",
    highlights: ["비전 바이오마커 분석 SW 초기 PRD 및 규제 문서 기반 요구사항 정의"],
  },
  {
    company: "Solidware (Ailys)",
    role: "AI PM / New Business Team Lead",
    period: "2018.12 - 2021.12",
    highlights: [
      "일본 엔터프라이즈 13개 고객 확보 (Mitsubishi, AEON 등)",
      "연매출 100% 성장 및 영업 접점 256% 확대",
      "정부과제 총 15억 원 규모 수주",
    ],
  },
] as const;

test("Phase 3 fixes the exact 15-project composition and Featured order", () => {
  assert.equal(projects.length, 15);
  assert.equal(new Set(projects.map(({ slug }) => slug)).size, 15);

  const featured = projects
    .filter(({ featured }) => featured)
    .sort((a, b) => (a.showcaseOrder ?? Infinity) - (b.showcaseOrder ?? Infinity));
  assert.deepEqual(featured.map(({ slug }) => slug), expectedFeaturedSlugs);

  const bySlug = new Map(projects.map((project) => [project.slug, project]));
  assert.equal(bySlug.get("cinev-ai-po-leadership")?.contribution, 60);
  assert.equal(bySlug.get("cinev-ai-enablement")?.contribution, 90);
  assert.deepEqual(
    ["cinev-s2m", "cinev-moai"].map((slug) => ({
      slug,
      featured: bySlug.get(slug)?.featured,
      showcaseOrder: bySlug.get(slug)?.showcaseOrder,
    })),
    [
      { slug: "cinev-s2m", featured: false, showcaseOrder: null },
      { slug: "cinev-moai", featured: false, showcaseOrder: null },
    ],
  );
  assert.equal(bySlug.has("cinev-a2p"), false);
});

test("Phase 3 fixes the exact eight-Demo canon and three-card Home preview", async () => {
  const demos = demosJson as unknown as ContractDemo[];
  assert.deepEqual(demos.map(({ slug }) => slug), expectedDemoSlugs);
  assert.deepEqual(demos.map(({ order }) => order), [1, 2, 3, 4, 5, 6, 7, 8]);
  assert.equal(demos.filter(({ productized }) => productized).length, 3);
  assert.ok(demos.every(({ kind }) => kind !== "skill"));
  assert.ok(demos.every((demo) => !Object.hasOwn(demo, "relatedDemo")));
  assert.deepEqual(
    demos.map((demo) => getDemoVideoMode(demo as unknown as Demo)),
    ["available", "available", "available", "available", "available", "available", "available", "none"],
  );

  const { getProductizedDemos } = await import("../src/lib/demos");
  assert.deepEqual(getProductizedDemos().map(({ slug }) => slug), expectedDemoSlugs.slice(0, 3));
});

test("Korean Era 3, About, and Resume copy exactly match the approved canon", () => {
  const era3 = eras.find(({ id }) => id === 3);
  assert.deepEqual(era3, {
    id: 3,
    name: { ko: "Generative AI Native", en: "Generative AI Native", zh: "Generative AI Native" },
    period: "2025–",
  });
  assert.deepEqual(messagesKo.home.timeline.eras.era3.items, expectedEra3Items);
  assert.deepEqual(aboutKo, expectedAboutKo);

  assert.equal(resumeKo.meta.subtitle, "7+ Years | Tabular ML → Computer Vision → LLM Application → Generative AI");
  assert.deepEqual(resumeKo.summary, expectedResumeSummaryParagraphs);
  assert.doesNotMatch(JSON.stringify(resumeKo.summary), /\\n\\n/);
  assert.equal(
    resumeKo.experience.find(({ company }) => company === "BUZZNI")?.period,
    "2023.04 - 2025.03",
  );
  const summaryText = Array.isArray(resumeKo.summary)
    ? resumeKo.summary.join(" ")
    : resumeKo.summary;
  assert.match(summaryText, /FSO \(First Satisfactory Output\)/);
  assert.doesNotMatch(summaryText, /FSO\(First Satisfactory Output\)/);
  assert.deepEqual(
    resumeKo.experience.find(({ company }) => company === "Cinamon (CineV)")?.highlights,
    expectedCinamonHighlights,
  );
  assert.deepEqual(
    resumeKo.experience.filter(({ company }) => company !== "Cinamon (CineV)"),
    expectedUnchangedResumeExperience,
  );
  assert.deepEqual(resumeKo.skills, expectedResumeSkills);
  assert.equal(Object.keys(resumeKo.skills).length, 4);
  assert.deepEqual(resumeKo.achievements, [
    "ML 특허 3건",
    "KSC 2023 논문 발표",
    "ElevenLabs Chroma Awards 2025 Sponsor Award Top 11 Finalist",
  ]);
  assert.doesNotMatch(JSON.stringify(resumeKo), /출원 진행중|컨소시엄/);
});

test("approved Korean copy remains wrapping-safe without manual line breaks", () => {
  const strings = [
    aboutKo.opening.quote,
    ...aboutKo.opening.body,
    aboutKo.markets.intro,
    ...aboutKo.markets.items.flatMap(({ language, detail }) => [language, detail]),
    ...aboutKo.motivation.body,
    aboutKo.motivation.belief,
    ...aboutKo.workingWithMe.principles.flatMap(({ title, body }) => [title, body]),
    aboutKo.workingWithMe.demosBridge,
    ...expectedResumeSummaryParagraphs,
    ...expectedCinamonHighlights,
    ...messagesKo.home.timeline.eras.era3.items,
    messagesKo.projects.explorer.archiveDescription,
  ];

  for (const copy of strings) assert.doesNotMatch(copy, /\r|\n/);
});

test("Resume renderer accepts locale-specific skill and summary shapes", () => {
  const renderer = readRepoFile("src/components/resume/ResumeRenderer.tsx");
  assert.match(renderer, /Omit<typeof resumeKo, "skills" \| "summary">/);
  assert.match(renderer, /summary:\s*string \| string\[\]/);
  assert.match(renderer, /skills:\s*Record<string, string\[\]>/);
  assert.match(renderer, /Array\.isArray\(data\.summary\)/);
  assert.doesNotMatch(renderer, /type ResumeData = typeof resumeKo;/);
  assert.doesNotMatch(renderer, /white-space:\s*pre-line|<br\b/);
});

test("Resume renders each Korean summary paragraph semantically with single-string locale fallback", () => {
  const expectedCounts = { ko: 3, en: 1, zh: 1 } as const;

  for (const locale of ["ko", "en", "zh"] as const) {
    const html = renderToStaticMarkup(
      React.createElement(
        LocaleProvider as React.ComponentType<{ locale: typeof locale }>,
        { locale },
        React.createElement(ResumeRenderer),
      ),
    );
    const summarySection = html.match(
      /<section class="resume-section" data-resume-section="summary">[\s\S]*?<\/section>/,
    )?.[0];

    assert.ok(summarySection, `${locale} summary section renders`);
    assert.equal(
      (summarySection.match(/<p class="resume-summary">/g) ?? []).length,
      expectedCounts[locale],
    );
    assert.doesNotMatch(summarySection, /<br\b|\n\n/);
  }
});

test("Korean i18n and spotlight prose avoid em-dash and middle-dot connectors", () => {
  const spotlightCopy = spotlights.flatMap(({ title, workTitle, caption }) => [
    title.ko,
    workTitle.ko,
    caption.ko,
  ]);
  const auditedCopy = [
    messagesKo.home.hero.supporting,
    ...messagesKo.home.timeline.eras.era1.items,
    ...messagesKo.home.timeline.eras.era2.items,
    ...messagesKo.home.timeline.eras.era3.items,
    ...spotlightCopy,
  ];

  for (const copy of auditedCopy) assert.doesNotMatch(copy, /[—·]/);
});

test("approved Demo corrections and Prompt Enhancer stack boundaries are exact", () => {
  const demos = demosJson as unknown as ContractDemo[];
  const bySlug = new Map(demos.map((demo) => [demo.slug, demo]));
  const getKo = (slug: string, field: "hypothesis" | "observation" | "outcome"): string =>
    bySlug.get(slug)?.[field].ko ?? "";

  assert.equal(
    getKo("voice-adaptor", "outcome"),
    "음성과 배경음 분리 기능을 제품에 통합했습니다. 기존 TTS 기능은 유지했으며, 화자별 후보 생성과 검토 흐름은 프로토타입 검증 범위로 남았습니다.",
  );
  assert.match(getKo("reverse-storyboard", "hypothesis"), /저사양 비디오 모델/);
  assert.doesNotMatch(JSON.stringify(bySlug.get("reverse-storyboard")), /저품질 비디오 모델/);
  assert.match(JSON.stringify(bySlug.get("reverse-storyboard")), /휴리스틱/);
  assert.match(JSON.stringify(bySlug.get("reverse-storyboard")), /비전 언어 모델/);
  assert.match(getKo("iro-matcher", "hypothesis"), /LUT 기반 방식/);
  assert.doesNotMatch(getKo("iro-matcher", "hypothesis"), /LUT와 유사한 방식/);
  assert.equal(
    getKo("script-to-bgm", "observation"),
    "짧은 AI 클립에서는 장면의 흐름과 정서를 연결하기 위해 영상에 어울리는 BGM을 별도로 탐색해야 했습니다.",
  );

  const promptStack = bySlug.get("prompt-enhancer")?.stack ?? [];
  const promptCopy = JSON.stringify(bySlug.get("prompt-enhancer"));
  assert.equal(
    getKo("prompt-enhancer", "observation"),
    "이미지와 비디오 생성 모델은 같은 의도라도 프롬프트를 어떻게 쓰느냐에 따라 결과 편차가 컸고, 그 노하우가 개인의 작업 방식 안에만 쌓여 있었다. 그래서 조직 내부용 Skill을 만들어 배포했고, 예상보다 빠른 사용 확산이 관측됐다. 프롬프트 작성이 실제 병목이라는 신호였다.",
  );
  assert.match(promptCopy, /prompt-enhancer-before-api\.svg/);
  for (const required of ["nanotape", "seehorse", "Organization Skill", "정성 평가", "제품 API"]) {
    assert.match(promptCopy, new RegExp(required));
  }
  const groupItems = promptStack.map(({ items }) => items.map((item: Record<string, string>) => item.ko));
  const apiGroup = groupItems.find((items) => items.some((item) => item.includes("OpenAI Responses API")));
  const targetGroup = groupItems.find((items) =>
    ["GPT Image 2", "nano banana", "Seedance 2.0", "HappyHorse"].every((target) =>
      items.some((item) => item.includes(target)),
    ),
  );
  assert.ok(apiGroup, "Prompt Enhancer must identify OpenAI Responses API as the transform API");
  assert.ok(targetGroup, "Prompt Enhancer must group all prompt-target generation models");
  assert.notEqual(apiGroup, targetGroup, "transform API and prompt-target models must be separate groups");
});

test("public data and MDX stay inside the approved confidentiality boundary", () => {
  const publicCopy = ["src/data/", "src/i18n/", "src/content/"]
    .flatMap(collectPublicCopyFiles)
    .map((path) => `${path}\n${readFileSync(path, "utf8")}`)
    .join("\n");

  assertPublicCopySafe(publicCopy);
});

test("confidentiality helper rejects synthetic NDA and private failure-rate mutations", () => {
  for (const mutation of [
    "NDA 40%",
    "40% under NDA",
    "내부 실패율은 47%였습니다.",
    "47% private failure rate",
    "failure rate was 12.5%",
  ]) {
    assert.throws(() => assertPublicCopySafe(mutation), assert.AssertionError, mutation);
  }
  assert.doesNotThrow(() => assertPublicCopySafe("5명이 120개 이상의 동일 장면을 검토했습니다."));
});

test("the obsolete public S2M object diagram and six-year claim are absent", () => {
  assert.doesNotMatch(readRepoFile("src/content/projects/ko/cinev-s2m.mdx"), /cinev-s2m-shot-01\.webp/);
  const publicJson = collectPublicCopyFiles("src/data/")
    .concat(collectPublicCopyFiles("src/i18n/"))
    .map((path) => readFileSync(path, "utf8"))
    .join("\n");
  assert.doesNotMatch(publicJson, /6\+\s*(?:Years|years|年)/);
});

test("approved resume downloads are byte-identical to the final PDFs", () => {
  assert.equal(
    sha256(readRepoBytes("public/assets/resume/resume_ko.pdf")),
    "7f53f9cff8d4f4ce8cb4e668548f47b1304cb5ddbc3afd29c54940131fe09ecb",
  );
  assert.equal(
    sha256(readRepoBytes("public/assets/resume/resume_en.pdf")),
    "c2e96a5dcd4cbfb0d85482173cce0048892714c82113409669c5ae8ac96af097",
  );
});

test("AI PO Leadership thumbnail presents only the approved public-safe five-stage narrative", () => {
  const path = "public/assets/images/projects/cinev/cinev-ai-po-leadership.svg";
  assert.equal(existsSync(new URL(path, repoRoot)), true, "Leadership SVG must exist");

  const svg = readRepoFile(path);
  assert.match(svg, /viewBox=["']0 0 1600 900["']/);
  for (const color of ["#f4e9e1", "#0e0e0e", "#2835f8", "#ff5c00"]) {
    assert.match(svg.toLowerCase(), new RegExp(color));
  }
  for (const copy of [
    "SIGNAL",
    "생성 모델의 표현 범위가 기존 렌더링의 전제를 변화",
    "REFRAME",
    "렌더링 수단과 계승할 상태와 컨텍스트 자산을 분리",
    "HYPOTHESIS",
    "생성형 렌더링과 Web 3D Conditioning의 결합",
    "VALIDATE",
    "120+ Same-scene Comparisons",
    "ALIGN TO LAUNCH",
    "조직 합의에서 Web CineV 공식 출시까지",
    "120+ SCENES VALIDATED",
    "WEB CINEV LAUNCHED",
    "2026.07.10",
  ]) {
    assert.match(svg, new RegExp(copy.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }

  assert.doesNotMatch(svg, /(?:<image|<script|href=|MAU|1\.5\s*만|NDA|실패율|failure rate)/i);
  assert.deepEqual(svg.match(/https?:\/\/[^"'\s<]+/gi) ?? [], ["http://www.w3.org/2000/svg"]);
  assert.doesNotMatch(svg, /(?:Asset 관리 시스템|내부 구조|데이터 구조|생성 방식|연결 규칙|내부 화면)/i);
});
