"use client";

import { ResumeRenderer } from "@/components/resume/ResumeRenderer";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getMessages } from "@/lib/i18n";

export default function ResumePage() {
  const { locale } = useLocale();
  const copy = getMessages(locale).resume.page;

  return (
    <main className="page-container space-y-6 py-8 md:space-y-8 md:py-12">
      <header className="space-y-3 md:space-y-4">
        <p className="section-kicker">{copy.kicker}</p>
        <h1 className="editorial-title text-5xl md:text-6xl">{copy.title}</h1>
        <p className="max-w-2xl text-base leading-relaxed text-white/72 md:text-lg">
          {copy.description}
        </p>
        <div className="flex flex-wrap gap-2.5 pt-1 md:gap-3">
          <a href="/assets/resume/resume_ko.pdf" className="btn-secondary">
            {copy.downloadKo}
          </a>
          <a href="/assets/resume/resume_en.pdf" className="btn-secondary">
            {copy.downloadEn}
          </a>
        </div>
      </header>
      <ResumeRenderer />
    </main>
  );
}
