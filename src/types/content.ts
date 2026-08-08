import type { Locale } from "@/lib/locale";

export type Localized<T> = Record<Locale, T>;

export type EraId = 1 | 2 | 3;

export type Era = {
  id: EraId;
  name: Localized<string>;
  period: string;
};
