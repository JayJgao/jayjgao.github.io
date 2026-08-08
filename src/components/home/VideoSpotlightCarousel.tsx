"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import spotlights from "@/data/spotlights.json";
import { getMessages } from "@/lib/i18n";
import type { Locale } from "@/lib/locale";
import { getLocalizedPath } from "@/lib/routes";
import type { Localized } from "@/types/content";

function pickText(value: Localized<string>, locale: Locale) {
  return value[locale] ?? value.ko;
}

type Spotlight = {
  slug: string;
  provider: "youtube" | "vimeo";
  videoId: string;
  title: Localized<string>;
  workTitle: Localized<string>;
  caption: Localized<string>;
  poster: string;
};

function getEmbedUrl(item: Spotlight) {
  if (item.provider === "youtube") {
    return `https://www.youtube.com/embed/${item.videoId}?rel=0&modestbranding=1`;
  }
  return `https://player.vimeo.com/video/${item.videoId}`;
}

export function VideoSpotlightCarousel() {
  const { locale } = useLocale();
  const copy = getMessages(locale).home.spotlight;
  const items = spotlights as Spotlight[];
  const [index, setIndex] = useState(0);
  const current = items[index] ?? items[0];
  const frameTitle = useMemo(
    () => `${current ? pickText(current.workTitle, locale) : copy.frameFallback} (${index + 1}/${items.length})`,
    [current, copy.frameFallback, index, items.length, locale],
  );

  if (!current) return null;

  const prev = () => setIndex((value) => (value - 1 + items.length) % items.length);
  const next = () => setIndex((value) => (value + 1) % items.length);

  return (
    <section className="spotlight-chapter">
      <header className="spotlight-heading">
        <div>
          <p className="section-kicker">{copy.kicker}</p>
          <h2 className="section-display">{copy.title}</h2>
          <p className="chapter-description">{copy.subtitle}</p>
        </div>
        <div className="spotlight-controls">
          <button type="button" onClick={prev} className="btn-secondary" aria-label={copy.prevAria}>
            {copy.prev}
          </button>
          <button type="button" onClick={next} className="btn-secondary" aria-label={copy.nextAria}>
            {copy.next}
          </button>
        </div>
      </header>

      <article className="spotlight-stage">
        <div className="spotlight-frame">
          <iframe
            key={`${current.provider}-${current.videoId}`}
            src={getEmbedUrl(current)}
            title={frameTitle}
            loading="lazy"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          />
        </div>
        <div className="spotlight-caption">
          <div>
            <h3>{pickText(current.workTitle, locale)}</h3>
            <p>{pickText(current.caption, locale)}</p>
          </div>
          <Link href={getLocalizedPath(locale, `/projects/${current.slug}/`)} className="btn-primary">
            {copy.relatedProject}
          </Link>
        </div>

        <div className="spotlight-index">
          {items.map((item, itemIndex) => (
            <button
              key={`${item.provider}-${item.videoId}`}
              type="button"
              onClick={() => setIndex(itemIndex)}
              className={`spotlight-item ${itemIndex === index ? "is-active" : ""}`}
              aria-label={`${copy.selectPrefix} ${pickText(item.title, locale)}`}
              aria-current={itemIndex === index ? "true" : undefined}
            >
              <span className="spotlight-item__image">
                <Image
                  src={item.poster}
                  alt={`${pickText(item.title, locale)} ${copy.posterAltSuffix}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 45vw, 240px"
                />
              </span>
              <span className="spotlight-item__title">{pickText(item.title, locale)}</span>
            </button>
          ))}
        </div>
      </article>
    </section>
  );
}
