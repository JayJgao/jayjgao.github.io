import Image from "next/image";

const diagramDimensions: Record<string, { width: number; height: number }> = {
  "/assets/diagrams/demos/boundary-deduper.svg": { width: 1400, height: 580 },
  "/assets/diagrams/demos/iro-matcher.svg": { width: 1400, height: 620 },
  "/assets/diagrams/demos/loudness-matcher.svg": { width: 1600, height: 840 },
  "/assets/diagrams/demos/prompt-enhance-skills.svg": { width: 1400, height: 410 },
  "/assets/diagrams/demos/prompt-enhancer.svg": { width: 1500, height: 840 },
  "/assets/diagrams/demos/reframer.svg": { width: 1400, height: 540 },
  "/assets/diagrams/demos/reverse-storyboard.svg": { width: 1400, height: 580 },
  "/assets/diagrams/demos/script-to-bgm.svg": { width: 1520, height: 620 },
  "/assets/diagrams/demos/voice-adaptor.svg": { width: 1600, height: 660 },
};

export function DemoDiagram({
  src,
  alt,
  scrollHint,
}: {
  src: string;
  alt: string;
  scrollHint: string;
}) {
  const dimensions = diagramDimensions[src];

  if (!dimensions) {
    throw new Error(`Missing source dimensions for Demo diagram: ${src}`);
  }

  return (
    <div className="space-y-2">
      <p className="text-xs text-white/52 md:hidden">↔ {scrollHint}</p>
      <div
        role="region"
        aria-label={alt}
        tabIndex={0}
        className="overflow-x-auto rounded-2xl border border-white/14 bg-white/[0.035] p-3 shadow-[inset_-18px_0_24px_-24px_rgba(255,255,255,0.5)] md:p-5"
      >
        <Image
          src={src}
          alt={alt}
          width={dimensions.width}
          height={dimensions.height}
          unoptimized
          className="h-auto min-w-[48rem] w-full max-w-none md:min-w-0"
        />
      </div>
    </div>
  );
}
