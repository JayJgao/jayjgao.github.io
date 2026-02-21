"use client";

import { useLocale } from "@/components/i18n/LocaleProvider";
import resumeEn from "@/data/resume.en.json";
import resumeKo from "@/data/resume.ko.json";
import resumeZh from "@/data/resume.zh.json";
import { getMessages } from "@/lib/i18n";
import type { Locale } from "@/lib/locale";

type ResumeData = typeof resumeKo;

const resumeByLocale: Record<Locale, ResumeData> = {
  ko: resumeKo,
  en: resumeEn,
  zh: resumeZh,
};

function SectionTitle({ children }: { children: string }) {
  return (
    <h2 className="section-kicker">
      {children}
    </h2>
  );
}

export function ResumeRenderer() {
  const { locale } = useLocale();
  const data = resumeByLocale[locale] as ResumeData;
  const copy = getMessages(locale).resume.renderer;

  return (
    <article className="panel p-5 md:p-8">
      <header className="border-b border-white/10 pb-6 md:pb-7">
        <h1 className="editorial-title text-4xl md:text-5xl">
          {data.meta.name}
        </h1>
        <p className="mt-2 text-xl text-white/90">{data.meta.title}</p>
        <p className="mt-2 text-sm leading-relaxed text-white/68">{data.meta.subtitle}</p>
        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-white/70">
          <span>{data.meta.location}</span>
          <a className="hover:text-white" href={`mailto:${data.meta.email}`}>
            {data.meta.email}
          </a>
          <a className="hover:text-white" href={data.meta.website}>
            {copy.website}
          </a>
          <a className="hover:text-white" href={data.meta.github}>
            {copy.github}
          </a>
        </div>
      </header>

      <section className="mt-6 grid gap-3 md:grid-cols-3 md:gap-4">
        <div className="rounded-xl border border-white/12 bg-white/6 p-4">
          <p className="text-xs tracking-[0.14em] text-white/62 uppercase">{copy.revenue}</p>
          <p className="display-kpi mt-1 text-2xl leading-none">MRR 10x</p>
          <p className="mt-1 text-xs text-white/72">₩5M → ₩52M</p>
        </div>
        <div className="rounded-xl border border-white/12 bg-white/6 p-4">
          <p className="text-xs tracking-[0.14em] text-white/62 uppercase">{copy.clientScale}</p>
          <p className="display-kpi mt-1 text-2xl leading-none">25+ B2B clients</p>
          <p className="mt-1 text-xs text-white/72">KR / JP enterprise tracks</p>
        </div>
        <div className="rounded-xl border border-white/12 bg-white/6 p-4">
          <p className="text-xs tracking-[0.14em] text-white/62 uppercase">{copy.ipResearch}</p>
          <p className="display-kpi mt-1 text-2xl leading-none">3 patents</p>
          <p className="mt-1 text-xs text-white/72">KSC publication + awards</p>
        </div>
      </section>

      <section className="mt-7 md:mt-8">
        <SectionTitle>{copy.summary}</SectionTitle>
        <p className="mt-3 text-sm leading-[1.88] text-white/86">{data.summary}</p>
      </section>

      <section className="mt-9 space-y-7">
        <SectionTitle>{copy.experience}</SectionTitle>
        {data.experience.map((item) => (
          <div key={`${item.company}-${item.period}`} className="border-l border-white/15 pl-4 md:pl-5">
            <p className="text-sm text-white/64">{item.period}</p>
            <h3 className="mt-1 text-xl font-medium text-white/95">{item.company}</h3>
            <p className="text-sm text-white/76">{item.role}</p>
            <ul className="mt-3 space-y-2.5 text-sm leading-[1.82] text-white/86">
              {item.highlights.map((highlight) => (
                <li key={highlight}>• {highlight}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section className="mt-9">
        <SectionTitle>{copy.skills}</SectionTitle>
        <div className="mt-4 space-y-5">
          {Object.entries(data.skills).map(([category, items]) => (
            <div key={category}>
              <h3 className="text-sm font-medium text-white/92">{category}</h3>
              <div className="mt-2.5 flex flex-wrap gap-2.5">
                {items.map((skill) => (
                  <span key={skill} className="pill text-xs">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-9 grid gap-7 md:grid-cols-2">
        <div>
          <SectionTitle>{copy.education}</SectionTitle>
          <ul className="mt-3 space-y-2.5 text-sm leading-[1.8] text-white/86">
            {data.education.map((entry) => (
              <li key={entry}>• {entry}</li>
            ))}
          </ul>
        </div>
        <div>
          <SectionTitle>{copy.achievements}</SectionTitle>
          <ul className="mt-3 space-y-2.5 text-sm leading-[1.8] text-white/86">
            {data.achievements.map((entry) => (
              <li key={entry}>• {entry}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mt-9">
        <SectionTitle>{copy.languages}</SectionTitle>
        <div className="mt-3 flex flex-wrap gap-2.5">
          {data.languages.map((language) => (
            <span key={language} className="pill text-xs">
              {language}
            </span>
          ))}
        </div>
      </section>
    </article>
  );
}
