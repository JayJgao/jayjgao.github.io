import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

const trackedFiles = (): string[] =>
  execFileSync("git", ["ls-files"], { encoding: "utf8" }).trim().split("\n");

test("private references and stale planning files are not tracked", async () => {
  const tracked = trackedFiles();
  assert.equal(tracked.some((file) => file.startsWith(".reference/")), false);
  assert.equal(tracked.includes("Planning.md"), false);
  assert.equal(tracked.includes("Agent.md"), false);
  assert.equal(tracked.includes("AGENTS.md"), true);

  const gitignore = await readFile(".gitignore", "utf8");
  assert.match(gitignore, /^\.reference\/$/m);
});

test("repository metadata is current and proprietary", async () => {
  const readme = await readFile("README.md", "utf8");
  const license = await readFile("LICENSE.md", "utf8");
  assert.doesNotMatch(readme, /WIP/i);
  assert.match(readme, /2026년 8월 10일/);
  assert.match(license, /All rights reserved/i);
  assert.match(license, /No license/i);
});

async function readSourceCorpus(directory: string): Promise<string> {
  const chunks: string[] = [];

  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const filename = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      chunks.push(await readSourceCorpus(filename));
    } else if (
      entry.name !== "asset-manifest.json" &&
      /\.(?:css|json|mdx|ts|tsx)$/.test(entry.name)
    ) {
      chunks.push(await readFile(filename, "utf8"));
    }
  }

  return chunks.join("\n");
}

function collectAssetPaths(value: unknown): string[] {
  if (typeof value === "string") return value.startsWith("/assets/") ? [value] : [];
  if (Array.isArray(value)) return value.flatMap(collectAssetPaths);
  if (typeof value === "object" && value !== null) {
    return Object.values(value).flatMap(collectAssetPaths);
  }
  return [];
}

test("every asset-manifest path is referenced by production source", async () => {
  const manifest = JSON.parse(await readFile("src/data/asset-manifest.json", "utf8")) as unknown;
  const corpus = await readSourceCorpus("src");

  for (const assetPath of collectAssetPaths(manifest)) {
    assert.ok(corpus.includes(assetPath), `unused manifest asset: ${assetPath}`);
  }
});

test("removed frontend packages are not direct dependencies", async () => {
  const packageJson = JSON.parse(await readFile("package.json", "utf8")) as {
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
  };

  for (const packageName of [
    "@react-three/drei",
    "@react-three/fiber",
    "@swc/helpers",
    "next-intl",
    "three",
    "@types/three",
  ]) {
    assert.equal(
      packageJson.dependencies?.[packageName] ?? packageJson.devDependencies?.[packageName],
      undefined,
      `${packageName} should not remain a direct dependency`,
    );
  }
});
