"use client";

import Link from "next/link";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getMessages } from "@/lib/i18n";

export default function NotFound() {
  const { locale } = useLocale();
  const copy = getMessages(locale).notFound;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col items-start justify-center gap-4 px-6 md:px-12">
      <p className="text-sm tracking-[0.16em] text-muted uppercase">404</p>
      <h1 className="text-4xl font-semibold tracking-tight">{copy.title}</h1>
      <p className="text-muted">{copy.description}</p>
      <Link href="/" className="text-accent hover:underline">
        {copy.backHome}
      </Link>
    </main>
  );
}
