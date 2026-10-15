# 디자인 v2: Bauhaus 리프레시 — 구현 계획

> **For agentic workers:** 설계는 `docs/decisions/2026-10-15-bauhaus-v2-design.md`에 있습니다. 시작 전에 설계 문서 전체와 저장소 `AGENTS.md`를 읽으세요. 단계마다 체크박스를 채우고, 단계가 끝나면 커밋하고 사용자에게 화면을 보여준 뒤 다음 단계로 갑니다. 설계 문서에 없는 결정이 필요하면 멈추고 사용자에게 묻습니다.

**Goal:** 크림·주황·mono 대문자를 걷어낸 Bauhaus v2 디자인 언어(흰 종이, ink, 코발트 구조, 노랑 면 전용)를 사이트 전체에 적용합니다. 이어서 홈과 프로젝트 상세를 채용 담당자 동선 기준으로 재구성합니다.

**Architecture:** Next.js 15 static export를 유지합니다. 1단계는 `globals.css` 토큰과 컴포넌트 클래스, i18n 라벨만 바꿉니다. 2단계는 데이터 필드(`results`, `featuredResult`, `links`, `productStatus`, `meta.linkedin`)를 추가하고 홈·상세·목록 컴포넌트를 재구성합니다.

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind 4(`@theme inline`), node:test via `tsx`, `scripts/verify-export.ts`.

**Branch:** `codex/refactor` (2026-10-15 작업 요청 반영). 이력서 업데이트 브랜치(`codex/update-resume-canonical`)가 `main`에 병합된 뒤 `main`에서 분기합니다. 병합 전이면 어느 브랜치에서 시작할지 사용자에게 묻습니다.

**Reference:** `docs/decisions/2026-10-15-bauhaus-v2-reference/home.html`, `project-detail.html`. 브라우저로 열고 「변경점 보기」를 켜면 바뀐 이유가 번호 메모로 뜹니다. 시안의 상단 검은 띠, 번호 메모, 부록 섹션은 시안 전용이라 사이트에 옮기지 않습니다.

**원칙**

- 저장소 `AGENTS.md`의 Verification대로 테스트를 먼저 바꿔 RED를 확인하고 구현합니다. 아래 "테스트 계약"이 v1 결정을 고정하고 있으니, 설계 문서의 v2 결정에 맞게 기대값을 먼저 고칩니다.
- 사이트 어디에도 "확인 필요", "TBD", "검토 중" 같은 표시를 넣지 않습니다. 설계 문서의 문구는 모두 확정입니다.
- 각 단계 끝에 아래 명령을 모두 통과시킵니다.

```bash
npm test
npm run lint -- --no-cache
npm run typecheck
npm run build
npm run verify:export
git diff --check
```

---

## 0단계 — 콘텐츠 수정 (디자인과 무관, 먼저 커밋)

- [x] **0-1. 버즈니 AIaaS 페이지의 에이플러스AI 링크 삭제**
  - 파일: `src/content/projects/ko/buzzni-aiaas-biz.mdx`, `src/content/projects/en/buzzni-aiaas-biz.mdx`, `src/content/projects/zh/buzzni-aiaas-biz.mdx`
  - 세 파일 33~36행의 `aplusai.ai/article/123842`, `115878`, `112071`, `112073` 링크 4줄을 지웁니다. ZDNet Korea와 컴퓨터월드 링크는 남깁니다.
  - 확인: `grep -rn aplusai src` 결과가 없어야 합니다.
  - 커밋: `content: remove AplusAI article links from AIaaS business case`

---

## 1단계 — 디자인 언어 (시각만, 구조 변경 없음)

### 1-1. 테스트 계약을 v2로 바꾸기 (RED)

- [x] `tests/phase2-design.test.ts`
  - "approved editorial color and depth system"(65행 부근): 허용 색을 `#ffffff`, `#0e0e0e`, `#5a5d66`, `#d9dbe0`, `#2835f8`, `#f3f4ff`, `#ffc400`로 바꿉니다. `#f4e9e1`, `#ff5c00`, `#b83c00`, `#242320`, `#ff3d00`이 없어야 한다는 단언을 추가합니다.
  - 모서리 허용값(77~82행): `["0", "50%"]`로 바꿉니다.
  - "orange separates vivid surfaces…"(88~135행): "signal yellow is fill-only"로 바꿉니다. `--color-signal-yellow`가 `color:` 선언에 한 번도 쓰이지 않는지, `background`·`border` 계열에만 쓰이는지 단언합니다. 큰 색면 클래스(`.demo-preview-chapter`, `.demo-list-hero`, `.demo-block--orange`의 후속 이름, `.about-demos-bridge`, `.mdx-content .award-result`)가 코발트 바탕 + 흰 글자이거나 흰 바탕 + 3px ink 테두리인지 단언합니다.
  - 새 테스트 "labels are sans and never uppercased": `globals.css`에 `text-transform: uppercase`가 없어야 합니다. 설계 3.2의 라벨 클래스들이 mono를 쓰지 않아야 합니다.
