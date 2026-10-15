import resumeKo from "@/data/resume.ko.json";
import resumeEn from "@/data/resume.en.json";
import resumeZh from "@/data/resume.zh.json";
import type { Locale } from "@/lib/locale";

export const resumes = { ko: resumeKo, en: resumeEn, zh: resumeZh };
export function getCompanyPeriod(company: string, locale: Locale): string | undefined {
  return resumes[locale].experience.find((entry) => entry.company.startsWith(company))?.period;
}
export function getCareerBars(locale: Locale, year = new Date().getUTCFullYear(), month = new Date().getUTCMonth() + 1) {
  const start = 2018 * 12 + 9;
  const end = (year + 1) * 12;
  return resumes[locale].experience.map((entry) => {
    const dates = [...entry.period.matchAll(/(\d{4})\.(\d{2})/g)];
    const from = Number(dates[0][1]) * 12 + Number(dates[0][2]) - 1;
    const current = dates.length === 1;
    const until = current ? year * 12 + month : Number(dates[1][1]) * 12 + Number(dates[1][2]);
    return { ...entry, current, offset: (from - start) / (end - start) * 100, width: (until - from) / (end - start) * 100 };
  });
}

export function getCareerTicks(year: number) {
  const start = 2018 * 12 + 9;
  const end = (year + 1) * 12;
  return Array.from({ length: Math.max(0, year - 2018) }, (_, index) => {
    const tickYear = 2019 + index;
    return { year: tickYear, offset: (tickYear * 12 - start) / (end - start) * 100 };
  });
}
