import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { SiteShell } from "@/components/layout/SiteShell";
import { SUPPORTED_LOCALES, isLocale } from "@/lib/locale";
import "@/styles/globals.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export default async function LocalizedLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <html lang={locale} className="dark">
      <body className="antialiased">
        <div className="background-grid" aria-hidden="true" />
        <div className="grain-overlay fixed inset-0 -z-10" aria-hidden="true" />
        <SiteShell locale={locale}>{children}</SiteShell>
      </body>
    </html>
  );
}