- [x] `tests/phase3-content.test.ts` 470행 부근: 색 목록을 v2로 바꿉니다.
- [x] `tests/demo-presentation.test.ts` 89행 부근: `nav.demos`(ko `데모`, en `Demos`, zh `演示`)와 묶음 제목(ko `제품에 반영된 데모` / `실험과 내부 도구`)을 언어별 값으로 바꿉니다. `demos.page.title`은 2단계에서 바꿉니다.
- [x] `tests/home-about.test.ts`, `tests/phase3-content.test.ts`의 소개 페이지 kicker 단언(`Working with Me`, `Three Languages, Three Markets`): ko 값을 `함께 일하는 방식`, `세 언어, 세 시장`으로 바꿉니다. en은 그대로입니다.
- [x] `npm test`로 바꾼 테스트만 실패하는지 확인합니다.

### 1-2. 토큰

- [x] `src/styles/globals.css` `:root`를 설계 3.1 표대로 바꿉니다. `--background: var(--color-paper)`, `--accent: var(--color-signal-yellow)`, `--muted: var(--color-gray)`로 둡니다. `--color-bone-cream`, `--color-ember-orange`, `--color-ember-orange-text`, `--color-charcoal`은 지웁니다.
- [x] 크림을 직접 부르던 선택자 17곳을 paper·cobalt-tint·ink 중 맞는 것으로 바꿉니다.
  - `html`, `body`, `.btn-primary`, `.btn-on-orange`(+hover), `.site-header`, `.nav-link:hover`/`.is-active`, `.scroll-progress__counter`, `.spotlight-item`(+active/hover), `.era-filter__button:hover`/`.is-active`, `.demo-card`, `.demo-preview-grid .demo-card`, `.demo-gallery-thumbnail`, `.about-demos-bridge:hover`
  - 활성·hover 상태는 ink 바탕 + 흰 글자 또는 cobalt-tint로 합니다.
- [x] 주황을 부르던 선택자 12곳을 바꿉니다. 큰 면은 코발트, 작은 글자는 ink입니다.
  - `.scroll-progress--demo`(+`__line`), `.hero-clause--demo`(2단계에서 삭제), `.demo-preview-chapter`, `.demo-list-hero`, `.demo-block--orange`(클래스 이름을 `.demo-block--accent`로), `.mdx-content .award-result`, `.reasoning-ledger span`, `.how-it-works-list > li > span`, `.demo-video-placeholder`, `.demo-video-play:hover .demo-video-play__icon`, `.about-principles span`, `.about-demos-bridge`, `.about-markets-ledger span`
  - `DemoDetail.tsx`의 `demo-block--orange` 참조도 함께 바꿉니다.

### 1-3. 글꼴

- [x] `text-transform: uppercase` 13곳을 모두 지웁니다.
  - `.section-kicker`, `.section-index`, 버튼 4종, `.site-wordmark`, `.hero-meta`, `.hero-stat__label`, `.project-card-meta`, `.demo-card__meta`, ledger `dt`, `.demo-card__outcome p`, `.demo-card__action`, `.demo-outcome p`, `.demo-media-group > h3`, `.stack-definitions dt`, `.about-demos-bridge strong`
