import { ResumeRenderer } from "@/components/resume/ResumeRenderer";

export default function ResumePage() {
  return (
    <main className="page-container space-y-6 py-10 md:py-14">
      <header className="space-y-3">
        <p className="text-xs tracking-[0.16em] text-accent uppercase">Resume</p>
        <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">Interactive Resume</h1>
        <p className="max-w-2xl text-base text-muted md:text-lg">
          PDF 업데이트 전까지 웹 렌더링을 기준 이력으로 사용합니다.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <a href="/assets/resume/JayKo_Resume_KO.pdf" className="btn-secondary">
            한국어 PDF 다운로드
          </a>
          <a href="/assets/resume/JayKo_Resume_EN.pdf" className="btn-secondary">
            English PDF Download
          </a>
        </div>
      </header>
      <ResumeRenderer />
    </main>
  );
}
