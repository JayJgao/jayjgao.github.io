import Image from "next/image";

const diagramDimensions: Record<string, { width: number; height: number }> = {
  "/assets/diagrams/demos/boundary-deduper.svg": { width: 1400, height: 580 },
  "/assets/diagrams/demos/iro-matcher.svg": { width: 1400, height: 620 },
  "/assets/diagrams/demos/loudness-matcher.svg": { width: 1600, height: 840 },
  "/assets/diagrams/demos/prompt-enhancer-before-api.svg": { width: 1400, height: 500 },
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
  if (!dimensions) throw new Error(`Missing source dimensions for Demo diagram: ${src}`);

  return (
    <div className="demo-diagram">
      <p className="demo-diagram__hint">↔ {scrollHint}</p>
      <div role="region" aria-label={alt} tabIndex={0} className="demo-diagram__viewport">
        <Image
          src={src}
          alt={alt}
          width={dimensions.width}
          height={dimensions.height}
          unoptimized
          className="demo-diagram__image"
        />
      </div>
    </div>
  );
}
