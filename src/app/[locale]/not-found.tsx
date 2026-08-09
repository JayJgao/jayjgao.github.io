"use client";

import Link from "next/link";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getMessages } from "@/lib/i18n";
import { getLocalizedPath } from "@/lib/routes";

export default function LocalizedNotFound() {
  const { locale } = useLocale();
  const copy = getMessages(locale).notFound;

  return (
    <main id="main-content" className="not-found-page">
      <p className="section-kicker">404</p>
      <h1 className="page-display">{copy.title}</h1>
      <p className="not-found-page__copy">{copy.description}</p>
      <Link href={getLocalizedPath(locale, "/")} className="btn-primary">
        {copy.backHome}
      </Link>
    </main>
  );
}
