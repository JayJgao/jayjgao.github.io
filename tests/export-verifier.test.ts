import assert from "node:assert/strict";
import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";

import {
  createProductionExportContract,
  extractDocumentSignals,
  resolveInternalHref,
  routeToExportRelativePath,
  scanHtmlTags,
  verifyExport,
  type ExportContract,
} from "../scripts/lib/export-verifier";

const siteUrl = "https://jayjgao.github.io";

function localizedHead(
  locale: "ko" | "en" | "zh",
  route: string,
  options: { omitXDefault?: boolean } = {},
): string {
  const suffix = route.replace(/^\/(?:ko|en|zh)/, "");
  const localized = (target: "ko" | "en" | "zh") =>
    `${siteUrl}/${target}${suffix}`.replace(/(?<!:)\/{2,}/g, "/");

  return [
    `<html lang="${locale}"><head>`,
    `<link rel="canonical" href="${siteUrl}${route}">`,
    `<link rel="alternate" hreflang="ko" href="${localized("ko")}">`,
    `<link rel="alternate" hreflang="en" href="${localized("en")}">`,
    `<link rel="alternate" hreflang="zh" href="${localized("zh")}">`,
    options.omitXDefault
      ? ""
      : `<link rel="alternate" hreflang="x-default" href="${localized("ko")}">`,
    "</head><body>",
  ].join("");
}

function localizedExpectation(
  locale: "ko" | "en" | "zh",
  route: string,
): ExportContract["localizedRoutes"][number] {
  const suffix = route.replace(/^\/(?:ko|en|zh)/, "");
  const localized = (target: "ko" | "en" | "zh") =>
    `${siteUrl}/${target}${suffix}`.replace(/(?<!:)\/{2,}/g, "/");

  return {
    route,
    locale,
    canonical: `${siteUrl}${route}`,
    alternates: {
      ko: localized("ko"),
      en: localized("en"),
      zh: localized("zh"),
      "x-default": localized("ko"),
    },
  };
}

async function writeRoute(outDir: string, route: string, html: string) {
  const relativePath = routeToExportRelativePath(route);
  const filename = path.join(outDir, relativePath);
  await mkdir(path.dirname(filename), { recursive: true });
  await writeFile(filename, html, "utf8");
}

function fixtureContract(): ExportContract {
  return {
    siteUrl,
    basePath: "",
    localizedRoutes: [
      localizedExpectation("en", "/en/"),
      localizedExpectation("en", "/en/about/"),
    ],
    legacyRoutes: [
      {
        route: "/about/",
        canonical: `${siteUrl}/ko/about/`,
        fallbackHrefs: ["/ko/about/", "/en/about/", "/zh/about/"],
      },
    ],
    rootRedirect: {
      route: "/",
      fallbackHrefs: ["/ko/", "/en/", "/zh/"],
    },
    projectDetailRoutes: [],
    demoDetailRoutes: [],
    require404: true,
    forbiddenHtmlPatterns: [],
    sourceEvidenceBasenames: [],
  };
}

