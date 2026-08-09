"use client";

import { useLocale } from "@/components/i18n/LocaleProvider";
import { getAllEras, getEraLabel, type EraFilterValue } from "@/lib/eras";
import { getMessages } from "@/lib/i18n";

export function EraFilter({
  value,
  onChange,
}: {
  value: EraFilterValue;
  onChange: (next: EraFilterValue) => void;
}) {
  const { locale } = useLocale();
  const copy = getMessages(locale).projects.filter;
  const options: Array<{ value: EraFilterValue; label: string }> = [
    { value: "all", label: copy.all },
    ...getAllEras().map((era) => ({
      value: `${era.id}` as EraFilterValue,
      label: getEraLabel(era.id, locale),
    })),
  ];

  return (
    <div className="era-filter" aria-label={copy.all}>
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            aria-pressed={active}
            className={`era-filter__button ${active ? "is-active" : ""}`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
