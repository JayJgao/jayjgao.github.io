import assert from "node:assert/strict";
import test from "node:test";

import {
  createLegacyMetadata,
  createLocalizedMetadata,
  SITE_URL,
} from "../src/lib/metadata";

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
