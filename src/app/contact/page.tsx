export default function ContactPage() {
  return (
    <main className="page-container py-10 md:py-14">
      <section className="panel max-w-3xl p-6 md:p-8">
        <p className="text-xs tracking-[0.16em] text-accent uppercase">Contact</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight md:text-5xl">
          Let&apos;s build AI products together.
        </h1>
        <p className="mt-4 text-base leading-relaxed text-white/85 md:text-lg">
          협업 제안, 채용 문의, 프로젝트 관련 대화를 환영합니다.
          현재는 폼 대신 이메일로 직접 연락을 받고 있습니다.
        </p>

        <div className="mt-8 grid gap-3 text-sm">
          <a
            href="mailto:rhwogus0205@gmail.com"
            className="rounded-2xl border border-white/12 bg-white/5 px-4 py-3 hover:bg-white/10"
          >
            Email · rhwogus0205@gmail.com
          </a>
          <a
            href="https://github.com/JayJgao"
            target="_blank"
            rel="noreferrer"
            className="rounded-2xl border border-white/12 bg-white/5 px-4 py-3 hover:bg-white/10"
          >
            GitHub · github.com/JayJgao
          </a>
          <div className="rounded-2xl border border-white/12 bg-white/5 px-4 py-3 text-muted">
            Phone · Private
          </div>
          <div className="rounded-2xl border border-white/12 bg-white/5 px-4 py-3 text-muted">
            LinkedIn · Private (to be added)
          </div>
        </div>
      </section>
    </main>
  );
}