- [x] mono 36곳을 정리합니다.
  - **mono 유지(숫자·날짜·순번)**: `.section-index`, `.scroll-progress__counter`, `.timeline-row__number`, `.project-archive-index`, `.mdx-content h2::before`, `.demo-gallery-counter`, `.resume-experience-row header > p`(기간), `.about-principles span`·`.about-markets-ledger span`(순번)
  - **sans로 변경**: 나머지 전부(`.skip-link`, `.section-kicker`, `.pill`, 버튼 4종, `.site-wordmark`, `.nav-link`, `.locale-trigger`, `.site-footer__inner`, `.hero-meta`, `.hero-stat__label`, `.project-card-meta`, `.demo-card__meta`, ledger `dt`, `.era-filter__button`, `.project-archive-company`, `.project-archive-era`, `.project-fallback-notice`, `.project-detail-nav > div`, `.demo-card__outcome p`, `.demo-card__action`, `.demo-back-link`, `.demo-outcome p`, `.reasoning-ledger span`, `.how-it-works-list > li > span`, `.demo-media-group > h3`, `.demo-video-placeholder`, `.demo-diagram__hint`, `.stack-definitions dt`, `.about-demos-bridge strong`, `.resume-contact`, `.resume-kpi-ledger p`, `.resume-kpi-ledger span`, `.resume-experience-row header > span`(직함))
  - 선택자가 숫자와 라벨을 함께 담고 있으면, 숫자 부분만 감싸는 `<span class="num">`(mono + tabular-nums)를 컴포넌트에 추가합니다.

### 1-4. 선과 모양

- [x] `border-radius: 999px`(`.pill`, 버튼 4종, `.nav-link`, `.locale-trigger`)를 0으로 바꿉니다. `.demo-video-play__icon`의 50%는 둡니다.
- [x] `.pill`을 `.tag`로 이름을 바꾸고 설계 3.4대로 고칩니다. `ProjectCard.tsx`, `CaseStudy.tsx`, 데모 컴포넌트의 `className="pill"`도 함께 바꿉니다.
- [x] 구조 선을 1px ink에서 3px ink로 올립니다.
  - `.site-header` 아래, `.chapter-heading`(섹션 머리 위), `.timeline-ledger` 위, `.project-card--featured`/`--default` 묶음 테두리, `.demo-preview-grid`/`.demo-list-grid` 테두리, `.project-detail-ledger` 위, `.project-detail-nav` 위아래, `.mdx-content h2` 위
- [x] 행 구분 1px 선(`.timeline-row`, `.project-card--archive`, `.project-card-ledger > div + div`, `.project-detail-ledger > div + div`, `.reasoning-ledger li`, `.how-it-works-list li`, `.stack-definitions > div`, `.about-principles li`)은 hairline 색으로 바꿉니다.
- [x] 섹션 제목(`.section-display`) 앞에 노랑 네모를 `::before`로 붙입니다(0.6em, 2px ink 테두리, 제목과 `gap` 0.5em).

### 1-5. 버튼·포커스

- [x] 설계 3.4 표대로 `.btn-primary`, `.btn-secondary`, `.btn-on-cobalt`를 고칩니다. `.btn-on-orange`는 지우고 쓰던 곳(`DemosPreview.tsx` 등)을 `.btn-primary`로 바꿉니다.
- [x] 전역 `:focus-visible`을 3px 코발트 아웃라인으로 바꿉니다.

### 1-6. 라벨(i18n)

- [x] 설계 3.5 표대로 `src/i18n/{ko,en,zh}.json`의 라벨을 바꿉니다. 키 구조는 바꾸지 않고 값만 바꿉니다.
- [x] 국문 MDX 15개의 h2를 바꿉니다: `## Problem`→`## 문제`, `## Approach`→`## 접근`, `## Execution`→`## 실행`, `## Results`→`## 결과`, `## Appendix`→`## 부록`, `## Evidence Gallery`→`## 근거 자료`. `## CineV Highlight`, `## CineV Technologies`는 고유명이라 그대로 둡니다.
  - `tests/project-data.test.ts` 313~343행(branding MDX의 `## Execution`/`## Results` 위치 단언)을 국문 h2에 맞게 고칩니다.
  - `tests/fixtures/project-headings.json`이 h2를 담고 있으면 함께 고칩니다.
- [x] 데모 라벨(ko): `demos.status.productized` `Productized`→`제품 반영`, `demos.status.internal` `Internal`→`내부 도구`, `demos.kind` `Service/Prototype/Workflow`→`서비스/프로토타입/워크플로`. en은 그대로 두고, zh는 대응어로 바꿉니다.
- [x] MDX `.highlight-callout__eyebrow`: ko `Lessons & Learned`→`배운 것`, en `Lessons & Learned`→`Lessons Learned`, zh `经验与收获`→`经验与反思`(1건)

### 1-7. 저장소 `AGENTS.md`의 Design language 갱신

