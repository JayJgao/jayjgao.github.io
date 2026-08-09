"use client";

import { useLocale } from "@/components/i18n/LocaleProvider";
import { getAllEras, getEraLabel } from "@/lib/eras";
import { getMessages } from "@/lib/i18n";
import type { EraId, Localized } from "@/types/content";

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
    items: itemsByEra[era.id],
  }));

  return (
    <section className="timeline-chapter">
      <header className="chapter-heading">
        <p className="section-kicker">{copy.kicker}</p>
        <h2 className="section-display">{copy.title}</h2>
      </header>

      <div className="timeline-ledger">
        {timeline.map(({ era, items }) => (
          <article key={era.id} className="timeline-row">
            <p className="timeline-row__number">0{era.id}</p>
            <h3 className="timeline-row__title">
              {eraPrefix[locale]} {era.id}<br />{getEraLabel(era.id, locale)}
            </h3>
            <ul className="timeline-row__items">
              {items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
