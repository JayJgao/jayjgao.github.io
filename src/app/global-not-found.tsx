import Link from "next/link";
import { GLOBAL_NOT_FOUND_TITLE } from "@/lib/metadata";
import "@/styles/globals.css";

export default function GlobalNotFound() {
  return (
    <html lang="ko" className="dark">
      <head>
        <title>{GLOBAL_NOT_FOUND_TITLE}</title>
      </head>
      <body className="antialiased">
        <div className="background-grid" aria-hidden="true" />
        <div className="grain-overlay fixed inset-0 -z-10" aria-hidden="true" />
        <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col items-start justify-center gap-4 px-6 md:px-12">
          <p className="text-sm tracking-[0.16em] text-muted uppercase">404</p>
          <h1 className="text-4xl font-semibold tracking-tight">페이지를 찾을 수 없습니다</h1>
          <p className="text-muted">요청하신 주소가 없거나 이동되었습니다.</p>
          <Link href="/ko/" className="text-accent hover:underline">
            한국어 홈으로 돌아가기
          </Link>
        </main>
      </body>
    </html>
  );
}
