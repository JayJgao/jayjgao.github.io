import fs from "node:fs/promises";
import path from "node:path";

export async function readProjectMdx(locale: string, slug: string) {
  const filePath = path.join(
    process.cwd(),
    "src",
    "content",
    "projects",
    locale,
    `${slug}.mdx`,
  );
  return fs.readFile(filePath, "utf8");
}
