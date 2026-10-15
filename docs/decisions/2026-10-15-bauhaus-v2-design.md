# 디자인 v2: Bauhaus 리프레시 — 설계

**Date:** 2026-10-15
**Status:** 승인. 2026-10-15 사용자와 시안 두 장을 놓고 확정함
**Plan:** `docs/decisions/2026-10-15-bauhaus-v2-plan.md`
**Reference:** `docs/decisions/2026-10-15-bauhaus-v2-reference/home.html`, `project-detail.html`

> 이 문서는 무엇을 왜 바꾸는지 정합니다. 작업 순서와 테스트는 plan 문서를 따릅니다. 시안 HTML은 브라우저로 열어 상단 띠의 「변경점 보기」를 누르면 바뀐 이유가 번호 메모로 뜹니다. 시안과 이 문서가 다르면 이 문서를 따릅니다.

## 1. 배경

- v1 디자인은 Bauhaus·브루탈리즘 미학(굵은 구조, 원색 면, 장식 없는 타이포)을 의도했습니다. 그런데 크림 바탕(`#f4e9e1`), 주황 강조(`#ff5c00`), mono 대문자 라벨 세 가지가 요즘 'AI beige'로 불리는 AI 생성 페이지의 인상과 겹칩니다.
- v2는 Bauhaus 정체성을 유지하고 이 세 가지만 걷어냅니다. 흰 종이, 검정 잉크, 코발트 구조, 노랑 한 점으로 갑니다.
- 구직 기간에 이 사이트가 하는 일은 하나입니다. 채용 담당자가 첫 화면에서 포지셔닝과 근거 숫자를 보고, 한 번에 이력서까지 가게 하는 것입니다. 정보 구조(2단계)는 이 동선을 기준으로 바꿉니다.

## 2. 사실의 원천

- 경력·숫자·표현의 원천은 이력서 정본 `/Users/jayko/Documents/career/정본/정본.md`입니다. 이 문서의 3장 지표 K1~K8, 2장 소개문 SUM-H·SUM-1~3, 9장 영문판 표기 기준을 씁니다.
- 아래 4장과 5장에 적힌 문구는 모두 사용자가 확인한 문구입니다. 그대로 씁니다.
- 사이트에 "확인 필요", "TBD", "검토 중" 같은 표시를 절대 넣지 않습니다. 시안 HTML의 번호 메모와 상단 띠도 시안 전용이며 사이트에 옮기지 않습니다.
- 영문·중문 문구가 정본에 없으면 저장소 `AGENTS.md`의 Content workflow대로 국문을 옮기고 사실을 대조합니다. 새 주장을 만들거나 강화하지 않습니다.

## 3. 디자인 언어 (1단계)

### 3.1 색

| 토큰 | 값 | 쓰임 |
|---|---|---|
| `--color-paper` | `#ffffff` | 모든 페이지 바탕. 크림을 대체 |
| `--color-ink` | `#0e0e0e` | 본문, 굵은 선, 기본 버튼 |
| `--color-gray` | `#5a5d66` | 보조 글자. 흰 바탕 대비 6.6:1 |
| `--color-hairline` | `#d9dbe0` | 행 구분 1px 선 전용. 글자에 쓰지 않음 |
| `--color-cobalt-blue` | `#2835f8` | 구조 색면(지표 띠, 결과 띠), 링크 hover, 포커스 링. 흰 글자 대비 7.1:1 |
| `--color-cobalt-tint` | `#f3f4ff` | 카드 hover 바탕 |
| `--color-signal-yellow` | `#ffc400` | 보조 원색. **면 전용** |

