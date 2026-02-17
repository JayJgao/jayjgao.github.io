const timeline = [
  {
    era: "Era 1 · Before LLM (2018-2022)",
    color: "bg-[#f59e0b]",
    items: [
      "Solidware (Ailys) — 일본 엔터프라이즈 13개 고객 확보, 연매출 100% 신장",
      "Lunit — 비전 바이오마커 분석 SW 초기 기획",
    ],
  },
  {
    era: "Era 2 · After LLM (2023-2025)",
    color: "bg-[#38bdf8]",
    items: [
      "BUZZNI — AIaaS 사업부 0명→20명 팀빌딩, MRR 10x 성장",
      "Long→Short-form AI 비디오 편집기 / 쇼핑 어시스턴트 챗봇 출시",
      "Dasan E&E — 사업운영 고도화 및 경영정상화 지원",
    ],
  },
  {
    era: "Era 3 · Generative AI Era (2025~)",
    color: "bg-[#34d399]",
    items: [
      "Cinamon CineV S2M — LLM Agent to Unreal E2E 통합",
      "Cinamon MOAI — 모션 AI 평가 플랫폼 구축",
      "Chroma Awards — Sponsor Award Top 11 Finalist",
    ],
  },
];

export function CareerTimeline() {
  return (
    <section className="space-y-6">
      <div>
        <p className="text-xs tracking-[0.16em] text-accent uppercase">3-Era Narrative</p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">Career Timeline</h2>
      </div>

      <div className="space-y-4">
        {timeline.map((era) => (
          <article key={era.era} className="panel p-5">
            <div className="flex items-center gap-3">
              <span className={`h-2.5 w-2.5 rounded-full ${era.color}`} aria-hidden="true" />
              <h3 className="text-lg font-medium">{era.era}</h3>
            </div>
            <ul className="mt-4 space-y-2 text-sm text-white/85">
              {era.items.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
