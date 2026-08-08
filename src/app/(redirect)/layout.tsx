import type { Metadata } from "next";
import type { ReactNode } from "react";
import { LEGACY_REDIRECT_TITLE } from "@/lib/metadata";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: LEGACY_REDIRECT_TITLE,
};

export default function RedirectLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
