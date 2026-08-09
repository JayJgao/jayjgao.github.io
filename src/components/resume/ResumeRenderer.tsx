"use client";

import { useLocale } from "@/components/i18n/LocaleProvider";
import resumeEn from "@/data/resume.en.json";
import resumeKo from "@/data/resume.ko.json";
import resumeZh from "@/data/resume.zh.json";
import { getMessages } from "@/lib/i18n";
import type { Locale } from "@/lib/locale";

type ResumeData = Omit<typeof resumeKo, "skills" | "summary"> & {
  summary: string | string[];
  skills: Record<string, string[]>;
};

const resumeByLocale: Record<Locale, ResumeData> = {
  ko: resumeKo,
  en: resumeEn,
  zh: resumeZh,
};

function SectionTitle({ children }: { children: string }) {
  return <h2 className="section-kicker">{children}</h2>;
}

export function ResumeRenderer() {
  const { locale } = useLocale();
  const data = resumeByLocale[locale] as ResumeData;
  const copy = getMessages(locale).resume.renderer;
  const summaryParagraphs = Array.isArray(data.summary) ? data.summary : [data.summary];

  return (
    <article className="resume-document">
      <header className="resume-header" data-resume-section="header">
        <h1>{data.meta.name}</h1>
        <p className="resume-header__title">{data.meta.title}</p>
        <p className="resume-header__subtitle">{data.meta.subtitle}</p>
        <div className="resume-contact">
          <span>{data.meta.location}</span>
          <a href={`mailto:${data.meta.email}`}>{data.meta.email}</a>
          <a href={data.meta.website}>{copy.website}</a>
          <a href={data.meta.github}>{copy.github}</a>
        </div>
      </header>

      <section className="resume-kpi-ledger" data-resume-section="kpis">
        <div>
          <p>{copy.revenue}</p><strong>MRR 10x</strong><span>₩5M → ₩52M</span>
        </div>
        <div>
          <p>{copy.clientScale}</p><strong>25+ B2B clients</strong><span>KR / JP enterprise tracks</span>
        </div>
        <div>
          <p>{copy.ipResearch}</p><strong>3 patents</strong><span>KSC publication + awards</span>
        </div>
      </section>

      <section className="resume-section" data-resume-section="summary">
        <SectionTitle>{copy.summary}</SectionTitle>
        {summaryParagraphs.map((paragraph, index) => (
          <p key={`summary-${index}`} className="resume-summary">{paragraph}</p>
        ))}
      </section>

      <section className="resume-section" data-resume-section="experience">
        <SectionTitle>{copy.experience}</SectionTitle>
        <div className="resume-experience-list">
          {data.experience.map((item) => (
            <article key={`${item.company}-${item.period}`} className="resume-experience-row">
              <header>
                <p>{item.period}</p>
                <h3>{item.company}</h3>
                <span>{item.role}</span>
              </header>
              <ul>
                {item.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="resume-section" data-resume-section="skills">
        <SectionTitle>{copy.skills}</SectionTitle>
        <div className="resume-skill-groups">
          {Object.entries(data.skills).map(([category, items]) => (
            <div key={category}>
              <h3>{category}</h3>
              <ul className="tag-list">
                {items.map((skill) => <li key={skill} className="pill">{skill}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="resume-index-grid" data-resume-section="index">
        <div>
          <SectionTitle>{copy.education}</SectionTitle>
          <ul>{data.education.map((entry) => <li key={entry}>{entry}</li>)}</ul>
        </div>
        <div>
          <SectionTitle>{copy.achievements}</SectionTitle>
          <ul>{data.achievements.map((entry) => <li key={entry}>{entry}</li>)}</ul>
        </div>
      </section>

      <section className="resume-section" data-resume-section="languages">
        <SectionTitle>{copy.languages}</SectionTitle>
        <ul className="tag-list">
          {data.languages.map((language) => <li key={language} className="pill">{language}</li>)}
        </ul>
      </section>
    </article>
  );
}
