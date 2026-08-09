import type { ReactNode } from "react";
import { LocaleProvider } from "@/components/i18n/LocaleProvider";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { PageTransition } from "@/components/layout/PageTransition";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
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
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <Navbar />
      <PageTransition>{children}</PageTransition>
      <Footer />
      <ScrollProgress />
    </LocaleProvider>
  );
}
