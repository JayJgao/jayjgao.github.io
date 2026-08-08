import { notFound } from "next/navigation";
import { IBM_Plex_Mono, IBM_Plex_Sans_KR, Noto_Sans_SC } from "next/font/google";
import type { ReactNode } from "react";
import { SiteShell } from "@/components/layout/SiteShell";
import { SUPPORTED_LOCALES, isLocale } from "@/lib/locale";
import "@/styles/globals.css";

const plexSans = IBM_Plex_Sans_KR({
  weight: ["400", "600"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-plex-sans",
});

const plexMono = IBM_Plex_Mono({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-plex-mono",
});

const notoSansSc = Noto_Sans_SC({
  weight: ["400", "600"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-noto-sans-sc",
});

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
    <html
      lang={locale}
      className={`${plexSans.variable} ${plexMono.variable} ${notoSansSc.variable}`}
    >
      <body>
        <SiteShell locale={locale}>{children}</SiteShell>
      </body>
    </html>
  );
}
