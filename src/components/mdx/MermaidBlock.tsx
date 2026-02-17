"use client";

import Image from "next/image";
import { useEffect, useId, useMemo, useState } from "react";

type MermaidBlockProps = {
  chart: string;
  fallbackSrc?: string;
  fallbackAlt?: string;
};

export function MermaidBlock({ chart, fallbackSrc, fallbackAlt }: MermaidBlockProps) {
  const reactId = useId();
  const renderId = useMemo(
    () => `mermaid-${reactId.replace(/[^a-zA-Z0-9_-]/g, "")}`,
    [reactId],
  );
  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    let cancelled = false;

    async function renderChart() {
      try {
        const mermaid = (await import("mermaid")).default;
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "loose",
          theme: "dark",
          themeVariables: {
            primaryColor: "#0d121f",
            primaryTextColor: "#e6e8ee",
            lineColor: "#8aa0c5",
            secondaryColor: "#111a2b",
            tertiaryColor: "#0b1020",
            noteBkgColor: "#111a2b",
            noteTextColor: "#e6e8ee",
          },
        });

        const { svg: renderedSvg } = await mermaid.render(renderId, chart);
        if (!cancelled) {
          setSvg(renderedSvg);
          setError("");
        }
      } catch (err) {
        if (!cancelled) {
          setSvg("");
          setError(err instanceof Error ? err.message : "Mermaid rendering failed.");
        }
      }
    }

    void renderChart();
    return () => {
      cancelled = true;
    };
  }, [chart, renderId]);

  if (svg) {
    return (
      <figure className="mermaid-block">
        <div
          className="mermaid-svg"
          dangerouslySetInnerHTML={{ __html: svg }}
          aria-label="Mermaid diagram"
        />
      </figure>
    );
  }

  if (error && fallbackSrc) {
    return (
      <figure className="mermaid-block">
        <Image
          src={fallbackSrc}
          alt={fallbackAlt ?? "Diagram fallback image"}
          width={1600}
          height={900}
          className="w-full rounded-xl border border-white/15"
        />
      </figure>
    );
  }

  return (
    <figure className="mermaid-block">
      <pre className="mermaid-source">
        <code>{chart}</code>
      </pre>
      {error ? <p className="mermaid-error">{error}</p> : null}
    </figure>
  );
}
