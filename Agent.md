# Agent.md — Jay Ko Portfolio & Resume Site

> 이 문서는 AI 코딩 에이전트(Claude Code, Cursor, Windsurf 등)가 이 프로젝트를 이해하고 작업하기 위한 핵심 지침서입니다.
> **Planning.md**와 함께 읽어야 합니다. Planning.md는 로드맵과 의사결정 히스토리를, 이 문서는 "지금 무엇을 어떻게 만들어야 하는가"를 다룹니다.

---

## 1. Project Identity

| Key | Value |
|---|---|
| **Owner** | 고재현 (Jay Ko) |
| **Role** | AI Product Manager / Product Owner (6+ years) |
| **Repo** | `https://github.com/JayJgao/jayjgao.github.io` |
| **Live URL** | `https://jayjgao.github.io` (Phase 1), 추후 커스텀 도메인 연결 예정 |
| **Purpose** | 인터랙티브 이력서 + 포트폴리오 통합 웹사이트 |
| **Target Audience** | 한국 AI 스타트업/테크 기업 + 글로벌 (완전한 다국어 KO/EN/ZH) |
| **Positioning** | "AI Product Leader who ships at the intersection of Generative AI, 3D/Motion, and Commerce" |

---

## 2. Tech Stack (Confirmed)

```
Framework:      Next.js 15 (App Router) — Static Export (output: 'export')
Styling:        Tailwind CSS v4
3D/Graphics:    React Three Fiber (R3F) + Drei + Three.js
Animation:      Framer Motion (scroll-linked, page transitions)
i18n:           next-intl (App Router native)
Content:        MDX (next-mdx-remote) + JSON data files
Diagrams:       Mermaid (rendered client-side) or React Flow
Deployment:     GitHub Pages (static only, via GitHub Actions)
Package Mgr:    pnpm (preferred) or npm
```

### Deployment Constraint: GitHub Pages = Static Export Only
- `next.config.js`에 `output: 'export'` 필수
- API Routes, Server Actions, ISR, middleware 사용 **불가**
- 모든 데이터 fetching은 빌드 타임 또는 클라이언트 사이드
- `next/image`의 built-in optimization 불가 → `unoptimized: true` 설정 또는 외부 이미지 최적화
- Contact form은 Formspree/Getform 같은 외부 서비스 사용

### GitHub Actions CI/CD
```yaml
# .github/workflows/deploy.yml
# main branch push → next build → next export → gh-pages branch deploy
```

---

## 3. Directory Structure

