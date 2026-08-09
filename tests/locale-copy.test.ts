import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

import demos from "../src/data/demos.json";
import projects from "../src/data/projects.json";
import frozenProjectFacts from "./fixtures/project-facts.json";

const repoRoot = new URL("..", import.meta.url);
const locales = ["ko", "en", "zh"] as const;
type Locale = (typeof locales)[number];

const intentionallyBlankLocalizedPaths = new Set([
  "content.projects.buzzni-shortform-ai.subtitle",
  "content.projects.buzzni-aiaas-biz.subtitle",
  "content.projects.buzzni-chatbot.subtitle",
  "content.projects.cinev-ai-po-leadership.subtitle",
  "content.projects.cinev-ai-enablement.subtitle",
  "content.projects.buzzni-review-aiaas.subtitle",
  "content.projects.buzzni-search-aiaas.subtitle",
  "content.projects.buzzni-branding-marketing.subtitle",
  "content.projects.solidware-automl.subtitle",
  "content.projects.solidware-product-marketing.subtitle",
  "content.projects.lunit-biomarker.subtitle",
]);

function readJson(path: string): unknown {
  return JSON.parse(readFileSync(new URL(path, repoRoot), "utf8")) as unknown;
}

function readRequiredFile(path: string): string {
  const url = new URL(path, repoRoot);
  assert.ok(existsSync(url), `${path} must exist`);
  return readFileSync(url, "utf8");
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Retains every object key and every array position so missing nested copy cannot hide. */
function recursiveShape(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(recursiveShape);
  if (isRecord(value)) {
    return Object.fromEntries(
      Object.entries(value)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, nested]) => [key, recursiveShape(nested)]),
    );
  }
  return typeof value;
}

function validateLocalizedLeaf(
  copy: Record<Locale, string>,
  path: string,
  visit: (copy: Record<Locale, string>, path: string) => void,
): void {
  for (const locale of locales) {
    assert.equal(typeof copy[locale], "string", `${path}.${locale} must be text`);
    if (!intentionallyBlankLocalizedPaths.has(path)) {
      assert.ok(copy[locale].trim(), `${path}.${locale} must not be blank`);
    }
  }
  visit(copy, path);
}

function walkLocalizedCopy(value: unknown, path: string, visit: (copy: Record<Locale, string>, path: string) => void): void {
  if (Array.isArray(value)) {
    value.forEach((nested, index) => walkLocalizedCopy(nested, `${path}[${index}]`, visit));
    return;
  }
  if (!isRecord(value)) return;

  const keys = Object.keys(value).sort();
  const localizedKeys = keys.filter((key) => (locales as readonly string[]).includes(key));
  if (localizedKeys.length > 0) {
    assert.deepEqual(keys, [...locales].sort(), `${path} must have exactly ko, en, and zh keys`);
    validateLocalizedLeaf(value as Record<Locale, string>, path, visit);
    return;
  }

  for (const [key, nested] of Object.entries(value)) {
    walkLocalizedCopy(nested, path ? `${path}.${key}` : key, visit);
  }
}

function walkParallelLocalizedCopy(
  values: Record<Locale, unknown>,
  path: string,
  visit: (copy: Record<Locale, string>, path: string) => void,
): void {
  if (typeof values.ko === "string") {
    validateLocalizedLeaf(values as Record<Locale, string>, path, visit);
    return;
  }

  if (Array.isArray(values.ko)) {
    for (const locale of locales) {
      assert.ok(Array.isArray(values[locale]), `${path}.${locale} must be an array`);
      assert.equal((values[locale] as unknown[]).length, values.ko.length, `${path}.${locale} array length`);
    }
    values.ko.forEach((_, index) =>
      walkParallelLocalizedCopy(
        Object.fromEntries(locales.map((locale) => [locale, (values[locale] as unknown[])[index]])) as Record<
          Locale,
          unknown
        >,
        `${path}[${index}]`,
        visit,
      ),
    );
    return;
  }

  assert.ok(isRecord(values.ko), `${path}.ko must be an object`);
  const koreanKeys = Object.keys(values.ko).sort();
  for (const locale of locales) {
    assert.ok(isRecord(values[locale]), `${path}.${locale} must be an object`);
    assert.deepEqual(Object.keys(values[locale]).sort(), koreanKeys, `${path}.${locale} keys`);
  }
  for (const key of koreanKeys) {
    walkParallelLocalizedCopy(
      Object.fromEntries(locales.map((locale) => [locale, (values[locale] as Record<string, unknown>)[key]])) as Record<
        Locale,
        unknown
      >,
      `${path}.${key}`,
      visit,
    );
  }
}

