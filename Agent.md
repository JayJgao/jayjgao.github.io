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
│   │       ├── resume_ko.pdf
│   │       └── resume_en.pdf
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
│   │   ├── archive/                # Archive 콘텐츠 (프롬프트 모음, 유저매뉴얼 등)
│   │   │   ├── ko/
│   │   │   └── en/
│   │   └── diagrams/               # Mermaid source of truth (.mmd)
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
  Solidware MLaaS, AutoML, Hana Bank / Lunit Biomarker / Dasan E&E (HR 컨설팅 경영정상화)
  
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
    {
      "company": "버즈니 (BUZZNI, 홈쇼핑모아)",
      "role": "AI Product Manager, AIaaS 프로덕트팀 팀장",
      "period": { "start": "2023-04", "end": "2025-03" },
      "highlights": [
        "MRR 10배 이상 성장 (500만 원 → 5,200만 원), 신규 계약 고객사 12개 확보",
        "신규 서비스 2건 기획·출시 (숏폼 AI 비디오 편집기 MRR 2,400만 원, 이커머스 쇼핑 어시스턴트 챗봇)",
        "20명 규모 팀 빌딩 및 조직 재구조화, AIaaS 제품 라인업·가격 정책 수립"
      ]
    },
    {
      "company": "다산 E&E (가족 운영 HR 컨설팅 기업)",
      "role": "Business Operations Manager",
      "period": { "start": "2022-06", "end": "2023-03" },
      "highlights": [
        "경영 위기 상황에서 사업 정상화 주도",
        "AI 활용 과제개발 프로세스 재설계를 통한 운영 효율화",
        "사업 전반 운영 관리 (재무, 고객관리, 서비스 운영)"
      ]
    },
    {
      "company": "루닛 (Lunit)",
      "role": "AI Product Manager, Lunit SCOPE team",
      "period": { "start": "2022-01", "end": "2022-04" },
      "highlights": [
        "비전모델 기반 바이오마커 분석 SW 초기 기획 (HER2, ER/PR)",
        "초기 제품 PRD 작성 및 기존 제품 FDA/CE regulation 문서 작성"
      ]
    },
    {
      "company": "솔리드웨어 (現 아일리스)",
      "role": "AI Product Manager, 신사업기획팀 책임",
      "period": { "start": "2018-12", "end": "2021-12" },
      "highlights": [
        "핀테크 MLaaS 신규 고객사 13개 확보 (Mitsubishi, AEON, Japan Post Bank)",
        "전년 대비 연매출 100% 신장, Sales 컨택포인트 256% 증대",
        "총 15억 원 규모 정부지원 사업 수주 (6건)"
      ]
    }
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
    "thumbnail": "/assets/images/projects/cinev/s2m-thumb.webp",
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
    "thumbnail": "/assets/images/projects/chroma/chroma-thumb.webp",
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
- [x] 이력서 PDF (KO/EN 최신본 반영 완료)
- [x] Notion 포트폴리오 HTML 18개 (콘텐츠 소스)
- [x] 프로필 사진
- [x] Cinamon/CineV 공개 가능한 에셋 (유저가 확인함)
- [x] 보도자료에 공개된 Buzzni 관련 이미지
- [x] 해커톤 관련 에셋 (ElevenLabs, Meta Llama)
- [x] Chroma Awards 출품 AI 영상 (임베드/링크 가능)
- [x] 배포 제외용 raw 에셋 보관소 (`.reference/notion-export/public-assets-raw/`)

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

## 12. Confirmed Content (확정 텍스트 — 에이전트는 이대로 렌더링)

### 12.1 Hero Section

```yaml
name_ko: "고재현"
name_en: "Jay Ko"
title: "AI Product Leader"
oneliner_ko: "Tabular ML에서 생성형 비디오까지 — AI 제품을 만들고 스케일합니다."
oneliner_en: "Building and scaling AI products — from tabular ML to generative video."
subtitle_ko: "6+ years, 매출 10배 성장, 25+ 엔터프라이즈 클라이언트"
subtitle_en: "6+ years, 10x revenue growth, 25+ enterprise clients."

stats:
  - value: "MRR 10x"
    label_ko: "매출 성장"
    label_en: "Revenue Growth"
  - value: "25+"
    label_ko: "B2B 클라이언트"
    label_en: "Enterprise Clients"
  - value: "3"
    label_ko: "ML 특허"
    label_en: "ML Patents"

cta:
  - text_ko: "프로젝트 보기"
    text_en: "View Projects"
    href: "/projects"
# NOTE: 별도 Resume 다운로드 CTA 없음. 메인 페이지 자체가 이력서 역할.
```

