import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
const read = (path: string) => readFileSync(path, "utf8");
test("hover rules cannot apply decorative geometry to interactive cards", () => {
  const css = read("src/styles/globals.css");
  for (const rule of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    if (!/:hover/.test(rule[1])) continue;
    assert.doesNotMatch(rule[2], /(?:^|;)\s*(?:width|height|min-width|min-height|max-width|max-height|display|grid-template-columns|flex|padding|margin|content)\s*:/, rule[1]);
  }
});
test("shortform evidence grid follows its localized appendix heading", () => {
  for (const [locale, heading] of [["ko", "부록"], ["en", "Appendix"], ["zh", "附录"]]) {
    const mdx = read(`src/content/projects/${locale}/buzzni-shortform-ai.mdx`);
    assert.ok(mdx.indexOf(`## ${heading}`) < mdx.indexOf('<div className="image-grid-two">'));
  }
});