- 지웁니다: `--color-bone-cream`, `--color-ember-orange`, `--color-ember-orange-text`, `--color-charcoal`. `--background`는 paper, `--accent`는 signal-yellow, `--muted`는 gray를 가리키게 합니다.
- 노랑은 흰 바탕 대비가 1.6:1이라 **글자색으로 쓰지 않습니다**(`color:`에 쓰지 않음). 쓰는 곳은 섹션 제목 앞 네모 표시, 히어로 사진 위 원, '배운 것' 하이라이트의 왼쪽 막대뿐입니다. 노랑 면 위 글자는 ink입니다(대비 12:1).
- 큰 색면은 코발트만 씁니다. v1에서 주황으로 칠하던 큰 면(`.demo-preview-chapter`, `.demo-list-hero`, `.demo-block--orange`, `.about-demos-bridge`, `.mdx-content .award-result`)은 코발트 바탕에 흰 글자, 또는 흰 바탕에 3px ink 테두리로 바꿉니다. 노랑으로 큰 면을 칠하지 않습니다.
- 다크 모드는 계속 넣지 않습니다.

### 3.2 글꼴

- IBM Plex Sans KR(400·600·700), IBM Plex Mono(400·500), Noto Sans SC(중문)를 그대로 씁니다.
- **mono는 숫자·날짜·순번에만 씁니다.** 기간(`2023.04 – 2025.03`), 순번(`01`), 진행 카운터, 금액이 대상이고 `font-variant-numeric: tabular-nums`를 함께 줍니다. 메뉴, 버튼, 라벨, 태그, 머리글, 각주는 sans로 바꿉니다.
- `text-transform: uppercase`는 모두 지웁니다.
- 제목은 굵기 700, 자간 `-0.02em ~ -0.03em`입니다. 본문 한국어는 `word-break: keep-all`을 유지합니다.

### 3.3 선과 모양

- 구조 선은 **3px ink**입니다. 사이트 머리글 아래, 섹션 머리 위, 카드 묶음 테두리와 카드 사이, 원장(ledger) 맨 위, 이전·다음 내비 위아래가 대상입니다.
- 행 구분은 **1px hairline**입니다. 목록 행, 원장 행, 데모 행이 대상입니다.
- 모서리는 모두 0입니다. 원(`50%`)은 히어로 원 장식과 재생 아이콘에만 씁니다. 알약(`999px`)은 없앱니다.
- 그림자와 그라디언트는 쓰지 않습니다.

### 3.4 컴포넌트 규칙

| 컴포넌트 | v2 규칙 |
|---|---|
| 버튼 `.btn-primary` | ink 바탕, 흰 글자, 2px ink 테두리, 모서리 0, sans 600 15px. hover는 코발트 바탕·테두리 |
| 버튼 `.btn-secondary` | 흰 바탕, ink 글자, 2px ink 테두리. hover는 코발트 |
| 버튼 `.btn-on-cobalt` | 코발트 면 위: 흰 2px 테두리, 흰 글자. hover는 흰 바탕·코발트 글자 |
| `.btn-on-orange` | 삭제. 쓰던 곳은 `.btn-primary`로 |
| 태그 `.pill` | 이름을 `.tag`로 바꿈. 2px ink 테두리, 모서리 0, sans 600 13px, 대문자 변환 없음 |
| 섹션 머리 | 3px ink 윗선 → 제목(700)과 노랑 네모(0.6em, 2px ink 테두리) → 오른쪽에 보조 정보나 '전체 ↗' 링크 |
| 지표·결과 띠 `ResultBand` | 코발트 바탕, 흰 글자, 칸 사이 3px 흰 선. 숫자 700 큰 글자, 설명 15px. 2칸 또는 3칸. 모바일에서는 세로로 쌓고 칸 사이 가로 3px 흰 선 |
| 카드 묶음 | 바깥 3px ink 테두리, 카드 사이 3px ink 선. hover 바탕은 cobalt-tint |
| 원장(ledger) | 맨 위 3px ink, 행 사이 1px hairline. 라벨(dt)은 gray sans, 값(dd)은 ink 600 |
| '배운 것' 하이라이트 | 3px ink 테두리, 왼쪽 12px 노랑 막대(오른쪽에 3px ink 선), 안쪽에 라벨 '배운 것' + 제목 + 본문 + 목록 |
| 포커스 | `outline: 3px solid var(--color-cobalt-blue); outline-offset: 2px` |
| 움직임 | 색 전환 0.15s만. `prefers-reduced-motion`에서는 끔 |

### 3.5 언어 규칙

