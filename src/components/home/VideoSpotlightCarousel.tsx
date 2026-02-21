"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLocale } from "@/components/i18n/LocaleProvider";
import spotlights from "@/data/home-spotlights.json";
import { getMessages } from "@/lib/i18n";
import type { Locale } from "@/lib/locale";

function pickText(value: Record<Locale, string>, locale: Locale) {
  return value[locale] ?? value.ko;
}

type Spotlight = {
  slug: string;
  provider: "youtube" | "vimeo";
  videoId: string;
  title: Record<Locale, string>;
  workTitle: Record<Locale, string>;
  caption: Record<Locale, string>;
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
  const messages = getMessages(locale);
  const copy = messages.home.spotlight;
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
    <section className="space-y-4 md:space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <p className="section-kicker">{copy.kicker}</p>
          <h2 className="editorial-title text-3xl md:text-5xl">{copy.title}</h2>
          <p className="text-sm text-white/70 md:text-base">
            {copy.subtitle}
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button type="button" onClick={prev} className="btn-secondary px-3 text-xs md:text-sm" aria-label={copy.prevAria}>
            {copy.prev}
          </button>
          <button type="button" onClick={next} className="btn-secondary px-3 text-xs md:text-sm" aria-label={copy.nextAria}>
            {copy.next}
          </button>
        </div>
      </div>

      <article className="panel overflow-hidden p-3 md:p-6">
        <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-white/10 bg-black">
          <iframe
            key={`${current.provider}-${current.videoId}`}
            src={getEmbedUrl(current)}
            title={frameTitle}
            className="absolute inset-0 h-full w-full"
            loading="lazy"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          />
        </div>
        <div className="mt-3.5 flex flex-wrap items-center justify-between gap-3 md:mt-4">
          <div>
            <h3 className="text-base font-medium text-white/95 md:text-lg">{pickText(current.workTitle, locale)}</h3>
            <p className="mt-1 text-sm text-white/72">{pickText(current.caption, locale)}</p>
          </div>
          <Link href={`/projects/${current.slug}`} className="btn-primary text-xs md:text-sm">
            {copy.relatedProject}
          </Link>
        </div>

        <div className="mt-4 flex gap-2.5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:gap-3">
          {items.map((item, itemIndex) => (
            <button
              key={`${item.provider}-${item.videoId}`}
              type="button"
              onClick={() => setIndex(itemIndex)}
              className={`spotlight-item w-[162px] shrink-0 rounded-xl border text-left md:w-[190px] ${
                itemIndex === index ? "border-accent/60 bg-accent/10" : "border-white/12 bg-white/5"
              }`}
              aria-label={`${copy.selectPrefix} ${pickText(item.title, locale)}`}
            >
              <div className="relative h-16 w-full overflow-hidden rounded-t-xl md:h-20">
                <Image
                  src={item.poster}
                  alt={`${pickText(item.title, locale)} ${copy.posterAltSuffix}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 45vw, 240px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
              </div>
              <div className="p-2.5 md:p-3">
                <p className="line-clamp-2 text-xs font-medium leading-snug text-white/90 md:text-sm whitespace-pre-line">
                  {pickText(item.title, locale)}
                </p>
              </div>
            </button>
          ))}
        </div>
      </article>
    </section>
  );
}