- [x] 다음 내용으로 바꿉니다(영문 유지).
  - White paper surfaces, Ink text and 3px structural rules, Cobalt structural fills, Signal Yellow as a fill-only secondary.
  - `#ffc400` is never used for text. Mono only for numbers, dates, and indexes. No uppercase transforms. Square corners; circles only for the hero dot and play icon.
  - Labels follow the page locale; titles, proper nouns, and the hero meta line stay in English.
  - Keep: no dark mode, decorative icons, gradients, shadows, or forced line breaks in prose.

### 1-8. 화면 확인과 커밋

- [x] `npm run build && npx serve out`로 띄우고 Playwright로 1440px·390px 전체 화면 캡처를 `.local/v2-qa/phase1/`에 저장합니다. 대상은 `/ko/`, `/ko/projects/`, `/ko/projects/buzzni-aiaas-biz/`, `/ko/projects/lunit-biomarker/`(배운 것 없는 비대표), `/ko/demos/`, `/ko/demos/voice-adaptor/`, `/ko/about/`, `/ko/resume/`, `/en/`, `/zh/`입니다.
- [x] 390px에서 `document.documentElement.scrollWidth`가 390을 넘지 않아야 합니다.
- [x] 크림·주황이 화면 어디에도 남지 않았는지, 대문자 라벨이 없는지 캡처로 확인합니다.
- [x] 전체 검증 명령을 통과시킵니다.
- [x] 커밋 `design: apply Bauhaus v2 tokens, type, rules, and labels`. 캡처를 사용자에게 보여주고 2단계 진행 여부를 묻습니다.

---

## 2단계 — 정보 구조

### 2-1. 데이터 (테스트 먼저)

- [ ] `src/types/content.ts`(또는 Project 타입 위치)에 다음을 추가합니다.
  - `results?: { value: Localized<string>; caption: Localized<string> }[]`(2~3개)
  - `featuredResult?: number`(기본 0)
  - `links?: { label: Localized<string>; url: string }[]`
- [ ] `src/data/projects.json`
  - 대표 프로젝트 6개에 설계 4.2 표의 `results`와 `featuredResult`를 넣습니다. en·zh 값은 정본 9장 표기 기준으로 옮기고 humanizer로 다듬은 뒤 숫자를 국문과 대조합니다.
  - `showcaseOrder`를 설계 4.1대로 바꿉니다(ai-po 1, aiaas-biz 2, enablement 3, chroma 4, shortform 5, solidware 6).
  - 외부 링크를 MDX에서 `links`로 옮깁니다. aiaas-biz는 ZDNet Korea·컴퓨터월드, shortform은 관련 기사(ZDNet Korea), ai-po는 CineV 제품 링크, chroma는 「HappyEnd」·「Mystery Invitation」 Devpost 링크입니다. 옮긴 MDX 링크 목록은 지웁니다.
- [ ] `src/data/demos.json`: productized 3개에 `productStatus`를 넣습니다(prompt-enhancer `shipped`, voice-adaptor `partial`, reverse-storyboard `shipped`). `src/types/demo.ts`에 타입을 추가하고, i18n `demos.status`에 `partial`(ko `일부 반영`, en `Partly shipped`, zh 대응어)을 추가합니다. `shipped`는 기존 `status.productized` 라벨을 씁니다.
- [ ] `src/data/resume.{ko,en,zh}.json` `meta.linkedin = "https://www.linkedin.com/in/jayko-ai/"`
- [ ] `tests/project-data.test.ts`, `tests/fixtures/project-facts.json`: 대표 6개의 `results` 개수(2~3)와 ko value 정확값, `featuredResult` 범위, `showcaseOrder`, `links`에 `aplusai`가 없음을 단언합니다. 기여도 단언(60·90 등)은 그대로 둡니다.

### 2-2. 홈 (테스트 먼저)

- [ ] `tests/home-about.test.ts`
  - 히어로 copy 기대값(56~66행)을 설계 4.1 표로 바꿉니다. 키는 `headline`, `lead: string[]`, `career`(메타 영문 줄), `stats[]`(value·caption)입니다.
  - 계층 단언(72~87행)을 `headline → lead → stats` 순서로 바꿉니다.
  - 섹션 마커 순서(157행)를 `["hero", "featured", "demos", "timeline", "films"]`로 바꿉니다.