- 메뉴, 섹션 이름, 라벨, 버튼은 페이지 언어로 씁니다. 국문판은 국문입니다.
- 영어로 두는 것은 직함(AI Product Leader 등), 고유명사, 기술 용어, 히어로 메타 줄입니다. 히어로 메타 줄은 세 언어 모두 같은 영문입니다(4.1).
- 국문판에서 바꿀 라벨:

| 위치 | v1 | v2 (ko) |
|---|---|---|
| `nav.projects` | 포트폴리오 | 프로젝트 |
| `nav.demos` | Demos | 데모 |
| 홈 대표 프로젝트 | Featured Showcase / Notable Projects | 대표 사례 |
| 홈 데모 '전체' 링크 | View All Demos | 데모 전체 |
| 홈 경력 | 3-Era Narrative / Career Timeline | 경력 |
| 프로젝트 목록 | Portfolio / Projects | 프로젝트 |
| 목록 구분 | Featured / Archive | 대표 프로젝트 / 전체 목록 |
| 필터 | All | 전체 |
| 데모 묶음 | Built into Products / Experiments and Internal Tools | 제품에 반영된 데모 / 실험과 내부 도구 |
| 소개 | Working with Me / Three Languages, Three Markets | 함께 일하는 방식 / 세 언어, 세 시장 |
| 프로젝트 본문 h2 | Problem / Approach / Execution / Results / Appendix / Evidence Gallery | 문제 / 접근 / 실행 / 결과 / 부록 / 근거 자료 |
| 배운 것 라벨 | Lessons & Learned | 배운 것 |
| 데모 상태 | Productized / Internal | 제품 반영 / 내부 도구 (부분 반영은 일부 반영) |
| 데모 종류 | Service / Prototype / Workflow | 서비스 / 프로토타입 / 워크플로 |

- 영문판은 영문 라벨을 문장형 대소문자로 둡니다(대문자 변환 없음). 배운 것 라벨은 `Lessons Learned`입니다.
- 중문판 프로젝트 본문 h2는 이미 중문입니다. 배운 것 라벨은 `经验与反思` 하나로 통일하고(현재 `经验与收获` 1건), 메뉴의 `作品集`은 `项目`, `Demos`는 `演示`로 바꿉니다.

## 4. 정보 구조 (2단계)

### 4.1 홈

순서: **히어로(+근거 띠) → 대표 사례 3 → 데모 → 경력 → AI 영상 한 줄 띠**

**히어로**

| 요소 | ko | en | zh |
|---|---|---|---|
| 메타 줄 | `AI Product Leader` · `Seoul, Korea` · `7+ years · Fintech AutoML → Medical AI → Commerce AIaaS → Generative AI Video` | 같음 | 같음 |
| H1 | 정의되지 않은 문제를 찾아 사업 성과를 내는 제품으로 만듭니다. | I find problems no one has defined yet and turn them into products that deliver business results. | 국문을 옮김 |
| 리드 1 | 기술과 시장, 조직 사이의 번역가를 자처하며 말보다 작동하는 데모로 설득합니다. | I act as a translator between technology, market, and organization, and I make the case with working demos rather than words. | 국문을 옮김 |
| 리드 2 | 제품 팀이 회사의 비전과 OKR을 향해 움직이도록 방향을 맞추고 목표를 달성할 때까지 책임집니다. | I align product teams with the company's vision and OKRs and stay accountable until the goals are met. | 국문을 옮김 |

- 리드 두 문장은 **문장마다 한 줄로 시작합니다.** `<br>`을 쓰지 않고, i18n에서 문자열 배열(`lead: string[]`)로 두고 문장마다 블록 요소로 렌더링합니다.
- 버튼(v1의 "히어로에 바로가기 버튼을 두지 않는다" 결정을 뒤집음):
  - ko: `이력서 PDF`(`/assets/resume/고재현_이력서.pdf`, primary), `Resume (EN)`(`/assets/resume/jayko_resume.pdf`), `LinkedIn ↗`
  - en·zh: `Resume PDF`(`/assets/resume/jayko_resume.pdf`, primary), `LinkedIn ↗`
  - LinkedIn: `https://www.linkedin.com/in/jayko-ai/`. 정본 1장 출처이며 `resume.{ko,en,zh}.json`의 `meta.linkedin`에 추가합니다.
