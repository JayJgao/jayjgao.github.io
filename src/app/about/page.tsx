"use client";

import Image from "next/image";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getAboutNarrative, getMessages } from "@/lib/i18n";

const sectionImages = {
  opening: "/assets/images/about/about-opening.webp",
  markets: "/assets/images/about/about-markets.webp",
  motivation: "/assets/images/about/about-motivation.webp",
  working: "/assets/images/about/about-working.webp",
} as const;

export default function AboutPage() {
  const { locale } = useLocale();
  const narrative = getAboutNarrative(locale);
  const messages = getMessages(locale);

  return (
    <main className="page-container py-8 md:py-12">
      <div className="about-card-stack">
        <section className="panel about-card">
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

        <section className="panel about-card">
          <div className="about-card-grid about-card-grid--reverse">
            <div className="about-card-copy">
              <p className="section-kicker">{narrative.markets.kicker}</p>
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

        <section className="panel about-card">
          <div className="about-card-grid">
            <div className="about-card-copy">
              <p className="section-kicker">{messages.about.motivationKicker}</p>
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

        <section className="panel about-card">
          <div className="about-card-grid about-card-grid--reverse">
            <div className="about-card-copy">
              <p className="section-kicker">{narrative.workingWithMe.kicker}</p>
              <p className="about-lead mt-4">{narrative.workingWithMe.lead}</p>
              <ul className="about-principles mt-5">
                {narrative.workingWithMe.principles.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
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
      </div>
    </main>
  );
}
