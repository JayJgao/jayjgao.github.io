"use client";

import Image from "next/image";
import { useState } from "react";

export type DemoGalleryDisplayItem = {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
};

type DemoGalleryProps = {
  items: DemoGalleryDisplayItem[];
  labels: {
    previous: string;
    next: string;
    selectPrefix: string;
    counterLabel: string;
  };
};

function GalleryFigure({ item }: { item: DemoGalleryDisplayItem }) {
  return (
    <figure>
      <div className="overflow-hidden rounded-2xl border border-white/14 bg-black/24">
        <Image
          src={item.src}
          alt={item.alt}
          width={item.width}
          height={item.height}
          sizes="(max-width: 1120px) 100vw, 1088px"
          className="h-auto w-full object-contain"
        />
      </div>
      <figcaption className="mt-3 text-sm leading-6 text-white/62">
        {item.caption}
      </figcaption>
    </figure>
  );
}

export function DemoGallery({ items, labels }: DemoGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (items.length === 0) return null;

  if (items.length === 1) {
    return (
      <div data-demo-gallery-mode="static">
        <GalleryFigure item={items[0]} />
      </div>
    );
  }

  const showPrevious = () => {
    setActiveIndex((current) => (current - 1 + items.length) % items.length);
  };

  const showNext = () => {
    setActiveIndex((current) => (current + 1) % items.length);
  };

  return (
    <div data-demo-gallery-mode="slider" className="space-y-4">
      <GalleryFigure item={items[activeIndex]} />

      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          data-demo-gallery-control="previous"
          onClick={showPrevious}
          aria-label={labels.previous}
          className="btn-secondary min-w-11 px-4"
        >
          <span aria-hidden="true">←</span>
        </button>
        <span
          data-demo-gallery-control="counter"
          aria-live="polite"
          aria-atomic="true"
          className="font-mono text-xs tracking-[0.14em] text-white/68"
        >
          <span className="sr-only">{labels.counterLabel}: </span>
          {String(activeIndex + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
        </span>
        <button
          type="button"
          data-demo-gallery-control="next"
          onClick={showNext}
          aria-label={labels.next}
          className="btn-secondary min-w-11 px-4"
        >
          <span aria-hidden="true">→</span>
        </button>
      </div>

      <div
        role="group"
        className="grid grid-cols-2 gap-3"
        aria-label={labels.selectPrefix}
      >
        {items.map((item, index) => {
          const selected = index === activeIndex;

          return (
            <button
              key={item.src}
              type="button"
              data-demo-gallery-control="thumbnail"
              onClick={() => setActiveIndex(index)}
              aria-label={`${labels.selectPrefix} ${index + 1}: ${item.alt}`}
              aria-current={selected ? "true" : undefined}
              className={`overflow-hidden rounded-xl border bg-black/24 p-1.5 transition ${
                selected
                  ? "border-accent/72 shadow-[0_0_0_1px_rgba(74,222,128,0.2)]"
                  : "border-white/12 opacity-62 hover:border-white/28 hover:opacity-100"
              }`}
            >
              <Image
                src={item.src}
                alt=""
                width={item.width}
                height={item.height}
                sizes="(max-width: 768px) 50vw, 360px"
                className="h-20 w-full object-contain md:h-28"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
