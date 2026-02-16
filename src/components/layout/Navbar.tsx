"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
  { href: "/resume", label: "Resume" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-background/70 backdrop-blur-xl">
      <div className="page-container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-mono text-sm tracking-[0.18em] text-accent uppercase">
            Jay Ko
          </span>
        </Link>

        <nav aria-label="Main navigation" className="flex items-center gap-1">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-3 py-1.5 text-sm transition ${
                  active
                    ? "bg-white/12 text-white"
                    : "text-muted hover:bg-white/6 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}

          <button
            type="button"
            disabled
            aria-label="Locale switcher (Phase 4)"
            className="ml-2 rounded-full border border-white/15 px-3 py-1.5 text-xs text-muted"
          >
            KO · EN · ZH
          </button>
        </nav>
      </div>
    </header>
  );
}
