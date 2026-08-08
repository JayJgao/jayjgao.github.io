"use client";

import { useLocale } from "@/components/i18n/LocaleProvider";
import { getAllEras, getEraLabel } from "@/lib/eras";
import { getMessages } from "@/lib/i18n";
import type { EraId, Localized } from "@/types/content";

const eraColors: Record<EraId, string> = {
  1: "bg-[#f59e0b]",
  2: "bg-[#38bdf8]",
  3: "bg-[#34d399]",
};

const eraPrefix: Localized<string> = {
  ko: "Era",
  en: "Era",
  zh: "阶段",
};

export function CareerTimeline() {
  const { locale } = useLocale();
  const copy = getMessages(locale).home.timeline;
  const itemsByEra: Record<EraId, string[]> = {
    1: copy.eras.era1.items,
    2: copy.eras.era2.items,
    3: copy.eras.era3.items,
  };
  const timeline = getAllEras().map((era) => ({
    era,
    color: eraColors[era.id],
    items: itemsByEra[era.id],
  }));

  return (
    <section className="space-y-5 md:space-y-6">
      <div>
        <p className="section-kicker">{copy.kicker}</p>
        <h2 className="editorial-title mt-2 text-3xl md:text-5xl">{copy.title}</h2>
      </div>

      <div className="space-y-3.5 md:space-y-4">
        {timeline.map((era) => (
          <article key={era.era.id} className="panel p-4 md:p-5">
            <div className="flex items-center gap-3">
              <span className={`h-2.5 w-2.5 rounded-full ${era.color}`} aria-hidden="true" />
              <h3 className="text-base font-medium text-white/92 md:text-lg">
                {eraPrefix[locale]} {era.era.id} · {getEraLabel(era.era.id, locale)}
              </h3>
            </div>
            <ul className="mt-3.5 space-y-2 text-sm leading-[1.8] text-white/84">
              {era.items.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
