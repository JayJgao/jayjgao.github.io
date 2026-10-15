import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

import projects from "../src/data/projects.json";
import frozenProjectFacts from "./fixtures/project-facts.json";
import originalProjectHeadings from "./fixtures/project-headings.json";
import { SUPPORTED_LOCALES, type Locale } from "../src/lib/locale";
import type { Project } from "../src/lib/projects";

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
  return {
    slug: project.slug,
    featured: project.featured,
    showcaseOrder: project.showcaseOrder,
    company: project.company,
    role: project.role,
    contribution: project.contribution,
    tags: project.tags,
    thumbnail: project.thumbnail,
    primaryMetric: project.primaryMetric,
    demoUrl: project.demoUrl ?? null,
    oneLiner: project.oneLiner,
  };
}

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
  const brandingExecution = brandingMdx.indexOf("## 실행");
  const brandingEvidence = brandingMdx.indexOf("buzzni-branding-marketing-shot-02.jpg");
  const brandingResults = brandingMdx.indexOf("## 결과");
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

test("asset policy distinguishes default derivatives from approved Phase 3 exceptions", () => {
  const assetManifest = readJson(dataUrl("asset-manifest.json"));
  assert.ok(isRecord(assetManifest));
  assert.equal(assetManifest.updatedAt, "2026-10-15");
  assert.ok(isRecord(assetManifest.policy));
  assert.equal(
    assetManifest.policy.thumbnail,
    "default 1200x675 webp; approved Phase 3 entries preserve canonical SVG or source-derived dimensions",
  );
  assert.equal(
    assetManifest.policy.shot,
    "default max-1600 webp; approved Phase 3 evidence derivatives preserve canonical source dimensions",
  );
});

test("Solidware Archive cards use the current company name consistently", () => {
  for (const slug of ["solidware-automl", "solidware-product-marketing"]) {
    const project = projects.find((candidate) => candidate.slug === slug);
    assert.ok(project);
    assert.equal(project.company, "Solidware");
  }
});

test("company filters contain only companies with projects in career order", async () => {
  const { getProjectCompanies } = await import("../src/lib/projects");
  assert.deepEqual(getProjectCompanies(), ["Cinamon", "BUZZNI", "Lunit", "Solidware", "Side Project"]);
  const first = getProjectCompanies(); first.pop();
  assert.equal(getProjectCompanies().length, 5);
  assert.ok(projects.every((project) => !("era" in project)));
  assert.equal(existsSync(dataUrl("eras.json")), false);
});
test("UI dictionaries retain locale labels without old timeline era copy", () => {
  for (const locale of SUPPORTED_LOCALES) {
    const messages = readJson(messagesUrl(locale));
    assert.ok(isRecord(messages) && isRecord(messages.projects) && isRecord(messages.home));
    assert.ok(isRecord(messages.projects.filter) && isRecord(messages.home.timeline));
    assert.deepEqual(Object.keys(messages.projects.filter), ["all"]);
    assert.equal("eras" in messages.home.timeline, false);
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

test("films strip replaces the obsolete spotlight data", () => {
  assert.equal(existsSync(dataUrl("spotlights.json")), false);
  assert.equal(existsSync(dataUrl("home-spotlights.json")), false);
});
