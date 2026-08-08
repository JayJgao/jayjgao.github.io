import type { ReactNode } from "react";
import { LocaleProvider } from "@/components/i18n/LocaleProvider";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { PageTransition } from "@/components/layout/PageTransition";
import type { Locale } from "@/lib/locale";

export function SiteShell({
  children,
  locale,
}: {
  children: ReactNode;
  locale: Locale;
}) {
  return (
    <LocaleProvider locale={locale}>
      <Navbar />
      <PageTransition>{children}</PageTransition>
      <Footer />
    </LocaleProvider>
  );
}
