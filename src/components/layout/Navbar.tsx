"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
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

const localeOptions: Array<{ value: Locale; label: string }> = [
  { value: "ko", label: "한국어" },
  { value: "en", label: "English" },
  { value: "zh", label: "中文" },
];

export function Navbar() {
  const pathname = usePathname();
  const { locale, setLocale } = useLocale();
  const [localeOpen, setLocaleOpen] = useState(false);
  const localeMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (!localeMenuRef.current?.contains(event.target as Node)) {
        setLocaleOpen(false);
      }
    };

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setLocaleOpen(false);
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onEscape);
    };
  }, []);

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
    <header className="sticky top-0 z-50 border-b border-white/10 bg-background/78 backdrop-blur-2xl">
      <div className="page-container flex h-[4.4rem] items-center gap-2 md:h-[4.6rem]">
        <Link href="/" className="shrink-0">
          <span className="font-mono text-[0.78rem] tracking-[0.22em] text-accent uppercase sm:text-sm">
            Jay Ko
          </span>
        </Link>

        <div className="ml-auto flex min-w-0 items-center gap-1.5 sm:gap-2">
          <nav
            aria-label="Main navigation"
            className="flex max-w-[calc(100vw-8rem)] min-w-0 items-center gap-1 overflow-x-auto whitespace-nowrap [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:max-w-none sm:gap-1.5"
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
                  className={`inline-flex min-h-11 shrink-0 items-center rounded-full px-3 py-2 text-[0.8rem] transition sm:px-3.5 sm:text-sm ${
                    active
                      ? "bg-white/16 text-white"
                      : "text-white/72 hover:bg-white/8 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div ref={localeMenuRef} className="relative shrink-0">
            <button
              type="button"
              onClick={() => setLocaleOpen((value) => !value)}
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-white/18 bg-surface/90 px-3 text-white/88 transition hover:border-white/30 hover:bg-white/8"
              aria-label="Language selector"
              aria-haspopup="menu"
              aria-expanded={localeOpen}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[1.02rem] w-[1.02rem]">
                <path
                  d="M12 3C7.03 3 3 7.03 3 12C3 16.97 7.03 21 12 21C16.97 21 21 16.97 21 12C21 7.03 16.97 3 12 3ZM5.06 13H8.09C8.22 15.19 8.93 17.15 10 18.58C7.45 17.84 5.52 15.66 5.06 13ZM5.06 11C5.52 8.34 7.45 6.16 10 5.42C8.93 6.85 8.22 8.81 8.09 11H5.06ZM12 19C10.98 17.63 10.27 15.4 10.1 13H13.9C13.73 15.4 13.02 17.63 12 19ZM10.1 11C10.27 8.6 10.98 6.37 12 5C13.02 6.37 13.73 8.6 13.9 11H10.1ZM14 18.58C15.07 17.15 15.78 15.19 15.91 13H18.94C18.48 15.66 16.55 17.84 14 18.58ZM15.91 11C15.78 8.81 15.07 6.85 14 5.42C16.55 6.16 18.48 8.34 18.94 11H15.91Z"
                  fill="currentColor"
                />
              </svg>
              <span className="ml-2 hidden text-xs sm:inline">{localeText[locale]}</span>
              <svg viewBox="0 0 20 20" aria-hidden="true" className="ml-1.5 h-3.5 w-3.5 text-white/70">
                <path d="M5.8 7.8L10 12l4.2-4.2 1.4 1.4-5.6 5.6-5.6-5.6 1.4-1.4z" fill="currentColor" />
              </svg>
            </button>

            {localeOpen ? (
              <ul
                role="menu"
                aria-label="Language options"
                className="absolute right-0 z-20 mt-2 min-w-[8.4rem] rounded-2xl border border-white/15 bg-surface/95 p-1.5 shadow-[0_20px_40px_rgba(0,0,0,0.45)] backdrop-blur"
              >
                {localeOptions.map((option) => {
                  const active = option.value === locale;
                  return (
                    <li key={option.value} role="none">
                      <button
                        type="button"
                        role="menuitemradio"
                        aria-checked={active}
                        onClick={() => {
                          setLocale(option.value);
                          setLocaleOpen(false);
                        }}
                        className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm transition ${
                          active ? "bg-white/14 text-white" : "text-white/78 hover:bg-white/8 hover:text-white"
                        }`}
                      >
                        {option.label}
                        {active ? <span className="text-accent">•</span> : null}
                      </button>
                    </li>
                  );
                })}
              </ul>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}
