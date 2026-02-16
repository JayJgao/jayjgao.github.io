import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-10 px-6 py-20 md:px-12">
      <header className="space-y-4">
        <p className="text-sm tracking-[0.18em] text-muted uppercase">
          Phase 0 Bootstrapped
        </p>
        <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
          Jay Ko Portfolio
        </h1>
        <p className="max-w-2xl text-base text-muted md:text-lg">
          GitHub Pages static export 기반으로 초기 셋업을 완료했습니다.
          아래 페이지 라우트를 통해 다음 단계 구현을 시작합니다.
        </p>
      </header>

      <section className="grid gap-3 sm:grid-cols-2">
        {[
          ["/", "Home"],
          ["/about", "About"],
          ["/projects", "Projects"],
          ["/resume", "Resume"],
          ["/contact", "Contact"],
        ].map(([href, label]) => (
          <Link
            key={href}
            href={href}
            className="rounded-xl border border-white/10 bg-white/5 p-5 transition hover:border-accent/60 hover:bg-white/8"
          >
            <span className="text-lg">{label}</span>
          </Link>
        ))}
      </section>
    </main>
  );
}