const approvedDigitFacts = [
  { label: "120+", korean: /(?:120\+|120\s*개\s*이상)/, translated: { en: /120\+/, zh: /120\+/ } },
  {
    label: "3",
    korean:
      /(?:(?:실험 기능|experimental features?)[^.\n]{0,40}3(?![A-Za-z0-9])\s*(?:건)?|3(?![A-Za-z0-9])\s*(?:건)?[^.\n]{0,40}(?:실험 기능|experimental features?))/i,
    translated: {
      en: /(?:\b3\s+(?:experimental\s+)?features?\b|(?:experimental\s+)?features?[^.\n]{0,40}\b3\b)/i,
      zh: /(?:3(?![A-Za-z0-9])\s*(?:项|項|个|個)?\s*(?:实验|實驗)(?:性)?(?:功能|特性)|(?:实验|實驗)(?:性)?(?:功能|特性)[^。\n]{0,30}3(?![A-Za-z0-9])\s*(?:项|項|个|個)?)/,
    },
  },
  { label: "7+", korean: /(?:7\+|7\s*개\s*이상)/, translated: { en: /7\+/, zh: /7\+/ } },
  { label: "30+", korean: /(?:30\+|30\s*종\s*이상)/, translated: { en: /30\+/, zh: /30\+/ } },
  {
    label: "13",
    korean: /(?:(?:AI Literacy|리터러시|비저닝|세션)[^.\n]{0,50}13\s*회|13\s*회[^.\n]{0,50}(?:AI Literacy|리터러시|비저닝|세션))/i,
    translated: {
      en: /(?:(?:AI Literacy|visioning|sessions?)[^.\n]{0,60}\b13\b|\b13\s+(?:(?:AI Literacy|visioning)[^.\n]{0,40})?sessions?\b)/i,
      zh: /(?:(?:AI Literacy|AI\s*素养|人工智能素养|愿景|願景|会议|會議|课程|課程|讲座|講座|研讨|研討)[^。\n]{0,50}13(?!\d)\s*(?:场|場|次)?|13(?!\d)\s*(?:场|場|次)[^。\n]{0,50}(?:AI Literacy|AI\s*素养|人工智能素养|愿景|願景|会议|會議|课程|課程|讲座|講座|研讨|研討))/i,
    },
  },
  { label: "60%", korean: /60\s*%/, translated: { en: /60\s*%/, zh: /60\s*%/ } },
  { label: "90%", korean: /90\s*%/, translated: { en: /90\s*%/, zh: /90\s*%/ } },
] as const;

const approvedDateForms = {
  ko: /(?:2026-07-10(?!\d)|2026[./]0?7[./]10(?!\d)|2026년\s*0?7월\s*10일)/,
  en: /(?:2026-07-10(?!\d)|2026[./]0?7[./]10(?!\d)|July\s+10(?:th)?[,]?\s+2026(?!\d)|10(?:th)?\s+July[,]?\s+2026(?!\d))/i,
  zh: /(?:2026-07-10(?!\d)|2026[./]0?7[./]10(?!\d)|2026\s*年\s*0?7\s*月\s*10\s*[日号號])/,
} as const;

