import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

import { getAllDemoSlugs, getDemoBySlug, getGalleryMode } from "../../src/lib/demos";
import { SUPPORTED_LOCALES, type Locale } from "../../src/lib/locale";
import { SITE_URL } from "../../src/lib/metadata";
import { getAllProjectSlugs } from "../../src/lib/projects";

export type HtmlTag = {
  name: string;
  attributes: Record<string, string>;
  start: number;
  end: number;
};

export type DocumentSignals = {
  lang: string | null;
  canonical: string | null;
  canonicalHrefs: string[];
  alternates: Record<string, string>;
  alternateHrefs: Record<string, string[]>;
  anchorHrefs: string[];
  robots: string[];
  iframes: HtmlTag[];
  tags: HtmlTag[];
};

export type LocalizedRouteExpectation = {
  route: string;
  locale: string;
  canonical: string;
  alternates: Record<"ko" | "en" | "zh" | "x-default", string>;
};

export type LegacyRouteExpectation = {
  route: string;
  canonical: string;
  fallbackHrefs: string[];
};

export type DemoRouteExpectation = {
  route: string;
  slug: string;
  galleryMode: "none" | "static" | "slider";
  galleryItemCount: number;
  videoMode: "play" | "none";
  videoId: string | null;
};

export type ExportContract = {
  siteUrl: string;
  basePath: string;
  localizedRoutes: LocalizedRouteExpectation[];
  legacyRoutes: LegacyRouteExpectation[];
  rootRedirect: {
    route: string;
    fallbackHrefs: string[];
  };
  projectDetailRoutes: string[];
  demoDetailRoutes: DemoRouteExpectation[];
  require404: boolean;
  expectedHtmlFileCount?: number;
  enforceExactHtmlInventory?: boolean;
  expectedLocalizedRouteCount?: number;
  expectedProjectDetailCount?: number;
  expectedDemoDetailCount?: number;
  expectedGalleryCounts?: Record<"none" | "static" | "slider", number>;
  expectedVideoCounts?: Record<"play", number>;
  forbiddenHtmlPatterns: Array<{ label: string; pattern: RegExp }>;
  sourceEvidenceBasenames: string[];
  forbiddenImagePrefixesByRoute?: Array<{
    routes: string[];
    prefixes: string[];
    scope?: {
      attribute: string;
      value: string;
      endValue?: string;
    };
  }>;
};

export type ExportVerificationResult = {
  htmlFiles: number;
  localizedRoutes: number;
  legacyRoutes: number;
  projectDetails: number;
  demoDetails: number;
  internalLinks: number;
  galleryModes: Record<"none" | "static" | "slider", number>;
  videoStates: Record<"play", number>;
  errors: 0;
};

const RAW_CONTENT_TAGS = new Set(["script", "style", "template"]);
const BASIC_ENTITIES: Record<string, string> = {
  amp: "&",
  apos: "'",
  gt: ">",
  lt: "<",
  quot: '"',
};

