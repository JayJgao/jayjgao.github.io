import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";

const repoRoot = new URL("..", import.meta.url);

function readRepoFile(path: string): string {
  return readFileSync(new URL(path, repoRoot), "utf8");
}

function readColorToken(css: string, token: string): string {
  const match = css.match(new RegExp(`--${token}:\\s*(#[0-9a-f]{6})\\s*;`, "i"));
  assert.ok(match, `missing color token --${token}`);
  return match[1];
}

function relativeLuminance(hex: string): number {
  const channels = hex
    .slice(1)
    .match(/.{2}/g)
    ?.map((channel) => Number.parseInt(channel, 16) / 255);
  assert.ok(channels, `invalid hex color ${hex}`);
  const [red, green, blue] = channels.map((channel) =>
    channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4,
  );
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

function contrastRatio(foreground: string, background: string): number {
  const light = Math.max(relativeLuminance(foreground), relativeLuminance(background));
  const dark = Math.min(relativeLuminance(foreground), relativeLuminance(background));
  return (light + 0.05) / (dark + 0.05);
}

function readProjectContentSources(): string {
  const projectContentUrl = new URL("src/content/projects/ko/", repoRoot);
  return readdirSync(projectContentUrl)
    .filter((name) => name.endsWith(".mdx"))
    .map((name) => readFileSync(new URL(name, projectContentUrl), "utf8"))
    .join("\n");
}

const presentationFiles = [
  "src/components/layout/Navbar.tsx",
  "src/components/layout/Footer.tsx",
  "src/components/home/HeroSection.tsx",
  "src/components/home/DemosPreview.tsx",
  "src/components/home/FeaturedProjects.tsx",
  "src/components/home/FilmsStrip.tsx",
  "src/components/home/CareerTimeline.tsx",
  "src/components/projects/ProjectCard.tsx",
  "src/components/projects/ProjectsExplorer.tsx",
  "src/components/projects/CompanyFilter.tsx",
  "src/components/projects/CaseStudy.tsx",
  "src/components/demos/DemoCard.tsx",
  "src/components/demos/DemosExplorer.tsx",
  "src/components/demos/DemoDetail.tsx",
  "src/components/demos/DemoDiagram.tsx",
  "src/components/demos/DemoGallery.tsx",
  "src/components/demos/DemoVideo.tsx",
  "src/components/resume/ResumeRenderer.tsx",
].map(readRepoFile).join("\n");

test("Phase 2 exposes only the approved editorial color and depth system", () => {
  const css = readRepoFile("src/styles/globals.css");

  for (const color of ["#ffffff", "#0e0e0e", "#5a5d66", "#d9dbe0", "#2835f8", "#f3f4ff", "#ffc400"]) {
    assert.match(css, new RegExp(color, "i"), `${color} must be an active design token`);
  }
  assert.doesNotMatch(css, /#ff3d00/i, "the retired orange must not remain active");
  for (const retired of ["#f4e9e1", "#ff5c00", "#b83c00", "#242320", "#ff3d00", "#060b16", "#4ade80", "#374936", "#444639"]) {
    assert.doesNotMatch(css, new RegExp(retired, "i"), `${retired} must be retired`);
  }

  assert.doesNotMatch(css, /(?:radial|linear)-gradient/i);
  assert.doesNotMatch(css, /box-shadow|backdrop-filter|mix-blend-mode|grain-overlay|background-grid/i);
  const radii = [...css.matchAll(/border-radius:\s*([^;]+);/gi)].map((match) =>
    match[1].trim(),
  );
  assert.ok(
    radii.every((radius) => ["0", "50%"].includes(radius)),
    `unexpected border radius: ${radii.join(", ")}`,
  );
  assert.doesNotMatch(presentationFiles, /rounded-(?!full\b|none\b)[a-z0-9_[\]-]+/i);
  assert.doesNotMatch(presentationFiles, /shadow-|backdrop-blur|blur-|hover:-?translate|group-hover:scale/i);
});

test("signal yellow is fill-only", () => {
  const css = readRepoFile("src/styles/globals.css");
  assert.doesNotMatch(css, /(?:^|[;{])\s*color:\s*var\(--(?:color-signal-yellow|accent)\)/m);
  assert.ok(contrastRatio(readColorToken(css, "color-paper"), readColorToken(css, "color-cobalt-blue")) >= 4.5);
  for (const selector of [".demo-list-hero", ".demo-block--accent", ".about-demos-bridge", ".mdx-content .award-result"]) {
    const rule = [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)].find((match) => match[1].split(",").some((part) => part.trim() === selector) && match[2].includes("background:"));
    assert.ok(rule, selector);
    assert.match(rule[2], /background: var\(--color-cobalt-blue\)/);
    assert.match(rule[2], /color: var\(--color-paper\)/);
  }
  assert.match(css, /\.section-display::before\s*\{[^}]*background: var\(--color-signal-yellow\)/);
});

test("labels are sans and never uppercased", () => {
  const css = readRepoFile("src/styles/globals.css");
  assert.doesNotMatch(css, /text-transform:\s*uppercase/);
  const numericSelectors = new Set([".num", ".reasoning-ledger .num", ".how-it-works-list > li > .num", ".resume-kpi-ledger .num", ".section-index", ".scroll-progress__counter", ".timeline-row__number", ".project-archive-index", ".mdx-content h2::before", ".demo-gallery-counter", ".resume-experience-row header > p", ".about-principles span", ".about-markets-ledger span"]);
  for (const rule of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    if (!/font-family: var\(--font-plex-mono\)/.test(rule[2])) continue;
    for (const selector of rule[1].trim().split(",")) assert.ok(numericSelectors.has(selector.trim()), selector);
    assert.match(rule[2], /font-variant-numeric: tabular-nums/);
  }
  assert.doesNotMatch(presentationFiles, /className="pill"|btn-on-orange|demo-block--orange/);
});

test("wrapping follows display, prose, Korean, and technical-string roles", () => {
  const css = readRepoFile("src/styles/globals.css");
  const projectAndDemo = [
    "src/components/projects/ProjectCard.tsx",
    "src/components/projects/ProjectsExplorer.tsx",
    "src/components/projects/CaseStudy.tsx",
    "src/components/demos/DemoCard.tsx",
    "src/components/demos/DemosExplorer.tsx",
    "src/components/demos/DemoDetail.tsx",
    "src/app/[locale]/about/page.tsx",
    "src/components/resume/ResumeRenderer.tsx",
  ].map(readRepoFile).join("\n");

  assert.match(css, /\.section-display,[^}]*\.page-display,[^}]*\.hero-display\s*\{[^}]*text-wrap:\s*balance;/);
  assert.match(css, /\.project-detail-intro,[^}]*\.demo-detail-summary,[^}]*\.about-lead[^}]*\{[^}]*text-wrap:\s*balance;/);
  assert.match(css, /\.mdx-content p,[^}]*\.mdx-content li[^}]*\{[^}]*text-wrap:\s*pretty;/);
  assert.match(css, /\.mdx-content\[lang="ko"\]\s*\{[^}]*word-break:\s*keep-all;/);
  assert.deepEqual(
    [...css.matchAll(/overflow-wrap:\s*anywhere/g)].length,
    2,
    "anywhere wrapping must remain a narrow URL/technical-string fallback",
  );
  assert.match(css, /\.resume-contact a\s*\{[^}]*overflow-wrap:\s*anywhere;/);
  assert.match(css, /\.project-related-links a\s*\{[^}]*overflow-wrap:\s*anywhere;/);
  assert.doesNotMatch(projectAndDemo, /<br\b/i);
});

