import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { SUPPORTED_LOCALES } from "../src/lib/locale";
import { readProjectMdx } from "../src/lib/mdx";
import { getAllProjectSlugs } from "../src/lib/projects";

const repoRoot = new URL("..", import.meta.url);

function readRepoFile(path: string): string {
  return readFileSync(new URL(path, repoRoot), "utf8");
}

const fallbackNotices = {
  ko: "이 프로젝트의 상세 내용은 현재 한국어 원문으로 제공됩니다.",
  en: "Detailed content for this project is currently available in the original Korean.",
  zh: "이 프로젝트의 상세 내용은 현재 한국어 원문으로 제공됩니다.",
} as const;

function assertFallbackNoticeContract(detail: string): void {
  const openingTag = detail.match(
    /<p(?=[^>]*data-project-fallback-notice=\{contentLocale\})[^>]*>/,
  )?.[0];
  assert.ok(openingTag, "fallback notice opening tag must be present");
  assert.match(openingTag, /role="note"/, "fallback notice must expose role=note");
  assert.match(
    openingTag,
    /lang=\{locale\}/,
    "localized fallback notice language must follow the page locale",
  );
}

test("project MDX prefers a locale file and otherwise reports Korean fallback", async () => {
  const localized = await readProjectMdx("en", "cinev-s2m");
  const korean = await readProjectMdx("ko", "cinev-s2m");

  assert.ok(localized.source.trim());
  assert.equal(korean.contentLocale, "ko");
  assert.ok(korean.source.trim());
  assert.ok(localized.contentLocale === "en" || localized.contentLocale === "ko");
  if (localized.contentLocale === "ko") {
    assert.equal(localized.source, korean.source);
  }
});

test("all projects have readable content for every generated locale route", async () => {
  const slugs = getAllProjectSlugs();
  assert.equal(slugs.length, 15);
  assert.ok(slugs.includes("cinev-ai-enablement"));
  assert.equal(slugs.includes("cinev-a2p"), false);

  for (const slug of slugs) {
    const korean = await readProjectMdx("ko", slug);
    assert.equal(korean.contentLocale, "ko", `${slug} must have Korean canonical MDX`);
    assert.ok(korean.source.trim(), `${slug} Korean canonical MDX must be nonempty`);

    for (const locale of SUPPORTED_LOCALES) {
      const result = await readProjectMdx(locale, slug);
      assert.ok(result.source.trim(), `${locale}/${slug} MDX must be nonempty`);
      assert.ok(
        result.contentLocale === locale || result.contentLocale === "ko",
        `${locale}/${slug} must use requested or Korean content`,
      );
    }
  }
});

test("Korean canonical MDX exists only for current Project slugs, not the A2P alias", async () => {
  const currentSlugs = getAllProjectSlugs();
  assert.ok(currentSlugs.includes("cinev-ai-po-leadership"));
  assert.ok(currentSlugs.includes("cinev-ai-enablement"));
  assert.equal(currentSlugs.includes("cinev-a2p"), false);

  await assert.rejects(
    readProjectMdx("ko", "cinev-a2p"),
    (error: NodeJS.ErrnoException) => error.code === "ENOENT",
  );
});

test("a missing Korean canonical MDX propagates its filesystem error", async () => {
  await assert.rejects(
    readProjectMdx("ko", "__missing-project__"),
    (error: NodeJS.ErrnoException) => error.code === "ENOENT",
  );
});

test("Project detail exposes a visible localized notice only when MDX falls back", () => {
  const detail = readRepoFile("src/components/projects/CaseStudy.tsx");

  assert.match(detail, /contentLocale\s*!==\s*locale/);
  assert.match(detail, /data-project-fallback-notice=\{contentLocale\}/);
  assert.match(detail, /copy\.fallbackNotice/);
  assertFallbackNoticeContract(detail);
  assert.throws(
    () => assertFallbackNoticeContract(detail.replace('role="note"', "")),
    /role=note/,
  );
  assert.throws(
    () => assertFallbackNoticeContract(detail.replace("lang={locale}", "")),
    /language must follow the page locale/,
  );
  assert.ok(
    detail.indexOf("data-project-fallback-notice") < detail.indexOf('className="mdx-content"'),
    "fallback notice must render before the MDX body",
  );
  assert.match(
    detail,
    /lang=\{contentLocale\}[^>]*className="mdx-content"[^>]*data-project-content-locale=\{contentLocale\}/,
    "the MDX body must retain its real content language",
  );
});

test("fallback copy is localized as each structured translation is approved", () => {
  for (const locale of ["ko", "en", "zh"] as const) {
    const messages = JSON.parse(readRepoFile(`src/i18n/${locale}.json`));
    assert.equal(messages.projects.caseStudy.fallbackNotice, fallbackNotices[locale]);
  }
});
