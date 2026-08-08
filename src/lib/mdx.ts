import fs from "node:fs/promises";
import path from "node:path";
import type { Locale } from "@/lib/locale";

function isMissingFileError(error: unknown): error is NodeJS.ErrnoException {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "ENOENT"
  );
}

export async function readProjectMdx(
  locale: Locale,
  slug: string,
): Promise<{ source: string; contentLocale: Locale }> {
  const readLocaleFile = (targetLocale: string) =>
    fs.readFile(
      path.join(
        process.cwd(),
        "src",
        "content",
        "projects",
        targetLocale,
        `${slug}.mdx`,
      ),
      "utf8",
    );

  try {
    const source = await readLocaleFile(locale);
    return { source, contentLocale: locale };
  } catch (error) {
    if (locale === "ko" || !isMissingFileError(error)) throw error;

    const source = await readLocaleFile("ko");
    return { source, contentLocale: "ko" };
  }
}
