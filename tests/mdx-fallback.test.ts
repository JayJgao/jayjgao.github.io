import assert from "node:assert/strict";
import test from "node:test";

import { SUPPORTED_LOCALES } from "../src/lib/locale";
import { readProjectMdx } from "../src/lib/mdx";
import { getAllProjectSlugs } from "../src/lib/projects";

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