test("narrow Project titles and tablet About headings keep a readable measure", () => {
  const css = readRepoFile("src/styles/globals.css");

  assert.match(
    css,
    /\.project-detail \.page-display\s*\{[^}]*font-size:\s*clamp\(2\.2rem,\s*4vw,\s*3\.5rem\);/,
  );
  assert.match(
    css,
    /@media \(min-width:\s*640px\) and \(max-width:\s*1023px\)[\s\S]*?\.about-opening \.chapter-inner,[^}]*\.about-section \.chapter-inner\s*\{[^}]*grid-template-columns:\s*minmax\(14rem,\s*0\.8fr\) minmax\(0,\s*1\.2fr\);/,
  );
});

test("localized layout self-hosts the approved fonts and removes the dark decoration root", () => {
  const layout = readRepoFile("src/app/[locale]/layout.tsx");
  const css = readRepoFile("src/styles/globals.css");

  assert.match(layout, /from "next\/font\/google"/);
  assert.match(layout, /IBM_Plex_Sans_KR/);
  assert.match(layout, /IBM_Plex_Mono/);
  assert.match(layout, /Noto_Sans_SC/);
  assert.match(layout, /--font-plex-sans/);
  assert.match(layout, /--font-plex-mono/);
  assert.match(layout, /--font-noto-sans-sc/);
  assert.doesNotMatch(layout, /className="dark"|background-grid|grain-overlay/);
  assert.match(css, /html\[lang="zh"\]/);
  assert.match(css, /word-break:\s*keep-all/);
});