### 12.2 Featured Projects (Showcase 6개, 확정)

```json
[
  {
    "slug": "cinev-s2m",
    "era": 3,
    "eraLabel": "Generative AI Era",
    "showcaseOrder": 1,
    "title_ko": "CineV S2M — LLM Agent → Unreal Pipeline",
    "title_en": "CineV S2M — LLM Agent to Unreal Pipeline",
    "oneLiner_ko": "합류 3개월 내 LLM-to-Unreal 첫 E2E 통합 달성",
    "oneLiner_en": "Achieved first E2E LLM-to-Unreal integration within 3 months of joining",
    "company": "Cinamon",
    "role": "AI Tech PO",
    "contribution": 50,
    "tags": ["LLM Agent", "Unreal Engine", "System Architecture"]
  },
  {
    "slug": "cinev-moai",
    "era": 3,
    "eraLabel": "Generative AI Era",
    "showcaseOrder": 2,
    "title_ko": "CineV MOAI — Motion AI 평가 플랫폼",
    "title_en": "CineV MOAI — Motion AI Evaluation Platform",
    "oneLiner_ko": "바이브코딩으로 직접 구축, 8개월간 유저스터디 6회 + 모델 2건 통합",
    "oneLiner_en": "Vibe-coded from scratch; 6 user studies + 2 model integrations in 8 months",
    "company": "Cinamon",
    "role": "AI Tech PO",
    "contribution": 50,
    "tags": ["Vibe Coding", "AI Evaluation", "User Study"]
  },
  {
    "slug": "chroma-awards",
    "era": 3,
    "eraLabel": "Generative AI Era",
    "showcaseOrder": 3,
    "title_ko": "Chroma Awards — Fully AI-Generated Short Film",
    "title_en": "Chroma Awards — Fully AI-Generated Short Film",
    "oneLiner_ko": "세계 최대 AI Film Competition Sponsor Award Top 11 Finalist",
    "oneLiner_en": "Top 11 Finalist, Sponsor Award — World's largest AI Film Competition (ElevenLabs)",
    "company": "Side Project",
    "role": "Creator / Director",
    "contribution": 50,
    "tags": ["Generative AI", "AI Film", "Video Generation"]
  },
  {
    "slug": "buzzni-shortform-ai",
    "era": 2,
    "eraLabel": "After LLM",
    "showcaseOrder": 4,
    "title_ko": "Long→Short-form AI 비디오 편집기",
    "title_en": "Long→Short-form AI Video Editor",
    "oneLiner_ko": "Long→Short-form AI 비디오 편집기, 0→1 기획·출시·운영",
    "oneLiner_en": "AI video editor, built 0→1 from planning to launch and operation",
    "company": "BUZZNI",
    "role": "AI PM / Team Lead",
    "contribution": 80,
    "tags": ["LLM", "Video AI", "B2B SaaS", "Prompt Engineering"]
  },
  {
    "slug": "buzzni-aiaas-biz",
    "era": 2,
    "eraLabel": "After LLM",
    "showcaseOrder": 5,
    "title_ko": "AIaaS 사업부 빌딩 & 리딩",
    "title_en": "AIaaS Business Unit — Build & Lead",
    "oneLiner_ko": "제로에서 20명 팀 빌딩, AIaaS 사업부 리딩 — MRR 500만→5,200만 원 (10x 성장)",
    "oneLiner_en": "Built 20-person team from zero, led AIaaS unit — MRR ₩5M→₩52M (10x growth)",
    "company": "BUZZNI",
    "role": "AI PM / Team Lead",
    "contribution": 80,
    "tags": ["Team Building", "B2B SaaS", "AIaaS", "Go-to-Market"]
  },
  {
    "slug": "solidware-mlaas",
    "era": 1,
    "eraLabel": "Before LLM",
    "showcaseOrder": 6,
    "title_ko": "핀테크 MLaaS — 일본 엔터프라이즈",
    "title_en": "Fintech MLaaS — Japan Enterprise",
    "oneLiner_ko": "Mitsubishi, AEON 등 13개 클라이언트 확보, 연매출 100% 신장",
    "oneLiner_en": "Acquired 13 clients incl. Mitsubishi, AEON; YoY revenue +100%",
    "company": "Solidware",
    "role": "AI PM / Biz Lead",
    "contribution": 70,
    "tags": ["AutoML", "Fintech", "B2B", "Japan Market"]
  }
]
```

