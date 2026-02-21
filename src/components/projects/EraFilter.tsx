"use client";

import { useLocale } from "@/components/i18n/LocaleProvider";
import { getMessages } from "@/lib/i18n";

type EraFilterValue = "all" | "1" | "2" | "3";

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
    { value: "1", label: copy.era1 },
    { value: "2", label: copy.era2 },
    { value: "3", label: copy.era3 },
  ];

  return (
    <div className="flex flex-wrap gap-2.5">
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`inline-flex min-h-11 items-center rounded-full border px-4 py-2 text-sm transition ${
              active
                ? "border-white/25 bg-white/16 text-white"
                : "border-white/12 text-white/76 hover:bg-white/8 hover:text-white"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