test("global shell keeps primary navigation visible and exposes skip and chapter progress", () => {
  const shell = readRepoFile("src/components/layout/SiteShell.tsx");
  const navbar = readRepoFile("src/components/layout/Navbar.tsx");
  const transition = readRepoFile("src/components/layout/PageTransition.tsx");

  assert.match(shell, /className="skip-link"/);
  assert.match(shell, /href="#main-content"/);
  assert.match(shell, /ScrollProgress/);
  assert.match(navbar, /nav-mobile-scroll/);
  assert.match(navbar, /aria-current=\{active \? "page"/);
  assert.doesNotMatch(navbar, /backdrop-blur|bg-background\//);
  assert.doesNotMatch(transition, /\by\s*:/);
  assert.doesNotMatch(transition, /framer-motion|AnimatePresence|opacity/);
});

test("Home is an evidence-first sequence with text-only project and Demo indexes", () => {
  const css = readRepoFile("src/styles/globals.css");
  const home = readRepoFile("src/app/[locale]/page.tsx");
  const hero = readRepoFile("src/components/home/HeroSection.tsx");
  const demos = readRepoFile("src/components/home/DemosPreview.tsx");
  const projects = readRepoFile("src/components/projects/ProjectCard.tsx");
  const timeline = readRepoFile("src/components/home/CareerTimeline.tsx");

  assert.match(home, /id="main-content"/);
  assert.match(home, /className="home-editorial"/);
  assert.match(hero, /hero-lead/);
  assert.match(hero, /<ResultBand/);
  assert.match(demos, /demo-preview-rows/);
  assert.match(demos, /demo-preview-chapter/);
  assert.doesNotMatch(projects, /next\/image|<Image|project\.thumbnail/);
  assert.match(css, /\.hero-display\s*\{[^}]*font-size:\s*clamp\(2rem,\s*5\.2vw,\s*4\.4rem\)/);
  assert.match(projects, /project-card--\$\{variant\}/);
  assert.match(timeline, /career-bars/);
  assert.doesNotMatch(timeline, /eraColors|rounded-full/);
});

test("Home Hero exposes locale-aware PDF and LinkedIn actions", () => {
  const hero = readRepoFile("src/components/home/HeroSection.tsx");
  assert.match(hero, /hero-actions/);
  assert.match(hero, /locale === "ko"/);
  assert.match(hero, /고재현_이력서\.pdf/);
  assert.match(hero, /jayko_resume\.pdf/);
  assert.match(hero, /href=\{meta.linkedin\}/);
  assert.doesNotMatch(hero, /ctaPortfolio/);
});

test("Projects separate white Featured cards from one-line Archive rows and retain detail media", () => {
  const explorer = readRepoFile("src/components/projects/ProjectsExplorer.tsx");
  const card = readRepoFile("src/components/projects/ProjectCard.tsx");
  const detail = readRepoFile("src/components/projects/CaseStudy.tsx");
  const css = readRepoFile("src/styles/globals.css");

  assert.match(explorer, /project-list-hero/);
  assert.match(explorer, /variant="archive"/);
  assert.match(card, /variant\?:\s*"default"\s*\|\s*"featured"\s*\|\s*"archive"/);
  assert.match(card, /project\.oneLiner\[locale\]/);
  assert.match(card, /project-card--archive/);
  assert.match(detail, /from "next\/image"/);
  assert.match(detail, /src=\{project\.thumbnail\}/);
  assert.match(detail, /data-project-section="hero"/);
  assert.match(detail, /data-project-section="content"/);
  assert.match(css, /counter-reset:\s*project-section/);
  assert.match(css, /counter-increment:\s*project-section/);
});

test("Project cards label performance as a highlight while ownership stays in details", () => {
  const card = readRepoFile("src/components/projects/ProjectCard.tsx");
  const detail = readRepoFile("src/components/projects/CaseStudy.tsx");
  const locales = {
    ko: JSON.parse(readRepoFile("src/i18n/ko.json")),
    en: JSON.parse(readRepoFile("src/i18n/en.json")),
    zh: JSON.parse(readRepoFile("src/i18n/zh.json")),
  } as const;

  assert.deepEqual(
    Object.values(locales).map((messages) => messages.projects.card.highlightLabel),
    ["하이라이트", "Highlight", "亮点"],
  );
  assert.match(card, /project\.results\?\.\[project\.featuredResult \?\? 0\]/);
  assert.match(card, /result\.caption\[locale\]/);
  assert.doesNotMatch(card, /copy\.card\.contributionLabel/);
  assert.doesNotMatch(card, /project\.contribution/);
  assert.match(detail, /copy\.contribution/);
  assert.match(detail, /project\.contribution/);
});

test("Project detail content does not use decorative emoji icons", () => {
  assert.doesNotMatch(readProjectContentSources(), /🚧|💡|⚙️?|✅|🔗|🏆/);
});

test("Project detail callouts compile without nested paragraph markup", () => {
  assert.doesNotMatch(
    readProjectContentSources(),
    /<p className="highlight-callout__body">/,
    "callout bodies must not create nested paragraphs during MDX compilation",
  );
});

test("Demos retain exact semantic flow with accent media and intrinsic diagrams", () => {
  const detail = readRepoFile("src/components/demos/DemoDetail.tsx");
  const diagram = readRepoFile("src/components/demos/DemoDiagram.tsx");
  const video = readRepoFile("src/components/demos/DemoVideo.tsx");
  const gallery = readRepoFile("src/components/demos/DemoGallery.tsx");

  const blocks = ["hero", "hypothesis", "media", "how-it-works", "stack", "boundary"];
  assert.deepEqual(
    blocks.map((block) => detail.indexOf(`data-demo-block="${block}"`)),
    [...blocks.map((block) => detail.indexOf(`data-demo-block="${block}"`))].sort((a, b) => a - b),
  );
  assert.match(detail, /demo-block--accent/);
  assert.match(diagram, /demo-diagram__viewport/);
  assert.match(diagram, /demo-diagram__image/);
  assert.match(video, /demo-video-fallback/);
  assert.doesNotMatch(video, /gradient|shadow-|backdrop-blur|group-hover:scale/i);
  assert.match(gallery, /data-demo-gallery-control="previous"/);
  assert.match(gallery, /aria-current=\{selected \? "true"/);
});

test("About is image-free and Resume is a flat paper document", () => {
  const about = readRepoFile("src/app/[locale]/about/page.tsx");
  const resume = readRepoFile("src/components/resume/ResumeRenderer.tsx");

  assert.doesNotMatch(about, /next\/image|<Image|sectionImages|assets\/images\/about/);
  assert.match(about, /about-demos-bridge/);
  assert.match(about, /about-markets-ledger/);
  assert.match(about, /about-belief-plate/);
  assert.match(resume, /resume-document/);
  assert.match(resume, /resume-kpi-ledger/);
  assert.match(resume, /resume-experience-row/);
});

test("responsive and motion contracts use the approved breakpoints and restrained transitions", () => {
  const css = readRepoFile("src/styles/globals.css");

  assert.match(css, /@media \(max-width:\s*639px\)/);
  assert.match(css, /@media \(min-width:\s*640px\) and \(max-width:\s*1023px\)/);
  assert.match(css, /@media \(min-width:\s*1024px\)/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(css, /transition:\s*none\s*!important/);
  assert.doesNotMatch(css, /transition[^;]*(?:transform|filter)/i);
});

test("Resume ledgers distinguish structural rules from row separators", () => {
  const css = readRepoFile("src/styles/globals.css");
  assert.match(css, /\.resume-kpi-ledger\s*\{[^}]*border-block: 3px solid var\(--color-ink\)/);
  assert.match(css, /\.resume-experience-list\s*\{[^}]*border-top: 3px solid var\(--color-ink\)/);
  assert.match(css, /\.resume-experience-row\s*\{[^}]*border-bottom: 1px solid var\(--color-hairline\)/);
  for (const rule of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    if (!rule[1].includes(".resume-experience-row > * + *") && !rule[1].includes(".resume-kpi-ledger > div + div")) continue;
    assert.doesNotMatch(rule[2], /1px solid var\(--color-ink\)/);
    assert.match(rule[2], /1px solid var\(--color-hairline\)/);
  }
});

test("Demo step indexes use numeric typography", () => {
  const detail = readRepoFile("src/components/demos/DemoDetail.tsx");
  assert.match(detail, /<span className="num">\{String\(index \+ 1\).padStart\(2, "0"\)\}<\/span>/);
});

test("page navigation never introduces smooth scrolling", () => {
  assert.doesNotMatch(readRepoFile("src/styles/globals.css"), /scroll-behavior:\s*smooth/);
});

test("Resume downloads prioritize the Korean PDF and keep the English PDF secondary", () => {
  const page = readRepoFile("src/app/[locale]/resume/page.tsx");
  assert.match(page, /href="\/assets\/resume\/고재현_이력서\.pdf" className="btn-primary"/);
  assert.match(page, /href="\/assets\/resume\/jayko_resume\.pdf" className="btn-secondary"/);
});

test("focus rings contrast on cobalt controls without changing white card focus", () => {
  const css = readRepoFile("src/styles/globals.css").replace(/\/\*[\s\S]*?\*\//g, "");
  assert.match(css, /:focus-visible\s*\{[^}]*outline: 3px solid var\(--color-cobalt-blue\)/);
  for (const selector of [".demo-detail-hero .demo-back-link:focus-visible"]) {
    const rule = [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)].find((match) => match[1].split(",").some((part) => part.trim() === selector));
    assert.ok(rule, selector);
    assert.match(rule[2], /outline-color: var\(--color-paper\)/);
  }
  assert.doesNotMatch(css, /\.demo-preview-chapter :focus-visible|\.demo-block--accent :focus-visible/);
});