function assertDigitFactsFrozen(copy: Record<Locale, string>, path: string): void {
  for (const fact of approvedDigitFacts) {
    if (!fact.korean.test(copy.ko)) continue;
    for (const locale of ["en", "zh"] as const) {
      assert.match(copy[locale], fact.translated[locale], `${path}.${locale} must preserve numeric fact ${fact.label}`);
    }
  }

  if (approvedDateForms.ko.test(copy.ko)) {
    for (const locale of locales) {
      assert.match(copy[locale], approvedDateForms[locale], `${path}.${locale} must preserve date 2026-07-10`);
    }
  }
}

const protectedProperNouns = [
  "Cinamon",
  "CineV",
  "AI PO Leadership",
  "AI Technology & Org Enablement",
  "Chroma Awards",
  "BUZZNI",
  "Solidware",
  "Prompt Enhancer",
  "Voice Adaptor",
  "Reverse Storyboard",
  "Product Discovery",
  "OpenAI Responses API",
  "GPT Image 2",
  "nano banana",
  "Seedance 2.0",
  "HappyHorse",
] as const;

function assertProperNounsFrozen(copy: Record<Locale, string>, path: string): void {
  for (const properNoun of protectedProperNouns) {
    if (!copy.ko.includes(properNoun)) continue;
    for (const locale of ["en", "zh"] as const) {
      assert.ok(copy[locale].includes(properNoun), `${path}.${locale} must preserve ${properNoun}`);
    }
  }
}

test("locale files retain recursively identical key and array shapes", () => {
  for (const stem of ["about", "resume"] as const) {
    const localized = locales.map((locale) => readJson(`src/data/${stem}.${locale}.json`));
    assert.deepEqual(recursiveShape(localized[1]), recursiveShape(localized[0]), `${stem}.en shape`);
    assert.deepEqual(recursiveShape(localized[2]), recursiveShape(localized[0]), `${stem}.zh shape`);
  }

  const dictionaries = locales.map((locale) => readJson(`src/i18n/${locale}.json`));
  assert.deepEqual(recursiveShape(dictionaries[1]), recursiveShape(dictionaries[0]), "i18n.en shape");
  assert.deepEqual(recursiveShape(dictionaries[2]), recursiveShape(dictionaries[0]), "i18n.zh shape");
});

test("localized About files match the exact approved copy", () => {
  const approvedSha256 = {
    en: "15eb12da0e51bbb9605a34b4ba3553a723dc579a151a92b7541a6c4c46dd415d",
    zh: "829fa5afd4e3c95504c5ceccab2a9ef507ef2c5a8d5220e11111b6234079281b",
  } as const;

  for (const locale of ["en", "zh"] as const) {
    const bytes = readFileSync(new URL(`src/data/about.${locale}.json`, repoRoot));
    assert.equal(createHash("sha256").update(bytes).digest("hex"), approvedSha256[locale]);
  }
});

test("every localized project and Demo leaf is complete in all three locales", () => {
  let localizedLeafCount = 0;
  const inspect = (copy: Record<Locale, string>, path: string) => {
    localizedLeafCount += 1;
    assertDigitFactsFrozen(copy, path);
    assertProperNounsFrozen(copy, path);
  };
  projects.forEach((project) => walkLocalizedCopy(project, `content.projects.${project.slug}`, inspect));
  demos.forEach((demo) => walkLocalizedCopy(demo, `content.demos.${demo.slug}`, inspect));
  assert.ok(localizedLeafCount > 100, "the recursive helper must inspect the complete localized corpus");
});

test("approved facts remain frozen across localized About, Resume, and i18n copy", () => {
  let localizedLeafCount = 0;
  const inspect = (copy: Record<Locale, string>, path: string) => {
    localizedLeafCount += 1;
    assertDigitFactsFrozen(copy, path);
    assertProperNounsFrozen(copy, path);
  };

  for (const stem of ["about", "resume"] as const) {
    walkParallelLocalizedCopy(
      Object.fromEntries(locales.map((locale) => [locale, readJson(`src/data/${stem}.${locale}.json`)])) as Record<
        Locale,
        unknown
      >,
      `content.${stem}`,
      inspect,
    );
  }
  walkParallelLocalizedCopy(
    Object.fromEntries(locales.map((locale) => [locale, readJson(`src/i18n/${locale}.json`)])) as Record<Locale, unknown>,
    "content.i18n",
    inspect,
  );

  assert.ok(localizedLeafCount > 100, "the helper must inspect all localized About, Resume, and i18n leaves");
});

