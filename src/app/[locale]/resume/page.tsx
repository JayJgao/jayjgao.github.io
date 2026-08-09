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
    <main id="main-content" className="resume-page">
      <header className="resume-page__heading">
        <p className="section-kicker">{copy.kicker}</p>
        <h1 className="page-display">{copy.title}</h1>
        <p className="chapter-description">{copy.description}</p>
        <div className="resume-downloads">
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
