"use client";

import { useLocale } from "@/components/i18n/LocaleProvider";
import { getMessages } from "@/lib/i18n";

const eraColors = {
  era1: "bg-[#f59e0b]",
  era2: "bg-[#38bdf8]",
  era3: "bg-[#34d399]",
} as const;

export function CareerTimeline() {
  const { locale } = useLocale();
  const copy = getMessages(locale).home.timeline;
  const timeline = [
    { key: "era1", color: eraColors.era1, data: copy.eras.era1 },
    { key: "era2", color: eraColors.era2, data: copy.eras.era2 },
    { key: "era3", color: eraColors.era3, data: copy.eras.era3 },
  ] as const;

  return (
    <section className="space-y-5 md:space-y-6">
      <div>
        <p className="section-kicker">{copy.kicker}</p>
        <h2 className="editorial-title mt-2 text-3xl md:text-5xl">{copy.title}</h2>
      </div>

      <div className="space-y-3.5 md:space-y-4">
        {timeline.map((era) => (
          <article key={era.key} className="panel p-4 md:p-5">
            <div className="flex items-center gap-3">
              <span className={`h-2.5 w-2.5 rounded-full ${era.color}`} aria-hidden="true" />
              <h3 className="text-base font-medium text-white/92 md:text-lg">{era.data.label}</h3>
            </div>
            <ul className="mt-3.5 space-y-2 text-sm leading-[1.8] text-white/84">
              {era.data.items.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
