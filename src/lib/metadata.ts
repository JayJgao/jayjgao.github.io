import type { Metadata } from "next";
import type { Locale } from "@/lib/locale";
import { getLocalizedPath } from "@/lib/routes";

export const SITE_URL = "https://jayjgao.github.io";
export const LEGACY_REDIRECT_TITLE = "Jay Ko Portfolio | Language Selection";
export const GLOBAL_NOT_FOUND_TITLE = "페이지를 찾을 수 없습니다 | Jay Ko";

type LocalizedMetadataOptions = {
  locale: Locale;
  path: string;
  title: string;
  description: string;
};

function absoluteLocalizedUrl(locale: Locale, path: string): string {
  return new URL(getLocalizedPath(locale, path), SITE_URL).toString();
}

export function createLegacyMetadata(path: string): Metadata {
  return {
    title: LEGACY_REDIRECT_TITLE,
    alternates: {
      canonical: absoluteLocalizedUrl("ko", path),
    },
    robots: {
      index: false,
      follow: true,
    },
  };
}

export function createLocalizedMetadata({
  locale,
  path,
  title,
  description,
}: LocalizedMetadataOptions): Metadata {
  const canonical = absoluteLocalizedUrl(locale, path);

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        ko: absoluteLocalizedUrl("ko", path),
        en: absoluteLocalizedUrl("en", path),
        zh: absoluteLocalizedUrl("zh", path),
        "x-default": absoluteLocalizedUrl("ko", path),
      },
    },
    openGraph: {
      type: "website",
      title,
      description,
      url: canonical,
    },
  };
}
