import skills from "@/data/skills.json";

const brandNarrative =
  "도메인이 바뀌어도 성과를 내는 AI Product Leader를 지향합니다.\nTabular ML에서 Vision, LLM Agent, Motion AI로 확장해오며 0→1 런칭과 수익화까지 연결해왔습니다.";

const workPrinciples = [
  "Impact-first: KPI가 선명한 문제만 풀고 실행 속도를 우선합니다.",
  "Product + System: PRD와 UX뿐 아니라 데이터/스키마/API 설계까지 직접 연결합니다.",
  "Build to Align: 바이브코딩 기반 프로토타입으로 팀 정렬과 의사결정을 빠르게 만듭니다.",
];

export default function AboutPage() {
  return (
    <main className="page-container space-y-7 py-8 md:space-y-9 md:py-12">
      <section className="panel p-5 md:p-8">
        <p className="section-kicker">Narrative</p>
        <h1 className="editorial-title mt-2 text-5xl md:text-6xl">About</h1>
        <p className="mt-5 max-w-3xl text-base leading-[1.78] text-white/86 md:text-lg whitespace-pre-line">
          {brandNarrative}
        </p>
        <ul className="mt-5 space-y-2.5 text-sm leading-[1.8] text-white/86 md:text-base">
          {workPrinciples.map((item) => (
            <li key={item}>• {item}</li>
          ))}
        </ul>
        <p className="mt-5 text-sm text-white/68">
          상세 경력/성과 증빙은 Resume 페이지에서 확인할 수 있습니다.
        </p>
      </section>

      <section className="grid gap-3 md:grid-cols-3 md:gap-4">
        <article className="panel p-4 md:p-5">
          <h2 className="editorial-title text-xl tracking-tight">Core Metric</h2>
          <p className="mt-3 text-sm text-white/90">MRR 10x growth</p>
          <p className="text-xs text-white/66">₩5M → ₩52M / AIaaS 사업부</p>
        </article>
        <article className="panel p-4 md:p-5">
          <h2 className="editorial-title text-xl tracking-tight">Delivery Range</h2>
          <p className="mt-3 text-sm text-white/90">25+ enterprise clients</p>
          <p className="text-xs text-white/66">Fintech · Ecommerce · GenAI</p>
        </article>
        <article className="panel p-4 md:p-5">
          <h2 className="editorial-title text-xl tracking-tight">R&D Output</h2>
          <p className="mt-3 text-sm text-white/90">3 ML patents</p>
          <p className="text-xs text-white/66">Applied AI productization</p>
        </article>
      </section>

      <section className="panel p-5 md:p-8">
        <h2 className="editorial-title text-3xl md:text-4xl">Capability Stack</h2>
        <p className="mt-2 text-sm text-white/68">Resume에서 상세 확인</p>
        <div className="mt-5 grid gap-5 md:grid-cols-3">
          {Object.entries(skills).map(([category, items]) => (
            <div key={category}>
              <h3 className="text-sm font-medium text-white/90">{category}</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {items.slice(0, 6).map((item) => (
                  <span key={item} className="pill text-xs">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
