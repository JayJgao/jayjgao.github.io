import Link from "next/link";
import { getMessages } from "@/lib/i18n";
import type { Locale } from "@/lib/locale";
import { getLocalizedPath } from "@/lib/routes";
import type { Demo } from "@/types/demo";

export function DemoCard({
  demo,
  locale,
  variant = "default",
}: {
  demo: Demo;
  locale: Locale;
  variant?: "default" | "compact";
}) {
  const copy = getMessages(locale).demos;
  const isCompact = variant === "compact";

  return (
    <article
      data-demo-card
      data-demo-slug={demo.slug}
      className={`demo-card ${isCompact ? "demo-card--compact" : "demo-card--default"}`}
    >
      <Link
        href={getLocalizedPath(locale, `/demos/${demo.slug}/`)}
        aria-label={`${copy.card.openDetail}: ${demo.name}`}
        className="demo-card__link"
      >
        <header className="demo-card__meta">
          <span>{String(demo.order).padStart(2, "0")}</span>
          <span>{copy.kind[demo.kind]}</span>
          <span>{demo.productized ? copy.status.productized : copy.status.internal}</span>
        </header>

        <div className="demo-card__copy">
          <h3>{demo.name}</h3>
          <p>{demo.summary[locale]}</p>
        </div>

        {!isCompact ? (
          <div className="demo-card__outcome">
            <p>{copy.card.outcomeLabel}</p>
            <span>{demo.outcome[locale]}</span>
          </div>
        ) : null}

        <span className="demo-card__action">
          {copy.card.openDetail}<span aria-hidden="true">→</span>
        </span>
      </Link>
    </article>
  );
}
