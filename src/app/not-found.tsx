import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col items-start justify-center gap-4 px-6 md:px-12">
      <p className="text-sm tracking-[0.16em] text-muted uppercase">404</p>
      <h1 className="text-4xl font-semibold tracking-tight">Page Not Found</h1>
      <p className="text-muted">요청하신 페이지를 찾을 수 없습니다.</p>
      <Link href="/" className="text-accent hover:underline">
        홈으로 돌아가기
      </Link>
    </main>
  );
}