```
jayjgao.github.io/
├── .github/
│   └── workflows/
│       └── deploy.yml              # GitHub Pages 배포 자동화
├── public/
│   ├── assets/
│   │   ├── images/                 # 프로젝트 스크린샷, GIF, 아키텍처 다이어그램
│   │   ├── models/                 # Three.js용 3D 에셋 (glTF/glb)
│   │   ├── fonts/                  # Pretendard, Inter 등 커스텀 폰트
│   │   └── resume/
│   │       ├── JayKo_Resume_KO.pdf
│   │       └── JayKo_Resume_EN.pdf
│   ├── favicon.ico
│   └── og-image.png                # Open Graph 이미지
├── src/
│   ├── app/
│   │   ├── [locale]/               # next-intl locale routing
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx            # Home (Hero + Featured Projects + Career Timeline)
│   │   │   ├── about/
│   │   │   │   └── page.tsx        # About (Domain Expansion Narrative + Skills)
│   │   │   ├── projects/
│   │   │   │   ├── page.tsx        # Projects Index (3-Era Grid)
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx    # Project Detail (Case Study Template)
│   │   │   ├── resume/
│   │   │   │   └── page.tsx        # Resume (inline render + PDF download)
│   │   │   └── contact/
│   │   │       └── page.tsx        # Contact (form + links)
│   │   ├── layout.tsx              # Root layout (locale redirect)
│   │   └── not-found.tsx
│   ├── components/
│   │   ├── three/                  # R3F 3D 컴포넌트
│   │   │   ├── HeroScene.tsx       # Hero 섹션 3D 인터랙티브 배경
│   │   │   ├── DomainOrbit.tsx     # 도메인 확장 3D 비주얼 (optional)
│   │   │   └── FallbackHero.tsx    # WebGL 미지원 시 CSS 대체
│   │   ├── layout/
│   │   │   ├── Navbar.tsx          # 네비게이션 (다국어 토글 포함)
│   │   │   ├── Footer.tsx
│   │   │   └── LocaleSwitcher.tsx  # KO / EN / ZH 토글
│   │   ├── home/
│   │   │   ├── HeroSection.tsx     # 이름 + 원라인 + 숫자 3개 + CTA
│   │   │   ├── FeaturedProjects.tsx # Showcase 프로젝트 카드 5~6개
│   │   │   └── CareerTimeline.tsx  # 3-Era 타임라인 (인터랙티브)
│   │   ├── projects/
│   │   │   ├── ProjectCard.tsx     # 프로젝트 그리드 카드
│   │   │   ├── CaseStudy.tsx       # 통일 케이스 스터디 레이아웃
│   │   │   ├── ArchitectureViewer.tsx # 인터랙티브 아키텍처 다이어그램
│   │   │   └── EraFilter.tsx       # Era 필터 (Before LLM / After LLM / GenAI)
│   │   ├── resume/
│   │   │   └── ResumeRenderer.tsx  # JSON → Resume 렌더링
│   │   └── ui/                     # 공통 UI (Button, Tag, Card, Modal 등)
│   ├── content/
│   │   ├── projects/               # 프로젝트별 MDX 파일
│   │   │   ├── ko/
│   │   │   │   ├── cinev-s2m.mdx
│   │   │   │   ├── cinev-moai.mdx
│   │   │   │   ├── cinev-a2p.mdx
│   │   │   │   ├── buzzni-shortform-ai.mdx
│   │   │   │   ├── buzzni-chatbot.mdx
│   │   │   │   ├── buzzni-aiaas.mdx
│   │   │   │   ├── solidware-mlaas.mdx
│   │   │   │   ├── solidware-automl.mdx
│   │   │   │   ├── lunit-biomarker.mdx
│   │   │   │   ├── hackathon-elevenlabs.mdx
│   │   │   │   └── hackathon-meta-llama.mdx
│   │   │   ├── en/
│   │   │   │   └── ... (동일 구조)
│   │   │   └── zh/
│   │   │       └── ... (동일 구조)
│   │   └── archive/                # Archive 콘텐츠 (프롬프트 모음, 유저매뉴얼 등)
│   │       ├── ko/
│   │       └── en/
│   ├── data/
│   │   ├── resume.ko.json          # 이력서 구조화 데이터 (한국어)
│   │   ├── resume.en.json          # 이력서 구조화 데이터 (영어)
│   │   ├── resume.zh.json          # 이력서 구조화 데이터 (중국어)
│   │   ├── projects.json           # 프로젝트 메타데이터 (era, tags, featured 여부)
│   │   └── skills.json             # 스킬 목록 (카테고리별)
│   ├── i18n/
│   │   ├── ko.json                 # UI 텍스트 (한국어)
│   │   ├── en.json                 # UI 텍스트 (영어)
│   │   └── zh.json                 # UI 텍스트 (중국어)
│   ├── lib/
│   │   ├── mdx.ts                  # MDX 파일 로딩/파싱
│   │   └── utils.ts                # 유틸 함수
│   └── styles/
│       └── globals.css             # Tailwind base + 커스텀 스타일
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
├── Agent.md                        # ← 이 파일
└── Planning.md                     # 로드맵 & 의사결정 히스토리
```

---

## 4. Design Principles

### 4.1 Showcase vs Archive
- **Showcase** (메인 페이지, 프로젝트 인덱스 상단): Featured 5~6개만 노출
- **Archive** (프로젝트 인덱스 하단, 개별 Artifacts 섹션 내 링크): 나머지 전부
- 원칙: 첫 화면에서 방문자가 10초 안에 "이 사람이 무엇을 잘하는지" 파악 가능해야 함

