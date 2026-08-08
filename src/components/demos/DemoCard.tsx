import Link from "next/link";
import { getMessages } from "@/lib/i18n";
import type { Locale } from "@/lib/locale";
import { getLocalizedPath } from "@/lib/routes";
import type { Demo } from "@/types/demo";

export function DemoCard({ demo, locale }: { demo: Demo; locale: Locale }) {
  const copy = getMessages(locale).demos;

  return (
    <article
      data-demo-card
      data-demo-slug={demo.slug}
      className="panel group flex h-full flex-col overflow-hidden p-5 transition duration-300 hover:-translate-y-1 hover:border-white/25 md:p-6"
    >
      <Link
        href={getLocalizedPath(locale, `/demos/${demo.slug}/`)}
        aria-label={`${copy.card.openDetail}: ${demo.name}`}
        className="flex h-full flex-col"
      >
        <div className="flex flex-wrap items-center gap-2">
          <span className="pill font-mono text-[10px] tracking-[0.13em] uppercase">
            {copy.kind[demo.kind]}
          </span>
          <span
            className={`pill font-mono text-[10px] tracking-[0.13em] uppercase ${
              demo.productized
                ? "border-accent/35 bg-accent/10 text-accent"
                : "text-white/62"
            }`}
          >
            {demo.productized ? copy.status.productized : copy.status.internal}
          </span>
        </div>

        <div className="mt-7 flex-1">
          <p className="font-mono text-[10px] tracking-[0.18em] text-white/42 uppercase">
            {String(demo.order).padStart(2, "0")}
          </p>
          <h3 className="mt-2 text-xl font-semibold tracking-[-0.02em] text-white/96 md:text-2xl">
            {demo.name}
          </h3>
          <p className="mt-3 text-sm leading-7 text-white/72">
            {demo.summary[locale]}
          </p>
        </div>

        <div className="mt-7 border-t border-white/10 pt-4">
          <p className="font-mono text-[10px] tracking-[0.16em] text-accent/82 uppercase">
            {copy.card.outcomeLabel}
          </p>
          <p className="mt-2 text-sm leading-6 text-white/84">
            {demo.outcome[locale]}
          </p>
          <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-white/88 transition group-hover:text-accent">
            {copy.card.openDetail}
            <span aria-hidden="true">→</span>
          </span>
        </div>
      </Link>
    </article>
  );
}
