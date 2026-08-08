"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale } from "@/components/i18n/LocaleProvider";
import resumeEn from "@/data/resume.en.json";
import resumeKo from "@/data/resume.ko.json";
import resumeZh from "@/data/resume.zh.json";
import { getMessages } from "@/lib/i18n";
import { getLocalizedPath } from "@/lib/routes";

const locationByLocale = {
  ko: resumeKo.meta.location,
  en: resumeEn.meta.location,
  zh: resumeZh.meta.location,
};

export function HeroSection() {
  const { locale } = useLocale();
  const copy = getMessages(locale).home.hero;
  const splitAt = copy.headline.indexOf(" and building");
  const demoClause = splitAt === -1 ? copy.headline : copy.headline.slice(0, splitAt);
  const projectClause = splitAt === -1 ? "" : copy.headline.slice(splitAt + 1);

  return (
    <section className="hero-editorial" aria-labelledby="home-hero-title">
      <div className="hero-meta">
        <span>{copy.name} / {copy.alias}</span>
        <span>{copy.kicker}</span>
        <span>{locationByLocale[locale]}</span>
      </div>

      <h1 id="home-hero-title" className="hero-display">
        <span className="hero-clause hero-clause--demo">{demoClause}</span>
        <span className="hero-clause hero-clause--project">{projectClause}</span>
      </h1>

      <div className="hero-support-grid">
        <div className="hero-support-copy">
          <p className="hero-subheadline">{copy.subheadline}</p>
          <p className="hero-supporting">{copy.supporting}</p>

          <div className="hero-stat-ledger">
            {copy.stats.map((stat) => (
              <div key={stat.label} className="hero-stat">
                <p className="hero-stat__value">{stat.value}</p>
                <p className="hero-stat__label">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="hero-actions">
            <Link href={getLocalizedPath(locale, "/projects/")} className="btn-primary">
              {copy.ctaPortfolio}
            </Link>
            <Link href={getLocalizedPath(locale, "/resume/")} className="btn-secondary">
              {copy.ctaResume}
            </Link>
          </div>
        </div>

        <figure className="hero-portrait">
          <Image
            src="/assets/images/profile/jayko_profile.jpg"
            alt={copy.profileAlt}
            fill
            className="object-cover object-center"
            sizes="(max-width: 639px) 34vw, 220px"
            priority
          />
        </figure>
      </div>
    </section>
  );
}
