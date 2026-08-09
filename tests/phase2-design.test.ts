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
  "src/components/home/VideoSpotlightCarousel.tsx",
  "src/components/home/CareerTimeline.tsx",
  "src/components/projects/ProjectCard.tsx",
  "src/components/projects/ProjectsExplorer.tsx",
  "src/components/projects/EraFilter.tsx",
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

  for (const color of ["#f4e9e1", "#ffffff", "#0e0e0e", "#242320", "#ff5c00", "#b83c00", "#2835f8"]) {
    assert.match(css, new RegExp(color, "i"), `${color} must be an active design token`);
  }
  assert.doesNotMatch(css, /#ff3d00/i, "the retired orange must not remain active");
  for (const retired of ["#060b16", "#4ade80", "#374936", "#444639"]) {
    assert.doesNotMatch(css, new RegExp(retired, "i"), `${retired} must be retired`);
  }

  assert.doesNotMatch(css, /(?:radial|linear)-gradient/i);
  assert.doesNotMatch(css, /box-shadow|backdrop-filter|mix-blend-mode|grain-overlay|background-grid/i);
  const radii = [...css.matchAll(/border-radius:\s*([^;]+);/gi)].map((match) =>
    match[1].trim(),
  );
  assert.ok(
    radii.every((radius) => ["0", "999px", "50%"].includes(radius)),
    `unexpected border radius: ${radii.join(", ")}`,
  );
  assert.doesNotMatch(presentationFiles, /rounded-(?!full\b|none\b)[a-z0-9_[\]-]+/i);
  assert.doesNotMatch(presentationFiles, /shadow-|backdrop-blur|blur-|hover:-?translate|group-hover:scale/i);
});

test("orange separates vivid surfaces from accessible small copy on cream", () => {
  const css = readRepoFile("src/styles/globals.css");

  assert.match(css, /--color-ember-orange:\s*#ff5c00\s*;/i);
  assert.match(css, /--color-ember-orange-text:\s*#b83c00\s*;/i);
  assert.match(
    css,
    /\.hero-clause--demo\s*\{[^}]*color:\s*var\(--color-ember-orange-text\);/,
  );
  const heroDemoContrast = contrastRatio(
    readColorToken(css, "color-ember-orange-text"),
    readColorToken(css, "color-bone-cream"),
  );
  assert.ok(
    heroDemoContrast >= 3,
    `.hero-clause--demo contrast must be at least 3:1, received ${heroDemoContrast.toFixed(2)}:1`,
  );
  assert.match(
    css,
    /\.demo-preview-chapter,[^}]*\.demo-block--orange\s*\{[^}]*background:\s*var\(--color-ember-orange\);[^}]*color:\s*var\(--color-ink\);/,
  );
  assert.match(
    css,
    /\.reasoning-ledger span,[^}]*\.how-it-works-list > li > span\s*\{[^}]*color:\s*var\(--color-ember-orange-text\);/,
  );
  assert.match(
    css,
    /\.about-principles span\s*\{[^}]*color:\s*var\(--color-ember-orange-text\);/,
  );
  assert.match(
    css,
    /\.about-markets-ledger span\s*\{[^}]*color:\s*var\(--color-ember-orange-text\);/,
  );
  assert.match(
    css,
    /\.scroll-progress--demo\s*\{[^}]*color:\s*var\(--color-ember-orange-text\);/,
  );
  assert.match(
    css,
    /\.scroll-progress--demo \.scroll-progress__line\s*\{[^}]*background:\s*var\(--color-ember-orange\);/,
  );
  assert.match(
    css,
    /\.mdx-content \.award-result\s*\{[^}]*background:\s*var\(--color-ember-orange\);[^}]*color:\s*var\(--color-ink\);/,
  );
  assert.match(
    css,
    /\.about-demos-bridge\s*\{[^}]*background:\s*var\(--color-ember-orange\);[^}]*color:\s*var\(--color-ink\);/,
  );
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
    1,
    "anywhere wrapping must remain a narrow URL/technical-string fallback",
  );
  assert.match(css, /\.resume-contact a\s*\{[^}]*overflow-wrap:\s*anywhere;/);
  assert.doesNotMatch(projectAndDemo, /<br\b/i);
});

test("narrow Project titles and tablet About headings keep a readable measure", () => {
  const css = readRepoFile("src/styles/globals.css");

  assert.match(
    css,
    /@media \(max-width:\s*639px\)[\s\S]*?\.project-detail \.page-display\s*\{[^}]*font-size:\s*clamp\(3rem,\s*15\.5vw,\s*4\.75rem\);/,
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
  assert.match(transition, /duration:\s*0\.16/);
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
  assert.match(hero, /hero-clause--demo/);
  assert.match(hero, /hero-clause--project/);
  assert.match(hero, /hero-stat-ledger/);
  assert.match(demos, /demo-preview-grid/);
  assert.match(demos, /demo-preview-chapter/);
  assert.doesNotMatch(projects, /next\/image|<Image|project\.thumbnail/);
  assert.match(
    css,
    /\.hero-display\s*\{[^}]*max-width:\s*100%;[^}]*font-size:\s*clamp\(4rem,\s*9vw,\s*9rem\)/,
    "desktop Hero keeps the claim compact enough to reveal the next chapter",
  );
  assert.match(
    css,
    /\.hero-support-grid\s*\{[^}]*margin-top:\s*clamp\(1\.5rem,\s*3vw,\s*2\.5rem\)/,
  );
  assert.match(projects, /project-card--featured/);
  assert.match(timeline, /timeline-ledger/);
  assert.doesNotMatch(timeline, /eraColors|rounded-full/);
});

test("Home Hero delegates navigation without Portfolio or Resume shortcut CTAs", () => {
  const hero = readRepoFile("src/components/home/HeroSection.tsx");
  const css = readRepoFile("src/styles/globals.css");
  const localeMessages = ["ko", "en", "zh"].map((locale) =>
    JSON.parse(readRepoFile(`src/i18n/${locale}.json`)),
  );

  assert.doesNotMatch(hero, /hero-actions|ctaPortfolio|ctaResume/);
  assert.doesNotMatch(hero, /from "next\/link"|getLocalizedPath/);
  assert.doesNotMatch(css, /\.hero-actions/);
  for (const messages of localeMessages) {
    assert.equal("ctaPortfolio" in messages.home.hero, false);
    assert.equal("ctaResume" in messages.home.hero, false);
  }
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
  assert.match(card, /copy\.card\.highlightLabel/);
  assert.match(card, /project\.primaryMetric/);
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

test("Demos retain exact semantic flow with orange media and intrinsic diagrams", () => {
  const detail = readRepoFile("src/components/demos/DemoDetail.tsx");
  const diagram = readRepoFile("src/components/demos/DemoDiagram.tsx");
  const video = readRepoFile("src/components/demos/DemoVideo.tsx");
  const gallery = readRepoFile("src/components/demos/DemoGallery.tsx");

  const blocks = ["hero", "hypothesis", "media", "how-it-works", "stack", "boundary"];
  assert.deepEqual(
    blocks.map((block) => detail.indexOf(`data-demo-block="${block}"`)),
    [...blocks.map((block) => detail.indexOf(`data-demo-block="${block}"`))].sort((a, b) => a - b),
  );
  assert.match(detail, /demo-block--orange/);
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
  assert.match(css, /transition-duration:\s*1ms\s*!important/);
  assert.doesNotMatch(css, /transition[^;]*(?:transform|filter)/i);
});
