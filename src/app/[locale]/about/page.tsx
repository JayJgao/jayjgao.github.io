import type { Metadata } from "next";
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
    <main id="main-content" className="about-editorial">
      <section className="about-opening" data-about-section="opening">
        <div className="chapter-inner">
          <h1 className="page-display">{narrative.title}</h1>
          <p className="about-quote">{narrative.opening.quote}</p>
          <div className="about-copy">
            {narrative.opening.body.map((paragraph, index) => (
              <p key={`opening-${index}`}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      <section
        className="about-section"
        data-about-section="how-i-work"
        aria-labelledby="about-how-i-work-title"
      >
        <div className="chapter-inner">
          <h2 id="about-how-i-work-title" className="section-kicker">{narrative.workingWithMe.kicker}</h2>
          <p className="about-lead">{narrative.workingWithMe.lead}</p>
          <ol className="about-principles">
            {narrative.workingWithMe.principles.map((item, index) => {
              const title = typeof item === "string" ? item : item.title;
              const body = typeof item === "string" ? null : item.body;

              return (
                <li key={title}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div className="about-principle-copy">
                    <h3>{title}</h3>
                    {body ? <p>{body}</p> : null}
                  </div>
                </li>
              );
            })}
          </ol>
          <Link href={getLocalizedPath(locale, "/demos/")} className="about-demos-bridge">
            <span>{narrative.workingWithMe.demosBridge}</span>
            <strong>{messages.about.demosCta} →</strong>
          </Link>
        </div>
      </section>

      <section
        className="about-section"
        data-about-section="markets"
        aria-labelledby="about-markets-title"
      >
        <div className="chapter-inner">
          <h2 id="about-markets-title" className="section-kicker">{narrative.markets.kicker}</h2>
          <p className="about-intro">{narrative.markets.intro}</p>
          <ul className="about-markets-ledger">
            {narrative.markets.items.map((item, index) => (
              <li key={item.language}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{item.language}</h3>
                <p>{item.detail}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        className="about-section about-section--belief"
        data-about-section="why-ai"
        aria-labelledby="about-why-ai-title"
      >
        <div className="chapter-inner">
          <h2 id="about-why-ai-title" className="section-kicker">{messages.about.motivationKicker}</h2>
          <div className="about-copy">
            {narrative.motivation.body.map((paragraph, index) => (
              <p key={`motivation-${index}`}>{paragraph}</p>
            ))}
          </div>
          <p className="about-belief-plate">{narrative.motivation.belief}</p>
        </div>
      </section>
    </main>
  );
}
