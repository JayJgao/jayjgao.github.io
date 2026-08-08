import { DemoCard } from "@/components/demos/DemoCard";
import { getDemoGroups } from "@/lib/demos";
import { getMessages } from "@/lib/i18n";
import type { Locale } from "@/lib/locale";

export function DemosExplorer({ locale }: { locale: Locale }) {
  const copy = getMessages(locale).demos;
  const groups = getDemoGroups();

  return (
    <div className="space-y-14 md:space-y-20">
      <header className="max-w-4xl space-y-4">
        <p className="section-kicker">{copy.page.kicker}</p>
        <h1 className="editorial-title text-5xl md:text-7xl">{copy.page.title}</h1>
        <p className="max-w-2xl text-base leading-8 text-white/72 md:text-lg">
          {copy.page.description}
        </p>
      </header>

      {groups.map((group, groupIndex) => {
        const groupCopy = copy.groups[group.id];

        return (
          <section
            key={group.id}
            data-demo-list-group={group.id}
            aria-labelledby={`demo-group-${group.id}`}
            className="space-y-6"
          >
            <div className="flex flex-col gap-4 border-t border-white/14 pt-6 md:flex-row md:items-end md:justify-between">
              <div className="max-w-2xl">
                <p className="font-mono text-[10px] tracking-[0.2em] text-accent/75 uppercase">
                  0{groupIndex + 1} / 02
                </p>
                <h2
                  id={`demo-group-${group.id}`}
                  className="editorial-title mt-2 text-3xl md:text-5xl"
                >
                  {groupCopy.title}
                </h2>
                <p className="mt-2 text-sm leading-7 text-white/66 md:text-base">
                  {groupCopy.description}
                </p>
              </div>
              <span className="pill w-fit font-mono text-[10px] tracking-[0.14em] text-white/64 uppercase">
                {String(group.demos.length).padStart(2, "0")} Demos
              </span>
            </div>

            <div className="grid gap-4 md:grid-cols-2 md:gap-5">
              {group.demos.map((demo) => (
                <DemoCard key={demo.slug} demo={demo} locale={locale} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
