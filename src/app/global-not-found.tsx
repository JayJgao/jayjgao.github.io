import Link from "next/link";
import { GLOBAL_NOT_FOUND_TITLE } from "@/lib/metadata";
import "@/styles/globals.css";

export default function GlobalNotFound() {
  return (
    <html lang="ko">
      <head>
        <title>{GLOBAL_NOT_FOUND_TITLE}</title>
      </head>
      <body>
        <main className="not-found-page">
          <p className="section-kicker">404</p>
          <h1 className="page-display">페이지를 찾을 수 없습니다</h1>
          <p>요청하신 주소가 없거나 이동되었습니다.</p>
          <Link href="/ko/" className="btn-secondary">
            한국어 홈으로 돌아가기
          </Link>
        </main>
      </body>
    </html>
  );
}