### 4.2 Impact-First
- Home Hero에 숫자가 먼저 보여야 함: `MRR 10x` / `25+ B2B Clients` / `3 Patents`
- 프로젝트 코드네임(S2M, MOAI 등)은 카드 내부에서만 노출
- 카드의 첫 줄은 임팩트 또는 한 줄 요약이어야 하고, 프로젝트명이 아니어야 함

### 4.3 3-Era Narrative
사이트 전체에 걸쳐 일관되게 적용:
```
Era 1: Before LLM (2018-2022) — "ML Product Foundation"
  Solidware MLaaS, AutoML, Hana Bank / Lunit Biomarker
  
Era 2: After LLM (2023-2025) — "AI Product at Scale"  
  Buzzni Short-form AI, Chatbot, Review AIaaS, Search AIaaS
  
Era 3: Generative AI Era (2025~) — "AI-Native Product Leadership"
  Cinamon S2M, MOAI, A2P / Chroma Awards (AI Film) / Hackathons
```

### 4.4 Unified Case Study Template
모든 프로젝트 페이지는 동일 구조:
```
┌─────────────────────────────────────────┐
│ [Hero Image/GIF]                        │
│ Project Title                           │
│ What: 한 줄 설명                          │
│ Role: 역할 + 기여도 %                     │
│ Impact: 핵심 숫자 1~3개                   │
│ Tags: [LLM Agent] [Vibe Coding] [B2B]   │
├─────────────────────────────────────────┤
│ ## 🚧 Problem                           │
│ ## 💡 Approach                          │
│ ## ⚙️ Execution                         │
│ ## ✅ Results                            │
│ ## 📎 Artifacts (toggle/collapsible)    │
│   - 아키텍처 다이어그램                     │
│   - 프롬프트 샘플 (AS-IS / TO-BE diff)    │
│   - 스키마 정의서 (JSON viewer)            │
│   - 데모 GIF/영상                         │
└─────────────────────────────────────────┘
```

### 4.5 Performance Guardrails
| Metric | Target | Strategy |
|---|---|---|
| First Contentful Paint | < 1.5s | Three.js lazy load + Suspense |
| Largest Contentful Paint | < 2.5s | Hero text first, 3D background deferred |
| Total Bundle Size | < 500KB (initial) | Code splitting per route |
| Mobile Three.js | 60fps or fallback | `FallbackHero.tsx` for low-end devices |
| WebGL Detection | Auto | `Suspense` + `useDetectGPU()` from Drei |

**모바일 전략**: 리크루터 50%+가 모바일에서 접근. Three.js Hero가 모바일에서 버벅이면 `FallbackHero`로 자동 전환.

```tsx
// 패턴 예시
const HeroSection = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const gpu = useDetectGPU();
  
  return gpu.tier < 2 || isMobile 
    ? <FallbackHero /> 
    : <Suspense fallback={<FallbackHero />}><HeroScene /></Suspense>;
};
```

### 4.6 Accessibility Baseline
- Semantic HTML (`<main>`, `<nav>`, `<article>`, `<section>`)
- 키보드 네비게이션 (Tab, Enter, Escape)
- 스크린 리더: Three.js 영역에 `aria-hidden="true"` + 대체 텍스트
- 색상 대비 WCAG AA 이상
- `prefers-reduced-motion` 미디어 쿼리 존중

---

## 5. Content & Data Architecture

### 5.1 Resume Data (JSON)
이력서를 JSON으로 관리하면 PDF 생성, 웹 렌더링, 다국어 모두 단일 소스에서 처리 가능.