for (const slug of ["cinev-ai-po-leadership", "cinev-ai-enablement"] as const) {
  test(`approved facts remain frozen in localized Project MDX for ${slug}`, () => {
    const copy = Object.fromEntries(
      locales.map((locale) => [locale, readRequiredFile(`src/content/projects/${locale}/${slug}.mdx`)]),
    ) as Record<Locale, string>;
    validateLocalizedLeaf(copy, `content.projectMdx.${slug}`, (localized, path) => {
      assertDigitFactsFrozen(localized, path);
      assertProperNounsFrozen(localized, path);
    });
  });
}

test("localized-leaf helper rejects a synthetic missing-locale mutation", () => {
  assert.throws(
    () => walkLocalizedCopy({ ko: "정본", en: "Canon" }, "mutation.oneLiner", () => undefined),
    /must have exactly ko, en, and zh keys/,
  );
});

test("localized-leaf helper rejects a synthetic blank-locale mutation", () => {
  const canonical = { ko: "정본", en: "Canon", zh: "正本" };
  for (const locale of locales) {
    assert.throws(
      () => walkLocalizedCopy({ ...canonical, [locale]: "   " }, "mutation.oneLiner", () => undefined),
      new RegExp(`mutation\\.oneLiner\\.${locale} must not be blank`),
    );
  }
  assert.doesNotThrow(() =>
    walkLocalizedCopy(
      { ko: "", en: "", zh: "" },
      "content.projects.cinev-ai-po-leadership.subtitle",
      () => undefined,
    ),
  );
});

test("fact helper rejects synthetic translations that drop normalized Korean magnitudes", () => {
  const canonical = {
    ko: "120개 이상 비교, 실험 기능 3건, 7개 이상 영역, 30종 이상 모델, 13회 세션",
    en: "120+ comparisons, 3 experimental features, 7+ areas, 30+ models, 13 sessions",
    zh: "120+ 次对比、3 项实验功能、7+ 个领域、30+ 个模型、13 次会议",
  };

  for (const [locale, token] of [
    ["en", "120+"],
    ["zh", "7+"],
    ["en", "30+"],
  ] as const) {
    assert.throws(
      () =>
        assertDigitFactsFrozen(
          { ...canonical, [locale]: canonical[locale].replace(`${token} `, "") },
          "mutation.localized-fact",
        ),
      new RegExp(token.replace("+", "\\+")),
    );
  }
});

test("fact helper requires feature and session context instead of accepting unrelated bare numbers", () => {
  const featureCopy = {
    ko: "3D 워크플로에서 실험 기능 3건을 제품에 통합했습니다.",
    en: "In a 3D workflow, we integrated 3 experimental features into the product.",
    zh: "在 3D 工作流中，将 3 项实验功能集成到产品中。",
  };
  assert.throws(
    () =>
      assertDigitFactsFrozen(
        { ...featureCopy, en: "The 3D workflow remained in place." },
        "mutation.experimental-features",
      ),
    /numeric fact 3/,
  );

  const sessionCopy = {
    ko: "AI Literacy와 비저닝 세션을 13회 진행했습니다.",
    en: "Won 13 clients and ran 13 AI Literacy and visioning sessions.",
    zh: "赢得 13 家客户，并举办 13 场 AI Literacy 与愿景会议。",
  };
  assert.throws(
    () =>
      assertDigitFactsFrozen(
        { ...sessionCopy, en: "Won 13 enterprise clients." },
        "mutation.enablement-sessions",
      ),
    /numeric fact 13/,
  );
});

