import { isLocale, type Locale } from "@/lib/locale";

export function normalizeSitePath(pathname: string | null | undefined): string {
  const pathOnly = (pathname ?? "").split(/[?#]/, 1)[0] ?? "";
  const segments = pathOnly.split("/").filter(Boolean);

  return segments.length === 0 ? "/" : `/${segments.join("/")}/`;
}

export function getPathWithoutLocale(
  pathname: string | null | undefined,
): string {
  const normalized = normalizeSitePath(pathname);
  const segments = normalized.split("/").filter(Boolean);

  if (isLocale(segments[0])) segments.shift();

  return segments.length === 0 ? "/" : `/${segments.join("/")}/`;
}

export function getLocalizedPath(locale: Locale, pathname: string): string {
  const suffix = getPathWithoutLocale(pathname);

  return normalizeSitePath(`/${locale}/${suffix}`);
}
