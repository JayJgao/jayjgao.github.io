import skills from "@/data/skills.json";
import resumeKo from "@/data/resume.ko.json";

const aboutParagraphs = [
  "저는 \"새로운 산업 도메인에 AI를 적용하는 것\"에 가장 큰 에너지를 느끼는 AI 프로덕트 리더입니다.",
  "핀테크에서 AutoML 솔루션을 일본 대기업에 판매하며 AI PM 커리어를 시작했고, 헬스케어에서 바이오마커 분석 소프트웨어를, 이커머스에서 LLM 기반 숏폼 영상 편집기와 쇼핑 챗봇을 만들었습니다. 현재는 생성형 AI와 3D 모션을 결합한 영상 제작 파이프라인을 설계하고 있습니다. Tabular ML → Computer Vision → LLM Agent → Motion AI — 매번 새로운 기술과 도메인으로 확장하면서도, 제로에서 팀을 빌딩하고 MRR을 10배 성장시킨 일관된 성과를 만들어왔습니다.",
  "PM의 역할은 제품의 성공을 위해 \"문제\"를 식별하고 해결하는 모든 영역을 커버하는 것이라 생각합니다. 기획뿐 아니라 직접 바이브코딩으로 내부 도구를 만들고, 프롬프트를 설계하고, 고객 앞에 서서 영업하고, 팀을 조직하는 — End-to-end Problem Manager로서 일합니다.",
];

export default function AboutPage() {
  return (
    <main className="page-container space-y-10 py-10 md:py-14">
      <section className="panel p-6 md:p-8">
        <p className="text-xs tracking-[0.16em] text-accent uppercase">Narrative</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight md:text-5xl">About</h1>
        <div className="mt-6 space-y-4 text-base leading-relaxed text-white/85 md:text-lg">
          {aboutParagraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>

      <section className="panel p-6 md:p-8">
        <h2 className="text-2xl font-semibold tracking-tight">Skills</h2>
        <div className="mt-5 space-y-5">
          {Object.entries(skills).map(([category, items]) => (
            <div key={category}>
              <h3 className="text-sm font-medium text-white/90">{category}</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {items.map((item) => (
                  <span key={item} className="pill text-xs">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <article className="panel p-6">
          <h2 className="text-xl font-semibold tracking-tight">Languages</h2>
          <ul className="mt-4 space-y-2 text-sm text-white/85">
            {resumeKo.languages.map((language) => (
              <li key={language}>• {language}</li>
            ))}
          </ul>
        </article>

        <article className="panel p-6">
          <h2 className="text-xl font-semibold tracking-tight">Education & Achievements</h2>
          <ul className="mt-4 space-y-2 text-sm text-white/85">
            {resumeKo.education.map((item) => (
              <li key={item}>• {item}</li>
            ))}
            {resumeKo.achievements.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </article>
      </section>
    </main>
  );
}
