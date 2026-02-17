import { ResumeRenderer } from "@/components/resume/ResumeRenderer";

export default function ResumePage() {
  return (
    <main className="page-container space-y-6 py-8 md:space-y-8 md:py-12">
      <header className="space-y-3 md:space-y-4">
        <p className="section-kicker">Resume</p>
        <h1 className="editorial-title text-5xl md:text-6xl">Jay Ko Resume</h1>
        <p className="max-w-2xl text-base leading-relaxed text-white/72 md:text-lg">
          웹 이력서와 다운로드 PDF를 동일한 기준으로 관리하고 있습니다.
        </p>
        <div className="flex flex-wrap gap-2.5 pt-1 md:gap-3">
          <a href="/assets/resume/resume_ko.pdf" className="btn-secondary">
            한국어 PDF 다운로드
          </a>
          <a href="/assets/resume/resume_en.pdf" className="btn-secondary">
            English PDF Download
          </a>
        </div>
      </header>
      <ResumeRenderer />
    </main>
  );
}
