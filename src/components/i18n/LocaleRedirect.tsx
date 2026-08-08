"use client";

import Link from "next/link";
import { useEffect } from "react";
import {
  LOCALE_STORAGE_KEY,
  SUPPORTED_LOCALES,
  selectPreferredLocale,
  type Locale,
} from "@/lib/locale";
import { getLocalizedPath } from "@/lib/routes";

const localeLabels: Record<Locale, string> = {
  ko: "한국어",
  en: "English",
  zh: "中文",
};

export function LocaleRedirect({ path }: { path: string }) {
  useEffect(() => {
    let storedLocale: string | null = null;
    try {
      storedLocale = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    } catch {
      // A blocked localStorage must not prevent language negotiation.
    }

    const browserLanguages =
      navigator.languages?.length > 0
        ? navigator.languages
        : navigator.language
          ? [navigator.language]
          : [];
    const locale = selectPreferredLocale(storedLocale, browserLanguages);

    window.location.replace(getLocalizedPath(locale, path));
  }, [path]);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col items-start justify-center gap-5 px-6 md:px-12">
      <p className="section-kicker">Jay Ko Portfolio</p>
      <h1 className="editorial-title text-4xl md:text-5xl">Choose a language</h1>
      <p className="text-white/70">
        언어 설정으로 이동하고 있습니다. 자동 이동이 되지 않으면 아래 링크를 선택해 주세요.
      </p>
      <nav aria-label="Language fallbacks" className="flex flex-wrap gap-3">
        {SUPPORTED_LOCALES.map((locale) => (
          <Link
            key={locale}
            href={getLocalizedPath(locale, path)}
            className="btn-secondary"
          >
            {localeLabels[locale]}
          </Link>
        ))}
      </nav>
    </main>
  );
}
