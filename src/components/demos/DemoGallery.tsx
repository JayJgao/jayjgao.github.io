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
    <figure className="demo-gallery-figure">
      <div className="demo-gallery-figure__media">
        <Image
          src={item.src}
          alt={item.alt}
          width={item.width}
          height={item.height}
          sizes="(max-width: 1120px) 100vw, 1088px"
        />
      </div>
      <figcaption>{item.caption}</figcaption>
    </figure>
  );
}

export function DemoGallery({ items, labels }: DemoGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  if (items.length === 0) return null;

  if (items.length === 1) {
    return <div data-demo-gallery-mode="static"><GalleryFigure item={items[0]} /></div>;
  }

  const showPrevious = () => setActiveIndex((current) => (current - 1 + items.length) % items.length);
  const showNext = () => setActiveIndex((current) => (current + 1) % items.length);

  return (
    <div data-demo-gallery-mode="slider" className="demo-gallery-slider">
      <GalleryFigure item={items[activeIndex]} />
      <div className="demo-gallery-controls">
        <button
          type="button"
          data-demo-gallery-control="previous"
          onClick={showPrevious}
          aria-label={labels.previous}
          className="btn-secondary"
        >
          <span aria-hidden="true">←</span>
        </button>
        <span
          data-demo-gallery-control="counter"
          aria-live="polite"
          aria-atomic="true"
          className="demo-gallery-counter"
        >
          <span className="sr-only">{labels.counterLabel}: </span>
          {String(activeIndex + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
        </span>
        <button
          type="button"
          data-demo-gallery-control="next"
          onClick={showNext}
          aria-label={labels.next}
          className="btn-secondary"
        >
          <span aria-hidden="true">→</span>
        </button>
      </div>
      <div role="group" className="demo-gallery-thumbnails" aria-label={labels.selectPrefix}>
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
              className={`demo-gallery-thumbnail ${selected ? "is-active" : ""}`}
            >
              <Image
                src={item.src}
                alt=""
                width={item.width}
                height={item.height}
                sizes="(max-width: 768px) 50vw, 360px"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
