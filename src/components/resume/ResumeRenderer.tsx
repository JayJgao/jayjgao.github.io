"use client";

import { useLocale } from "@/components/i18n/LocaleProvider";
import resumeEn from "@/data/resume.en.json";
import resumeKo from "@/data/resume.ko.json";
import resumeZh from "@/data/resume.zh.json";
import type { Locale } from "@/lib/locale";

type ResumeData = typeof resumeKo;

const resumeByLocale: Record<Locale, ResumeData> = {
  ko: resumeKo,
  en: resumeEn,
  zh: resumeZh,
};

function SectionTitle({ children }: { children: string }) {
  return (
    <h2 className="text-xs font-semibold tracking-[0.16em] text-accent uppercase">
      {children}
    </h2>
  );
}

export function ResumeRenderer() {
  const { locale } = useLocale();
  const data = resumeByLocale[locale] as ResumeData;

  return (
    <article className="panel p-6 md:p-8">
      <header className="border-b border-white/10 pb-6">
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
          {data.meta.name}
        </h1>
        <p className="mt-2 text-lg text-white/90">{data.meta.title}</p>
        <p className="mt-2 text-sm text-muted">{data.meta.subtitle}</p>
        <div className="mt-4 flex flex-wrap gap-3 text-sm text-muted">
          <span>{data.meta.location}</span>
          <a className="hover:text-white" href={`mailto:${data.meta.email}`}>
            {data.meta.email}
          </a>
          <a className="hover:text-white" href={data.meta.website}>
            Website
          </a>
          <a className="hover:text-white" href={data.meta.github}>
            GitHub
          </a>
        </div>
      </header>

      <section className="mt-6 grid gap-3 md:grid-cols-3">
        <div className="rounded-xl border border-white/12 bg-white/5 p-4">
          <p className="text-xs tracking-[0.14em] text-muted uppercase">Revenue</p>
          <p className="mt-1 text-lg font-semibold">MRR 10x</p>
          <p className="text-xs text-white/75">₩5M → ₩52M</p>
        </div>
        <div className="rounded-xl border border-white/12 bg-white/5 p-4">
          <p className="text-xs tracking-[0.14em] text-muted uppercase">Client Scale</p>
          <p className="mt-1 text-lg font-semibold">25+ B2B clients</p>
          <p className="text-xs text-white/75">KR / JP enterprise tracks</p>
        </div>
        <div className="rounded-xl border border-white/12 bg-white/5 p-4">
          <p className="text-xs tracking-[0.14em] text-muted uppercase">IP & Research</p>
          <p className="mt-1 text-lg font-semibold">3 patents</p>
          <p className="text-xs text-white/75">KSC publication + awards</p>
        </div>
      </section>

      <section className="mt-6">
        <SectionTitle>Summary</SectionTitle>
        <p className="mt-3 text-sm leading-relaxed text-white/85">{data.summary}</p>
      </section>

      <section className="mt-8 space-y-6">
        <SectionTitle>Experience</SectionTitle>
        {data.experience.map((item) => (
          <div key={`${item.company}-${item.period}`} className="border-l border-white/15 pl-4">
            <p className="text-sm text-muted">{item.period}</p>
            <h3 className="mt-1 text-lg font-medium">{item.company}</h3>
            <p className="text-sm text-white/75">{item.role}</p>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-white/85">
              {item.highlights.map((highlight) => (
                <li key={highlight}>• {highlight}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section className="mt-8">
        <SectionTitle>Skills</SectionTitle>
        <div className="mt-4 space-y-4">
          {Object.entries(data.skills).map(([category, items]) => (
            <div key={category}>
              <h3 className="text-sm font-medium text-white/90">{category}</h3>
              <div className="mt-2 flex flex-wrap gap-2">
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

      <section className="mt-8 grid gap-6 md:grid-cols-2">
        <div>
          <SectionTitle>Education</SectionTitle>
          <ul className="mt-3 space-y-2 text-sm text-white/85">
            {data.education.map((entry) => (
              <li key={entry}>• {entry}</li>
            ))}
          </ul>
        </div>
        <div>
          <SectionTitle>Achievements</SectionTitle>
          <ul className="mt-3 space-y-2 text-sm text-white/85">
            {data.achievements.map((entry) => (
              <li key={entry}>• {entry}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mt-8">
        <SectionTitle>Languages</SectionTitle>
        <div className="mt-3 flex flex-wrap gap-2">
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
