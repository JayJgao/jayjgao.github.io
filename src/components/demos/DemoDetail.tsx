import Link from "next/link";
import { DemoDiagram } from "@/components/demos/DemoDiagram";
import { DemoGallery } from "@/components/demos/DemoGallery";
import { DemoVideo } from "@/components/demos/DemoVideo";
import {
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
  const embedUrl = demo.video.videoId ? getYouTubeEmbedUrl(demo.video.videoId) : null;
  const galleryItems = demo.gallery.map((item) => ({
    src: item.src,
    alt: item.alt[locale],
    caption: item.caption[locale],
    width: item.width,
    height: item.height,
  }));

  return (
    <article className="demo-detail">
      <section
        data-demo-block="hero"
        aria-labelledby="demo-title"
        className="demo-block demo-block--orange demo-detail-hero"
      >
        <div className="chapter-inner">
          <Link href={getLocalizedPath(locale, "/demos/")} className="demo-back-link">
            <span aria-hidden="true">←</span>{detailCopy.backToList}
          </Link>
          <div className="demo-detail-hero__copy">
            <div className="tag-list">
              <span className="pill">{copy.kind[demo.kind]}</span>
              <span className="pill">{demo.productized ? copy.status.productized : copy.status.internal}</span>
            </div>
            <p className="section-index">Demo {String(demo.order).padStart(2, "0")}</p>
            <h1 id="demo-title" className="page-display">{demo.name}</h1>
            <p className="demo-detail-summary">{demo.summary[locale]}</p>
            <div className="demo-outcome">
              <p>{detailCopy.outcomeLabel}</p>
              <span>{demo.outcome[locale]}</span>
            </div>
          </div>
        </div>
      </section>

      <section
        data-demo-block="hypothesis"
        aria-labelledby="demo-hypothesis-flow"
        className="demo-block"
      >
        <div className="chapter-inner">
          <p className="section-kicker">01 / Reasoning</p>
          <h2 id="demo-hypothesis-flow" className="section-display">{detailCopy.flowTitle}</h2>
          <ol className="reasoning-ledger">
            {[
              [detailCopy.sections.observation, demo.observation[locale]],
              [detailCopy.sections.problem, demo.problem[locale]],
              [detailCopy.sections.hypothesis, demo.hypothesis[locale]],
            ].map(([label, body], index) => (
              <li key={label}>
                <span>0{index + 1}</span>
                <h3>{label}</h3>
                <p>{body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section
        data-demo-block="media"
        aria-labelledby="demo-highlight-media"
        className="demo-block demo-block--orange"
      >
        <div className="chapter-inner">
          <p className="section-kicker">02 / Evidence</p>
          <h2 id="demo-highlight-media" className="section-display">{detailCopy.sections.highlightMedia}</h2>
          <div className="demo-media-stack">
            {videoMode !== "none" ? (
              <div role="group" aria-labelledby="demo-video-title" className="demo-media-group">
                <h3 id="demo-video-title">{detailCopy.sections.video}</h3>
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
              <div role="group" aria-labelledby="demo-gallery-title" className="demo-media-group">
                <h3 id="demo-gallery-title">{detailCopy.sections.gallery}</h3>
                <DemoGallery items={galleryItems} labels={detailCopy.gallery} />
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section
        data-demo-block="how-it-works"
        aria-labelledby="demo-how-it-works"
        className="demo-block"
      >
        <div className="chapter-inner">
          <p className="section-kicker">03 / System</p>
          <h2 id="demo-how-it-works" className="section-display">{detailCopy.sections.howItWorks}</h2>
          <ol className="how-it-works-list">
            {demo.howItWorks.map((step, index) => (
              <li key={`${demo.slug}-step-${index}`}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <p>{step[locale]}</p>
              </li>
            ))}
          </ol>
          {demo.prelude ? (
            <div className="pipeline-section demo-prelude">
              <h3 className="section-display">{demo.prelude.title[locale]}</h3>
              {demo.prelude.paragraphs.map((paragraph, index) => (
                <p
                  key={`${demo.slug}-prelude-${index}`}
                  className="boundary-copy demo-prelude__copy"
                >
                  {paragraph[locale]}
                </p>
              ))}
              <DemoDiagram
                src={demo.prelude.diagram}
                alt={`${demo.name} ${demo.prelude.title[locale]}`}
                scrollHint={detailCopy.diagramScrollHint}
              />
            </div>
          ) : null}
          <div className="pipeline-section">
            <h3 className="section-display">{detailCopy.sections.pipeline}</h3>
            <DemoDiagram
              src={demo.diagram}
              alt={`${demo.name} ${detailCopy.sections.pipeline}`}
              scrollHint={detailCopy.diagramScrollHint}
            />
          </div>
        </div>
      </section>

      <section data-demo-block="stack" aria-labelledby="demo-stack" className="demo-block">
        <div className="chapter-inner">
          <p className="section-kicker">04 / Stack</p>
          <h2 id="demo-stack" className="section-display">{detailCopy.sections.stack}</h2>
          <dl className="stack-definitions">
            {demo.stack.map((group) => (
              <div key={group.label[locale]}>
                <dt>{group.label[locale]}</dt>
                <dd>
                  <ul className="tag-list">
                    {group.items.map((item) => (
                      <li key={item[locale]} className="pill">{item[locale]}</li>
                    ))}
                  </ul>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section data-demo-block="boundary" aria-labelledby="demo-boundary" className="demo-block">
        <div className="chapter-inner">
          <p className="section-kicker">05 / Boundary</p>
          <h2 id="demo-boundary" className="section-display">{detailCopy.sections.boundary}</h2>
          <p className="boundary-copy">{demo.boundary[locale]}</p>
        </div>
      </section>
    </article>
  );
}