test("date helper accepts locale-appropriate forms of the approved release date", () => {
  assert.doesNotThrow(() =>
    assertDigitFactsFrozen(
      {
        ko: "2026년 7월 10일 공식 출시했습니다.",
        en: "Officially launched on July 10, 2026.",
        zh: "于 2026年7月10日正式上线。",
      },
      "mutation.natural-date",
    ),
  );
  assert.doesNotThrow(() =>
    assertDigitFactsFrozen(
      { ko: "출시일 2026.07.10", en: "Launch date: 2026-07-10", zh: "上线日期：2026.07.10" },
      "mutation.dotted-date",
    ),
  );
});

test("date helper rejects dropped or incorrect approved release dates", () => {
  assert.throws(
    () =>
      assertDigitFactsFrozen(
        { ko: "2026년 7월 10일 공식 출시", en: "Official launch", zh: "2026年7月10日正式上线" },
        "mutation.dropped-date",
      ),
    /mutation\.dropped-date\.en must preserve date 2026-07-10/,
  );
  assert.throws(
    () =>
      assertDigitFactsFrozen(
        { ko: "2026년 7월 10일 공식 출시", en: "Launched July 10, 2026", zh: "2026年7月11日正式上线" },
        "mutation.wrong-date",
      ),
    /mutation\.wrong-date\.zh must preserve date 2026-07-10/,
  );
});

test("Phase 3 fact-bearing names and primary metrics remain frozen", () => {
  const expected = frozenProjectFacts.map(({ slug, company, contribution, primaryMetric }) => ({
    slug,
    company,
    contribution,
    primaryMetric,
  }));
  const actual = projects.map(({ slug, company, contribution, primaryMetric }) => ({
    slug,
    company,
    contribution,
    primaryMetric,
  }));
  assert.deepEqual(actual, expected);

  const bySlug = new Map(projects.map((project) => [project.slug, project]));
  assert.deepEqual(
    {
      aiPo: {
        company: bySlug.get("cinev-ai-po-leadership")?.company,
        contribution: bySlug.get("cinev-ai-po-leadership")?.contribution,
        primaryMetric: bySlug.get("cinev-ai-po-leadership")?.primaryMetric,
      },
      enablement: {
        company: bySlug.get("cinev-ai-enablement")?.company,
        contribution: bySlug.get("cinev-ai-enablement")?.contribution,
        primaryMetric: bySlug.get("cinev-ai-enablement")?.primaryMetric,
      },
    },
    {
      aiPo: { company: "Cinamon", contribution: 60, primaryMetric: "PIVOT → WEB LAUNCH" },
      enablement: {
        company: "Cinamon",
        contribution: 90,
        primaryMetric: "SHARED LANGUAGE → INDEPENDENT EXECUTION",
      },
    },
  );
});

test("the approved digit-bearing Korean statements retain their exact magnitudes", () => {
  const koreanCorpus = [
    readRequiredFile("src/data/projects.json"),
    readRequiredFile("src/data/resume.ko.json"),
    readRequiredFile("src/i18n/ko.json"),
    readRequiredFile("src/content/projects/ko/cinev-ai-po-leadership.mdx"),
    readRequiredFile("src/content/projects/ko/cinev-ai-enablement.mdx"),
  ].join("\n");

  const frozenFacts = [
    /120(?:\+|개 이상)/,
    /(?:실험 기능|EXPERIMENTAL FEATURES)[^\n]{0,40}3|3[^\n]{0,40}(?:실험 기능|EXPERIMENTAL FEATURES)/i,
    /7(?:\+|개 이상)[^\n]{0,40}(?:영역|AREAS)/i,
    /30(?:\+|종 이상)[^\n]{0,40}(?:모델|MODELS)/i,
    /13회/,
    /"contribution"\s*:\s*60/,
    /"contribution"\s*:\s*90/,
    /(?:2026-07-10|2026[./]0?7[./]10|2026년\s*0?7월\s*10일)/,
  ] as const;

  for (const fact of frozenFacts) assert.match(koreanCorpus, fact);
});
