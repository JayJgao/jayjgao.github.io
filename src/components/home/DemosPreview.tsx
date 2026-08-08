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
    <section className="space-y-5 md:space-y-7" aria-labelledby="home-demos-title">
      <div className="max-w-2xl space-y-2">
        <p className="section-kicker">{copy.page.kicker}</p>
        <h2 id="home-demos-title" className="editorial-title text-3xl md:text-5xl">
          {copy.groups.productized.title}
        </h2>
        <p className="text-sm leading-7 text-white/66 md:text-base">
          {copy.groups.productized.description}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {demos.map((demo) => (
          <DemoCard key={demo.slug} demo={demo} locale={locale} variant="compact" />
        ))}
      </div>

      <div className="flex justify-end">
        <Link
          href={getLocalizedPath(locale, "/demos/")}
          className="btn-secondary w-fit px-4 text-xs tracking-[0.12em] uppercase md:text-sm"
        >
          {homeCopy.viewAll}
        </Link>
      </div>
    </section>
  );
}
