import path from "node:path";

import { verifyExport } from "./lib/export-verifier";

async function main(): Promise<void> {
  try {
    const result = await verifyExport(path.resolve("out"));
    console.log(
      [
        "Export verification passed:",
        `${result.htmlFiles} HTML files,`,
        `${result.localizedRoutes} localized routes,`,
        `${result.projectDetails} project details,`,
        `${result.demoDetails} Demo details,`,
        `${result.legacyRoutes} legacy routes,`,
        `${result.internalLinks} internal links.`,
      ].join(" "),
    );
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}

void main();
