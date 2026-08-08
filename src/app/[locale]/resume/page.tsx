import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ResumeRenderer } from "@/components/resume/ResumeRenderer";
import { getMessages } from "@/lib/i18n";
import { isLocale } from "@/lib/locale";
import { createLocalizedMetadata } from "@/lib/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const copy = getMessages(locale).resume.page;
  return createLocalizedMetadata({
    locale,
    path: "/resume/",
    title: `${copy.title} | Jay Ko`,
    description: copy.description,
  });
}

export default async function ResumePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

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
