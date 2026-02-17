# Planning.md — Jay Ko Portfolio & Resume Site

> 이 문서는 프로젝트의 로드맵, 의사결정 히스토리, 단계별 체크리스트를 관리합니다.
> 코딩 작업 전에 반드시 **Agent.md**와 함께 읽어야 합니다.
> 완료된 태스크는 `[x]`로 마킹합니다.

---

## 📋 Table of Contents

1. [전략 요약](#1-전략-요약)
2. [의사결정 히스토리](#2-의사결정-히스토리)
3. [Phase 0: 프로젝트 셋업](#3-phase-0-프로젝트-셋업)
4. [Phase 1: Core Structure (MVP)](#4-phase-1-core-structure-mvp)
4.5. [Phase 1.5: UX & Asset Rework](#45-phase-15-ux--asset-rework)
5. [Phase 2: Content Population](#5-phase-2-content-population)
6. [Phase 3: Three.js & Interactivity](#6-phase-3-threejs--interactivity)
7. [Phase 4: i18n (다국어)](#7-phase-4-i18n-다국어)
8. [Phase 5: Polish & Deploy](#8-phase-5-polish--deploy)
9. [Phase 6: Resume PDF Renewal](#9-phase-6-resume-pdf-renewal)
10. [Backlog & Ideas](#10-backlog--ideas)
11. [콘텐츠 매핑 테이블](#11-콘텐츠-매핑-테이블)
12. [리스크 & 완화 전략](#12-리스크--완화-전략)

---

## 1. 전략 요약

### 포지셔닝
"AI Product Leader who ships at the intersection of Generative AI, 3D/Motion, and Commerce — From tabular ML to LLM agents to motion AI, building and scaling AI products across 6+ years with 10x revenue growth track record"

### 핵심 차별점
- **도메인 확장 내러티브**: Tabular → Vision → LLM → Motion → Generative Video (시장에서 극히 희귀)
- **하드 넘버**: MRR 10x 성장, 25+ B2B 클라이언트, 15억 정부과제, 3 특허
- **바이브 코딩 역량**: 이 사이트 자체가 증거 (Three.js + R3F + Next.js)
- **다국어**: KO/EN/ZH 완전 지원 → 칭화대 졸업 + 글로벌 클라이언트 경험의 실체적 증거

### 타겟 오디언스
| 타겟 | 언어 | 핵심 관심사 |
|---|---|---|
| 한국 AI 스타트업/테크기업 | 한국어 | 실무 성과, 팀 리딩 경험, 도메인 폭 |
| 글로벌 기업 (해외) | English | Impact metrics, system thinking, AI expertise |
| 중화권 기업/네트워크 | 中文 | 칭화대 졸업, 중국어 역량, AI 도메인 경험 |

### 사이트 설계 원칙 (5가지)
1. **Showcase vs Archive**: 메인에는 Featured 5~6개만, 나머지는 깊은 위치로
2. **Impact-First**: 숫자가 먼저, 프로젝트 코드네임은 뒤에
3. **3-Era Narrative**: Before LLM → After LLM → Generative AI Era
4. **Unified Case Study Template**: What/Role/Impact (상단 고정) + Problem → Approach → Execution → Results → Artifacts (본문)
5. **Performance Guardrails**: FCP < 1.5s, Three.js는 lazy + fallback 필수

---

## 2. 의사결정 히스토리

| 날짜 | 결정사항 | 선택 | 근거 |
|---|---|---|---|
| 2026-02-16 | 배포 전략 | GitHub Pages (Static Export) | 무료, 레포와 동일, 충분한 기능 |
| 2026-02-16 | 타겟 오디언스 | 양쪽 동등 (완전한 다국어) | 글로벌+한국 동시 타겟 |
| 2026-02-16 | CineV NDA | 공개 가능한 에셋 있음 | 유저 확인 완료 |
| 2026-02-16 | 프레임워크 | Next.js 15 (App Router) + Static Export | R3F 생태계 풍부, SSG 가능 |
| 2026-02-16 | 3D | React Three Fiber + Drei | React 친화적, 선언적 Three.js |
| 2026-02-16 | 스타일링 | Tailwind CSS v4 | 유틸리티 퍼스트, 빠른 프로토타이핑 |
| 2026-02-16 | 다국어 | next-intl | App Router 네이티브 지원 |
| 2026-02-16 | 애니메이션 | Framer Motion | 스크롤 연동, 페이지 전환 |
| 2026-02-16 | 콘텐츠 관리 | MDX + JSON | 프로젝트 추가 = MDX 파일 추가 + git push |
| 2026-02-16 | Showcase 개수 | Era별 Featured (총 5~6개) | 커리어 스토리텔링에 Era별 대표 필수 |
| 2026-02-16 | 케이스 스터디 구조 | What/Role/Impact + Problem→Approach→Execution→Results→Artifacts | 기존 🚧→💡→✅ 에서 Execution과 Artifacts 분리 |

---

## 3. Phase 0: 프로젝트 셋업

> **목표**: 빌드 가능한 빈 껍데기. `pnpm dev` → 로컬 확인, `pnpm build` → static export, GitHub Actions → 자동 배포.

- [x] **0.1** `create-next-app` 초기화 (TypeScript, Tailwind, App Router, src/ 디렉토리)
  ```bash
  pnpx create-next-app@latest jayjgao.github.io --typescript --tailwind --app --src-dir --use-pnpm
  ```
- [x] **0.2** `next.config.js` 설정
  - `output: 'export'`
  - `basePath: ''` (username.github.io는 basePath 불필요)
  - `images: { unoptimized: true }`
  - `trailingSlash: true` (GitHub Pages 호환)
- [x] **0.3** 의존성 설치
  ```bash
  pnpm add @react-three/fiber @react-three/drei three framer-motion next-intl next-mdx-remote
  pnpm add -D @types/three
  ```
- [x] **0.4** 디렉토리 구조 생성 (Agent.md §3 참조)
- [x] **0.5** GitHub Actions 워크플로우 설정
  ```yaml
  # .github/workflows/deploy.yml
  name: Deploy to GitHub Pages
  on:
    push:
      branches: [main]
  permissions:
    pages: write
    id-token: write
  jobs:
    build-deploy:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v4
        - uses: pnpm/action-setup@v2
          with: { version: 9 }
        - uses: actions/setup-node@v4
          with: { node-version: 20, cache: pnpm }
        - run: pnpm install --frozen-lockfile
        - run: pnpm build
        - uses: actions/upload-pages-artifact@v3
          with: { path: ./out }
        - uses: actions/deploy-pages@v4
  ```
- [x] **0.6** Tailwind 커스텀 테마 기본값 설정
  - 폰트: Pretendard (KO) + Inter (EN) + 시스템 중문 폰트
  - 컬러 팔레트: 다크 모드 우선 (PM 포트폴리오는 다크가 프리미엄 느낌)
  - 브레이크포인트: sm(640), md(768), lg(1024), xl(1280)
- [x] **0.7** 빈 페이지 라우팅 확인
  - `/` → Home
  - `/about` → About
  - `/projects` → Projects
  - `/resume` → Resume
  - `/contact` → Contact
- [x] **0.8** `pnpm build` + `npx serve out` 로 static export 정상 확인
- [x] **0.9** GitHub에 push → Pages 자동 배포 → `jayjgao.github.io` 라이브 확인

**Phase 0 완료 기준**: 빈 페이지 5개가 GitHub Pages에 라이브로 보이면 완료.

---

## 4. Phase 1: Core Structure (MVP)

> **목표**: 한국어 단일 언어로 핵심 레이아웃과 콘텐츠 완성. 방문자가 "이 사람이 뭘 하는 사람인지" 10초 안에 파악 가능.

### 1.1 Layout & Navigation
- [x] `Navbar.tsx` — 로고(Jay Ko) + 메뉴(Projects, About, Resume, Contact) + 다국어 토글(Phase 4에서 활성화)
- [x] `Footer.tsx` — 미니멀 링크(GitHub/Email) + © 2026
- [x] 페이지 전환 애니메이션 (Framer Motion `AnimatePresence`)
- [x] 다크 모드 기본 (라이트 모드 토글은 Backlog)

### 1.2 Home Page (`/`)
- [x] **Hero Section**
  - 이름: **고재현 (Jay Ko)**
  - 타이틀: **AI Product Leader**
  - 원라인: "Building and scaling AI products from tabular ML to generative video — 6+ years, 10x revenue growth"
  - 핵심 숫자 3개 (카운트업 애니메이션):
    - `MRR 10x Growth`
    - `25+ B2B Clients`
    - `3 ML Patents`
  - CTA 버튼 1개: "View Projects" → /projects
  - **NOTE**: 별도 Resume 다운로드 없음. 메인 페이지 자체가 이력서 역할.
  - 배경: Phase 1에서는 CSS 그라디언트 (Phase 3에서 Three.js로 교체)
- [x] **Featured Projects** (Showcase 5~6개, 카드 그리드)
  - 카드: Thumbnail + 한줄 임팩트 + Era 태그 + 회사명
  - Showcase 선정 (확정, Agent.md §12.2 참조):
    1. ⭐ CineV S2M — LLM Agent → Unreal 파이프라인 (기여 50%)
    2. ⭐ CineV MOAI — 모션 AI 평가 플랫폼 (기여 50%)
    3. ⭐ Chroma Awards — Fully AI-Generated Film (기여 50%)
    4. ⭐ Buzzni 숏폼 AI 비디오 편집기 — 0→1 기획·출시·운영 (기여 80%)
    5. ⭐ Buzzni AIaaS 사업부 빌딩 & 리딩 — MRR 10x, 20명 팀빌딩 (기여 80%)
    6. ⭐ Solidware MLaaS — 일본 엔터프라이즈 13개사 (기여 70%)
  - "View All Projects →" 링크
- [x] **Career Timeline** (3-Era 시각화)
  - 가로 타임라인 (2018 → 2026)
  - Era별 색상 구분
  - 회사 로고/이름 + 기간 + 한줄 요약
  - Framer Motion으로 스크롤 인 애니메이션

### 1.3 Projects Page (`/projects`)
- [x] **Era Filter** (탭 또는 필터 버튼: All / Before LLM / After LLM / GenAI Era)
- [x] **Project Grid** (카드, 3열 → 2열(태블릿) → 1열(모바일))
- [x] Featured 프로젝트는 상단에 크게, Archive는 하단에 작게
- [x] 카드 클릭 → `/projects/{slug}`

### 1.4 Project Detail Page (`/projects/[slug]`)
- [x] `CaseStudy.tsx` 컴포넌트 (Agent.md §4.4 통일 템플릿)
- [x] MDX 렌더링 (Phase 2에서 콘텐츠 채움, Phase 1은 S2M 1개만 작성)
- [x] Artifacts 섹션 collapsible (Framer Motion accordion)
- [x] 이전/다음 프로젝트 네비게이션

### 1.5 About Page (`/about`)
- [x] 커리어 서사 (도메인 확장 내러티브, 2~3문단)
- [x] Skills 섹션 (카테고리별 태그 클라우드, 바 그래프 대신)
- [x] Languages 섹션 (KO/ZH/EN/RU + 레벨)
- [x] Education (칭화대, 수상이력)
- [x] Publications, Patents, Hackathons (요약 리스트)

### 1.6 Resume Page (`/resume`)
- [x] `ResumeRenderer.tsx` — `data/resume.ko.json`을 읽어 웹에서 렌더링
- [x] PDF 다운로드 버튼 (언어별 PDF)
- [x] 웹 렌더링 버전과 PDF 버전이 동일한 데이터 소스 사용

### 1.7 Contact Page (`/contact`)
- [ ] Contact Form (Formspree 또는 Getform 연동)
  - Confirmed Content 기준 현재는 mailto만 사용 (폼은 보류)
- [x] 이메일, 전화, LinkedIn, GitHub 링크
- [x] "Let's work together" 메시지

**Phase 1 완료 기준**: 한국어로 모든 페이지가 동작하고, S2M 프로젝트 1개의 케이스 스터디가 완성. 모바일 반응형 확인.

---

## 4.5. Phase 1.5: UX & Asset Rework

> **목표**: Phase 2 진입 전, 정보 밀도 축소 + 시인성 개선 + 에셋 계약 고정 + Mermaid 렌더 파이프라인 도입.

### 1.5.1 Blocking Fixes
- [x] Resume PDF 링크를 실제 파일명(`resume_ko.pdf`, `resume_en.pdf`)으로 동기화
- [x] `hackathon-elevenlabs`를 Era 2 (`After LLM`)로 이동

### 1.5.2 Mermaid Infra
- [x] Mermaid 런타임 렌더 컴포넌트 추가 (`MermaidBlock`)
- [x] MDX ` ```mermaid ` 코드블록 자동 매핑 레이어 추가
- [x] Mermaid 다크 테마 스타일 추가
- [x] source of truth 디렉토리 생성 (`src/content/diagrams/{slug}/*.mmd`)
- [x] 폴백 SVG 규칙 도입 (`public/assets/diagrams/flows/*.svg`)

### 1.5.3 Asset Contract Normalization
- [x] Notion raw HTML/원본 에셋을 `.reference/notion-export/public-assets-raw/`로 이동
- [x] 프로젝트 썸네일 10개를 slug 기반 webp로 재생성
- [x] 대용량 영상 1건 웹 최적화(`solidware-marketing-demo-01.mp4`)
- [x] 에셋 매핑 파일 추가 (`src/data/asset-manifest.json`)

### 1.5.4 UX Rebuild
- [x] Home 상단 영상 스포트라이트 캐러셀 추가
- [x] Featured/Projects 카드 이미지 우선(상품형) 구조로 통일
- [x] Footer의 `Built with vibe coding` 문구 제거
- [x] About/Resume 역할 분리: About=브랜드, Resume=증빙

### 1.5.5 Content Compression
- [x] KO 프로젝트 MDX를 impact-first 압축형 문체로 리라이트
- [x] `cinev-s2m`, `buzzni-shortform-ai`에 Mermaid 코드블록 삽입

**Phase 1.5 완료 기준**: 홈/프로젝트 시인성 개선, Mermaid 렌더 동작, 썸네일 경로 일치, raw 에셋 비배포화 완료.

---

## 5. Phase 2: Content Population

> **목표**: 모든 프로젝트 콘텐츠(MDX)와 이력서 데이터(JSON) 완성.

### 2.1 Resume Data 작성
- [ ] `data/resume.ko.json` — 시나몬 경험 추가, 최신화
- [ ] `data/resume.en.json` — 영문 번역
- [ ] `data/resume.zh.json` — 중문 번역

### 2.2 Project MDX 작성 (한국어 우선)

**Era 3: Generative AI Era (2025~)**
- [ ] `cinev-s2m.mdx` — LLM Agent → Unreal 파이프라인 (⭐ Showcase)
  - Impact: 합류 3개월 내 첫 E2E 통합
  - Artifacts: 아키텍처 다이어그램 (직접 재구성), 프롬프트 설계 예시
- [ ] `cinev-moai.mdx` — 모션 AI 평가 플랫폼 (⭐ Showcase)
  - Impact: 8개월간 유저스터디 6회 + 모델 2건 (vs 이전 3년간 2건)
  - Artifacts: 평가 플랫폼 스크린샷/GIF, 유저스터디 설계
- [ ] `cinev-a2p.mdx` — Off-the-shelf 모델 통합 전략
  - Impact: I2V, I2I, TTS, Music Gen 통합 전략 수립
  - Artifacts: 스키마 설계, 통합 전략 문서

**Era 2: After LLM (2023-2025)**
- [ ] `buzzni-shortform-ai.mdx` — Long→Short-form AI 비디오 편집기 (⭐ Showcase)
  - Impact: 0→1 기획·출시·운영
  - Artifacts: 제품 스크린샷, Mermaid 플로우차트, 프롬프트 AS-IS/TO-BE
- [ ] `buzzni-aiaas-biz.mdx` — AIaaS 사업부 빌딩 & 리딩 (⭐ Showcase)
  - Impact: MRR 500만→5,200만 원 (10x), 20명 팀빌딩, 12개 고객사
  - Artifacts: 제품 라인업, 가격 정책, 팀 구조, 챗봇·검색·리뷰 AIaaS 서브 프로젝트 포함
- [ ] `buzzni-chatbot.mdx` — 이커머스 쇼핑 어시스턴트 챗봇 (Archive)
  - Impact: 신규 서비스 0→1 기획~출시
  - Artifacts: 챗봇 대화 시나리오, EP 스키마
- [ ] `buzzni-aiaas.mdx` — AIaaS 제품 라인업 (검색, 리뷰, 카테고리, 카탈로그)
  - Impact: MRR 2,800만 원, 12개 고객사
  - Artifacts: API 정책 문서, 가격 정책

**Era 1: Before LLM (2018-2022)**
- [ ] `solidware-mlaas.mdx` — 핀테크 MLaaS (⭐ Showcase)
  - Impact: 연매출 100% 신장, 일본 대기업 13개 클라이언트
  - Artifacts: AutoML 제품 소개, 마케팅 전략
- [ ] `solidware-automl.mdx` — AutoML 신규 모듈 개발 (Archive)
- [ ] `lunit-biomarker.mdx` — 비전 바이오마커 SW 초기 기획 (Archive)

**Side Hustles**
- [ ] `hackathon-elevenlabs.mdx` — Multi-persona Agentic AI 롤플레잉
- [ ] `hackathon-meta-llama.mdx` — Text-to-Video Retrieval 3위 입상
- [ ] `chroma-awards.mdx` — Fully AI-Generated Short Film, Sponsor Award Top 11 Finalist (ElevenLabs Chroma Awards 2025)

### 2.3 프로젝트 에셋 준비
- [ ] CineV S2M 아키텍처 다이어그램 (직접 재구성)
- [ ] CineV MOAI 플랫폼 스크린샷/GIF
- [ ] CineV A2P 통합 스키마 다이어그램
- [ ] Buzzni 숏폼 AI 제품 스크린샷 (보도자료 기반)
- [ ] Buzzni 챗봇 대화 예시 스크린샷
- [ ] Solidware AutoML 제품 이미지
- [ ] 각 프로젝트 thumbnail 이미지 (1200x630, OG 비율)

### 2.4 Archive 콘텐츠 정리
- [ ] 프롬프트 모음 → `content/archive/ko/prompt-collection.mdx`
- [ ] 유저매뉴얼 핵심 워크플로우 → GIF 2~3개로 축약
- [ ] 채용과제 설계 → "Team Building" 하이라이트로 압축

**Phase 2 완료 기준**: 모든 프로젝트 MDX와 이력서 JSON이 한국어로 완성. 에셋 파일 모두 `/public/assets/images/` 배치.

---

## 6. Phase 3: Three.js & Interactivity

> **목표**: Hero Scene, Career Timeline, Architecture Viewer를 3D 인터랙티브로 업그레이드.

### 3.1 Hero Scene
- [ ] `HeroScene.tsx` — "Domain Expansion Orbit" 컨셉 (Agent.md §6.1)
- [ ] `FallbackHero.tsx` — CSS 그라디언트 + Framer Motion (저사양/모바일)
- [ ] GPU 감지 + 자동 전환 로직
- [ ] 스크롤 연동 (아래로 스크롤 시 궤도 줌인)
- [ ] 마우스/터치 인터랙션 (궤도 회전)
- [ ] `prefers-reduced-motion` 존중 → 모션 비활성화

### 3.2 Career Timeline (3D)
- [ ] 가로 타임라인 → 3D 노드 그래프 업그레이드 (또는 유지, 필요시)
- [ ] 노드 호버 → 프로젝트 요약 팝업
- [ ] 노드 클릭 → 프로젝트 상세 이동

### 3.3 Architecture Viewer
- [ ] `ArchitectureViewer.tsx` — S2M 파이프라인 인터랙티브 다이어그램
- [ ] React Flow 또는 R3F 기반
- [ ] 모듈 클릭 → 설명 팝업
- [ ] 데이터 흐름 애니메이션 (파티클)

### 3.4 성능 최적화
- [ ] Three.js 에셋 lazy loading (`React.lazy` + `Suspense`)
- [ ] 3D 에셋 Draco 압축 (총 < 2MB)
- [ ] Lighthouse 성능 점수 90+ 확인
- [ ] 모바일 60fps 또는 자동 fallback 확인

**Phase 3 완료 기준**: Three.js Hero가 데스크톱에서 매끄럽게 동작하고, 모바일에서 graceful fallback. Lighthouse Performance 90+.

---

## 7. Phase 4: i18n (다국어)

> **목표**: 한국어/영어/중국어 완전 전환 가능.

### 4.1 인프라
- [ ] next-intl 설정 (static export 호환 모드)
- [ ] `[locale]` 라우팅 세팅
- [ ] `generateStaticParams`로 모든 locale 조합 생성
- [ ] `LocaleSwitcher.tsx` 활성화 (KO / EN / ZH 토글)
- [ ] 기본 locale 자동 감지 (브라우저 언어 기반, static에서는 JS 리다이렉트)

### 4.2 UI 텍스트 번역
- [ ] `i18n/ko.json` (기준)
- [ ] `i18n/en.json`
- [ ] `i18n/zh.json`

### 4.3 콘텐츠 번역
- [ ] `content/projects/en/*.mdx` (11개 프로젝트)
- [ ] `content/projects/zh/*.mdx` (11개 프로젝트)
- [ ] `content/archive/en/*.mdx`

### 4.4 이력서 데이터 번역 확인
- [ ] `data/resume.en.json` 최종 검수
- [ ] `data/resume.zh.json` 최종 검수

### 4.5 SEO
- [ ] `<html lang>` 태그 locale별 설정
- [ ] `<link rel="alternate" hreflang>` 태그
- [ ] Open Graph 태그 locale별 설정
- [ ] `sitemap.xml` 생성 (locale별 URL 포함)

**Phase 4 완료 기준**: KO/EN/ZH 토글이 완벽하게 동작. 모든 페이지에서 언어 전환 시 콘텐츠가 해당 언어로 표시.

---

## 8. Phase 5: Polish & Deploy

> **목표**: 최종 다듬기, 성능 최적화, 라이브 배포.

### 5.1 디자인 Polish
- [ ] 타이포그래피 미세 조정 (줄간격, 자간, 폰트 웨이트)
- [ ] 컬러 팔레트 최종 확정 (다크 모드 대비 확인)
- [ ] 모바일 반응형 전체 점검 (iPhone SE ~ iPad Pro)
- [ ] 프로젝트 카드 호버 효과 정리
- [ ] 페이지 전환 애니메이션 타이밍 조절

### 5.2 SEO & Meta
- [ ] 모든 페이지 `<title>`, `<meta description>` 설정
- [ ] Open Graph 이미지 (1200x630)
- [ ] Twitter Card 설정
- [ ] Favicon set (16, 32, 180, 512)
- [ ] `robots.txt`
- [ ] `sitemap.xml` (자동 생성)

### 5.3 Analytics
- [ ] Google Analytics 4 또는 Plausible 연동 (클라이언트 사이드)
- [ ] 주요 이벤트 추적: Resume 다운로드, Contact 제출, 프로젝트 클릭

### 5.4 접근성 최종 점검
- [ ] 키보드 네비게이션 테스트
- [ ] 스크린 리더 테스트 (VoiceOver / NVDA)
- [ ] WCAG AA 색상 대비 확인
- [ ] `aria-label` 누락 확인

### 5.5 성능 최종 점검
- [ ] Lighthouse: Performance 90+, Accessibility 90+, SEO 90+
- [ ] 번들 사이즈 분석 (`@next/bundle-analyzer`)
- [ ] 이미지 최적화 확인 (WebP, lazy loading)

### 5.6 배포 & 도메인
- [ ] GitHub Pages 라이브 확인
- [ ] 커스텀 도메인 구매 (jayko.dev, jko.ai 등) → CNAME 설정
- [ ] HTTPS 확인
- [ ] 404 페이지 커스텀

**Phase 5 완료 기준**: 프로덕션 퀄리티. 누구에게든 공유 가능한 상태.

---

## 9. Phase 6: Resume PDF Renewal

> **목표**: ATS 최적화된 새 이력서 PDF 생성 (시나몬 경험 포함).

### 6.1 이력서 구조 (1~2페이지)
```
Header: 고재현 (Jay Ko) | AI Product Manager | 6+ Years
        Seoul, Korea | email | phone | website | LinkedIn | GitHub

Summary (3줄):
  "6+ years AI PM spanning tabular ML, computer vision, LLM agents, and motion AI.
   Led 0→1 team building to MRR 10x growth (₩5M→₩52M). 25+ B2B enterprise clients
   including Hyundai, CJENM, Mitsubishi. 3 ML patents, Tsinghua University graduate."

Experience:
  Cinamon (CineV) — AI Tech Product Owner (Apr 2025 – Present)
  • S2M: [Action → Metric]
  • MOAI: [Action → Metric]  
  • A2P: [Action → Metric]
  
  Buzzni — AI Product Manager, AIaaS Team Lead (Apr 2023 – Mar 2025)
  • MRR 10x growth (₩5M → ₩52M), 12 new enterprise clients
  • Launched 2 B2B2C services: AI video editor (MRR ₩24M), shopping chatbot
  • Led 20-person team restructuring, defined AIaaS product lineup & pricing
  
  Dasan E&E (Family-owned HR Consulting) — Business Operations Manager (Jun 2022 – Mar 2023)
  • Led business turnaround during financial crisis
  • Redesigned task development process leveraging AI for operational efficiency
  • Managed overall business operations (finance, client relations, service delivery)
  
  Lunit — AI Product Manager, SCOPE Team (Jan 2022 – Apr 2022)
  • Biomarker analysis SW initial PRD, FDA/CE regulation docs
  
  Solidware (Ailiis) — AI PM, New Business Team Lead (Dec 2018 – Dec 2021)
  • 13 new MLaaS clients (Mitsubishi, AEON, Japan Post Bank)
  • YoY revenue +100%, sales contacts +256%
  • ₩1.5B government grants (6 projects)

Skills: (카테고리별 키워드, 바 그래프 없음)
  AI/ML: LLM Agent, Prompt Engineering, RAG, AI Evaluation, GenAI, Motion AI, AutoML
  Product: B2B SaaS, AIaaS, Go-to-Market, Roadmapping, PRD, Agile/Scrum
  Technical: Vibe Coding, System Architecture, API Design, SQL, GA
  Tools: Figma, Notion, Jira, Mermaid, LangChain

Education: Tsinghua University (Beijing) — B.A. Journalism (Media Statistics), 3.78/4.0
  • Best Graduation Thesis (first international student), Beijing Outstanding Scholarship (3x)

Side: Patents (3), Publication (KSC 2023), Hackathons (ElevenLabs 2025, Meta Llama 3rd 2024)
  Chroma Awards Top 11 Finalist — Sponsor Award (2025, ElevenLabs, Fully AI-Generated Film)

Languages: Korean (Native), Chinese (Business Fluent), English (Professional), Japanese (Basic), Russian (Elementary)
```

### 6.2 PDF 생성 전략
- [ ] 웹 Resume 페이지에서 "PDF 다운로드" 시 미리 빌드된 PDF 제공
- [ ] PDF는 LaTeX, Typst, 또는 React-PDF로 생성
- [ ] ATS 호환: 텍스트 선택 가능, 단일 컬럼, 표준 섹션명
- [ ] 한국어/영어 각각 별도 PDF

**Phase 6 완료 기준**: ATS 최적화된 PDF 2종(KO/EN) 완성, 웹에서 다운로드 가능.

---

## 10. Backlog & Ideas

우선순위 낮지만 고려 중인 아이디어들:

| ID | 아이디어 | 난이도 | 임팩트 | 비고 |
|---|---|---|---|---|
| B1 | 라이트/다크 모드 토글 | 낮음 | 중간 | Tailwind `dark:` 클래스 활용 |
| B2 | 블로그 섹션 (`/blog`) | 중간 | 높음 | MDX 기반, AI/PM 인사이트 |
| B3 | 방명록 / 추천서 섹션 | 낮음 | 중간 | 동료/클라이언트 추천 문구 |
| B4 | Easter Egg: 터미널 모드 | 중간 | 높음 | `~` 누르면 터미널 UI로 포트폴리오 탐색 |
| B5 | AI 챗봇 (자기소개용) | 높음 | 높음 | 이력서 데이터 기반 RAG 챗봇 |
| B6 | PDF 자동 생성 파이프라인 | 중간 | 중간 | JSON → Typst → PDF (GitHub Actions) |
| B7 | 프로젝트 타임라인 시각화 (Gantt) | 낮음 | 낮음 | 프로젝트 기간 오버랩 시각화 |
| B8 | 방문자 히트맵 | 낮음 | 낮음 | 어디를 가장 많이 보는지 |
| B9 | 러시아어 (4번째 언어) | 낮음 | 낮음 | CIS 시장 타겟 시 추가 |

---

## 11. 콘텐츠 매핑 테이블

기존 Notion 포트폴리오 콘텐츠 → 새 사이트 매핑:

| 기존 콘텐츠 | 새 위치 | 변환 방식 | 우선순위 |
|---|---|---|---|
| Mermaid Mindmap (About Me) | `/about` - 인터랙티브 SVG 또는 R3F | 새로 구현 | Phase 1 |
| Notion DB 테이블 (After LLM) | `/projects` - 카드 그리드 | MDX + JSON 메타데이터 | Phase 1 |
| Notion DB 테이블 (Before LLM) | `/projects` - 카드 그리드 | MDX + JSON 메타데이터 | Phase 1 |
| 🚧→💡→✅ 구조 | Case Study Template | What/Role/Impact + 5단계 | Phase 1 |
| 프롬프트 AS-IS/TO-BE | Artifacts 내 코드 diff 뷰어 | Syntax highlight | Phase 2 |
| EP 스키마 정의서 | Artifacts 내 JSON viewer | Collapsible | Phase 2 |
| 유저매뉴얼 (37 섹션) | Archive + GIF 2~3개 요약 | 대폭 축약 | Phase 2 |
| 시나리오/캐릭터 빌드 | Hackathon 프로젝트 하위 | 통합 | Phase 2 |
| 채용과제 설계 | Archive ("Team Building" 요약) | 압축 | Phase 2 |
| Mermaid Flowcharts | 렌더링된 다이어그램 또는 React Flow | 재구현 | Phase 3 |
| (없음) CineV S2M | 새로 작성 | MDX + 아키텍처 다이어그램 | Phase 2 |
| (없음) CineV MOAI | 새로 작성 | MDX + 스크린샷/GIF | Phase 2 |
| (없음) CineV A2P | 새로 작성 | MDX + 스키마 다이어그램 | Phase 2 |
| (없음) Chroma Awards | 새로 작성 | MDX + 영상 임베드 | Phase 2 |

---

## 12. 리스크 & 완화 전략

| 리스크 | 영향 | 확률 | 완화 전략 |
|---|---|---|---|
| Three.js가 모바일에서 성능 저하 | 높음 | 높음 | FallbackHero 필수 구현, GPU 감지 자동 전환 |
| Static export에서 next-intl 호환 이슈 | 중간 | 중간 | `generateStaticParams` 꼼꼼히 설정, 빌드 테스트 자주 |
| CineV NDA 범위 애매함 | 높음 | 낮음 | 아키텍처는 직접 재구성, 제품 화면은 확인된 것만 |
| 콘텐츠 번역 품질 (EN/ZH) | 중간 | 중간 | LLM 번역 후 직접 검수, 핵심 문구는 직접 작성 |
| GitHub Pages 빌드 실패 | 낮음 | 낮음 | 로컬에서 `pnpm build` 반드시 확인 후 push |
| Three.js 번들 사이즈 과대 | 중간 | 중간 | Dynamic import, Tree shaking, Drei 필요 모듈만 import |
| 커스텀 도메인 DNS 전파 지연 | 낮음 | 낮음 | GitHub Pages → CNAME 설정 후 24~48h 대기 |

---

## 📌 Current Status

```
Phase 0: ✅ COMPLETED
Phase 1: ✅ COMPLETED
Phase 1.5: ✅ COMPLETED
Phase 2: ⬜ NOT STARTED
Phase 3: ⬜ NOT STARTED
Phase 4: ⬜ NOT STARTED
Phase 5: ⬜ NOT STARTED
Phase 6: ⬜ NOT STARTED
```

**Next Action**: Phase 2 콘텐츠 보강 (EN/ZH resume 번역, 프로젝트 상세 아티팩트 확장) 착수

---

*Last updated: 2026-02-17*
