import Link from "next/link";
import { DemoCard } from "@/components/demos/DemoCard";
import { getProductizedDemos } from "@/lib/demos";
import { getMessages } from "@/lib/i18n";
import type { Locale } from "@/lib/locale";
import { getLocalizedPath } from "@/lib/routes";

export function DemosPreview({ locale }: { locale: Locale }) {
  const messages = getMessages(locale);
  const copy = messages.demos;
  const homeCopy = messages.home.demos;
  const demos = getProductizedDemos();

  return (
    <section className="demo-preview-chapter" aria-labelledby="home-demos-title">
      <div className="chapter-inner">
        <header className="chapter-heading chapter-heading--cream">
          <p className="section-kicker">{copy.page.kicker}</p>
          <h2 id="home-demos-title" className="section-display">
            {copy.groups.productized.title}
          </h2>
          <p className="chapter-description">{copy.groups.productized.description}</p>
        </header>

        <div className="demo-preview-grid">
          {demos.map((demo) => (
            <DemoCard key={demo.slug} demo={demo} locale={locale} variant="compact" />
          ))}
        </div>

        <Link href={getLocalizedPath(locale, "/demos/")} className="btn-on-orange">
          {homeCopy.viewAll}
        </Link>
      </div>
    </section>
  );
}