```jsonc
// data/resume.ko.json (구조 예시)
{
  "meta": {
    "name": "고재현",
    "title": "AI Product Manager",
    "subtitle": "6+ Years | Tabular → Vision → LLM → Motion AI",
    "location": "Seoul, Korea",
    "email": "rhwogus0205@gmail.com",
    "phone": "+82 10 4415 9302",
    "website": "https://jayjgao.github.io",
    "linkedin": "...",
    "github": "https://github.com/JayJgao"
  },
  "summary": "...",
  "experience": [
    {
      "company": "시나몬 (Cinamon)",
      "product": "CineV",
      "role": "AI Tech Product Owner",
      "period": { "start": "2025-04", "end": null },
      "highlights": [
        "S2M: LLM Agent → Unreal 파이프라인 아키텍처 재설계, 합류 3개월 내 첫 E2E 통합 달성",
        "MOAI: 내부 모션 AI 평가 플랫폼 바이브코딩으로 직접 구축, 8개월간 유저스터디 6회 + 모델 2건 통합 (vs. 이전 3년간 2건)",
        "A2P: I2V, I2I, TTS, Music Gen 등 외부 모델 통합 전략 수립 및 스키마/API 레이어 설계"
      ]
    },
    // ... (Buzzni, Lunit, Solidware)
  ],
  "education": [...],
  "skills": {...},
  "publications": [...],
  "patents": [...],
  "hackathons": [...],
  "languages": [
    { "lang": "한국어", "level": "Native" },
    { "lang": "중국어 (보통화)", "level": "Business Fluent (HSK 6)" },
    { "lang": "영어", "level": "Professional Working" },
    { "lang": "日本語", "level": "Basic Conversation" },
    { "lang": "러시아어", "level": "Elementary" }
  ]
}
```

### 5.2 Project Metadata (JSON)
```jsonc
// data/projects.json
[
  {
    "slug": "cinev-s2m",
    "era": 3,
    "eraLabel": "Generative AI Era",
    "featured": true,
    "showcaseOrder": 1,
    "title": { "ko": "CineV S2M — LLM Agent → Unreal 파이프라인", "en": "CineV S2M — LLM Agent to Unreal Pipeline", "zh": "..." },
    "oneLiner": { "ko": "자연어 한 줄로 3D 영상을 생성하는 AI Agent 시스템", "en": "..." },
    "impact": { "ko": "합류 3개월 내 첫 E2E 통합 달성", "en": "..." },
    "tags": ["LLM Agent", "Unreal Engine", "Prompt Engineering", "System Architecture"],
    "thumbnail": "/assets/images/projects/s2m-thumb.png",
    "company": "Cinamon",
    "role": "AI Tech PO",
    "contribution": 80
  },
  {
    "slug": "chroma-awards",
    "era": 3,
    "eraLabel": "Generative AI Era",
    "featured": true,
    "showcaseOrder": 3,
    "title": { "ko": "Chroma Awards — Fully AI-Generated Short Film", "en": "Chroma Awards — Fully AI-Generated Short Film", "zh": "..." },
    "oneLiner": { "ko": "세계 최대 AI Film Competition에서 Sponsor Award Top 11 Finalist 선정", "en": "Top 11 Finalist at the world's largest AI Film Competition (ElevenLabs)" },
    "impact": { "ko": "Sponsor Award Top 11 Finalist (2025)", "en": "Sponsor Award Top 11 Finalist (2025)" },
    "tags": ["Generative AI", "AI Film", "Video Generation", "Creative AI"],
    "thumbnail": "/assets/images/projects/chroma-thumb.png",
    "company": "Side Project",
    "role": "Creator / Director",
    "contribution": 100
  },
  // ...
]
```

### 5.3 MDX Project Pages
각 프로젝트 MDX 파일은 frontmatter + Case Study Template 본문:

```mdx
---
slug: cinev-s2m
---

## 🚧 Problem
CineV의 핵심 파이프라인 S2M(Script-to-Movie)은...

## 💡 Approach
추상화 레이어를 도입하여...

## ⚙️ Execution
- Phase 1: 기존 파이프라인 분석 및 병목 지점 식별
- Phase 2: LLM Agent 아키텍처 재설계
- ...

## ✅ Results
- 합류 3개월 내 첫 E2E 제품 통합 달성
- ...

## 📎 Artifacts
<Collapsible title="아키텍처 다이어그램">
  <ArchitectureViewer src="s2m-architecture" />
</Collapsible>
```

### 5.4 i18n (Internationalization)

**3개 언어**: 한국어 (ko), English (en), 中文 (zh)

