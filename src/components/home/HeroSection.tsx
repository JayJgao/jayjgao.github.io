"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getMessages } from "@/lib/i18n";

export function HeroSection() {
  const { locale } = useLocale();
  const copy = getMessages(locale).home.hero;

  return (
    <section className="panel relative overflow-hidden p-5 sm:p-6 md:p-10">
      <div className="absolute -top-24 right-0 h-72 w-72 rounded-full bg-accent/20 blur-3xl" aria-hidden="true" />
      <div className="absolute -left-20 top-24 h-60 w-60 rounded-full bg-cyan-400/10 blur-3xl" aria-hidden="true" />
      <div className="relative z-10 grid gap-6 lg:grid-cols-[1.42fr_0.9fr] lg:items-center lg:gap-8">
        <div className="space-y-4">
          <p className="section-kicker">{copy.kicker}</p>
          <h1 className="editorial-title text-4xl md:text-6xl">
            {copy.name} <span className="text-white/65">({copy.alias})</span>
          </h1>
          <p className="max-w-2xl text-xl leading-snug text-white/90 md:text-2xl whitespace-pre-line">
            {copy.headline}
          </p>
          <p className="text-sm text-white/74 md:text-base">
            {copy.subheadline}
          </p>

          <div className="grid grid-cols-3 gap-2.5 pt-2 md:gap-3">
            {copy.stats.map((stat) => (
              <div key={stat.label} className="flex h-full flex-col justify-between rounded-xl border border-white/12 bg-white/5 p-2.5 sm:p-3 md:rounded-2xl md:p-4">
                <p className="display-kpi min-h-[2.45rem] text-[clamp(1.05rem,3.3vw,1.78rem)] leading-[0.98] tracking-[-0.01em] text-white/96 md:min-h-[2.2rem]">
                  {stat.value}
                </p>
                <p className="mt-1 text-[10px] leading-tight tracking-[0.14em] text-white/65 uppercase md:text-xs">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-2.5 pt-2 md:gap-3">
            <Link href="/projects" className="btn-primary min-w-[8.6rem]">
              {copy.ctaPortfolio}
            </Link>
            <Link href="/resume" className="btn-secondary min-w-[8.6rem]">
              {copy.ctaResume}
            </Link>
          </div>
        </div>

        <aside className="panel relative hidden h-[330px] overflow-hidden p-3 sm:flex lg:h-[470px] lg:p-4">
          <div className="relative h-full w-full overflow-hidden rounded-xl md:rounded-2xl">
            <Image
              src="/assets/images/profile/jayko_profile.jpg"
              alt={copy.profileAlt}
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 40vw, 34vw"
              priority
            />
          </div>
        </aside>
      </div>
    </section>
  );
}
