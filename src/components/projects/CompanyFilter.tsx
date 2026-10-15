"use client";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getProjectCompanies } from "@/lib/projects";
import { getMessages } from "@/lib/i18n";
export function CompanyFilter({ value, onChange }: { value: string; onChange: (next: string) => void }) {
  const { locale } = useLocale();
  const copy = getMessages(locale).projects.filter;
  const options = [{ value: "all", label: copy.all }, ...getProjectCompanies().map((company) => ({ value: company, label: company }))];
  return <div className="company-filter" aria-label={copy.all}>{options.map((option) => <button key={option.value} type="button" onClick={() => onChange(option.value)} aria-pressed={option.value === value} className={`company-filter__button ${option.value === value ? "is-active" : ""}`}>{option.label}</button>)}</div>;
}
