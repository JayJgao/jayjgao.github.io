# Planning.md — Lean Execution Board

## 1. Goal & Scope
- 목적: 노션 원본 HTML을 source-of-truth로 유지하면서, 실제 운영 중인 포트폴리오 실행 항목만 관리한다.
- 범위: `Planning.md`는 실행 큐/정합성 문서로만 사용한다.
- 원칙: 모든 항목은 `Source HTML -> Target Output Path -> Status -> Batch`로 추적 가능해야 한다.

## 2. Ground Truth Snapshot
- 기준 시각: 2026-02-17
- 노션 원본 개수:
  - root HTML: 18
  - raw export HTML: 14
- 공개 상태(`src/data/projects.json`):
  - Published: `cinev-s2m`, `cinev-moai`, `chroma-awards`, `buzzni-shortform-ai`, `buzzni-aiaas-biz`, `solidware-mlaas`, `buzzni-chatbot`, `solidware-automl`, `lunit-biomarker`, `cinev-ai-po-leadership`, `cinev-a2p`, `buzzni-review-aiaas`, `buzzni-search-aiaas`, `solidware-product-marketing`, `buzzni-branding-marketing`
  - Staged(MDX 작성 완료, 비노출): 없음
  - Parked: `프롬프트 모음`, `팀 리드`, `숏폼AI User Manual`, `프로토타입 유저매뉴얼`, `정부지원과제 총괄`, `하나은행 On-site 프로젝트`, `시나리오`, `캐릭터 빌드`
- 에셋 계약:
  - 썸네일: `1200x675 WebP`
  - 상세 샷: `max-1600 WebP`
  - 매핑 파일: `src/data/asset-manifest.json`
  - raw 보관: `.reference/notion-export/public-assets-raw`

## 3. Notion Curated Mapping
| Notion Title | Source HTML Path | Target Output Path | Status | Batch ID |
|---|---|---|---|---|
| 고재현 포트폴리오 | `.reference/notion-export/고재현_포트폴리오_1aba667ac505800aa943c9704163e21a.html` | `Planning.md`, `src/data/projects.json` | Published | B2-PLAN-BASE |
| CineV S2M (Film Agent) | `.reference/notion-export/public-assets-raw/cinev/s2m/CineV S2M (Film Agent) 30aa667ac505802da1a4f41e622eb38f.html` | `src/content/projects/ko/cinev-s2m.mdx` | Published | B2-CONTENT-CORE |
| MOAI 데모 콘솔 | `.reference/notion-export/public-assets-raw/cinev/moai/MOAI 데모 콘솔 30aa667ac50580bba067c5e48b17c1eb.html` | `src/content/projects/ko/cinev-moai.mdx` | Published | B2-CONTENT-CORE |
| AI video directing | `.reference/notion-export/public-assets-raw/chroma/AI video directing 30aa667ac5058006a68ace68ad14ff74.html` | `src/content/projects/ko/chroma-awards.mdx`, `src/data/home-spotlights.json` | Published | B2-CHROMA-MAP |
| 숏폼 제작 AIaaS | `.reference/notion-export/숏폼_제작_AIaaS_1aba667ac505804589c3c97427e43132.html` | `src/content/projects/ko/buzzni-shortform-ai.mdx` | Published | B2-CONTENT-CORE |
| AIaaS 사업부 빌딩 & 리딩 | `.reference/notion-export/고재현_포트폴리오_1aba667ac505800aa943c9704163e21a.html` | `src/content/projects/ko/buzzni-aiaas-biz.mdx` | Published | B2-CONTENT-CORE |
| 이커머스 쇼핑 어시스턴트 챗봇 AIaaS | `.reference/notion-export/이커머스_쇼핑_어시스턴트_챗봇_AIaaS_1aba667ac50580a793cfc05611971468.html` | `src/content/projects/ko/buzzni-chatbot.mdx` | Published | B2-CONTENT-CORE |
| 이커머스 리뷰분석 AIaaS | `.reference/notion-export/이커머스_리뷰분석_AIaaS_1aba667ac50580cba7a5e295e25aba66.html` | `src/content/projects/ko/buzzni-review-aiaas.mdx` | Published | B2-PHASE2-2 |
| 이커머스 검색 AIaaS | `.reference/notion-export/이커머스_검색_AIaaS_1aba667ac505806ea845c9be7fecace9.html` | `src/content/projects/ko/buzzni-search-aiaas.mdx` | Published | B2-PHASE2-2 |
| Archive) AI PO Job | `.reference/notion-export/public-assets-raw/archive/aipo_tasks/Archive) AI PO Job 30aa667ac50580258e45c48bc3dbee11.html` | `src/content/projects/ko/cinev-ai-po-leadership.mdx` | Published | B2-PHASE2-2 |
| 제품 마케팅 | `.reference/notion-export/제품_마케팅_1aba667ac5058022a4c3f8e63cc2b377.html` | `src/content/projects/ko/solidware-product-marketing.mdx` | Published | B2-PHASE2-2 |
| 제품 브랜딩&마케팅 | `.reference/notion-export/제품_브랜딩_마케팅_1aba667ac505808aaebcd92753f75241.html` | `src/content/projects/ko/buzzni-branding-marketing.mdx` | Published | B2-PHASE2-2 |
| MLaaS Product Management | `.reference/notion-export/MLaaS_Product_Management_1aba667ac50580e982d9e26c6be90b60.html` | `src/content/projects/ko/solidware-mlaas.mdx` | Published | B2-CONTENT-CORE |
| AutoML 솔루션 신규 Feature개발 | `.reference/notion-export/AutoML_솔루션_신규_Feature개발_1aba667ac50580fd9687deae5d4d0d37.html` | `src/content/projects/ko/solidware-automl.mdx` | Published | B2-CONTENT-CORE |
| AI 바이오마커 진단 솔루션 (HER2, ER/PR) | `.reference/notion-export/AI_바이오마커_진단_솔루션__HER2__ER_PR__1aba667ac5058085a86cf1b2ffaa56ed.html` | `src/content/projects/ko/lunit-biomarker.mdx` | Published | B2-CONTENT-CORE |
| CineV A2P | `.reference/notion-export/public-assets-raw/archive/aipo_tasks/Archive) AI PO Job 30aa667ac50580258e45c48bc3dbee11.html` | `src/content/projects/ko/cinev-a2p.mdx` | Published | B2-PHASE2-3 |
| 프롬프트 모음 | `.reference/notion-export/프롬프트_모음_1aba667ac50580839a11c34cfb99283e.html` | `src/content/archive/ko/prompt-collection.mdx` | Parked | B2-PARKED |
| 숏폼AI User Manual_Common_VER.1 | `.reference/notion-export/숏폼AI_User_Manual_Common_VER_1_1aba667ac50580e28362c73058327994.html` | `src/content/archive/ko/user-manual-digest.mdx` | Parked | B2-PARKED |
| 프로토타입 유저매뉴얼 | `.reference/notion-export/프로토타입_유저매뉴얼_1aba667ac50580159a7df52e26abac7b.html` | `src/content/archive/ko/user-manual-digest.mdx` | Parked | B2-PARKED |
| 팀 리드 | `.reference/notion-export/팀_리드_1aba667ac50580098ae8d7454571913c.html` | `src/content/archive/ko/team-building-digest.mdx` | Parked | B2-PARKED |
| 정부지원과제 총괄 | `.reference/notion-export/정부지원과제_총괄_1aba667ac50580dc88b8e9ae9a4c0357.html` | `src/content/archive/ko/legacy-business-digest.mdx` | Parked | B2-PARKED |
| 하나은행 On-site 프로젝트 | `.reference/notion-export/하나은행_On-site_프로젝트_1aba667ac5058021bc29e5ba255c002d.html` | `src/content/archive/ko/legacy-business-digest.mdx` | Parked | B2-PARKED |
| 시나리오 | `.reference/notion-export/시나리오_1aba667ac5058096aa68f30d325f6d04.html` | `src/content/archive/ko/meta-llama-idea.mdx` | Parked | B2-PARKED |
| 캐릭터 빌드 | `.reference/notion-export/캐릭터_빌드_1aba667ac50580f4b0c4c0fa10855779.html` | `src/content/archive/ko/meta-llama-idea.mdx` | Parked | B2-PARKED |

