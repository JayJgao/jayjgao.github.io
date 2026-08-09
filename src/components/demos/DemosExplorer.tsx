import { DemoCard } from "@/components/demos/DemoCard";
import { getDemoGroups } from "@/lib/demos";
import { getMessages } from "@/lib/i18n";
import type { Locale } from "@/lib/locale";

export function DemosExplorer({ locale }: { locale: Locale }) {
  const copy = getMessages(locale).demos;
  const groups = getDemoGroups();

  return (
    <div className="demo-index">
      <header className="demo-list-hero">
        <div className="chapter-inner">
          <p className="section-kicker">{copy.page.kicker}</p>
          <h1 className="page-display">{copy.page.title}</h1>
          <p className="chapter-description">{copy.page.description}</p>
        </div>
      </header>

      <div className="demo-index__body">
        {groups.map((group, groupIndex) => {
          const groupCopy = copy.groups[group.id];
          return (
            <section
              key={group.id}
              data-demo-list-group={group.id}
              aria-labelledby={`demo-group-${group.id}`}
              className={`demo-group demo-group--${group.id}`}
            >
              <header className="demo-group__heading">
                <div>
                  <p className="section-index">0{groupIndex + 1} / 02</p>
                  <h2 id={`demo-group-${group.id}`} className="section-display">{groupCopy.title}</h2>
                  <p>{groupCopy.description}</p>
                </div>
                <span className="pill">{String(group.demos.length).padStart(2, "0")} Demos</span>
              </header>

              <div className="demo-list-grid">
                {group.demos.map((demo) => (
                  <DemoCard key={demo.slug} demo={demo} locale={locale} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
