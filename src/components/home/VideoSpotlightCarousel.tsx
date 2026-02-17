"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import spotlights from "@/data/home-spotlights.json";

type Spotlight = {
  slug: string;
  provider: "youtube" | "vimeo";
  videoId: string;
  title: string;
  workTitle: string;
  caption: string;
  poster: string;
};

function getEmbedUrl(item: Spotlight) {
  if (item.provider === "youtube") {
    return `https://www.youtube.com/embed/${item.videoId}?rel=0&modestbranding=1`;
  }
  return `https://player.vimeo.com/video/${item.videoId}`;
}

export function VideoSpotlightCarousel() {
  const items = spotlights as Spotlight[];
  const [index, setIndex] = useState(0);
  const current = items[index] ?? items[0];

  const frameTitle = useMemo(
    () => `${current?.workTitle ?? "Spotlight"} (${index + 1}/${items.length})`,
    [current?.workTitle, index, items.length],
  );

  if (!current) return null;

  const prev = () => setIndex((value) => (value - 1 + items.length) % items.length);
  const next = () => setIndex((value) => (value + 1) % items.length);

  return (
    <section className="space-y-4 md:space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs tracking-[0.18em] text-accent uppercase">Creative Spotlight</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight md:text-4xl">Watch First</h2>
          <p className="mt-1.5 text-xs text-muted md:mt-2 md:text-sm">
            AI Filmmaking Showcase.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button type="button" onClick={prev} className="btn-secondary px-3 py-1.5 text-xs md:py-2" aria-label="Previous spotlight">
            Prev
          </button>
          <button type="button" onClick={next} className="btn-secondary px-3 py-1.5 text-xs md:py-2" aria-label="Next spotlight">
            Next
          </button>
        </div>
      </div>

      <article className="panel overflow-hidden p-3.5 md:p-6">
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
            <h3 className="text-base font-medium text-white/95 md:text-lg">{current.workTitle}</h3>
            <p className="mt-1 text-xs text-muted md:text-sm">{current.caption}</p>
          </div>
          <Link href={`/projects/${current.slug}`} className="btn-primary text-xs md:text-sm">
            관련 프로젝트 보기
          </Link>
        </div>

        <div className="mt-3.5 grid grid-cols-2 gap-2.5 md:mt-4 md:gap-3 lg:grid-cols-4">
          {items.map((item, itemIndex) => (
            <button
              key={`${item.provider}-${item.videoId}`}
              type="button"
              onClick={() => setIndex(itemIndex)}
              className={`spotlight-item rounded-xl border text-left ${
                itemIndex === index ? "border-accent/60 bg-accent/10" : "border-white/12 bg-white/5"
              }`}
              aria-label={`Select ${item.title}`}
            >
              <div className="relative h-16 w-full overflow-hidden rounded-t-xl md:h-20">
                <Image
                  src={item.poster}
                  alt={`${item.title} poster`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
              </div>
              <div className="p-2.5 md:p-3">
                <p className="line-clamp-2 text-xs font-medium text-white/90 md:text-sm whitespace-pre-line">{item.title}</p>
              </div>
            </button>
          ))}
        </div>
      </article>
    </section>
  );
}