### 12.3 About — 커리어 서사 (확정)

**한국어:**

> 저는 "새로운 산업 도메인에 AI를 적용하는 것"에 가장 큰 에너지를 느끼는 AI 프로덕트 리더입니다.
>
> 핀테크에서 AutoML 솔루션을 일본 대기업에 판매하며 AI PM 커리어를 시작했고, 헬스케어에서 바이오마커 분석 소프트웨어를, 이커머스에서 LLM 기반 숏폼 영상 편집기와 쇼핑 챗봇을 만들었습니다. 현재는 생성형 AI와 3D 모션을 결합한 영상 제작 파이프라인을 설계하고 있습니다. Tabular ML → Computer Vision → LLM Agent → Motion AI — 매번 새로운 기술과 도메인으로 확장하면서도, 제로에서 팀을 빌딩하고 MRR을 10배 성장시킨 일관된 성과를 만들어왔습니다.
>
> PM의 역할은 제품의 성공을 위해 "문제"를 식별하고 해결하는 모든 영역을 커버하는 것이라 생각합니다. 기획뿐 아니라 직접 바이브코딩으로 내부 도구를 만들고, 프롬프트를 설계하고, 고객 앞에 서서 영업하고, 팀을 조직하는 — End-to-end Problem Manager로서 일합니다.

**English:**

> I'm an AI Product Leader who thrives on applying AI to new industry domains.
>
> I started my AI PM career selling AutoML solutions to Japanese enterprises in fintech, then built biomarker analysis software in healthcare, and LLM-powered short-form video editors and shopping chatbots in e-commerce. Currently, I'm designing video production pipelines that combine generative AI with 3D motion. Tabular ML → Computer Vision → LLM Agents → Motion AI — with each expansion into new technology and domain, I've delivered consistent results: building teams from zero and growing MRR by 10x.
>
> I believe a PM's role is to cover every area where problems need solving for a product's success. Beyond planning, I vibe-code internal tools, design prompts, pitch to clients, and build teams — working as an end-to-end Problem Manager.

### 12.4 Skills (카테고리별 태그, 확정)

```json
{
  "AI/ML": ["LLM Agent", "Prompt Engineering", "Context Engineering", "RAG", "AI Evaluation", "Generative AI", "Computer Vision", "Motion AI", "AutoML"],
  "Product": ["B2B SaaS", "AIaaS", "Go-to-Market", "Roadmapping", "PRD", "Agile/Scrum", "Cross-functional Leadership", "Team Building"],
  "Technical": ["Vibe Coding", "System Architecture", "API Design", "SQL", "GA", "Figma", "Notion", "Jira", "Mermaid", "LangChain"],
  "Languages": ["Korean (Native)", "Chinese (Business Fluent, HSK 6)", "English (Professional)", "Japanese (Basic)", "Russian (Elementary)"]
}
```

### 12.5 Contact (확정)

```yaml
email: rhwogus0205@gmail.com          # 공개
github: https://github.com/JayJgao    # 공개
phone: null                            # 비공개
linkedin: null                         # 비공개 (추후 추가 가능)
form_service: null                     # 폼 없음, mailto 링크만
```

### 12.6 Asset Status (확정)

```yaml
profile_photo: available               # 프로필 사진 있음
project_thumbnails: normalized         # slug 기반 webp 썸네일 정규화 완료
resume_pdf: updated                    # /assets/resume/resume_{ko,en}.pdf
```

---

## 13. Quick Start (for Agent)

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
