import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

for (const locale of ["ko", "en", "zh"]) {
  test(`${locale} S2M Highlight embeds the approved replacement video`, () => {
    const mdx = readFileSync(
      new URL(`../src/content/projects/${locale}/cinev-s2m.mdx`, import.meta.url),
      "utf8",
    );
    assert.match(mdx, /src="https:\/\/www\.youtube\.com\/embed\/rz9c4_5FcfA"/);
    assert.doesNotMatch(mdx, /P1nohI-uHOI/);
  });
}

for (const locale of ["ko", "en", "zh"]) {
  test(`${locale} leadership case study introduces CineV Technologies before the problem`, () => {
    const mdx = readFileSync(
      new URL(`../src/content/projects/${locale}/cinev-ai-po-leadership.mdx`, import.meta.url),
      "utf8",
    );
    const video = mdx.indexOf('src="https://www.youtube.com/embed/iVccZeyvyI0"');
    const problem = mdx.indexOf(locale === "zh" ? "## 问题" : "## Problem");
    assert.ok(video > 0 && video < problem, "technology overview must precede the case study problem");
    assert.match(mdx, /title="CineV Technologies"/);
    assert.doesNotMatch(mdx, /CineV Technologies \(KO\)/);
  });
}
