"use client";

import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { getPathWithoutLocale } from "@/lib/routes";

const sectionSelector = [
  "[data-home-section]",
  "[data-demo-list-group]",
  "[data-demo-block]",
  "[data-about-section]",
  "[data-project-section]",
  "[data-resume-section]",
].join(",");

type ProgressState = {
  current: number;
  progress: number;
  total: number;
};

export function ScrollProgress() {
  const pathname = usePathname();
  const [state, setState] = useState<ProgressState>({
    current: 1,
    progress: 0,
    total: 1,
  });

  const chapter = useMemo(() => {
    const path = getPathWithoutLocale(pathname);
    if (path === "/demos" || path.startsWith("/demos/")) return "demo";
    if (path === "/projects" || path.startsWith("/projects/")) return "project";
    return "ink";
  }, [pathname]);

  useEffect(() => {
    const update = () => {
      const root = document.documentElement;
      const maxScroll = Math.max(0, root.scrollHeight - window.innerHeight);
      const progress = maxScroll === 0 ? 1 : Math.min(1, window.scrollY / maxScroll);
      const sections = Array.from(document.querySelectorAll<HTMLElement>(sectionSelector));
      const threshold = window.innerHeight * 0.42;
      let current = 1;

      sections.forEach((section, index) => {
        if (section.getBoundingClientRect().top <= threshold) current = index + 1;
      });

      setState({
        current,
        progress,
        total: Math.max(1, sections.length),
      });
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [pathname]);

  return (
    <div className={`scroll-progress scroll-progress--${chapter}`} aria-hidden="true">
      <span
        className="scroll-progress__line"
        style={{ transform: `scaleX(${state.progress})` }}
      />
      <span className="scroll-progress__counter">
        {String(state.current).padStart(2, "0")}/{String(state.total).padStart(2, "0")}
      </span>
    </div>
  );
}
