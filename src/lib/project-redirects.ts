export const LEGACY_PROJECT_REDIRECTS = {
  "cinev-a2p": "cinev-ai-po-leadership",
} as const;

export function getLegacyProjectTarget(slug: string): string | undefined {
  return LEGACY_PROJECT_REDIRECTS[slug as keyof typeof LEGACY_PROJECT_REDIRECTS];
}

export function getLegacyProjectSlugs(): string[] {
  return Object.keys(LEGACY_PROJECT_REDIRECTS);
}

export function getCanonicalProjectPath(slug: string): string {
  return `/projects/${getLegacyProjectTarget(slug) ?? slug}/`;
}
