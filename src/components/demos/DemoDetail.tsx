import Link from "next/link";
import { DemoDiagram } from "@/components/demos/DemoDiagram";
import { DemoGallery } from "@/components/demos/DemoGallery";
import { DemoVideo } from "@/components/demos/DemoVideo";
import {
  getDemoBySlug,
  getDemoVideoMode,
  getGalleryMode,
  getYouTubeEmbedUrl,
} from "@/lib/demos";
import { getMessages } from "@/lib/i18n";
import type { Locale } from "@/lib/locale";
import { getLocalizedPath } from "@/lib/routes";
import type { Demo } from "@/types/demo";

export function DemoDetail({ demo, locale }: { demo: Demo; locale: Locale }) {
  const copy = getMessages(locale).demos;
  const detailCopy = copy.detail;
  const videoMode = getDemoVideoMode(demo);
  const galleryMode = getGalleryMode(demo.gallery);
  const embedUrl = demo.video.videoId
    ? getYouTubeEmbedUrl(demo.video.videoId)
    : null;
  const galleryItems = demo.gallery.map((item) => ({
    src: item.src,
    alt: item.alt[locale],
    caption: item.caption[locale],
    width: item.width,
    height: item.height,
  }));
  const relatedDemo = demo.relatedDemo
    ? getDemoBySlug(demo.relatedDemo)
    : undefined;

  return (
    <article className="space-y-8 md:space-y-12">
      <section
        data-demo-block="hero"
        aria-labelledby="demo-title"
        className="relative overflow-hidden rounded-[1.75rem] border border-white/14 bg-[radial-gradient(circle_at_82%_0%,rgba(74,222,128,0.14),transparent_30%),linear-gradient(145deg,rgba(255,255,255,0.08),rgba(255,255,255,0.025))] p-6 shadow-[0_28px_70px_rgba(0,0,0,0.3)] md:p-10"
      >
        <Link
          href={getLocalizedPath(locale, "/demos/")}
          className="inline-flex items-center gap-2 text-sm text-white/62 transition hover:text-accent"
        >
          <span aria-hidden="true">←</span>
          {detailCopy.backToList}
        </Link>

        <div className="mt-12 max-w-4xl md:mt-20">
          <div className="flex flex-wrap gap-2">
            <span className="pill font-mono text-[10px] tracking-[0.14em] uppercase">
              {copy.kind[demo.kind]}
            </span>
            <span
              className={`pill font-mono text-[10px] tracking-[0.14em] uppercase ${
                demo.productized
                  ? "border-accent/35 bg-accent/10 text-accent"
                  : "text-white/62"
              }`}
            >
              {demo.productized ? copy.status.productized : copy.status.internal}
            </span>
          </div>
          <p className="mt-7 font-mono text-[10px] tracking-[0.2em] text-accent/76 uppercase">
            Demo {String(demo.order).padStart(2, "0")}
          </p>
          <h1 id="demo-title" className="editorial-title mt-3 text-5xl md:text-7xl">
            {demo.name}
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-white/76 md:text-xl md:leading-9">
            {demo.summary[locale]}
          </p>

          <div className="mt-9 border-l-2 border-accent/64 pl-5 md:max-w-3xl">
            <p className="font-mono text-[10px] tracking-[0.17em] text-accent/82 uppercase">
              {detailCopy.outcomeLabel}
            </p>
            <p className="mt-2 text-base leading-7 text-white/90 md:text-lg">
              {demo.outcome[locale]}
            </p>
          </div>
        </div>
      </section>

      <section
        data-demo-block="hypothesis"
        aria-labelledby="demo-hypothesis-flow"
        className="panel p-6 md:p-9"
      >
        <p className="section-kicker">01 / Reasoning</p>
        <h2
          id="demo-hypothesis-flow"
          className="editorial-title mt-2 text-3xl md:text-5xl"
        >
          {detailCopy.flowTitle}
        </h2>
        <p className="mt-4 font-mono text-[10px] tracking-[0.12em] text-white/46 uppercase">
          {detailCopy.sections.observation}
          <span className="mx-2 text-accent" aria-hidden="true">→</span>
          {detailCopy.sections.problem}
          <span className="mx-2 text-accent" aria-hidden="true">→</span>
          {detailCopy.sections.hypothesis}
        </p>

        <ol className="mt-8 grid gap-4 lg:grid-cols-3">
          {[
            [detailCopy.sections.observation, demo.observation[locale]],
            [detailCopy.sections.problem, demo.problem[locale]],
            [detailCopy.sections.hypothesis, demo.hypothesis[locale]],
          ].map(([label, body], index) => (
            <li
              key={label}
              className="rounded-2xl border border-white/11 bg-white/[0.035] p-5"
            >
              <span className="font-mono text-[10px] tracking-[0.16em] text-accent/72">
                0{index + 1}
              </span>
              <h3 className="mt-3 text-lg font-semibold text-white/94">{label}</h3>
              <p className="mt-3 text-sm leading-7 text-white/70">{body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section
        data-demo-block="media"
        aria-labelledby="demo-highlight-media"
        className="panel p-6 md:p-9"
      >
        <p className="section-kicker">02 / Evidence</p>
        <h2
          id="demo-highlight-media"
          className="editorial-title mt-2 text-3xl md:text-5xl"
        >
          {detailCopy.sections.highlightMedia}
        </h2>

        <div className="mt-8 space-y-10">
          {videoMode !== "none" ? (
            <div role="group" aria-labelledby="demo-video-title" className="space-y-4">
              <h3 id="demo-video-title" className="text-lg font-semibold text-white/88">
                {detailCopy.sections.video}
              </h3>
              <DemoVideo
                demoName={demo.name}
                embedUrl={embedUrl}
                mode={videoMode}
                videoId={demo.video.videoId}
                labels={detailCopy.video}
              />
            </div>
          ) : null}

          {galleryMode !== "none" ? (
            <div role="group" aria-labelledby="demo-gallery-title" className="space-y-4">
              <h3 id="demo-gallery-title" className="text-lg font-semibold text-white/88">
                {detailCopy.sections.gallery}
              </h3>
              <DemoGallery items={galleryItems} labels={detailCopy.gallery} />
            </div>
          ) : null}
        </div>
      </section>

      <section
        data-demo-block="how-it-works"
        aria-labelledby="demo-how-it-works"
        className="panel p-6 md:p-9"
      >
        <p className="section-kicker">03 / System</p>
        <h2
          id="demo-how-it-works"
          className="editorial-title mt-2 text-3xl md:text-5xl"
        >
          {detailCopy.sections.howItWorks}
        </h2>
        <ol className="mt-8 space-y-3">
          {demo.howItWorks.map((step, index) => (
            <li
              key={`${demo.slug}-step-${index}`}
              className="grid gap-3 rounded-2xl border border-white/11 bg-white/[0.03] p-4 sm:grid-cols-[3rem_1fr] sm:items-start md:p-5"
            >
              <span className="font-mono text-xs tracking-[0.14em] text-accent/72">
                {String(index + 1).padStart(2, "0")}
              </span>
              <p className="text-sm leading-7 text-white/78 md:text-base">
                {step[locale]}
              </p>
            </li>
          ))}
        </ol>

        <div className="mt-12 border-t border-white/12 pt-8">
          <h3 className="editorial-title text-2xl md:text-4xl">
            {detailCopy.sections.pipeline}
          </h3>
          <div className="mt-5">
            <DemoDiagram
              src={demo.diagram}
              alt={`${demo.name} ${detailCopy.sections.pipeline}`}
              scrollHint={detailCopy.diagramScrollHint}
            />
          </div>
        </div>
      </section>

      <section
        data-demo-block="stack"
        aria-labelledby="demo-stack"
        className="panel p-6 md:p-9"
      >
        <p className="section-kicker">04 / Stack</p>
        <h2 id="demo-stack" className="editorial-title mt-2 text-3xl md:text-5xl">
          {detailCopy.sections.stack}
        </h2>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {demo.stack.map((group) => (
            <div
              key={group.label[locale]}
              className="rounded-2xl border border-white/11 bg-white/[0.035] p-5"
            >
              <h3 className="font-mono text-xs tracking-[0.14em] text-accent/78 uppercase">
                {group.label[locale]}
              </h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <li key={item[locale]} className="pill text-xs text-white/74">
                    {item[locale]}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section
        data-demo-block="boundary"
        aria-labelledby="demo-boundary"
        className="panel p-6 md:p-9"
      >
        <p className="section-kicker">05 / Boundary</p>
        <h2 id="demo-boundary" className="editorial-title mt-2 text-3xl md:text-5xl">
          {detailCopy.sections.boundary}
        </h2>
        <p className="mt-6 max-w-3xl text-base leading-8 text-white/76 md:text-lg">
          {demo.boundary[locale]}
        </p>

        {relatedDemo ? (
          <Link
            href={getLocalizedPath(locale, `/demos/${relatedDemo.slug}/`)}
            className="btn-secondary mt-8 gap-2"
          >
            {detailCopy.relatedDemo}: {relatedDemo.name}
            <span aria-hidden="true">→</span>
          </Link>
        ) : null}
      </section>
    </article>
  );
}
