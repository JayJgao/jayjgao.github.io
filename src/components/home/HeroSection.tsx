import Image from "next/image";
import Link from "next/link";

const stats = [
  { value: "LLM→Unreal", label: "E2E 통합" },
  { value: "6 / 5개월", label: "MOAI 유저스터디" },
  { value: "MRR 10x", label: "사업 성장" },
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-surface/80 p-6 md:p-10">
      <div className="absolute -top-20 right-0 h-64 w-64 rounded-full bg-accent/20 blur-3xl" aria-hidden="true" />
      <div className="grid gap-8 lg:grid-cols-[1.4fr_0.9fr]">
        <div>
          <p className="text-xs tracking-[0.18em] text-accent uppercase">AI Product Leader</p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
            고재현 <span className="text-white/65">(Jay Ko)</span>
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/90">
            Tabular ML에서 생성형 비디오까지 — AI 제품을 만들고 스케일합니다.
          </p>
          <p className="mt-3 text-sm text-muted">
            6+ years, 제품 출시와 통합 속도 개선에 집중한 AI Product 리딩
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-white/12 bg-white/5 p-4">
                <p className="text-2xl font-semibold tracking-tight">{stat.value}</p>
                <p className="mt-1 text-xs tracking-wide text-muted uppercase">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/projects" className="btn-primary">
              프로젝트 보기
            </Link>
            <Link href="/about" className="btn-secondary">
              About 보기
            </Link>
          </div>
        </div>

        <aside className="panel relative flex items-end justify-start overflow-hidden p-4">
          <Image
            src="/assets/images/profile/jayko_profile.jpg"
            alt="고재현 프로필 사진"
            width={720}
            height={960}
            className="h-[360px] w-full rounded-2xl object-cover object-center"
            priority
          />
        </aside>
      </div>
    </section>
  );
}
