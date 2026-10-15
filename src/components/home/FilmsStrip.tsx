import { FILMS_URL } from "@/lib/films";
import { getMessages } from "@/lib/i18n";
import type { Locale } from "@/lib/locale";
export function FilmsStrip({ locale }: { locale: Locale }) {
  const copy = getMessages(locale).home.films;
  return <section className="films-strip"><div><h2>{copy.title}</h2><p>{copy.description}</p></div><a className="btn-primary" href={`${FILMS_URL}/?lang=${locale}`}>{copy.viewAll}</a></section>;
}
