import { getCareerBars } from "@/lib/career";
import { getMessages } from "@/lib/i18n";
import type { Locale } from "@/lib/locale";
export function CareerTimeline({ locale }: { locale: Locale }) {
  const copy = getMessages(locale).home.timeline;
  const year = new Date().getUTCFullYear();
  return <section className="timeline-chapter">
    <header className="chapter-heading"><h2 className="section-display">{copy.title}</h2></header>
    <div className="career-axis num"><span>2018.10</span><span>{year}.12</span></div>
    <div className="career-bars">{getCareerBars(locale, year).map((entry) => <article key={entry.company} className="career-row">
      <div className="career-row__label"><h3>{entry.company}</h3><p>{entry.role}</p><p className="num">{entry.period}</p></div>
      <div className="career-row__track" aria-hidden="true"><span className={entry.current ? "career-bar is-current" : "career-bar"} style={{ marginLeft: `${entry.offset}%`, width: `${entry.width}%` }} /></div>
    </article>)}</div>
  </section>;
}
