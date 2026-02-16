"use client";

type EraFilterValue = "all" | "1" | "2" | "3";

const options: Array<{ value: EraFilterValue; label: string }> = [
  { value: "all", label: "All" },
  { value: "1", label: "Before LLM" },
  { value: "2", label: "After LLM" },
  { value: "3", label: "Generative AI Era" },
];

export function EraFilter({
  value,
  onChange,
}: {
  value: EraFilterValue;
  onChange: (next: EraFilterValue) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`rounded-full px-4 py-2 text-sm transition ${
              active
                ? "bg-white/15 text-white"
                : "border border-white/10 text-muted hover:bg-white/8 hover:text-white"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
