import type { Locale } from "@/lib/locale";

export type Localized<T> = Record<Locale, T>;