async function createValidFixture(): Promise<{ outDir: string; contract: ExportContract }> {
  const outDir = await mkdtemp(path.join(tmpdir(), "export-verifier-"));
  const contract = fixtureContract();

  await writeRoute(
    outDir,
    "/en/",
    `${localizedHead("en", "/en/")}
      <a href="about/">About</a>
      <a href="?view=all">Query</a>
      <a href="#work">Hash</a>
      <a href="mailto:test@example.com">Email</a>
      <a href="https://example.com/elsewhere/">External</a>
      <a href="//jayjgao.github.io/en/about/">Same-origin protocol relative</a>
      <a href="/_next/static/chunk.js">Next asset</a>
      <a href="/assets/images/missing.webp">Public asset</a>
      <a href="/favicon.ico">Favicon</a>
      <script>self.__next_f.push([1, '<a href="/en/not-real/"><iframe></iframe></a>'])</script>
      <style>.x::after { content: '<a href="/en/not-real/">'; }</style>
      <template><a href="/en/not-real/">Template fallback</a></template>
    </body></html>`,
  );
  await writeRoute(
    outDir,
    "/en/about/",
    `${localizedHead("en", "/en/about/")}<a href="../">Home</a></body></html>`,
  );
  await writeRoute(
    outDir,
    "/about/",
    `<html lang="ko"><head>
      <meta name="robots" content="noindex, follow">
      <link rel="canonical" href="${siteUrl}/ko/about/">
    </head><body>
      <a href="/ko/about/">한국어</a><a href="/en/about/">English</a><a href="/zh/about/">中文</a>
    </body></html>`,
  );
  await writeRoute(
    outDir,
    "/",
    `<html lang="ko"><body><a href="/ko/">한국어</a><a href="/en/">English</a><a href="/zh/">中文</a></body></html>`,
  );
  await writeFile(path.join(outDir, "404.html"), "not found", "utf8");

  for (const route of ["/ko/", "/zh/", "/ko/about/", "/zh/about/"]) {
    await writeRoute(outDir, route, "<html><body>fallback target</body></html>");
  }

  return { outDir, contract };
}

function sliderDocument(markers: "none" | "valid" | "wrong-kind"): string {
  const marker = (role: string, element: "button" | "span") => {
    if (markers === "none") return "";
    if (markers === "wrong-kind" && role === "previous") {
      return element === "button" ? "" : ` data-demo-gallery-control="${role}"`;
    }
    return ` data-demo-gallery-control="${role}"`;
  };
  const image = '<img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==" alt="">';

  return `${localizedHead("en", "/en/about/")}
    <div data-demo-gallery-mode="slider">
      ${markers === "wrong-kind" ? `<div${marker("previous", "span")}></div>` : ""}
      ${image}
      <button${marker("previous", "button")}>Previous</button>
      <span aria-live="polite"${marker("counter", "span")}>1 / 2</span>
      <button${marker("next", "button")}>Next</button>
      <button aria-current="true"${marker("thumbnail", "button")}>${image}</button>
      <button${marker("thumbnail", "button")}>${image}</button>
    </div>
    <section data-demo-block="how-it-works"></section>
  </body></html>`;
}

function addSliderExpectation(contract: ExportContract): void {
  const expectation: ExportContract["demoDetailRoutes"][number] = {
    route: "/en/about/",
    slug: "fixture-slider",
    galleryMode: "slider" as const,
    galleryItemCount: 2,
    videoMode: "none" as const,
    videoId: null,
  };
  contract.demoDetailRoutes = [expectation];
}

function addVideoExpectation(
  contract: ExportContract,
  videoMode: "play" | "none",
  videoId: string | null,
): void {
  contract.demoDetailRoutes = [
    {
      route: "/en/about/",
      slug: `fixture-${videoMode}`,
      galleryMode: "none",
      galleryItemCount: 0,
      videoMode,
      videoId,
    },
  ];
}

function videoDocument({
  state = "play",
  thumbnailSrc = "https://i.ytimg.com/vi/NLleH-4c5HY/maxresdefault.jpg",
  loading = "lazy",
  referrerPolicy = "no-referrer",
  iframe = false,
}: {
  state?: "play" | "none";
  thumbnailSrc?: string | null;
  loading?: string | null;
  referrerPolicy?: string | null;
  iframe?: boolean;
} = {}): string {
  const image = thumbnailSrc
    ? `<img src="${thumbnailSrc}" alt=""${loading ? ` loading="${loading}"` : ""}${referrerPolicy ? ` referrerpolicy="${referrerPolicy}"` : ""}>`
    : "";
  const video = state === "none"
    ? image
    : `<div data-demo-video-state="${state}">${image}</div>`;

  return `${localizedHead("en", "/en/about/")}
    ${video}
    ${iframe ? '<iframe src="https://www.youtube-nocookie.com/embed/NLleH-4c5HY"></iframe>' : ""}
    <section data-demo-block="how-it-works"></section>
  </body></html>`;
}

