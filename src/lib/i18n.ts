import aboutEn from "@/data/about.en.json";
import aboutKo from "@/data/about.ko.json";
import aboutZh from "@/data/about.zh.json";
import enMessages from "@/i18n/en.json";
import koMessages from "@/i18n/ko.json";
import zhMessages from "@/i18n/zh.json";
import { normalizeLocale, type Locale } from "@/lib/locale";
import type { AboutNarrative } from "@/types/about";
import type { AppMessages } from "@/types/i18n";

const messagesByLocale: Record<Locale, AppMessages> = {
  ko: koMessages as AppMessages,
  en: enMessages as AppMessages,
  zh: zhMessages as AppMessages,
};

const aboutByLocale: Record<Locale, AboutNarrative> = {
  ko: aboutKo as AboutNarrative,
  en: aboutEn as AboutNarrative,
  zh: aboutZh as AboutNarrative,
};

export function getMessages(locale: Locale | string | null | undefined): AppMessages {
  const normalized = normalizeLocale(typeof locale === "string" ? locale : null);
  return messagesByLocale[normalized] ?? messagesByLocale.ko;
}

export function getAboutNarrative(
  locale: Locale | string | null | undefined,
): AboutNarrative {
  const normalized = normalizeLocale(typeof locale === "string" ? locale : null);
  return aboutByLocale[normalized] ?? aboutByLocale.ko;
}
