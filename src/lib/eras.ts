import erasJson from "@/data/eras.json";
import type { Locale } from "@/lib/locale";
import type { Era, EraId } from "@/types/content";

const eras = erasJson as Era[];

export type EraFilterValue = "all" | `${EraId}`;

function cloneEra(era: Era): Era {
  return {
    ...era,
    name: { ...era.name },
  };
}

export function getAllEras(): Era[] {
  return eras.map(cloneEra);
}

export function getEraById(id: EraId): Era | undefined {
  const era = eras.find((candidate) => candidate.id === id);
  return era ? cloneEra(era) : undefined;
}

export function getEraLabel(id: EraId, locale: Locale): string {
  const era = getEraById(id);

  if (!era) {
    throw new Error(`Unknown Era: ${id}`);
  }

  return `${era.name[locale]} (${era.period})`;
}
