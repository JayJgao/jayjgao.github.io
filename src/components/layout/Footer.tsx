"use client";

import { useLocale } from "@/components/i18n/LocaleProvider";
import { getMessages } from "@/lib/i18n";

export function Footer() {
  const { locale } = useLocale();
  const copy = getMessages(locale);

  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <p>{copy.footer.brand}</p>
        <div className="site-footer__links">
          <a href="https://github.com/JayJgao">
            {copy.common.github}
          </a>
          <a href="mailto:rhwogus0205@gmail.com">
            {copy.common.email}
          </a>
          <span>{copy.footer.copyright}</span>
        </div>
      </div>
    </footer>
  );
}
