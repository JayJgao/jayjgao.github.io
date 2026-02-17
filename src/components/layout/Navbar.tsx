"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import en from "@/i18n/en.json";
import ko from "@/i18n/ko.json";
import zh from "@/i18n/zh.json";
import type { Locale } from "@/lib/locale";

const labels = {
  ko: ko.nav,
  en: en.nav,
  zh: zh.nav,
} as const;

const localeText: Record<Locale, string> = {
  ko: "한국어",
  en: "English",
  zh: "中文",
};

export function Navbar() {
  const pathname = usePathname();
  const { locale, setLocale } = useLocale();

  const navItems = useMemo(
    () => [
      { href: "/", label: labels[locale].home },
      { href: "/about", label: labels[locale].about },
      { href: "/projects", label: "Portfolio" },
      { href: "/resume", label: labels[locale].resume },
    ],
    [locale],
  );

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-background/70 backdrop-blur-xl">
      <div className="page-container flex h-16 items-center gap-2">
        <Link href="/" className="shrink-0">
          <span className="font-mono text-sm tracking-[0.18em] text-accent uppercase">
            Jay Ko
          </span>
        </Link>

        <div className="ml-auto flex min-w-0 items-center gap-1.5">
          <nav
            aria-label="Main navigation"
            className="flex min-w-0 items-center gap-1 overflow-x-auto whitespace-nowrap [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {navItems.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`shrink-0 rounded-full px-2.5 py-1.5 text-xs transition sm:px-3 sm:text-sm ${
                    active
                      ? "bg-white/12 text-white"
                      : "text-muted hover:bg-white/6 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <label className="sr-only" htmlFor="locale-select">
            Language
          </label>
          <select
            id="locale-select"
            value={locale}
            onChange={(event) => {
              setLocale(event.target.value as Locale);
            }}
            className="shrink-0 rounded-full border border-white/15 bg-surface/90 px-2.5 py-1.5 text-[11px] text-white sm:px-3 sm:text-xs"
            aria-label="Language selector"
          >
            <option value="ko">{localeText.ko}</option>
            <option value="en">{localeText.en}</option>
            <option value="zh">{localeText.zh}</option>
          </select>
        </div>
      </div>
    </header>
  );
}
