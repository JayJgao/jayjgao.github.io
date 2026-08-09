export const SUPPORTED_LOCALES = ["ko", "en", "zh"] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "ko";
export const LOCALE_STORAGE_KEY = "portfolio-locale";

export function isLocale(value: unknown): value is Locale {
  return (
    typeof value === "string" &&
    SUPPORTED_LOCALES.includes(value as Locale)
  );
}

export function normalizeLocale(value: string | null | undefined): Locale {
  return isLocale(value) ? value : DEFAULT_LOCALE;
}

export function localeFromLanguageTag(
  languageTag: string | null | undefined,
): Locale | null {
  if (!languageTag) return null;

  const primaryLanguage = languageTag.trim().split(/[-_]/, 1)[0]?.toLowerCase();
  return isLocale(primaryLanguage) ? primaryLanguage : null;
}

export function selectPreferredLocale(
  storedLocale: string | null | undefined,
  browserLanguages: readonly string[] = [],
): Locale {
  if (isLocale(storedLocale)) return storedLocale;

  for (const languageTag of browserLanguages) {
    const locale = localeFromLanguageTag(languageTag);
    if (locale) return locale;
  }

  return DEFAULT_LOCALE;
}
