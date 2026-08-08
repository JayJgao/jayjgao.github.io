import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import aboutEn from "@/data/about.en.json";
import aboutKo from "@/data/about.ko.json";
import aboutZh from "@/data/about.zh.json";
import { getMessages } from "@/lib/i18n";
import { isLocale, type Locale } from "@/lib/locale";
import { createLocalizedMetadata } from "@/lib/metadata";
import { getLocalizedPath } from "@/lib/routes";
import type { AboutNarrative } from "@/types/about";

const aboutByLocale: Record<Locale, AboutNarrative> = {
  ko: aboutKo as AboutNarrative,
  en: aboutEn as AboutNarrative,
  zh: aboutZh as AboutNarrative,
};

const sectionImages = {
  opening: "/assets/images/about/about-opening.webp",
  markets: "/assets/images/about/about-markets.webp",
  motivation: "/assets/images/about/about-motivation.webp",
  working: "/assets/images/about/about-working.webp",
} as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const narrative = aboutByLocale[locale];
  return createLocalizedMetadata({
    locale,
    path: "/about/",
    title: `${narrative.title} | Jay Ko`,
    description: narrative.opening.quote,
  });
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const narrative = aboutByLocale[locale];
  const messages = getMessages(locale);

  return (
    <main className="page-container py-8 md:py-12">
      <div className="about-card-stack">
        <section className="panel about-card" data-about-section="opening">
          <div className="about-card-grid">
            <header className="about-card-copy">
              <h1 className="editorial-title text-5xl md:text-6xl">{narrative.title}</h1>
              <p className="about-quote mt-7">{narrative.opening.quote}</p>
              <div className="about-copy mt-6">
                {narrative.opening.body.map((paragraph, index) => (
                  <p key={`opening-${index}`}>{paragraph}</p>
                ))}
              </div>
            </header>
            <figure className="about-card-media" aria-label="Opening visual">
              <Image
                src={sectionImages.opening}
                alt={messages.about.images.opening}
                fill
                sizes="(max-width: 1024px) 100vw, 42vw"
                className="about-card-image"
              />
            </figure>
          </div>
        </section>

        <section
          className="panel about-card"
          data-about-section="how-i-work"
          aria-labelledby="about-how-i-work-title"
        >
          <div className="about-card-grid about-card-grid--reverse">
            <div className="about-card-copy">
              <h2 id="about-how-i-work-title" className="section-kicker">{narrative.workingWithMe.kicker}</h2>
              <p className="about-lead mt-4">{narrative.workingWithMe.lead}</p>
              <ul className="about-principles mt-5">
                {narrative.workingWithMe.principles.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p className="mt-6 text-sm leading-7 text-white/72">
                {narrative.workingWithMe.demosBridge}
              </p>
              <Link
                href={getLocalizedPath(locale, "/demos/")}
                className="btn-secondary mt-4 w-fit px-4 text-xs tracking-[0.12em] uppercase md:text-sm"
              >
                {messages.about.demosCta}
              </Link>
            </div>
            <figure className="about-card-media" aria-label="Working with me visual">
              <Image
                src={sectionImages.working}
                alt={messages.about.images.working}
                fill
                sizes="(max-width: 1024px) 100vw, 42vw"
                className="about-card-image"
              />
            </figure>
          </div>
        </section>

        <section
          className="panel about-card"
          data-about-section="markets"
          aria-labelledby="about-markets-title"
        >
          <div className="about-card-grid about-card-grid--reverse">
            <div className="about-card-copy">
              <h2 id="about-markets-title" className="section-kicker">{narrative.markets.kicker}</h2>
              <p className="about-intro mt-5">{narrative.markets.intro}</p>
              <ul className="about-language-list mt-6">
                {narrative.markets.items.map((item) => (
                  <li key={item.language} className="about-language-item">
                    <h3 className="about-language-head">{item.language}</h3>
                    <p className="about-language-detail">{item.detail}</p>
                  </li>
                ))}
              </ul>
            </div>
            <figure className="about-card-media" aria-label="Markets visual">
              <Image
                src={sectionImages.markets}
                alt={messages.about.images.markets}
                fill
                sizes="(max-width: 1024px) 100vw, 42vw"
                className="about-card-image"
              />
            </figure>
          </div>
        </section>

        <section
          className="panel about-card"
          data-about-section="why-ai"
          aria-labelledby="about-why-ai-title"
        >
          <div className="about-card-grid">
            <div className="about-card-copy">
              <h2 id="about-why-ai-title" className="section-kicker">{messages.about.motivationKicker}</h2>
              <div className="about-copy mt-6">
                {narrative.motivation.body.map((paragraph, index) => (
                  <p key={`motivation-${index}`}>{paragraph}</p>
                ))}
              </div>
              <p className="about-belief mt-5">{narrative.motivation.belief}</p>
            </div>
            <figure className="about-card-media" aria-label="Motivation visual">
              <Image
                src={sectionImages.motivation}
                alt={messages.about.images.motivation}
                fill
                sizes="(max-width: 1024px) 100vw, 42vw"
                className="about-card-image"
              />
            </figure>
          </div>
        </section>
      </div>
    </main>
  );
}
