"use client";

import { useLocale } from "@/components/i18n/LocaleProvider";
import { getMessages } from "@/lib/i18n";

export function Footer() {
  const { locale } = useLocale();
  const copy = getMessages(locale);

  return (
    <footer className="border-t border-white/10 py-7 md:py-8">
      <div className="page-container flex flex-col gap-3 text-sm text-white/62 md:flex-row md:items-center md:justify-between">
        <p className="text-white/56">{copy.footer.brand}</p>
        <div className="flex items-center gap-4">
          <a href="https://github.com/JayJgao" className="hover:text-white/92">
            {copy.common.github}
          </a>
          <a href="mailto:rhwogus0205@gmail.com" className="hover:text-white/92">
            {copy.common.email}
          </a>
          <span className="text-white/56">{copy.footer.copyright}</span>
        </div>
      </div>
    </footer>
  );
}