- 사진: 흑백 프로필, 3px ink 테두리, 오른쪽 아래로 밀린 코발트 블록, 왼쪽 위 노랑 원(2px ink 테두리).
- 근거 띠(`ResultBand`, 히어로 바로 아래 전체 폭, 정본 K1·K2·K7):

| value (ko) | caption (ko) | value (en) | caption (en) |
|---|---|---|---|
| MRR 10X | AIaaS 사업 · 1년 만에 500만 → 5,200만 원 | MRR 10X | AIaaS business · KRW 5M → 52M in one year |
| 0 → 20명 | AIaaS 제품 조직 빌딩 | Team 0 → 20 | Built the AIaaS product organization |
| AI 특허 3건 | 출원 2건 · KSC 논문 · Chroma 파이널리스트 | 3 AI patents | 2 pending · KSC paper · Chroma Awards finalist |

**대표 사례**: `showcaseOrder` 1~3 프로젝트를 3칸 카드로 보여줍니다. 카드 문구는 프로젝트 데이터에서 가져옵니다(시안 카드의 제목과 설명은 예시입니다).
- 카드 구성: 회사 · 재직 기간 → `results[featuredResult]`의 value(크게)와 caption → 프로젝트 제목 → `oneLiner` → 역할 · '사례 보기 →'
- `showcaseOrder`: `cinev-ai-po-leadership` 1, `buzzni-aiaas-biz` 2, `cinev-ai-enablement` 3, `chroma-awards` 4, `buzzni-shortform-ai` 5, `solidware-mlaas` 6

**데모**: 제목 `추상적인 언어보다, 동작하는 데모로`(데모 페이지 제목도 같은 문구로 바꿈). 오른쪽에 `제품에 반영된 데모 3개 · 실험과 내부 도구 5개`(데이터에서 계산) + '전체 ↗'.
- `productized` 데모만 행으로 보여줍니다. 행 = 이름 + 한 줄 요약(`summary`) + 상태 태그입니다. 회색 보충 문장(boundary·outcome)은 목록에 넣지 않고 상세에만 둡니다.
- 상태 태그는 `demos.json`에 `productStatus: "shipped" | "partial"`을 추가해 정합니다. prompt-enhancer와 reverse-storyboard는 shipped(`제품 반영`), voice-adaptor는 partial(`일부 반영`)입니다.

**경력**: 회사별 기간 막대입니다. 시대 구분(Classical ML / LLM Application / Generative AI Native)은 화면에서 없앱니다.
- 데이터는 `resume.{locale}.json`의 `experience[].company / role / period`입니다. 새 문구를 만들지 않습니다.
- 가로축은 2018.10부터 빌드 시점 연도의 12월까지입니다. 막대 폭은 재직 개월 수에 비례하고, 현재 재직(`Present`)은 코발트, 나머지는 ink입니다. 기간 숫자는 mono입니다.
- 서버에서 계산해 정적으로 렌더링합니다(클라이언트 JS 없이).

**AI 영상**: 캐러셀(`VideoSpotlightCarousel`)을 홈에서 빼고 3px ink 테두리의 한 줄 띠로 바꿉니다.
- ko 문구: `AI 영상 작업 6편` / `「HappyEnd」(Chroma Awards 2025 fal Sponsor Award TOP 11 파이널리스트) 외 실사, 광고, 뮤직비디오 작업` / 버튼 `영상 갤러리 ↗`
- 링크: `https://jayko-ai-films.jayahtoh.chatgpt.site/?lang={locale}`. ko는 `?lang=ko`, en은 `?lang=en`, zh는 `?lang=zh`입니다. 기본 주소는 한 곳에 상수로 두고 locale만 붙입니다.

### 4.2 프로젝트 상세

순서: **머리 → 결과 띠 → 배운 것 하이라이트 → 문제 → 접근 → 실행 → (부록·근거 자료)** 이고, 왼쪽 레일이 함께 붙습니다.

