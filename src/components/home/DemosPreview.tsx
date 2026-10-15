import Link from "next/link";
import { getAllDemos, getProductizedDemos } from "@/lib/demos";
import { getMessages } from "@/lib/i18n";
import type { Locale } from "@/lib/locale";
import { getLocalizedPath } from "@/lib/routes";
export function DemosPreview({ locale }: { locale: Locale }) {
  const messages = getMessages(locale);
  const copy = messages.demos;
  const homeCopy = messages.home.demos;
  const demos = getProductizedDemos();
  const counts = homeCopy.counts.replace("{productized}", String(demos.length)).replace("{internal}", String(getAllDemos().length - demos.length));
  return <section className="demo-preview-chapter" aria-labelledby="home-demos-title">
    <div className="chapter-inner">
      <header className="chapter-heading"><h2 id="home-demos-title" className="section-display">{copy.page.title}</h2><p>{counts}</p><Link href={getLocalizedPath(locale, "/demos/")} className="btn-secondary">{homeCopy.viewAll} ↗</Link></header>
      <div className="demo-preview-rows">{demos.map((demo) => <Link key={demo.slug} href={getLocalizedPath(locale, `/demos/${demo.slug}/`)} className="demo-preview-row">
        <h3>{demo.name}</h3><p>{demo.summary[locale]}</p><span className="tag">{demo.productStatus === "partial" ? copy.status.partial : copy.status.productized}</span>
      </Link>)}</div>
    </div>
  </section>;
}
