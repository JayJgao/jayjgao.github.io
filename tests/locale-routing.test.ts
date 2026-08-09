import assert from "node:assert/strict";
import test from "node:test";

import {
  DEFAULT_LOCALE,
  isLocale,
  localeFromLanguageTag,
  normalizeLocale,
  selectPreferredLocale,
} from "../src/lib/locale";
import {
  getLocalizedPath,
  getPathWithoutLocale,
  normalizeSitePath,
} from "../src/lib/routes";
import {
  getCanonicalProjectPath,
  getLegacyProjectTarget,
  LEGACY_PROJECT_REDIRECTS,
} from "../src/lib/project-redirects";

test("a supported stored locale takes precedence over browser languages", () => {
  assert.equal(selectPreferredLocale("zh", ["en-US", "ko-KR"]), "zh");
});

test("browser language tags resolve from their primary language", () => {
  assert.equal(localeFromLanguageTag("zh-TW"), "zh");
  assert.equal(localeFromLanguageTag("en-GB"), "en");
  assert.equal(localeFromLanguageTag("ko-KR"), "ko");
});

test("unsupported preferences fall back to Korean", () => {
  assert.equal(selectPreferredLocale(null, ["fr-FR", "de-DE"]), DEFAULT_LOCALE);
  assert.equal(normalizeLocale("fr"), "ko");
  assert.equal(localeFromLanguageTag("fr-FR"), null);
  assert.equal(isLocale("fr"), false);
});

test("an invalid stored locale does not hide a supported browser language", () => {
  assert.equal(selectPreferredLocale("fr", ["en-US"]), "en");
});

test("site paths always have one leading slash and one trailing slash", () => {
  assert.equal(normalizeSitePath("projects//cinev-s2m"), "/projects/cinev-s2m/");
  assert.equal(normalizeSitePath("//"), "/");
});

test("locale replacement preserves the complete non-locale suffix", () => {
  const source = "/en//projects/cinev-s2m/";

  assert.equal(getPathWithoutLocale(source), "/projects/cinev-s2m/");
  assert.equal(getLocalizedPath("zh", source), "/zh/projects/cinev-s2m/");
  assert.equal(getLocalizedPath("ko", "/projects/cinev-s2m/"), "/ko/projects/cinev-s2m/");
});

test("only a supported first path segment is removed as a locale", () => {
  assert.equal(getPathWithoutLocale("/fr/projects/"), "/fr/projects/");
  assert.equal(getPathWithoutLocale("/ko/about"), "/about/");
});

test("the retired A2P slug resolves only to the canonical AI PO Leadership project", () => {
  assert.deepEqual(LEGACY_PROJECT_REDIRECTS, {
    "cinev-a2p": "cinev-ai-po-leadership",
  });
  assert.equal(getLegacyProjectTarget("cinev-a2p"), "cinev-ai-po-leadership");
  assert.equal(getLegacyProjectTarget("cinev-ai-enablement"), undefined);
});

test("the nonlocalized Project compatibility route includes aliases and targets canonical metadata", async () => {
  const route = await import("../src/app/(redirect)/projects/[slug]/page");
  const params = route.generateStaticParams();

  assert.ok(params.some(({ slug }) => slug === "cinev-a2p"));
  assert.ok(params.some(({ slug }) => slug === "cinev-ai-enablement"));
  assert.equal(new Set(params.map(({ slug }) => slug)).size, params.length);

  const metadata = await route.generateMetadata({
    params: Promise.resolve({ slug: "cinev-a2p" }),
  });
  assert.equal(
    metadata.alternates?.canonical,
    "https://jayjgao.github.io/ko/projects/cinev-ai-po-leadership/",
  );
  assert.equal(getCanonicalProjectPath("cinev-a2p"), "/projects/cinev-ai-po-leadership/");
  assert.equal(
    getCanonicalProjectPath("cinev-ai-enablement"),
    "/projects/cinev-ai-enablement/",
  );
});