- **머리**: 브레드크럼 `프로젝트 / {회사}` → 회사 · 재직 기간 → H1 제목. 오른쪽(데스크톱)에 썸네일을 16:9, 3px ink 테두리로 둡니다. v1처럼 화면 전체 폭으로 깔지 않습니다. 시대 라벨(`LLM Application (2023-2024)`)은 없앱니다.
- **왼쪽 레일**(데스크톱 15rem, 모바일은 본문 위):
  - 원장: 회사 / 재직 기간 / 역할 / 기여도. **기여도는 v1처럼 상세에 유지합니다.**
  - '재직 기간'은 해당 회사의 `resume` 기간입니다. `resume.{locale}.json`의 `experience[].company`가 `project.company`로 시작하는 항목을 찾습니다(예: `Cinamon` → `Cinamon (CineV)`). 짝이 없으면(`Side Project`) 이 행을 그리지 않습니다. 프로젝트별 기간은 데이터에 없으므로 만들지 않습니다.
  - 태그(`.tag`), 그 아래 '관련 링크'(`links` 필드). 모바일에서 '관련 링크'는 본문 뒤로 내려갑니다.
- **결과 띠**: `projects.json`의 새 필드 `results`를 `ResultBand`로 그립니다. 대표 프로젝트 6개는 필수이고, 나머지는 없으면 띠를 그리지 않습니다.
- **배운 것**: 일부 회사가 필수로 요구하는 항목이라 결과 바로 아래 별도 하이라이트로 둡니다. 번호 섹션 안에 넣지 않습니다. MDX 맨 앞의 `.highlight-callout`을 이 모양으로 다시 그리고 라벨만 언어별로 바꿉니다(3.5). 대표 프로젝트 6개는 모두 이 블록이 있어야 합니다.
- **본문**: MDX의 문제·접근·실행입니다. h2 앞 번호(`01`)는 mono이고, h2 위에 3px ink 선을 둡니다. 숫자 결과 목록(`## Results`)은 결과 띠로 옮겼으므로 대표 프로젝트 MDX에서는 뺍니다. 영상 임베드 같은 숫자가 아닌 자료는 `## 부록`(ko) / `## Appendix`(en) / `## 附录`(zh)으로 옮깁니다.
- **이전·다음**: 3px ink 위아래 선 사이의 세 블록(이전 / 프로젝트 목록 / 다음)입니다. 모바일에서는 세로로 쌓습니다.

**결과 띠 데이터(대표 프로젝트, ko)** — en·zh는 정본 9장 영문 표기 기준으로 옮깁니다(`KRW 5M → 52M`, `2.8x`, `10X`).

| 프로젝트 | featuredResult | 칸 1 | 칸 2 | 칸 3 |
|---|---|---|---|---|
| cinev-ai-po-leadership | 0 | **Web CineV 출시** / 2026.02 전환 결정 → 2026.07.10 공식 출시 | **실험 기능 3건** / Prompt Enhancer · Voice Adaptor · Reverse Storyboard 제품 통합 | **모델 30종+** / R2V·I2V·TTS 등 7개+ 영역, 조직 단위 통합 |
| buzzni-aiaas-biz | 2 | **MRR 10X** / 1년 만에 500만 → 5,200만 원 | **0 → 20명** / 입사 후 AIaaS 제품 조직을 직접 빌딩 | **신규 고객사 12개** / 초기 미팅부터 PoC·계약까지 |
| cinev-ai-enablement | 0 | **전환율 2.8배** / 웹팀 AI Literacy TF · 프로덕션 A/B · 클립 다운로드 기준 | **교육·비저닝 13회** / 비개발·웹·크리에이티브·경영진 대상 | **R2V 독립 구현** / 웹팀이 AI LAB에 의존하지 않고 구현 |
| buzzni-shortform-ai | 0 | **0→1 출시** / 롱폼을 숏폼으로 바꾸는 AI 편집기 | **본계약 3곳** / CJ온스타일 · SK스토아 · 신세계라이브쇼핑 | — |
| solidware-mlaas | 0 | **고객 13개사** / Mitsubishi · AEON 등 일본 기업 확보에 기여 | **연매출 2배** / 성장에 기여 | **15억 원** / 정부지원사업 제안서·사업계획서 총괄, 수주 지원 |
| chroma-awards | 0 | **TOP 11 파이널리스트** / Chroma Awards 2025 · fal Sponsor Award · 「HappyEnd」 | **Element 엔진 개발** / Chroma Awards 제작 과정에서 얻은 노하우로 전체 제품에서 사용되는 Element 관리 엔진 기획 및 개발 | — |