- [ ] `tests/phase2-design.test.ts`
  - "Home Hero delegates navigation without … CTAs"를 뒤집습니다. 히어로에 이력서 PDF 링크와 LinkedIn 링크가 있어야 합니다.
  - `.hero-display` 크기 단언을 국문 한 문장이 들어가는 값(`clamp(2rem, 5.2vw, 4.4rem)` 부근)으로 바꿉니다.
  - `timeline-ledger`·`eraColors` 단언을 막대 타임라인(`career-bars`) 단언으로 바꿉니다.
- [ ] `tests/phase3-content.test.ts` 362행 "avoid em-dash and middle-dot": 감사 대상을 `hero.lead[]`와 영상 띠 문구로 바꿉니다. `hero.supporting`·`timeline.eras`·spotlight 문구는 지워지므로 대상에서 뺍니다.
- [ ] `tests/demo-presentation.test.ts`: `demos.page.title` ko `추상적인 언어보다, 동작하는 데모로`. en·zh는 국문을 옮긴 값으로 고정합니다.
- [ ] 구현
  - `HeroSection.tsx`: 메타 줄, H1, `lead` 문장별 블록, 버튼, 사진(코발트 블록 + 노랑 원)
  - 근거 띠: 공용 `ResultBand` 컴포넌트를 새로 만들어 쓰고, 2-3에서 다시 씁니다.
  - `FeaturedProjects.tsx`: `showcaseOrder` 1~3 사례 카드(설계 4.1 카드 구성)
  - `DemosPreview.tsx`: 행 목록, 상태 태그, 개수 문구
  - `CareerTimeline.tsx`: `resume.{locale}.json` 기반 막대. 서버 컴포넌트로 바꾸고 `<br>`을 쓰지 않습니다.
  - 새 `FilmsStrip`: 설계 4.1 문구. 링크는 `${FILMS_URL}/?lang=${locale}`
  - `src/app/[locale]/page.tsx`: 순서와 `data-home-section` 마커 갱신
  - `Footer.tsx`: 이메일, LinkedIn, GitHub
- [ ] `VideoSpotlightCarousel`을 홈에서 빼면 쓰는 곳이 없어집니다. 컴포넌트, `spotlights.json`, i18n `home.spotlight`를 지웁니다. `public/` 아래 포스터 중 다른 곳에서 참조하지 않는 파일은 `asset-manifest.json`과 함께 지웁니다. 지우기 전에 `grep -rn <파일명> src`로 참조가 없는지 확인합니다.

### 2-3. 프로젝트 상세 (테스트 먼저)

- [ ] `tests/phase2-design.test.ts` "Projects separate … retain detail media": `data-project-section`에 `results`, `lessons`가 생기는지, 썸네일이 머리 안에 있는지 단언합니다. 기여도 단언(289~292행)은 유지합니다.
- [ ] `CaseStudy.tsx` 재구성: 머리(브레드크럼·회사·재직 기간·H1·썸네일) → 2열(왼쪽 레일 원장·태그·관련 링크 / 본문: `ResultBand` → MDX) → 이전·다음
  - 재직 기간은 설계 4.2의 매칭 규칙을 따릅니다. 시대 라벨 표시는 지웁니다.
  - MDX 맨 앞 `.highlight-callout`이 결과 띠 바로 아래 오도록 MDX 구조를 확인합니다. 대표 6개 MDX에서 callout이 맨 앞이 아니면 맨 앞으로 옮깁니다.
  - `.highlight-callout` CSS를 설계 3.4의 '배운 것' 하이라이트로 다시 그립니다.
- [ ] 대표 6개 MDX(ko·en·zh)에서 `## 결과`/`## Results`/`## 成果`·`## 结果` 숫자 목록을 지웁니다. 숫자가 아닌 자료(영상 임베드, 이미지)는 `## 부록`/`## Appendix`/`## 附录`로 옮깁니다. chroma의 `<p className="award-result">`는 결과 띠와 겹치므로 지웁니다.
- [ ] 이전·다음 내비를 설계 4.2대로 고칩니다.

### 2-4. 프로젝트 목록 (테스트 먼저)