function legacyDocument(robotsContents: string[]): string {
  return `<html lang="ko"><head>
    ${robotsContents
      .map((content) => `<meta name="robots" content="${content}">`)
      .join("\n")}
    <link rel="canonical" href="${siteUrl}/ko/about/">
  </head><body>
    <a href="/ko/about/">한국어</a><a href="/en/about/">English</a><a href="/zh/about/">中文</a>
  </body></html>`;
}

test("route mapping uses trailing-slash index files and cannot escape the export root", () => {
  assert.equal(routeToExportRelativePath("/en/about/"), "en/about/index.html");
  assert.equal(routeToExportRelativePath("/en/about"), "en/about/index.html");
  assert.equal(routeToExportRelativePath("/"), "index.html");
  assert.equal(routeToExportRelativePath("/404.html"), "404.html");
  assert.throws(
    () => routeToExportRelativePath("/%2e%2e/private/"),
    /encoded traversal/i,
  );
});

test("the scanner is quote-aware, normalizes attributes, decodes entities, and skips inert markup", () => {
  const html = `<!doctype html><!-- <a href="/comment/"> -->
    <HTML LANG='en'><head>
      <script>const fake = '<a href="/flight/">';</script>
      <style>.x{content:'<link rel="canonical" href="/style/">'}</style>
      <template><a href="/template/">ignored</a></template>
      <LINK REL=canonical HREF='https://jayjgao.github.io/en/?a=1&amp;b=2'>
      <link rel="alternate" hreflang=x-default href="https://jayjgao.github.io/ko/">
    </head><body><A HREF=/en/about/?q=&#x31;>About</A></body></HTML>`;

  const tags = scanHtmlTags(html);
  assert.deepEqual(tags.map(({ name }) => name), ["html", "head", "link", "link", "body", "a"]);
  assert.equal(tags[0].attributes.lang, "en");
  assert.equal(tags[2].attributes.href, "https://jayjgao.github.io/en/?a=1&b=2");
  assert.equal(tags[5].attributes.href, "/en/about/?q=1");

  const signals = extractDocumentSignals(html);
  assert.equal(signals.lang, "en");
  assert.equal(signals.canonical, "https://jayjgao.github.io/en/?a=1&b=2");
  assert.equal(signals.alternates["x-default"], "https://jayjgao.github.io/ko/");
  assert.deepEqual(signals.anchorHrefs, ["/en/about/?q=1"]);
  assert.equal(signals.iframes.length, 0);
});

test("internal href resolution handles relative and same-origin URLs while ignoring non-page links", () => {
  const options = { siteUrl, basePath: "" };

  assert.equal(resolveInternalHref("../about/?x=1#top", "/en/projects/", options), "/en/about/");
  assert.equal(resolveInternalHref("?x=1", "/en/about/", options), "/en/about/");
  assert.equal(resolveInternalHref("//jayjgao.github.io/en/about/", "/en/", options), "/en/about/");
  assert.equal(resolveInternalHref("https://jayjgao.github.io/en/about/", "/en/", options), "/en/about/");
  assert.equal(resolveInternalHref("https://example.com/en/about/", "/en/", options), null);
  assert.equal(resolveInternalHref("mailto:test@example.com", "/en/", options), null);
  assert.equal(resolveInternalHref("#section", "/en/", options), null);
  assert.equal(resolveInternalHref("/_next/static/a.js", "/en/", options), null);
  assert.equal(resolveInternalHref("/assets/image.webp", "/en/", options), null);
  assert.equal(resolveInternalHref("/favicon.ico", "/en/", options), null);
  assert.throws(
    () => resolveInternalHref("/%2e%2e/private/", "/en/", options),
    /encoded traversal/i,
  );
});

