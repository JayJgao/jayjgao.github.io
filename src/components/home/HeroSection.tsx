"use client";
import Image from "next/image";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { ResultBand } from "@/components/ResultBand";
import { resumes } from "@/lib/career";
import { getMessages } from "@/lib/i18n";

export function HeroSection() {
  const { locale } = useLocale();
  const copy = getMessages(locale).home.hero;
  const meta = resumes[locale].meta;
  return (
    <section className="hero-editorial" aria-labelledby="home-hero-title">
      <div className="hero-main">
        <div className="hero-copy">
          <div className="hero-meta"><span>AI Product Leader</span><span>Seoul, Korea</span><span>{copy.career}</span></div>
          <h1 id="home-hero-title" className="hero-display">{copy.headline}</h1>
          <div className="hero-lead">{copy.lead.map((sentence) => <p key={sentence}>{sentence}</p>)}</div>
          <div className="hero-actions">
            <a className="btn-primary" href={locale === "ko" ? "/assets/resume/고재현_이력서.pdf" : "/assets/resume/jayko_resume.pdf"}>{copy.resumeLabel}</a>
            {locale === "ko" ? <a className="btn-secondary" href="/assets/resume/jayko_resume.pdf">Resume (EN)</a> : null}
            <a className="btn-secondary" href={meta.linkedin}>LinkedIn ↗</a>
          </div>
        </div>
        <figure className="hero-portrait">
          <Image src="/assets/images/profile/jayko_profile.jpg" alt={copy.profileAlt} fill className="object-cover object-center" sizes="(max-width: 767px) 210px, (max-width: 1240px) 32vw, 390px" priority />
        </figure>
      </div>
      <ResultBand results={copy.stats} />
    </section>
  );
}