## 4. Execution Board (Now/Next/Later)
### Now
- `B2-IA-01`: GNB를 `Home / About / Portfolio / Resume`로 고정하고 `/contact` 제거 유지
- `B2-ARCHIVE-05`: Archive 5개 카드/상세/에셋 매핑 회귀 테스트
- `B2-IMG-FIRST-01`: 프로젝트 다이어그램 렌더 방식을 정적 이미지 중심으로 유지
- `B2-I18N-01`: 모바일 우선 Language 드롭다운 활성화 + locale 쿠키 기반 렌더 동기화

### Next
- `B2-CONTENT-TRIM`: Published 프로젝트의 텍스트 밀도 2차 압축
- `B2-I18N-02`: About/MDX 본문 다국어 분리 전략(ko 우선 -> en/zh 확장)

### Later
- `B3-INTERACT-01`: Hero/Career 인터랙션(3D 포함) 성능 검증
- `B4-I18N-01`: locale 라우팅 + 번역 리소스 정합성 점검
- `B5-POLISH-01`: Lighthouse/SEO 접근성 자동 점검 파이프라인

## 5. Definition of Done
- `Planning.md`와 실제 코드 상태 충돌 0건
- 상태 값은 `Published / Staged / Pending / Parked`만 사용
- `src/data/projects.json`와 MDX/에셋 실파일 경로가 1:1 일치
- Chroma 포스터 경로가 `waiff-thumb.webp`, `chroma-happyend-thumb.webp` 기준으로 정상 동작
- Mermaid 런타임 의존성/코드블록 미사용
- `npm run build` 성공

## 6. Open Risks
- Archive 프로젝트 증가로 카드 밀도가 높아져 모바일 스캔 피로가 재발할 수 있음
- 노션 원본의 장문 내용을 그대로 옮기면 About/Resume 중복이 다시 증가할 수 있음
- 영상 썸네일 교체 시 `home-spotlights.json` 동기화 누락 위험

## 7. Changelog
- 2026-02-17: Phase 2.2 반영 — Archive 5개 Published 승격 및 MDX/에셋 추가
- 2026-02-17: GNB를 Home/About/Portfolio/Resume로 정렬하고 `/contact` 라우트 제거
- 2026-02-17: Mermaid 런타임 렌더 철회, 정적 이미지 전환
- 2026-02-18: `cinev-a2p`를 Staged에서 Archive(Published)로 승격
- 2026-02-18: 모바일 친화 Language 드롭다운 및 locale 쿠키 기반 렌더 연결