test("verification aggregates a missing target and missing x-default without trusting Flight markup", async () => {
  const { outDir, contract } = await createValidFixture();
  await writeRoute(
    outDir,
    "/en/",
    `${localizedHead("en", "/en/", { omitXDefault: true })}
      <a href="/en/missing/">Missing</a>
      <script>self.__next_f.push([1, '<link rel="alternate" hreflang="x-default" href="${siteUrl}/ko/">'])</script>
    </body></html>`,
  );

  await assert.rejects(
    () => verifyExport(outDir, contract),
    (error: Error) => {
      assert.match(error.message, /x-default/);
      assert.match(error.message, /\/en\/missing\//);
      assert.match(error.message, /2 export verification errors/);
      return true;
    },
  );
});

test("verification rejects decoded traversal and reports other document failures in the same run", async () => {
  const { outDir, contract } = await createValidFixture();
  await writeRoute(
    outDir,
    "/en/about/",
    `${localizedHead("en", "/en/about/")}<a href="/%2e%2e/private/">Bad</a></body></html>`,
  );
  await writeRoute(
    outDir,
    "/about/",
    `<html lang="ko"><head><meta name="robots" content="index,follow"></head><body>
      <a href="/ko/about/">Only one fallback</a>
    </body></html>`,
  );

  await assert.rejects(
    () => verifyExport(outDir, contract),
    (error: Error) => {
      assert.match(error.message, /encoded traversal/i);
      assert.match(error.message, /noindex,follow/i);
      assert.match(error.message, /canonical/i);
      assert.match(error.message, /fallback/i);
      return true;
    },
  );
});

test("legacy robots metadata rejects conflicting, duplicate, and extra-directive variants", async () => {
  const cases = [
    ["noindex, follow", "index, follow"],
    ["noindex, follow", "noindex, follow"],
    ["noindex, follow, noarchive"],
  ];

  for (const robotsContents of cases) {
    const { outDir, contract } = await createValidFixture();
    await writeRoute(outDir, "/about/", legacyDocument(robotsContents));

    await assert.rejects(
      () => verifyExport(outDir, contract),
      /exactly one robots meta.*noindex,follow/i,
      robotsContents.join(" | "),
    );
  }
});

test("verification reports a missing local image asset while anchor assets remain ignored", async () => {
  const { outDir, contract } = await createValidFixture();
  await writeRoute(
    outDir,
    "/en/about/",
    `${localizedHead("en", "/en/about/")}
      <a href="/assets/downloads/not-a-page.pdf">Ignored anchor asset</a>
      <img src="/assets/images/missing-poster.webp" alt="Missing poster">
    </body></html>`,
  );

  await assert.rejects(
    () => verifyExport(outDir, contract),
    /missing local image.*missing-poster\.webp/i,
  );
});

test("verification rejects unreferenced public assets and accepts linked downloads", async () => {
  const invalid = await createValidFixture();
  const unusedAsset = path.join(invalid.outDir, "assets", "images", "unused.webp");
  await mkdir(path.dirname(unusedAsset), { recursive: true });
  await writeFile(unusedAsset, "unused", "utf8");

  await assert.rejects(
    () => verifyExport(invalid.outDir, {
      ...invalid.contract,
      enforceReferencedPublicAssets: true,
    }),
    /unreferenced public asset.*unused\.webp/i,
  );

  const valid = await createValidFixture();
  const resumeAsset = path.join(valid.outDir, "assets", "resume", "resume.pdf");
  await mkdir(path.dirname(resumeAsset), { recursive: true });
  await writeFile(resumeAsset, "resume", "utf8");
  await writeRoute(
    valid.outDir,
    "/en/about/",
    `${localizedHead("en", "/en/about/")}
      <a href="/assets/resume/resume.pdf">Download resume</a>
      <a href="../">Home</a>
    </body></html>`,
  );

  const result = await verifyExport(valid.outDir, {
    ...valid.contract,
    enforceReferencedPublicAssets: true,
  });
  assert.equal(result.errors, 0);
});

test("route-specific presentation rules reject index and About image requests", async () => {
  const cases = [
    { route: "/en/", prefix: "/assets/images/projects/", src: "/assets/images/projects/example.webp" },
    { route: "/en/about/", prefix: "/assets/images/about/", src: "/assets/images/about/example.webp" },
  ];

  for (const { route, prefix, src } of cases) {
    const { outDir, contract } = await createValidFixture();
    contract.forbiddenImagePrefixesByRoute = [{ routes: [route], prefixes: [prefix] }];
    await writeRoute(
      outDir,
      route,
      `${localizedHead("en", route)}<img src="${src}" alt="forbidden fixture"></body></html>`,
    );
    await mkdir(path.join(outDir, path.dirname(src)), { recursive: true });
    await writeFile(path.join(outDir, src), "fixture", "utf8");

    await assert.rejects(
      () => verifyExport(outDir, contract),
      /forbidden image request/i,
    );
  }
});

test("route-specific presentation rules allow Project detail evidence", async () => {
  const { outDir, contract } = await createValidFixture();
  const detailRoute = "/en/projects/example/";
  contract.forbiddenImagePrefixesByRoute = [
    { routes: ["/en/", "/en/about/"], prefixes: ["/assets/images/projects/", "/assets/images/about/"] },
  ];
  contract.localizedRoutes.push(localizedExpectation("en", detailRoute));
  contract.projectDetailRoutes.push(detailRoute);
  const src = "/assets/images/projects/detail-evidence.webp";
  await writeRoute(
    outDir,
    detailRoute,
    `${localizedHead("en", detailRoute)}
      <img src="${src}" alt="Project evidence">
      <div lang="en" data-project-content-locale="en">Project body</div>
    </body></html>`,
  );
  await mkdir(path.join(outDir, path.dirname(src)), { recursive: true });
  await writeFile(path.join(outDir, src), "fixture", "utf8");

  const result = await verifyExport(outDir, contract);
  assert.equal(result.errors, 0);
});

test("Project fallback verification requires a notice above mismatched-language content", async () => {
  const { outDir, contract } = await createValidFixture();
  const detailRoute = "/en/projects/example/";
  contract.localizedRoutes.push(localizedExpectation("en", detailRoute));
  contract.projectDetailRoutes.push(detailRoute);
  await writeRoute(
    outDir,
    detailRoute,
    `${localizedHead("en", detailRoute)}
      <div lang="ko" data-project-content-locale="ko">한국어 본문</div>
    </body></html>`,
  );

  await assert.rejects(
    () => verifyExport(outDir, contract),
    /fallback notice.*content locale/i,
  );
});

test("Project fallback verification accepts a localized notice in the page language", async () => {
  const { outDir, contract } = await createValidFixture();
  const detailRoute = "/en/projects/example/";
  contract.localizedRoutes.push(localizedExpectation("en", detailRoute));
  contract.projectDetailRoutes.push(detailRoute);
  await writeRoute(
    outDir,
    detailRoute,
    `${localizedHead("en", detailRoute)}
      <p role="note" lang="en" data-project-fallback-notice="ko">This project is currently available in Korean.</p>
      <div lang="ko" data-project-content-locale="ko">한국어 본문</div>
    </body></html>`,
  );

  const result = await verifyExport(outDir, contract);
  assert.equal(result.errors, 0);
});

test("Project fallback verification rejects a notice without role=note", async () => {
  const { outDir, contract } = await createValidFixture();
  const detailRoute = "/en/projects/example/";
  contract.localizedRoutes.push(localizedExpectation("en", detailRoute));
  contract.projectDetailRoutes.push(detailRoute);
  await writeRoute(
    outDir,
    detailRoute,
    `${localizedHead("en", detailRoute)}
      <p lang="en" data-project-fallback-notice="ko">This project is currently available in Korean.</p>
      <div lang="ko" data-project-content-locale="ko">한국어 본문</div>
    </body></html>`,
  );

  await assert.rejects(
    () => verifyExport(outDir, contract),
    /fallback notice must expose role=note/i,
  );
});

test("Project fallback verification rejects a notice outside the page language", async () => {
  const { outDir, contract } = await createValidFixture();
  const detailRoute = "/en/projects/example/";
  contract.localizedRoutes.push(localizedExpectation("en", detailRoute));
  contract.projectDetailRoutes.push(detailRoute);
  await writeRoute(
    outDir,
    detailRoute,
    `${localizedHead("en", detailRoute)}
      <p role="note" lang="ko" data-project-fallback-notice="ko">한국어 원문 안내</p>
      <div lang="ko" data-project-content-locale="ko">한국어 본문</div>
    </body></html>`,
  );

  await assert.rejects(
    () => verifyExport(outDir, contract),
    /fallback notice lang must match page locale en/i,
  );
});

test("Project fallback verification rejects a notice on native-language content", async () => {
  const { outDir, contract } = await createValidFixture();
  const detailRoute = "/ko/projects/example/";
  contract.localizedRoutes.push(localizedExpectation("ko", detailRoute));
  contract.projectDetailRoutes.push(detailRoute);
  await writeRoute(
    outDir,
    detailRoute,
    `${localizedHead("ko", detailRoute)}
      <p data-project-fallback-notice="ko">잘못 표시된 안내</p>
      <div lang="ko" data-project-content-locale="ko">한국어 본문</div>
    </body></html>`,
  );

  await assert.rejects(
    () => verifyExport(outDir, contract),
    /must not show a fallback notice/i,
  );
});

test("scoped presentation rules do not reject media in a later Home chapter", async () => {
  const { outDir, contract } = await createValidFixture();
  const route = "/en/";
  const src = "/assets/images/projects/creative-spotlight.webp";
  contract.forbiddenImagePrefixesByRoute = [
    {
      routes: [route],
      prefixes: ["/assets/images/projects/"],
      scope: {
        attribute: "data-home-section",
        value: "featured",
        endValue: "spotlight",
      },
    },
  ];
  await writeRoute(
    outDir,
    route,
    `${localizedHead("en", route)}
      <div data-home-section="featured"><p>Text-only projects</p></div>
      <div data-home-section="spotlight"><img src="${src}" alt="creative work"></div>
    </body></html>`,
  );
  await mkdir(path.join(outDir, path.dirname(src)), { recursive: true });
  await writeFile(path.join(outDir, src), "fixture", "utf8");

  const result = await verifyExport(outDir, contract);
  assert.equal(result.errors, 0);
});

test("source-evidence boundary names are rejected without blocking ordinary build artifacts", async () => {
  const { outDir, contract } = await createValidFixture();
  const forbiddenNames = [
    "private-source.png",
    "raw.png",
    "capture-original.jpg",
    "product-screenshot.webp",
    "product-screen_shot.png",
    "product-screen-shot.png",
  ];
  const allowedNames = [
    "resource.png",
    "originality.png",
    "rawhide.png",
    "screenshotter.png",
    "sourceful.png",
    "README.md",
    "next-route.txt",
  ];
  await mkdir(path.join(outDir, "assets", "review"), { recursive: true });
  for (const basename of [...forbiddenNames, ...allowedNames]) {
    await writeFile(path.join(outDir, "assets", "review", basename), "fixture", "utf8");
  }

  await assert.rejects(
    () => verifyExport(outDir, contract),
    (error: Error) => {
      for (const basename of forbiddenNames) assert.match(error.message, new RegExp(basename.replace(".", "\\.")));
      for (const basename of allowedNames) assert.doesNotMatch(error.message, new RegExp(basename.replace(".", "\\.")));
      return true;
    },
  );
});

test("forbidden public URLs cover raw, escaped, scheme-relative, and bare forms", async () => {
  const cases = [
    "https://github.com/CINEV/private",
    String.raw`https:\/\/github.com\/CINEV\/private`,
    "//github.com/CINEV/private",
    "github.com/CINEV/private",
    "https://assets.cinamon.io/private",
    String.raw`https:\/\/assets.cinamon.io\/private`,
    "//assets.cinamon.io/private",
    "assets.cinamon.io/private",
  ];
  const productionPatterns = createProductionExportContract().forbiddenHtmlPatterns;

  for (const forbiddenUrl of cases) {
    const { outDir, contract } = await createValidFixture();
    contract.forbiddenHtmlPatterns = productionPatterns;
    await writeRoute(
      outDir,
      "/en/about/",
      `${localizedHead("en", "/en/about/")}<p>${forbiddenUrl}</p></body></html>`,
    );

    await assert.rejects(
      () => verifyExport(outDir, contract),
      /contains forbidden (?:CINEV GitHub URL|Cinamon domain URL)/i,
      forbiddenUrl,
    );
  }
});

test("forbidden URL matching does not treat domain-like path segments or substrings as hosts", async () => {
  const cases = [
    "https://github.com/CINEVision/public",
    "https://notgithub.com/CINEV/public",
    "https://mycinamon.io/public",
    "https://cinamon.io.example.com/public",
    "https://example.com/archive/github.com/CINEV/public",
    "https://example.com/archive/assets.cinamon.io/public",
  ];
  const productionPatterns = createProductionExportContract().forbiddenHtmlPatterns;

  for (const allowedUrl of cases) {
    const { outDir, contract } = await createValidFixture();
    contract.forbiddenHtmlPatterns = productionPatterns;
    await writeRoute(
      outDir,
      "/en/about/",
      `${localizedHead("en", "/en/about/")}<p>${allowedUrl}</p></body></html>`,
    );

    const result = await verifyExport(outDir, contract);
    assert.equal(result.errors, 0, allowedUrl);
  }
});

test("slider controls cannot satisfy the contract through unrelated button and image counts", async () => {
  const { outDir, contract } = await createValidFixture();
  addSliderExpectation(contract);
  await writeRoute(outDir, "/en/about/", sliderDocument("none"));

  await assert.rejects(
    () => verifyExport(outDir, contract),
    /slider gallery controls/i,
  );
});

test("slider control roles must be attached to their semantic element kinds", async () => {
  const { outDir, contract } = await createValidFixture();
  addSliderExpectation(contract);
  await writeRoute(outDir, "/en/about/", sliderDocument("wrong-kind"));

  await assert.rejects(
    () => verifyExport(outDir, contract),
    /slider gallery controls/i,
  );
});

test("stable semantic slider controls satisfy the verifier contract", async () => {
  const { outDir, contract } = await createValidFixture();
  addSliderExpectation(contract);
  await writeRoute(outDir, "/en/about/", sliderDocument("valid"));

  const result = await verifyExport(outDir, contract);
  assert.equal(result.demoDetails, 1);
  assert.equal(result.galleryModes.slider, 1);
});

test("static galleries reject every slider control marker", async () => {
  const { outDir, contract } = await createValidFixture();
  const image = '<img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==" alt="">';
  contract.demoDetailRoutes = [
    {
      route: "/en/about/",
      slug: "fixture-static",
      galleryMode: "static",
      galleryItemCount: 1,
      videoMode: "none",
      videoId: null,
    },
  ];
  await writeRoute(
    outDir,
    "/en/about/",
    `${localizedHead("en", "/en/about/")}
      <div data-demo-gallery-mode="static" data-demo-gallery-control="thumbnail">${image}</div>
      <section data-demo-block="how-it-works"></section>
    </body></html>`,
  );

  await assert.rejects(
    () => verifyExport(outDir, contract),
    /static gallery.*control/i,
  );
});

test("playable Demos require the exact lazy no-referrer maxres thumbnail", async () => {
  const invalidDocuments = [
    videoDocument({ thumbnailSrc: null }),
    videoDocument({ thumbnailSrc: "https://example.com/vi/NLleH-4c5HY/maxresdefault.jpg" }),
    videoDocument({ thumbnailSrc: "https://i.ytimg.com/vi/wrong-video/maxresdefault.jpg" }),
    videoDocument({ thumbnailSrc: "https://i.ytimg.com/vi/NLleH-4c5HY/hqdefault.jpg" }),
    videoDocument({ loading: null }),
    videoDocument({ referrerPolicy: null }),
  ];

  for (const html of invalidDocuments) {
    const { outDir, contract } = await createValidFixture();
    addVideoExpectation(contract, "play", "NLleH-4c5HY");
    await writeRoute(outDir, "/en/about/", html);

    await assert.rejects(
      () => verifyExport(outDir, contract),
      /YouTube thumbnail/i,
    );
  }
});

test("video-free Demos reject YouTube thumbnail requests", async () => {
  const { outDir, contract } = await createValidFixture();
  addVideoExpectation(contract, "none", null);
  await writeRoute(outDir, "/en/about/", videoDocument({ state: "none" }));

  await assert.rejects(
    () => verifyExport(outDir, contract),
    /must not request a YouTube thumbnail/i,
  );
});

test("the production contract has eight localized Demos and no pending video state", () => {
  const contract = createProductionExportContract();

  assert.equal(contract.demoDetailRoutes.length, 24);
  assert.deepEqual(
    contract.demoDetailRoutes.map(({ slug }) => slug).filter(
      (slug, index, slugs) => slugs.indexOf(slug) === index,
    ),
    [
      "prompt-enhancer",
      "voice-adaptor",
      "reverse-storyboard",
      "reframer",
      "boundary-deduper",
      "iro-matcher",
      "loudness-matcher",
      "script-to-bgm",
    ],
  );
  assert.deepEqual(contract.expectedGalleryCounts, { static: 3, slider: 9, none: 12 });
  assert.deepEqual(contract.expectedVideoCounts, { play: 21 });
  assert.ok(
    contract.demoDetailRoutes.every(({ videoMode }) => String(videoMode) !== "pending"),
  );
});

test("the production contract freezes the Phase 4 static export inventory", () => {
  const contract = createProductionExportContract();

  assert.equal(contract.expectedHtmlFileCount, 106);
  assert.equal(contract.expectedLocalizedRouteCount, 84);
  assert.equal(contract.expectedProjectDetailCount, 45);
  assert.equal(contract.expectedDemoDetailCount, 24);
  assert.equal(contract.legacyRoutes.length, 19);
});

test("the production contract treats the retired A2P URL as an AI PO Leadership alias", () => {
  const contract = createProductionExportContract();
  const alias = contract.legacyRoutes.find(({ route }) => route === "/projects/cinev-a2p/");

  assert.deepEqual(alias, {
    route: "/projects/cinev-a2p/",
    canonical: `${siteUrl}/ko/projects/cinev-ai-po-leadership/`,
    fallbackHrefs: [
      "/ko/projects/cinev-ai-po-leadership/",
      "/en/projects/cinev-ai-po-leadership/",
      "/zh/projects/cinev-ai-po-leadership/",
    ],
  });
});

test("a playable Demo accepts the exact thumbnail and still rejects an initial iframe", async () => {
  const valid = await createValidFixture();
  addVideoExpectation(valid.contract, "play", "NLleH-4c5HY");
  await writeRoute(valid.outDir, "/en/about/", videoDocument());

  const result = await verifyExport(valid.outDir, valid.contract);
  assert.equal(result.demoDetails, 1);

  const invalid = await createValidFixture();
  addVideoExpectation(invalid.contract, "play", "NLleH-4c5HY");
  await writeRoute(invalid.outDir, "/en/about/", videoDocument({ iframe: true }));

  await assert.rejects(
    () => verifyExport(invalid.outDir, invalid.contract),
    /must not contain an initial iframe/i,
  );
});

test("a valid fixture passes and counts only actual page anchors", async () => {
  const { outDir, contract } = await createValidFixture();

  const result = await verifyExport(outDir, contract);

  assert.equal(result.localizedRoutes, 2);
  assert.equal(result.legacyRoutes, 1);
  assert.equal(result.demoDetails, 0);
  assert.equal(result.internalLinks, 10);
  assert.equal(result.errors, 0);
});

test("404/index.html must match 404.html when the optional directory form exists", async () => {
  const { outDir, contract } = await createValidFixture();
  await writeRoute(outDir, "/404/", "different not found");

  await assert.rejects(
    () => verifyExport(outDir, contract),
    /404\/index\.html.*match.*404\.html/i,
  );
});