- **기본 언어**: 브라우저 `Accept-Language` 헤더 기반 자동 감지, fallback은 `ko`
- **URL 구조**: `/ko/projects/cinev-s2m`, `/en/projects/cinev-s2m`, `/zh/projects/cinev-s2m`
- **UI 텍스트**: `i18n/{locale}.json`
- **콘텐츠**: `content/projects/{locale}/{slug}.mdx`
- **데이터**: `data/resume.{locale}.json`
- **토글 위치**: Navbar 우측, 3개 국기 아이콘 또는 KO/EN/ZH 텍스트 토글

**Static Export 주의사항**:
next-intl의 App Router 지원은 middleware 기반 리다이렉트를 사용하는데, static export에서는 middleware가 작동하지 않음.
→ `generateStaticParams`로 모든 locale 조합을 빌드 타임에 생성해야 함.

```tsx
// src/app/[locale]/projects/[slug]/page.tsx
export function generateStaticParams() {
  const locales = ['ko', 'en', 'zh'];
  const slugs = getAllProjectSlugs();
  return locales.flatMap(locale => 
    slugs.map(slug => ({ locale, slug }))
  );
}
```

---

## 6. Three.js Interactive Concepts

### 6.1 Hero Scene — "Domain Expansion Orbit"
컨셉: 유저의 커리어 도메인을 3D 공간에서 궤도로 표현.

```
중심: "Jay Ko" 텍스트 또는 추상적 코어 오브젝트
궤도 1 (가장 안쪽): Tabular/ML — 작은 데이터 포인트 파티클
궤도 2: Vision — 이미지 프레임 오브젝트
궤도 3: LLM — 텍스트 스트림 파티클
궤도 4 (가장 바깥): Motion/3D — 모션 캡처 형태 메시
```

- 마우스 호버/드래그로 궤도 회전
- 스크롤 시 줌인되면서 현재 Era의 궤도가 강조됨
- 클릭 시 해당 Era의 프로젝트 섹션으로 스크롤

### 6.2 Career Timeline — 인터랙티브 3D 타임라인
컨셉: 가로축 = 시간, 세로축 = 도메인 복잡도, Z축 = 매출/임팩트 규모

- 각 회사/프로젝트가 노드로 표현
- 노드 사이에 커넥팅 라인 (커리어 패스)
- 호버 시 프로젝트 요약 팝업
- 클릭 시 프로젝트 상세 페이지 이동

### 6.3 Architecture Viewer — 프로젝트별 인터랙티브 다이어그램
컨셉: S2M → Unreal → Web → MOAI 파이프라인을 인터랙티브 노드 그래프로.

- React Flow 또는 R3F로 구현
- 각 모듈 클릭 시 설명 팝업
- 데이터 흐름 애니메이션 (파티클이 노드 간 이동)

### 6.4 Fallback Strategy
```
GPU Tier 3 (High-end):    Full Three.js + 파티클 + post-processing
GPU Tier 2 (Mid-range):   Three.js (파티클 줄임, 후처리 없음)
GPU Tier 1 (Low-end):     CSS 그라디언트 애니메이션 + Framer Motion
GPU Tier 0 / No WebGL:    정적 이미지 + 간단한 CSS 전환
```

---

## 7. Available Assets

### 7.1 Confirmed Available
- [x] 이력서 PDF (2025.01 기준, 시나몬 미반영 — 업데이트 필요)
- [x] Notion 포트폴리오 HTML 18개 (콘텐츠 소스)
- [x] 프로필 사진
- [x] Cinamon/CineV 공개 가능한 에셋 (유저가 확인함)
- [x] 보도자료에 공개된 Buzzni 관련 이미지
- [x] 해커톤 관련 에셋 (ElevenLabs, Meta Llama)
- [x] Chroma Awards 출품 AI 영상 (임베드/링크 가능)

### 7.2 To Be Created
- [ ] 프로젝트 스크린샷/GIF (CineV S2M, MOAI, A2P)
- [ ] 아키텍처 다이어그램 (직접 재구성 → NDA 무관)
- [ ] Three.js Hero용 3D 에셋 (직접 제작 또는 프로시저럴 생성)
- [ ] OG Image (사이트 공유용)
- [ ] Favicon set