function decodeHtmlEntities(value: string): string {
  return value.replace(
    /&(#(?:x[0-9a-f]+|[0-9]+)|amp|apos|gt|lt|quot);/gi,
    (entity, body: string) => {
      if (body.startsWith("#")) {
        const hexadecimal = body[1]?.toLowerCase() === "x";
        const digits = body.slice(hexadecimal ? 2 : 1);
        const codePoint = Number.parseInt(digits, hexadecimal ? 16 : 10);
        if (!Number.isFinite(codePoint) || codePoint > 0x10ffff) return entity;
        try {
          return String.fromCodePoint(codePoint);
        } catch {
          return entity;
        }
      }

      return BASIC_ENTITIES[body.toLowerCase()] ?? entity;
    },
  );
}

function findTagEnd(html: string, start: number): number {
  let quote: '"' | "'" | null = null;

  for (let index = start + 1; index < html.length; index += 1) {
    const character = html[index];
    if (quote) {
      if (character === quote) quote = null;
      continue;
    }
    if (character === '"' || character === "'") {
      quote = character;
      continue;
    }
    if (character === ">") return index;
  }

  return html.length - 1;
}

function parseAttributes(source: string, offset: number): Record<string, string> {
  const attributes: Record<string, string> = {};
  let cursor = offset;

  while (cursor < source.length) {
    while (/\s/.test(source[cursor] ?? "")) cursor += 1;
    if (cursor >= source.length || source[cursor] === "/" || source[cursor] === ">") break;

    const nameStart = cursor;
    while (cursor < source.length && !/[\s=/>]/.test(source[cursor] ?? "")) cursor += 1;
    const name = source.slice(nameStart, cursor).toLowerCase();
    if (!name) {
      cursor += 1;
      continue;
    }

    while (/\s/.test(source[cursor] ?? "")) cursor += 1;
    let value = "";
    if (source[cursor] === "=") {
      cursor += 1;
      while (/\s/.test(source[cursor] ?? "")) cursor += 1;
      const quote = source[cursor];
      if (quote === '"' || quote === "'") {
        cursor += 1;
        const valueStart = cursor;
        while (cursor < source.length && source[cursor] !== quote) cursor += 1;
        value = source.slice(valueStart, cursor);
        if (source[cursor] === quote) cursor += 1;
      } else {
        const valueStart = cursor;
        while (cursor < source.length && !/[\s>]/.test(source[cursor] ?? "")) cursor += 1;
        value = source.slice(valueStart, cursor).replace(/\/$/, "");
      }
    }

    attributes[name] = decodeHtmlEntities(value);
  }

  return attributes;
}

export function scanHtmlTags(html: string): HtmlTag[] {
  const tags: HtmlTag[] = [];
  const lowerHtml = html.toLowerCase();
  let cursor = 0;

  while (cursor < html.length) {
    const start = html.indexOf("<", cursor);
    if (start < 0) break;

    if (html.startsWith("<!--", start)) {
      const commentEnd = html.indexOf("-->", start + 4);
      cursor = commentEnd < 0 ? html.length : commentEnd + 3;
      continue;
    }

    const next = html[start + 1];
    if (!next || next === "/" || next === "!" || next === "?") {
      cursor = findTagEnd(html, start) + 1;
      continue;
    }

    const end = findTagEnd(html, start);
    let nameEnd = start + 1;
    while (nameEnd <= end && /[A-Za-z0-9:-]/.test(html[nameEnd] ?? "")) nameEnd += 1;
    const name = html.slice(start + 1, nameEnd).toLowerCase();
    if (!name) {
      cursor = end + 1;
      continue;
    }

    const tag = {
      name,
      attributes: parseAttributes(html.slice(start, end + 1), nameEnd - start),
      start,
      end: end + 1,
    };

    if (RAW_CONTENT_TAGS.has(name)) {
      const closingStart = lowerHtml.indexOf(`</${name}`, end + 1);
      cursor = closingStart < 0 ? html.length : findTagEnd(html, closingStart) + 1;
    } else {
      tags.push(tag);
      cursor = end + 1;
    }
  }

  return tags;
}

function relTokens(value: string): string[] {
  return value.toLowerCase().split(/\s+/).filter(Boolean);
}

export function extractDocumentSignals(html: string): DocumentSignals {
  const tags = scanHtmlTags(html);
  const htmlTags = tags.filter(({ name }) => name === "html");
  const canonicalHrefs: string[] = [];
  const alternateHrefs: Record<string, string[]> = {};
  const anchorHrefs: string[] = [];
  const robots: string[] = [];
  const iframes: HtmlTag[] = [];

  for (const tag of tags) {
    if (tag.name === "link") {
      const rel = relTokens(tag.attributes.rel ?? "");
      if (rel.includes("canonical") && tag.attributes.href) {
        canonicalHrefs.push(tag.attributes.href);
      }
      if (rel.includes("alternate") && tag.attributes.hreflang && tag.attributes.href) {
        const language = tag.attributes.hreflang.toLowerCase();
        (alternateHrefs[language] ??= []).push(tag.attributes.href);
      }
    } else if (tag.name === "a" && tag.attributes.href) {
      anchorHrefs.push(tag.attributes.href);
    } else if (
      tag.name === "meta" &&
      tag.attributes.name?.toLowerCase() === "robots" &&
      tag.attributes.content
    ) {
      robots.push(tag.attributes.content);
    } else if (tag.name === "iframe") {
      iframes.push(tag);
    }
  }

  return {
    lang: htmlTags[0]?.attributes.lang ?? null,
    canonical: canonicalHrefs[0] ?? null,
    canonicalHrefs,
    alternates: Object.fromEntries(
      Object.entries(alternateHrefs).map(([language, hrefs]) => [language, hrefs[0]]),
    ),
    alternateHrefs,
    anchorHrefs,
    robots,
    iframes,
    tags,
  };
}

function normalizedBasePath(basePath: string): string {
  if (!basePath || basePath === "/") return "";
  return `/${basePath.split("/").filter(Boolean).join("/")}`;
}

function assertNoEncodedTraversal(value: string): void {
  if (!/%[0-9a-f]{2}/i.test(value)) return;

  let decoded = value;
  for (let pass = 0; pass < 3; pass += 1) {
    try {
      const next = decodeURIComponent(decoded);
      if (next === decoded) break;
      decoded = next;
    } catch {
      throw new Error(`Invalid percent encoding in URL: ${value}`);
    }
  }

  const pathOnly = decoded.split(/[?#]/, 1)[0] ?? "";
  if (pathOnly.split(/[\\/]/).some((segment) => segment === "..")) {
    throw new Error(`Encoded traversal is not allowed: ${value}`);
  }
}

function normalizePageRoute(route: string): string {
  const pathOnly = route.split(/[?#]/, 1)[0] || "/";
  if (pathOnly === "/") return "/";
  if (/\.[a-z0-9]+$/i.test(pathOnly)) return pathOnly.startsWith("/") ? pathOnly : `/${pathOnly}`;
  return `/${pathOnly.split("/").filter(Boolean).join("/")}/`;
}

export function routeToExportRelativePath(route: string, basePath = ""): string {
  assertNoEncodedTraversal(route);
  const decoded = decodeURIComponent(route.split(/[?#]/, 1)[0] || "/");
  const configuredBasePath = normalizedBasePath(basePath);
  let sitePath = decoded.startsWith("/") ? decoded : `/${decoded}`;

  if (configuredBasePath) {
    if (sitePath === configuredBasePath) sitePath = "/";
    else if (sitePath.startsWith(`${configuredBasePath}/`)) sitePath = sitePath.slice(configuredBasePath.length);
  }

  if (sitePath.split(/[\\/]/).some((segment) => segment === "..")) {
    throw new Error(`Path traversal is not allowed: ${route}`);
  }

  const normalized = normalizePageRoute(sitePath);
  if (normalized === "/") return "index.html";
  const relative = normalized.replace(/^\/+/, "");
  return /\.[a-z0-9]+$/i.test(relative)
    ? relative
    : path.posix.join(relative, "index.html");
}

function isAssetPath(route: string): boolean {
  if (route === "/favicon.ico") return true;
  if (route.startsWith("/_next/") || route.startsWith("/assets/")) return true;
  return /\.[a-z0-9]+$/i.test(route) && !route.toLowerCase().endsWith(".html");
}

export function resolveInternalHref(
  href: string,
  currentRoute: string,
  options: { siteUrl: string; basePath: string },
): string | null {
  const trimmed = href.trim();
  if (!trimmed || trimmed.startsWith("#")) return null;
  assertNoEncodedTraversal(trimmed);

  const configuredBasePath = normalizedBasePath(options.basePath);
  const origin = new URL(options.siteUrl);
  const currentWithBase = configuredBasePath
    ? `${configuredBasePath}${normalizePageRoute(currentRoute)}`
    : normalizePageRoute(currentRoute);
  const resolved = new URL(trimmed, new URL(currentWithBase, origin));

  if (resolved.protocol !== "http:" && resolved.protocol !== "https:") return null;
  if (resolved.origin !== origin.origin) return null;

  let sitePath = resolved.pathname;
  if (configuredBasePath) {
    if (sitePath === configuredBasePath) sitePath = "/";
    else if (sitePath.startsWith(`${configuredBasePath}/`)) sitePath = sitePath.slice(configuredBasePath.length);
    else throw new Error(`Internal URL escapes configured basePath ${configuredBasePath}: ${href}`);
  }

  const route = normalizePageRoute(sitePath);
  return isAssetPath(route) ? null : route;
}

export function resolveLocalAssetHref(
  href: string,
  currentRoute: string,
  options: { siteUrl: string; basePath: string },
): string | null {
  const trimmed = href.trim();
  if (!trimmed || trimmed.startsWith("data:") || trimmed.startsWith("blob:")) return null;
  assertNoEncodedTraversal(trimmed);

  const configuredBasePath = normalizedBasePath(options.basePath);
  const origin = new URL(options.siteUrl);
  const currentWithBase = configuredBasePath
    ? `${configuredBasePath}${normalizePageRoute(currentRoute)}`
    : normalizePageRoute(currentRoute);
  const resolved = new URL(trimmed, new URL(currentWithBase, origin));

  if (resolved.protocol !== "http:" && resolved.protocol !== "https:") return null;
  if (resolved.origin !== origin.origin) return null;

  let assetPath = decodeURIComponent(resolved.pathname);
  if (configuredBasePath) {
    if (assetPath.startsWith(`${configuredBasePath}/`)) {
      assetPath = assetPath.slice(configuredBasePath.length);
    } else {
      throw new Error(`Local asset URL escapes configured basePath ${configuredBasePath}: ${href}`);
    }
  }

  if (assetPath.split(/[\\/]/).some((segment) => segment === "..")) {
    throw new Error(`Path traversal is not allowed: ${href}`);
  }
  return assetPath.startsWith("/") ? assetPath : `/${assetPath}`;
}

function routeFilePath(outDir: string, route: string, basePath: string): string {
  const root = path.resolve(outDir);
  const filename = path.resolve(root, routeToExportRelativePath(route, basePath));
  const relative = path.relative(root, filename);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`Resolved route escapes export directory: ${route}`);
  }
  return filename;
}

async function listFiles(root: string): Promise<string[]> {
  const files: string[] = [];

  async function visit(directory: string): Promise<void> {
    let entries;
    try {
      entries = await readdir(directory, { withFileTypes: true });
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") return;
      throw error;
    }

    for (const entry of entries) {
      const absolute = path.join(directory, entry.name);
      if (entry.isDirectory()) await visit(absolute);
      else if (entry.isFile()) files.push(absolute);
    }
  }

  await visit(root);
  return files;
}

function localizedUrl(siteUrl: string, locale: Locale, suffix: string): string {
  return new URL(`/${locale}${suffix}`, siteUrl).toString();
}

export function createProductionExportContract(): ExportContract {
  const projectSlugs = getAllProjectSlugs();
  const demoSlugs = getAllDemoSlugs();
  const localizedRoutes: LocalizedRouteExpectation[] = [];
  const projectDetailRoutes: string[] = [];
  const demoDetailRoutes: DemoRouteExpectation[] = [];
  const pageSuffixes = ["/", "/about/", "/projects/", "/demos/", "/resume/"];

  for (const locale of SUPPORTED_LOCALES) {
    const suffixes = [
      ...pageSuffixes,
      ...projectSlugs.map((slug) => `/projects/${slug}/`),
      ...demoSlugs.map((slug) => `/demos/${slug}/`),
    ];

    for (const suffix of suffixes) {
      const route = `/${locale}${suffix}`;
      localizedRoutes.push({
        route,
        locale,
        canonical: localizedUrl(SITE_URL, locale, suffix),
        alternates: {
          ko: localizedUrl(SITE_URL, "ko", suffix),
          en: localizedUrl(SITE_URL, "en", suffix),
          zh: localizedUrl(SITE_URL, "zh", suffix),
          "x-default": localizedUrl(SITE_URL, "ko", suffix),
        },
      });
    }

    projectDetailRoutes.push(...projectSlugs.map((slug) => `/${locale}/projects/${slug}/`));
    for (const slug of demoSlugs) {
      const demo = getDemoBySlug(slug);
      if (!demo) throw new Error(`Missing Demo data for ${slug}`);
      demoDetailRoutes.push({
        route: `/${locale}/demos/${slug}/`,
        slug,
        galleryMode: getGalleryMode(demo.gallery),
        galleryItemCount: demo.gallery.length,
        videoMode: demo.video.videoId ? "play" : "none",
        videoId: demo.video.videoId,
      });
    }
  }

  const legacySuffixes = [
    "/about/",
    "/projects/",
    ...projectSlugs.map((slug) => `/projects/${slug}/`),
    "/resume/",
  ];

  return {
    siteUrl: SITE_URL,
    basePath: "",
    localizedRoutes,
    legacyRoutes: legacySuffixes.map((suffix) => ({
      route: suffix,
      canonical: localizedUrl(SITE_URL, "ko", suffix),
      fallbackHrefs: SUPPORTED_LOCALES.map((locale) => `/${locale}${suffix}`),
    })),
    rootRedirect: {
      route: "/",
      fallbackHrefs: SUPPORTED_LOCALES.map((locale) => `/${locale}/`),
    },
    projectDetailRoutes,
    demoDetailRoutes,
    require404: true,
    expectedHtmlFileCount: 108,
    enforceExactHtmlInventory: true,
    expectedLocalizedRouteCount: 87,
    expectedProjectDetailCount: 45,
    expectedDemoDetailCount: 24,
    expectedGalleryCounts: { static: 3, slider: 9, none: 12 },
    expectedVideoCounts: { play: 21 },
    forbiddenHtmlPatterns: [
      {
        label: "CINEV GitHub URL",
        pattern:
          /(?:^|\\|[\s"'=>(:\[{},])(?:(?:https?:)?\/\/)?(?:www\.)?github\.com\/cinev(?:[/?#:]|$)/gim,
      },
      {
        label: "Cinamon domain URL",
        pattern:
          /(?:^|\\|[\s"'=>(:\[{},])(?:(?:https?:)?\/\/)?(?:[a-z0-9-]+\.)*cinamon\.io(?:[/?#:]|$)/gim,
      },
    ],
    sourceEvidenceBasenames: [
      "image_board.jpg",
      "video_board.jpg",
      "reverse_storyboard_product.png",
      "voice_adaptor_product_2.png",
      "vocie_adaptor_product.png",
      "prompt_enhancer_product.png",
      "n8n_workflow.png",
      "n8n_slack_webhook.png",
    ],
    forbiddenImagePrefixesByRoute: [
      {
        routes: SUPPORTED_LOCALES.map((locale) => `/${locale}/`),
        prefixes: ["/assets/images/projects/"],
        scope: {
          attribute: "data-home-section",
          value: "featured",
          endValue: "spotlight",
        },
      },
      {
        routes: SUPPORTED_LOCALES.map((locale) => `/${locale}/projects/`),
        prefixes: ["/assets/images/projects/"],
      },
      {
        routes: SUPPORTED_LOCALES.map((locale) => `/${locale}/about/`),
        prefixes: ["/assets/images/about/"],
      },
    ],
  };
}

function sameStringSet(actual: string[], expected: string[]): boolean {
  return (
    actual.length === expected.length &&
    [...actual].sort().every((value, index) => value === [...expected].sort()[index])
  );
}

function normalizedRobots(value: string): string {
  return value.toLowerCase().split(",").map((token) => token.trim()).filter(Boolean).sort().join(",");
}

export function isSourceEvidenceBasename(basename: string): boolean {
  return /(?:^|[-_.])(?:raw|original|source|screenshot|screen[-_]?shot)(?=[-_.]|$)/i.test(
    basename,
  );
}

function normalizeEscapedUrlText(html: string): string {
  return html.replace(/\\\//g, "/");
}

export async function verifyExport(
  outDir: string,
  optionalContract?: ExportContract,
): Promise<ExportVerificationResult> {
  const contract = optionalContract ?? createProductionExportContract();
  const root = path.resolve(outDir);
  const errors: string[] = [];
  const files = await listFiles(root);
  const fileSet = new Set(files);
  const htmlFiles = files.filter((filename) => filename.toLowerCase().endsWith(".html"));
  const htmlByFile = new Map<string, string>();
  let internalLinks = 0;
  const galleryModes = { none: 0, static: 0, slider: 0 };
  const videoStates = { play: 0 };

  if (contract.expectedHtmlFileCount !== undefined) {
    const optional404Index = path.join(root, "404", "index.html");
    const optional404IsAbsent = !fileSet.has(optional404Index);
    const acceptedWithoutOptional404 =
      optional404IsAbsent && htmlFiles.length === contract.expectedHtmlFileCount - 1;
    if (htmlFiles.length !== contract.expectedHtmlFileCount && !acceptedWithoutOptional404) {
      errors.push(
        `Expected ${contract.expectedHtmlFileCount} physical HTML files (${contract.expectedHtmlFileCount - 1} without optional 404/index.html), found ${htmlFiles.length}`,
      );
    }
  }
  if (contract.enforceExactHtmlInventory) {
    const allowedHtmlFiles = new Set([
      ...contract.localizedRoutes.map(({ route }) =>
        routeFilePath(root, route, contract.basePath),
      ),
      ...contract.legacyRoutes.map(({ route }) =>
        routeFilePath(root, route, contract.basePath),
      ),
      routeFilePath(root, contract.rootRedirect.route, contract.basePath),
      ...(contract.require404
        ? [path.join(root, "404.html"), path.join(root, "404", "index.html")]
        : []),
    ]);
    for (const filename of htmlFiles) {
      if (!allowedHtmlFiles.has(filename)) {
        errors.push(`Unexpected HTML export: ${path.relative(root, filename)}`);
      }
    }
  }
  if (
    contract.expectedLocalizedRouteCount !== undefined &&
    contract.localizedRoutes.length !== contract.expectedLocalizedRouteCount
  ) {
    errors.push(
      `Expected ${contract.expectedLocalizedRouteCount} localized route expectations, found ${contract.localizedRoutes.length}`,
    );
  }
  if (
    contract.expectedProjectDetailCount !== undefined &&
    contract.projectDetailRoutes.length !== contract.expectedProjectDetailCount
  ) {
    errors.push(
      `Expected ${contract.expectedProjectDetailCount} project detail routes, found ${contract.projectDetailRoutes.length}`,
    );
  }
  if (
    contract.expectedDemoDetailCount !== undefined &&
    contract.demoDetailRoutes.length !== contract.expectedDemoDetailCount
  ) {
    errors.push(
      `Expected ${contract.expectedDemoDetailCount} Demo detail routes, found ${contract.demoDetailRoutes.length}`,
    );
  }

  async function readExpectedRoute(route: string): Promise<string | null> {
    let filename: string;
    try {
      filename = routeFilePath(root, route, contract.basePath);
    } catch (error) {
      errors.push(`${route}: ${(error as Error).message}`);
      return null;
    }
    try {
      const cached = htmlByFile.get(filename);
      if (cached !== undefined) return cached;
      const html = await readFile(filename, "utf8");
      htmlByFile.set(filename, html);
      return html;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") {
        errors.push(`${route}: missing export target ${path.relative(root, filename)}`);
        return null;
      }
      throw error;
    }
  }

  for (const expectation of contract.localizedRoutes) {
    const html = await readExpectedRoute(expectation.route);
    if (html === null) continue;
    const signals = extractDocumentSignals(html);

    const presentationRules = contract.forbiddenImagePrefixesByRoute?.filter(
      ({ routes }) => routes.includes(expectation.route),
    ) ?? [];
    for (const rule of presentationRules) {
      let ruleTags = signals.tags;
      const scope = rule.scope;
      if (scope) {
        const scopeStart = signals.tags.find(
          ({ attributes }) =>
            attributes[scope.attribute] === scope.value,
        );
        const scopeEnd = scopeStart && scope.endValue
          ? signals.tags.find(
              ({ start, attributes }) =>
                start > scopeStart.start &&
                attributes[scope.attribute] === scope.endValue,
            )
          : undefined;
        if (!scopeStart || (scope.endValue && !scopeEnd)) {
          errors.push(
            `${expectation.route}: missing presentation scope ${scope.attribute}=${scope.value}${scope.endValue ? `..${scope.endValue}` : ""}`,
          );
          continue;
        }
        ruleTags = signals.tags.filter(
          ({ start }) =>
            start >= scopeStart.start && (!scopeEnd || start < scopeEnd.start),
        );
      }

      const forbiddenImages = ruleTags.filter(
        ({ name, attributes }) =>
          name === "img" &&
          rule.prefixes.some((prefix) =>
            (attributes.src ?? "").startsWith(prefix),
          ),
      );
      for (const image of forbiddenImages) {
        errors.push(
          `${expectation.route}: forbidden image request ${image.attributes.src}`,
        );
      }
    }

    if (signals.lang !== expectation.locale) {
      errors.push(`${expectation.route}: expected html lang=${expectation.locale}, found ${signals.lang ?? "missing"}`);
    }
    if (
      signals.canonicalHrefs.length !== 1 ||
      signals.canonical !== expectation.canonical
    ) {
      errors.push(
        `${expectation.route}: expected one canonical ${expectation.canonical}, found ${signals.canonicalHrefs.join(", ") || "missing"}`,
      );
    }

    const expectedLanguages = Object.keys(expectation.alternates).sort();
    const actualLanguages = Object.keys(signals.alternateHrefs).sort();
    const unexpectedLanguages = actualLanguages.filter(
      (language) => !expectedLanguages.includes(language),
    );
    if (unexpectedLanguages.length > 0) {
      errors.push(
        `${expectation.route}: found unexpected alternate languages ${unexpectedLanguages.join(", ")}`,
      );
    }
    for (const [language, expectedHref] of Object.entries(expectation.alternates)) {
      const hrefs = signals.alternateHrefs[language] ?? [];
      if (hrefs.length !== 1 || hrefs[0] !== expectedHref) {
        errors.push(
          `${expectation.route}: expected one ${language} alternate ${expectedHref}, found ${hrefs.join(", ") || "missing"}`,
        );
      }
    }
  }

  for (const expectation of contract.legacyRoutes) {
    const html = await readExpectedRoute(expectation.route);
    if (html === null) continue;
    const signals = extractDocumentSignals(html);
    const robots = signals.robots.map(normalizedRobots);

    if (robots.length !== 1 || robots[0] !== "follow,noindex") {
      errors.push(
        `${expectation.route}: legacy document must have exactly one robots meta normalized to noindex,follow`,
      );
    }
    if (signals.canonicalHrefs.length !== 1 || signals.canonical !== expectation.canonical) {
      errors.push(`${expectation.route}: legacy canonical must be ${expectation.canonical}`);
    }
    if (!sameStringSet(signals.anchorHrefs, expectation.fallbackHrefs)) {
      errors.push(
        `${expectation.route}: legacy fallback anchors must be exactly ${expectation.fallbackHrefs.join(", ")}`,
      );
    }
  }

  const rootHtml = await readExpectedRoute(contract.rootRedirect.route);
  if (rootHtml !== null) {
    const rootAnchors = extractDocumentSignals(rootHtml).anchorHrefs;
    if (!sameStringSet(rootAnchors, contract.rootRedirect.fallbackHrefs)) {
      errors.push(
        `${contract.rootRedirect.route}: root fallback anchors must be exactly ${contract.rootRedirect.fallbackHrefs.join(", ")}`,
      );
    }
  }

  for (const route of contract.projectDetailRoutes) await readExpectedRoute(route);

  for (const expectation of contract.demoDetailRoutes) {
    const html = await readExpectedRoute(expectation.route);
    if (html === null) continue;
    const signals = extractDocumentSignals(html);
    if (signals.iframes.length !== 0) {
      errors.push(`${expectation.route}: Demo detail must not contain an initial iframe`);
    }

    const galleryTags = signals.tags.filter(
      ({ attributes }) => attributes["data-demo-gallery-mode"] !== undefined,
    );
    const pageGalleryControls = signals.tags.filter(
      ({ attributes }) => attributes["data-demo-gallery-control"] !== undefined,
    );
    const actualGalleryMode = galleryTags[0]?.attributes["data-demo-gallery-mode"];
    if (expectation.galleryMode === "none") {
      galleryModes.none += 1;
      if (galleryTags.length !== 0) {
        errors.push(`${expectation.route}: expected no gallery, found ${actualGalleryMode}`);
      }
      if (pageGalleryControls.length !== 0) {
        errors.push(`${expectation.route}: gallery-free page must not contain gallery controls`);
      }
    } else {
      galleryModes[expectation.galleryMode] += 1;
      if (galleryTags.length !== 1 || actualGalleryMode !== expectation.galleryMode) {
        errors.push(
          `${expectation.route}: expected one ${expectation.galleryMode} gallery, found ${actualGalleryMode ?? "none"}`,
        );
      } else {
        const start = galleryTags[0].start;
        const nextBlock = signals.tags.find(
          (tag) => tag.start > start && tag.attributes["data-demo-block"] === "how-it-works",
        );
        const scopedTags = signals.tags.filter(
          (tag) => tag.start >= start && (!nextBlock || tag.start < nextBlock.start),
        );
        const buttons = scopedTags.filter(({ name }) => name === "button");
        const images = scopedTags.filter(({ name }) => name === "img");
        const liveCounters = scopedTags.filter(
          ({ attributes }) => attributes["aria-live"] === "polite",
        );
        const controls = scopedTags.filter(
          ({ attributes }) => attributes["data-demo-gallery-control"] !== undefined,
        );
        const controlsFor = (role: string) =>
          controls.filter(
            ({ attributes }) => attributes["data-demo-gallery-control"] === role,
          );
        const previousControls = controlsFor("previous");
        const nextControls = controlsFor("next");
        const counterControls = controlsFor("counter");
        const thumbnailControls = controlsFor("thumbnail");
        const unknownControls = controls.filter(
          ({ attributes }) =>
            !["previous", "next", "counter", "thumbnail"].includes(
              attributes["data-demo-gallery-control"],
            ),
        );
        const currentThumbnails = thumbnailControls.filter(
          ({ attributes }) => attributes["aria-current"] === "true",
        );
        const embeddedMedia = scopedTags.filter(
          ({ name, attributes }) =>
            name === "iframe" || attributes["data-demo-video-state"] !== undefined,
        );

        if (embeddedMedia.length !== 0) {
          errors.push(`${expectation.route}: gallery must not contain video or iframe markup`);
        }
        if (expectation.galleryMode === "static") {
          if (
            controls.length !== 0 ||
            buttons.length !== 0 ||
            liveCounters.length !== 0 ||
            images.length !== expectation.galleryItemCount
          ) {
            errors.push(
              `${expectation.route}: static gallery must have one image and zero gallery controls`,
            );
          }
        } else {
          const semanticControlsValid =
            controls.length === expectation.galleryItemCount + 3 &&
            unknownControls.length === 0 &&
            previousControls.length === 1 &&
            previousControls[0].name === "button" &&
            nextControls.length === 1 &&
            nextControls[0].name === "button" &&
            counterControls.length === 1 &&
            (counterControls[0].name === "span" ||
              counterControls[0].attributes.role === "status") &&
            counterControls[0].attributes["aria-live"] === "polite" &&
            thumbnailControls.length === expectation.galleryItemCount &&
            thumbnailControls.every(({ name }) => name === "button") &&
            currentThumbnails.length === 1;
          const structuralCountsValid =
            buttons.length === expectation.galleryItemCount + 2 &&
            images.length === expectation.galleryItemCount + 1 &&
            liveCounters.length === 1;

          if (!semanticControlsValid || !structuralCountsValid) {
            errors.push(
              `${expectation.route}: slider gallery controls must include one semantic previous button, next button, polite live counter, ${expectation.galleryItemCount} thumbnail buttons, and one current thumbnail`,
            );
          }
        }
      }
    }

    const videoTags = signals.tags.filter(
      ({ attributes }) => attributes["data-demo-video-state"] !== undefined,
    );
    const youtubeThumbnails = signals.tags.filter(({ name, attributes }) => {
      if (name !== "img" || !attributes.src) return false;
      try {
        return new URL(attributes.src, contract.siteUrl).hostname === "i.ytimg.com";
      } catch {
        return false;
      }
    });
    const actualVideoStates = videoTags.map(
      ({ attributes }) => attributes["data-demo-video-state"],
    );
    if (expectation.videoMode === "none") {
      if (videoTags.length !== 0) {
        errors.push(`${expectation.route}: expected no video surface`);
      }
    } else {
      videoStates[expectation.videoMode] += 1;
      if (videoTags.length !== 1 || actualVideoStates[0] !== expectation.videoMode) {
        errors.push(
          `${expectation.route}: expected video state ${expectation.videoMode}, found ${actualVideoStates.join(", ") || "none"}`,
        );
      }
    }

    if (expectation.videoMode === "play") {
      const expectedThumbnail = expectation.videoId
        ? `https://i.ytimg.com/vi/${expectation.videoId}/maxresdefault.jpg`
        : null;
      const thumbnail = youtubeThumbnails[0];
      const thumbnailIsValid =
        expectedThumbnail !== null &&
        youtubeThumbnails.length === 1 &&
        thumbnail.attributes.src === expectedThumbnail &&
        thumbnail.attributes.loading === "lazy" &&
        thumbnail.attributes.referrerpolicy === "no-referrer" &&
        thumbnail.attributes.alt === "";

      if (!thumbnailIsValid) {
        errors.push(
          `${expectation.route}: playable Demo must expose exactly one decorative lazy no-referrer YouTube thumbnail at ${expectedThumbnail ?? "its canonical video ID"}`,
        );
      }
    } else if (youtubeThumbnails.length !== 0) {
      errors.push(`${expectation.route}: ${expectation.videoMode} Demo must not request a YouTube thumbnail`);
    }

    if (expectation.slug === "script-to-bgm") {
      if (actualGalleryMode !== "slider" || videoTags.length !== 0) {
        errors.push(`${expectation.route}: script-to-bgm must have only its image slider`);
      }
    }
  }

  if (contract.expectedGalleryCounts) {
    for (const mode of ["none", "static", "slider"] as const) {
      if (galleryModes[mode] !== contract.expectedGalleryCounts[mode]) {
        errors.push(
          `Expected ${contract.expectedGalleryCounts[mode]} ${mode} Demo galleries, found ${galleryModes[mode]}`,
        );
      }
    }
  }
  if (contract.expectedVideoCounts) {
    for (const state of ["play"] as const) {
      if (videoStates[state] !== contract.expectedVideoCounts[state]) {
        errors.push(
          `Expected ${contract.expectedVideoCounts[state]} Demo video state=${state} pages, found ${videoStates[state]}`,
        );
      }
    }
  }

  if (contract.require404) {
    const notFound = path.join(root, "404.html");
    let notFoundBytes: Buffer | null = null;
    try {
      notFoundBytes = await readFile(notFound);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") errors.push("Missing 404.html");
      else throw error;
    }
    const directoryNotFound = path.join(root, "404", "index.html");
    try {
      const directoryBytes = await readFile(directoryNotFound);
      if (notFoundBytes && !directoryBytes.equals(notFoundBytes)) {
        errors.push("404/index.html must match 404.html byte-for-byte");
      }
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    }
  }

  const evidenceNames = new Set(contract.sourceEvidenceBasenames.map((name) => name.toLowerCase()));
  for (const filename of files) {
    const basename = path.basename(filename);
    if (basename === ".DS_Store") {
      errors.push(`Forbidden metadata file: ${path.relative(root, filename)}`);
    }
    if (
      evidenceNames.has(basename.toLowerCase()) ||
      isSourceEvidenceBasename(basename)
    ) {
      errors.push(`Forbidden source evidence file: ${path.relative(root, filename)}`);
    }
  }

  for (const filename of htmlFiles) {
    const html = htmlByFile.get(filename) ?? (await readFile(filename, "utf8"));
    htmlByFile.set(filename, html);
    const route = `/${path.relative(root, filename).split(path.sep).join("/")}`
      .replace(/\/index\.html$/, "/")
      .replace(/^\/index\.html$/, "/");
    const signals = extractDocumentSignals(html);

    const normalizedUrlHtml = normalizeEscapedUrlText(html);
    for (const { label, pattern } of contract.forbiddenHtmlPatterns) {
      pattern.lastIndex = 0;
      if (pattern.test(normalizedUrlHtml)) {
        errors.push(`${route}: contains forbidden ${label}`);
      }
    }

    for (const href of signals.anchorHrefs) {
      let targetRoute: string | null;
      try {
        targetRoute = resolveInternalHref(href, route, {
          siteUrl: contract.siteUrl,
          basePath: contract.basePath,
        });
      } catch (error) {
        errors.push(`${route}: ${(error as Error).message}`);
        continue;
      }
      if (!targetRoute) continue;
      internalLinks += 1;
      let targetFile: string;
      try {
        targetFile = routeFilePath(root, targetRoute, contract.basePath);
      } catch (error) {
        errors.push(`${route}: ${(error as Error).message}`);
        continue;
      }
      if (!fileSet.has(targetFile)) {
        errors.push(`${route}: internal link ${href} resolves to missing target ${targetRoute}`);
      }
    }

    for (const image of signals.tags.filter(({ name }) => name === "img")) {
      const src = image.attributes.src;
      if (!src) {
        errors.push(`${route}: image is missing src`);
        continue;
      }
      let assetHref: string | null;
      try {
        assetHref = resolveLocalAssetHref(src, route, {
          siteUrl: contract.siteUrl,
          basePath: contract.basePath,
        });
      } catch (error) {
        errors.push(`${route}: ${(error as Error).message}`);
        continue;
      }
      if (!assetHref) continue;
      const assetFile = path.resolve(root, assetHref.replace(/^\/+/, ""));
      const relative = path.relative(root, assetFile);
      if (relative.startsWith("..") || path.isAbsolute(relative)) {
        errors.push(`${route}: local image escapes export directory: ${src}`);
      } else if (!fileSet.has(assetFile)) {
        errors.push(`${route}: missing local image ${assetHref}`);
      }
    }
  }

  if (errors.length > 0) {
    throw new Error(
      `${errors.length} export verification ${errors.length === 1 ? "error" : "errors"}:\n${errors
        .map((error) => `- ${error}`)
        .join("\n")}`,
    );
  }

  return {
    htmlFiles: htmlFiles.length,
    localizedRoutes: contract.localizedRoutes.length,
    legacyRoutes: contract.legacyRoutes.length,
    projectDetails: contract.projectDetailRoutes.length,
    demoDetails: contract.demoDetailRoutes.length,
    internalLinks,
    galleryModes,
    videoStates,
    errors: 0,
  };
}