- [ ] `tests/project-data.test.ts` 48~120행, 391~420행의 era 테스트를 회사 필터 테스트로 바꿉니다.
- [ ] `EraFilter.tsx` → `CompanyFilter.tsx`, `ProjectsExplorer.tsx` 갱신, `ProjectCard.tsx` 대표 카드는 사례 카드 컴포넌트를 쓰고 archive 행은 회사·재직 기간을 씁니다.
- [ ] `eras.json`, `lib/eras.ts`, 프로젝트의 `era` 필드, i18n `home.timeline.eras`, `projects.page.description`의 3-Era 문장을 지웁니다. 새 설명: ko `회사와 기간 순으로 정리했습니다.`

### 2-5. 화면 확인과 커밋

- [ ] 1-8과 같은 목록을 `.local/v2-qa/phase2/`에 캡처하고 레퍼런스 시안 두 장과 나란히 비교합니다.
- [ ] 대표 6개 상세 페이지를 모두 캡처합니다. 결과 띠 칸 수(3·3·3·2·3·2), 배운 것 위치, 에이플러스AI 링크 없음을 확인합니다.
- [ ] 390px 가로 넘침이 없어야 하고, 사이트 어디에도 확인 표시가 없어야 합니다(`grep -rn "확인 필요\|TBD" out/` 결과 없음).
- [ ] `verify:export` 인벤토리가 106 HTML / 84 localized / 45 project / 24 demo / 19 legacy 그대로인지 확인합니다.
- [ ] 커밋 `feat: restructure home and project detail for v2`. 캡처를 사용자에게 보여줍니다.

---

## 완료 기준

- 크림·주황·mono 대문자 라벨이 사이트에 남아 있지 않습니다.
- 노랑은 면으로만 쓰이고 글자색으로 쓰인 곳이 없습니다.
- 국문판의 메뉴·섹션·라벨이 모두 국문입니다.
- 홈 첫 화면에서 포지셔닝 문장, 근거 숫자 3개, 이력서 PDF 버튼이 보입니다.
- 대표 프로젝트 6개 상세에 결과 띠와 '배운 것' 하이라이트가 있습니다.
- 버즈니 AIaaS 페이지에 에이플러스AI 링크가 없습니다.
- 모든 검증 명령이 통과하고 export 인벤토리가 그대로입니다.


## 실행 기록 — 2026-10-15

- `main`의 이력서 업데이트 병합 커밋 `b03ae69`에서 기존 격리 작업 트리를 사용하고, 사용자 요청에 따라 `codex/refactor` 브랜치를 생성했습니다.
- 0단계: `3955da6`에서 세 언어의 에이플러스AI 링크 12개를 삭제했습니다.
- 1단계: v2 UI 색상·글꼴·구조선·라벨·버튼을 적용했습니다. 2단계 정보 구조와 본문 변경은 화면 확인 이후로 남겨둡니다.
- 정본 데모 다이어그램과 기존 증거 이미지, PDF는 보존했습니다. UI 팔레트 제거 조건은 원본 자료 내부의 색상까지 재작성한다는 의미로 확대하지 않았습니다. 파비콘과 자체 제작 AI PO 썸네일만 UI 색상에 맞췄습니다.
- 접근성 보완: 기본 포커스는 3px 코발트입니다. 같은 코발트 면에 직접 놓인 대표 사례 전체 버튼, 데모 전체 버튼, 데모 뒤로 링크에만 흰 포커스 링을 적용하여 대비를 확보했습니다.
- 자동 테스트는 변경 전 157개에서 163개로 늘었습니다. 새 계약의 RED를 확인한 뒤 전체 GREEN을 확인했습니다. 지정된 test / lint / typecheck / build / verify:export / diff 검사를 통과했습니다.
- export 인벤토리: 106 HTML / 84 localized / 45 Project / 24 Demo / 19 legacy, 내부 링크 1,082개.
- 화면: 지정한 10개 경로 × 1440px·390px, 총 20개 전체 캡처를 `.local/v2-qa/phase1/`에 저장했습니다. 모든 페이지에서 문서 가로 넘침과 uppercase 변환이 없었습니다. 캐러셀·필터·다이어그램의 내부 스크롤은 기존 동작대로 유지됩니다.
- 브라우저 조작: 언어 메뉴 열기·Escape·포커스 복귀, 필터 전환, 동일 페이지의 언어 전환, PDF 버튼 hover, reduced-motion, 코발트 면의 포커스 대비를 확인했습니다.
- 별도 설계 준수 리뷰와 코드 품질 리뷰를 완료했습니다. 2단계는 사용자의 1단계 화면 확인을 기다립니다.
