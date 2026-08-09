"use client";

import Image from "next/image";
import { useState } from "react";
import { getYouTubeThumbnailUrl, type DemoVideoMode } from "@/lib/demos";

type DemoVideoProps = {
  demoName: string;
  embedUrl: string | null;
  mode: DemoVideoMode;
  videoId: string | null;
  labels: {
    playPrefix: string;
    titleSuffix: string;
  };
};

export function DemoVideo({ demoName, embedUrl, mode, videoId, labels }: DemoVideoProps) {
  const primaryThumbnail = videoId ? getYouTubeThumbnailUrl(videoId, "maxresdefault") : null;
  const fallbackThumbnail = videoId ? getYouTubeThumbnailUrl(videoId, "hqdefault") : null;
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

  if (loaded && embedUrl) {
    return (
      <div data-demo-video-state="loaded" className="demo-video-frame">
        <iframe
          src={embedUrl}
          title={`${demoName} ${labels.titleSuffix}`}
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <div data-demo-video-state="play" className="demo-video-frame demo-video-fallback">
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
          className="demo-video-thumbnail"
        />
      ) : (
        <div className="demo-video-placeholder" aria-hidden="true"><span>DEMO</span></div>
      )}
      <button
        type="button"
        onClick={() => setLoaded(true)}
        aria-label={`${labels.playPrefix}: ${demoName}`}
        className="demo-video-play"
      >
        <span className="demo-video-play__icon">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M8 5.5v13l10-6.5L8 5.5Z" />
          </svg>
        </span>
      </button>
    </div>
  );
}