- 2칸 프로젝트는 2칸으로 둡니다. 세 번째 칸을 채우려고 문구를 만들지 않습니다.
- 위 표의 문구는 모두 확정입니다. 사이트에 어떤 확인 표시도 붙이지 않습니다.

### 4.3 프로젝트 목록

- 시대 필터(`EraFilter`)를 회사 필터로 바꿉니다. 버튼은 '전체'와 `project.company` 값(Cinamon, BUZZNI, Solidware, Lunit, Side Project)이며, 프로젝트가 있는 회사만 보입니다. 순서는 최근 회사부터입니다.
- 대표 프로젝트 카드는 4.1의 사례 카드와 같은 컴포넌트(결과 하나 + 제목 + oneLiner)를 씁니다. 전체 목록 행은 순번 · 제목 · oneLiner · 회사 · 재직 기간입니다.
- 페이지 설명에서 3-Era 문장을 지우고 `회사와 기간 순으로 정리했습니다.`로 바꿉니다.
- `eras.json`, `lib/eras.ts`, `EraFilter.tsx`, `getEraLabel` 호출, i18n `home.timeline.eras.*`는 쓰는 곳이 없어지면 지웁니다. 프로젝트의 `era` 필드도 함께 지웁니다.

### 4.4 데모·소개·이력서 페이지

- 데모 목록·상세: 1단계 규칙(색면 코발트, 태그, 라벨)만 적용합니다. 상세의 outcome·boundary 문장은 그대로 둡니다.
- 소개: 1단계 규칙만 적용합니다. 주황 숫자 라벨(`.about-principles span`, `.about-markets-ledger span`)은 ink mono로 바꿉니다.
- 이력서: 1단계 규칙만 적용합니다. 다운로드 버튼은 `.btn-primary`(국문) / `.btn-secondary`(영문)입니다. PDF 파일은 손대지 않습니다(2026-10-15 이력서 업데이트에서 정본 PDF로 교체 완료).

## 5. 콘텐츠 수정 (0단계, 디자인과 무관)

- `buzzni-aiaas-biz`의 에이플러스AI 링크 4개를 국·영·중 MDX에서 모두 삭제합니다(`aplusai.ai/article/123842`, `115878`, `112071`, `112073`). ZDNet Korea와 컴퓨터월드 링크는 남깁니다.

## 6. 하지 않는 것

- 라우트, 언어, 레거시 별칭, 메타데이터 구조는 바꾸지 않습니다. export 인벤토리(106 HTML 등)는 그대로여야 합니다.
- 폰트를 바꾸거나 아이콘·그라디언트·그림자·다크 모드를 넣지 않습니다.
- 프로젝트·데모 본문 문장을 다시 쓰지 않습니다. 이 문서에 적힌 수정만 합니다.
- 영상 갤러리 사이트는 이 저장소 밖이므로 다루지 않습니다. 링크에 `?lang=`만 붙입니다.

## 7. v1 결정과의 관계

| v1 결정 (테스트로 고정됨) | v2 |
|---|---|
| Bone/cream 바탕, Ember Orange 강조 | 폐기 → 흰 바탕, 노랑 면 전용 |
| 모서리 0·999px·50% 허용 | 0·50%만 |
| 히어로에 바로가기 버튼 없음 | 뒤집음 → 이력서·LinkedIn 버튼 |
| 기여도는 카드에서 빼고 상세에만 | **유지** |
| 시대(Era) 3단 구분 | 폐기 → 회사·기간 |
| 'Lessons & Learned' 콜아웃이 본문 맨 앞 | 유지하되 '배운 것' 하이라이트로 다시 그림, 결과 띠 바로 아래 |
| 문장 안 강제 줄바꿈 금지 | 유지. 히어로 리드는 문장 배열로 처리 |
