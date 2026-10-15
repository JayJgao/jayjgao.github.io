import type { Metadata } from "next";
import Link from "next/link";
import { getMessages } from "@/lib/i18n";
import { createHomeDescription, createLocalizedMetadata } from "@/lib/metadata";

const copy = getMessages("ko").home.hero;

export const metadata: Metadata = {
  ...createLocalizedMetadata({
    locale: "ko",
    path: "/",
    title: `${copy.name} | AI Product Leader`,
    description: createHomeDescription("ko", copy),
  }),
  robots: {
    index: false,
    follow: true,
  },
};

export default function RootRedirectPage() {
  return (
    <>
      <meta httpEquiv="refresh" content="0;url=/ko/" />
      <main id="main-content" className="redirect-page" lang="ko">
        <p className="section-kicker">Jay Ko Portfolio</p>
        <h1 className="page-display">한국어 페이지로 이동합니다</h1>
        <p className="redirect-page__copy">
          자동 이동이 되지 않으면 아래 링크를 선택해 주세요.
        </p>
        <nav aria-label="Language fallbacks" className="redirect-page__links">
          <Link href="/ko/" className="btn-secondary">한국어</Link>
          <Link href="/en/" className="btn-secondary">English</Link>
          <Link href="/zh/" className="btn-secondary">中文</Link>
        </nav>
      </main>
    </>
  );
}
