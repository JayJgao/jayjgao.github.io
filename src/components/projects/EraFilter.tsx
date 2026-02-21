"use client";

type EraFilterValue = "all" | "1" | "2" | "3";

const options: Array<{ value: EraFilterValue; label: string }> = [
  { value: "all", label: "All" },
  { value: "1", label: "Classical ML (2018-2022)" },
  { value: "2", label: "LLM Application (2023-2024)" },
  { value: "3", label: "Generative AI Native (2025~)" },
];

export function EraFilter({
  value,
  onChange,
}: {
  value: EraFilterValue;
  onChange: (next: EraFilterValue) => void;
}) {
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
