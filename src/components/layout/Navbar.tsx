"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getMessages } from "@/lib/i18n";
import type { Locale } from "@/lib/locale";
import {
  getLocalizedPath,
  getPathWithoutLocale,
  normalizeSitePath,
} from "@/lib/routes";

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
  const { locale } = useLocale();
  const labels = getMessages(locale).nav;
  const [localeOpen, setLocaleOpen] = useState(false);
  const localeMenuRef = useRef<HTMLDivElement | null>(null);
  const localeTriggerRef = useRef<HTMLButtonElement | null>(null);
  const localeDisclosureId = "locale-disclosure";
  const pathWithoutLocale = getPathWithoutLocale(pathname);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (!localeMenuRef.current?.contains(event.target as Node)) {
        setLocaleOpen(false);
      }
    };

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && localeOpen) {
        event.preventDefault();
        setLocaleOpen(false);
        localeTriggerRef.current?.focus();
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onEscape);
    };
  }, [localeOpen]);

  const navItems = useMemo(
    () => [
      { href: "/", label: labels.home },
      { href: "/about", label: labels.about },
      { href: "/projects", label: labels.projects },
      { href: "/demos", label: labels.demos },
      { href: "/resume", label: labels.resume },
    ],
    [labels],
  );

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <div className="site-header__brand-row">
          <Link href={getLocalizedPath(locale, "/")} className="site-wordmark">
            Jay Ko
          </Link>

          <div ref={localeMenuRef} className="locale-control">
            <button
              ref={localeTriggerRef}
              type="button"
              onClick={() => setLocaleOpen((value) => !value)}
              className="locale-trigger"
              aria-label="Language selector"
              aria-expanded={localeOpen}
              aria-controls={localeDisclosureId}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" className="locale-trigger__icon">
                <path
                  d="M12 3C7.03 3 3 7.03 3 12C3 16.97 7.03 21 12 21C16.97 21 21 16.97 21 12C21 7.03 16.97 3 12 3ZM5.06 13H8.09C8.22 15.19 8.93 17.15 10 18.58C7.45 17.84 5.52 15.66 5.06 13ZM5.06 11C5.52 8.34 7.45 6.16 10 5.42C8.93 6.85 8.22 8.81 8.09 11H5.06ZM12 19C10.98 17.63 10.27 15.4 10.1 13H13.9C13.73 15.4 13.02 17.63 12 19ZM10.1 11C10.27 8.6 10.98 6.37 12 5C13.02 6.37 13.73 8.6 13.9 11H10.1ZM14 18.58C15.07 17.15 15.78 15.19 15.91 13H18.94C18.48 15.66 16.55 17.84 14 18.58ZM15.91 11C15.78 8.81 15.07 6.85 14 5.42C16.55 6.16 18.48 8.34 18.94 11H15.91Z"
                  fill="currentColor"
                />
              </svg>
              <span>{localeText[locale]}</span>
              <svg viewBox="0 0 20 20" aria-hidden="true" className="locale-trigger__chevron">
                <path d="M5.8 7.8L10 12l4.2-4.2 1.4 1.4-5.6 5.6-5.6-5.6 1.4-1.4z" fill="currentColor" />
              </svg>
            </button>

            <ul
              id={localeDisclosureId}
              aria-label="Language options"
              hidden={!localeOpen}
              className="locale-menu"
            >
              {localeOptions.map((option) => {
                const active = option.value === locale;
                return (
                  <li key={option.value}>
                    <Link
                      href={getLocalizedPath(option.value, pathWithoutLocale)}
                      aria-current={active ? "page" : undefined}
                      hrefLang={option.value}
                      onClick={() => setLocaleOpen(false)}
                      className={`locale-menu__link ${active ? "is-active" : ""}`}
                    >
                      {option.label}
                      {active ? <span aria-hidden="true">●</span> : null}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <nav aria-label="Main navigation" className="nav-mobile-scroll">
          {navItems.map((item) => {
            const normalizedItemPath = normalizeSitePath(item.href);
            const active =
              normalizedItemPath === "/"
                ? pathWithoutLocale === "/"
                : pathWithoutLocale === normalizedItemPath ||
                  pathWithoutLocale.startsWith(`${normalizedItemPath}/`);
            return (
              <Link
                key={item.href}
                href={getLocalizedPath(locale, item.href)}
                aria-current={active ? "page" : undefined}
                className={`nav-link ${active ? "is-active" : ""}`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
