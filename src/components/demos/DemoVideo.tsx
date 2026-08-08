"use client";

import Image from "next/image";
import { useState } from "react";
import {
  getYouTubeThumbnailUrl,
  type DemoVideoMode,
} from "@/lib/demos";

type DemoVideoProps = {
  demoName: string;
  embedUrl: string | null;
  mode: DemoVideoMode;
  videoId: string | null;
  labels: {
    playPrefix: string;
    pending: string;
    titleSuffix: string;
  };
};

export function DemoVideo({
  demoName,
  embedUrl,
  mode,
  videoId,
  labels,
}: DemoVideoProps) {
  const primaryThumbnail = videoId
    ? getYouTubeThumbnailUrl(videoId, "maxresdefault")
    : null;
  const fallbackThumbnail = videoId
    ? getYouTubeThumbnailUrl(videoId, "hqdefault")
    : null;
  const [loaded, setLoaded] = useState(false);
  const [thumbnailSrc, setThumbnailSrc] = useState(primaryThumbnail);

  function handleThumbnailError() {
    if (thumbnailSrc === primaryThumbnail) {
      setThumbnailSrc(fallbackThumbnail);
      return;
    }

    setThumbnailSrc(null);
  }

  if (mode === "none") return null;

  if (mode === "pending") {
    return (
      <div
        data-demo-video-state="pending"
        role="status"
        className="flex aspect-video items-center justify-center rounded-2xl border border-dashed border-white/20 bg-white/[0.035] p-8 text-center"
      >
        <div>
          <span className="mx-auto block h-2 w-2 rounded-full bg-accent shadow-[0_0_18px_rgba(74,222,128,0.7)]" />
          <p className="mt-4 text-sm font-medium text-white/72">{labels.pending}</p>
        </div>
      </div>
    );
  }

  if (loaded && embedUrl) {
    return (
      <div
        data-demo-video-state="loaded"
        className="aspect-video overflow-hidden rounded-2xl border border-white/14 bg-black shadow-[0_20px_55px_rgba(0,0,0,0.36)]"
      >
        <iframe
          src={embedUrl}
          title={`${demoName} ${labels.titleSuffix}`}
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          className="h-full w-full"
        />
      </div>
    );
  }

  return (
    <div
      data-demo-video-state="play"
      className="relative aspect-video overflow-hidden rounded-2xl border border-white/14 bg-[radial-gradient(circle_at_50%_10%,rgba(74,222,128,0.14),transparent_38%),linear-gradient(145deg,#101a2c,#070c17)] shadow-[0_20px_55px_rgba(0,0,0,0.32)]"
    >
      {thumbnailSrc ? (
        <Image
          src={thumbnailSrc}
          alt=""
          fill
          unoptimized
          loading="lazy"
          referrerPolicy="no-referrer"
          sizes="(max-width: 1120px) 100vw, 1088px"
          onError={handleThumbnailError}
          className="object-cover opacity-80"
        />
      ) : (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:42px_42px]"
        />
      )}
      <button
        type="button"
        onClick={() => setLoaded(true)}
        aria-label={`${labels.playPrefix}: ${demoName}`}
        className="group absolute inset-0 flex items-center justify-center bg-black/10 transition hover:bg-black/0"
      >
        <span className="flex h-16 w-16 items-center justify-center rounded-full border border-white/28 bg-black/52 text-white shadow-[0_12px_35px_rgba(0,0,0,0.42)] backdrop-blur transition group-hover:scale-105 group-hover:border-accent/55 group-hover:text-accent md:h-20 md:w-20">
          <svg viewBox="0 0 24 24" aria-hidden="true" className="ml-1 h-7 w-7 fill-current">
            <path d="M8 5.5v13l10-6.5L8 5.5Z" />
          </svg>
        </span>
      </button>
    </div>
  );
}
