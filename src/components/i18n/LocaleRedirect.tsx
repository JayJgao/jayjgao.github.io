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
    <main id="main-content" className="redirect-page">
      <p className="section-kicker">Jay Ko Portfolio</p>
      <h1 className="page-display">Choose a language</h1>
      <p className="redirect-page__copy">
        언어 설정으로 이동하고 있습니다. 자동 이동이 되지 않으면 아래 링크를 선택해 주세요.
      </p>
      <nav aria-label="Language fallbacks" className="redirect-page__links">
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
