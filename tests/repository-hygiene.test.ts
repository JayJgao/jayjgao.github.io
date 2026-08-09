import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFile } from "node:fs/promises";
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