### 7.3 NDA Guidelines
- CineV 제품 화면: **공개 가능한 범위만** 사용 (유저 확인 완료)
- 아키텍처 다이어그램: 직접 재구성 시 NDA 무관
- Buzzni: 보도자료에 나온 이미지 사용 가능
- 비공개 에셋: "면접 시 직접 시연" 문구로 대체

---

## 8. ATS & SEO Keywords

이력서(PDF)와 웹사이트 `<meta>` 태그, 프로젝트 설명에 자연스럽게 포함해야 할 키워드:

```
AI/ML: LLM Agent, Prompt Engineering, Context Engineering, RAG, LangChain, LangGraph,
       AI Evaluation, Generative AI, Computer Vision, Motion AI, AutoML, MLOps

Product: Product-Led Growth, Go-to-Market, B2B SaaS, AIaaS, Product Strategy,
         Cross-functional Leadership, Roadmapping, PRD, User Research

Technical: Unreal Engine (Integration), Three.js, Vibe Coding, React, Next.js,
           API Design, System Architecture, Data Pipeline

Domain: E-commerce, Fintech, Healthcare/Biotech, Video/Content, 3D/Motion
```

---

## 9. Git Workflow

```
main          ← Production (GitHub Pages 배포 소스)
├── dev       ← 개발 통합 브랜치
│   ├── feat/hero-scene        ← Three.js Hero
│   ├── feat/project-pages     ← MDX 프로젝트 페이지
│   ├── feat/i18n              ← 다국어
│   ├── feat/resume-renderer   ← JSON → Resume
│   └── fix/mobile-perf        ← 모바일 성능 최적화
```

- `main` push 시 GitHub Actions가 자동으로 빌드 & 배포
- PR 기반 merge (혼자 작업이라도 히스토리 관리를 위해)

---

## 10. Code Conventions

- **TypeScript strict mode** — `strict: true`
- **컴포넌트**: `PascalCase.tsx`, named export
- **유틸/훅**: `camelCase.ts`
- **스타일**: Tailwind utility-first, 커스텀 CSS는 `globals.css`에 최소한으로
- **커밋 메시지**: Conventional Commits (`feat:`, `fix:`, `docs:`, `style:`, `refactor:`)
- **MDX frontmatter**: 프로젝트 메타데이터는 `projects.json`에, MDX는 본문만
- **이미지**: WebP 우선, fallback PNG. 최대 너비 1200px, 용량 < 200KB/장
- **3D 에셋**: glTF/glb 포맷, Draco 압축, 총 에셋 < 2MB

---

## 11. Agent Instructions (코딩 에이전트용)

### DO:
- `Planning.md`의 현재 Phase를 확인하고 해당 Phase의 태스크만 수행
- 컴포넌트 하나 만들 때마다 모바일 뷰 확인 (Tailwind responsive 클래스 필수)
- Three.js 코드에는 반드시 `Suspense` + fallback 포함
- 다국어 텍스트는 하드코딩하지 말고 `i18n/{locale}.json` 또는 MDX에서 로딩
- `next build && next export` 성공 확인 후 커밋

### DON'T:
- API Routes, Server Actions, middleware 사용하지 말 것 (static export 불가)
- `next/image` default loader 사용하지 말 것 → `unoptimized: true` 또는 `<img>` 직접 사용
- 프로젝트 코드네임(S2M, MOAI, A2P)을 Hero 섹션에 직접 노출하지 말 것
- NDA 범위를 벗어나는 에셋 참조하지 말 것
- 500KB 이상의 single chunk 만들지 말 것 (code splitting 필수)

---

## 12. Quick Start (for Agent)

```bash
# 1. Clone & Install
git clone https://github.com/JayJgao/jayjgao.github.io.git
cd jayjgao.github.io
pnpm install

# 2. Dev server
pnpm dev    # http://localhost:3000

# 3. Build (static export)
pnpm build  # output → /out directory

# 4. Preview static build
npx serve out

# 5. Deploy (auto via GitHub Actions on push to main)
git push origin main
```

---

*This site was built using vibe coding with Claude Code + Cursor.*
*Last updated: 2026-02-16*
