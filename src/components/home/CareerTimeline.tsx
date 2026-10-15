import { getCareerBars, getCareerTicks } from "@/lib/career";
import { getMessages } from "@/lib/i18n";
import type { Locale } from "@/lib/locale";

export function CareerTimeline({ locale }: { locale: Locale }) {
  const copy = getMessages(locale).home.timeline;
  const year = new Date().getUTCFullYear();
  const entries = getCareerBars(locale, year);
  return (
    <section className="timeline-chapter">
      <header className="chapter-heading career-heading">
        <h2 className="section-display">{copy.title}</h2>
        <p>{copy.summary.replace("{count}", String(entries.length))}</p>
      </header>
      <div className="career-bars">
        {entries.map((entry) => {
          const periodBefore = entry.offset > 50;
          return (
            <article key={entry.company} className="career-row">
              <div className="career-row__label"><h3>{entry.company}</h3><p>{entry.role}</p></div>
              <div className="career-row__track">
                <span aria-hidden="true" className={entry.current ? "career-bar is-current" : "career-bar"} style={{ marginLeft: `${entry.offset}%`, width: `${entry.width}%` }} />
                <span className={`career-period num${periodBefore ? " career-period--before" : ""}`} style={{ left: `${periodBefore ? entry.offset : entry.offset + entry.width}%` }}>{entry.period}</span>
              </div>
            </article>
          );
        })}
      </div>
      <div className="career-axis num" aria-hidden="true">
        {getCareerTicks(year).map((tick) => <span key={tick.year} className={tick.year % 2 === 0 ? "career-tick career-tick--minor" : "career-tick"} style={{ left: `${tick.offset}%` }}>{tick.year}</span>)}
      </div>
    </section>
  );
}
