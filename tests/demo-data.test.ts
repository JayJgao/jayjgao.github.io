import assert from "node:assert/strict";
import test from "node:test";

import demosJson from "../src/data/demos.json";
import { getAllDemos, getAllDemoSlugs, getDemoBySlug } from "../src/lib/demos";
import { SUPPORTED_LOCALES, type Locale } from "../src/lib/locale";
import type { Demo } from "../src/types/demo";

const expectedSlugs = [
  "prompt-enhancer",
  "prompt-enhance-skills",
  "voice-adaptor",
  "reverse-storyboard",
  "reframer",
  "boundary-deduper",
  "iro-matcher",
  "loudness-matcher",
  "script-to-bgm",
] as const;

const expectedKinds = [
  "service",
  "skill",
  "prototype",
  "prototype",
  "prototype",
  "prototype",
  "prototype",
  "prototype",
  "workflow",
] as const;

const expectedVideoIds = [
  "NLleH-4c5HY",
  null,
  "UL02NA57TGw",
  "IiRKOHz8fxg",
  "5oJkxE2Slh0",
  "Yr_kDA-A6JM",
  "ywjCfb9ZgDc",
  "65j-raKVtik",
  null,
] as const;

const expectedCoreCopy = [
  {
    name: "Prompt Enhancer",
    summary:
      "개인에게 쌓여 있던 이미지·비디오 프롬프트 작성 감각을 제품 API의 검증 가능한 프롬프트 변환 파이프라인으로 옮긴 작업",
    observation:
      "이미지와 비디오 생성 모델은 같은 의도라도 프롬프트를 어떻게 쓰느냐에 따라 결과 편차가 컸고, 그 노하우가 개인의 작업 방식 안에만 쌓여 있었다. 먼저 nanotape 이미지 스킬과 seehorse 비디오 스킬로 이 노하우를 가볍게 문서화해 공유했고, 창작팀의 실제 반응을 확인한 뒤 제품 탑재를 전제로 API화했다.",
    problem:
      "팀원마다 결과 품질이 달라지고, 잘 쓰는 사람의 감각이 조직 전체의 반복 가능한 인터페이스로 전파되지 않았다. 특히 제품 흐름에서는 사용자가 매번 추가 질문에 답할 수 없고, 참조 이미지 순서·역할·비디오 길이 같은 계약이 모호하면 후속 생성 단계가 흔들릴 수 있었다.",
    hypothesis:
      "스킬이 참조하던 카메라, 표정, 조명, 모델별 핸들 규칙, 프롬프트 패턴을 제품 API의 정책으로 흡수하되, 요청 스키마·검증·실패 처리·진단 노출 경계를 명확히 하면 막 쓴 문장도 모델용 프롬프트로 안정적으로 변환할 수 있다.",
    outcome:
      "FastAPI Gateway의 Prompt Transform 기능으로 구현되어 API 문서, Gradio 데모, 자동화 테스트가 함께 반영된 상태",
  },
  {
    name: "Prompt Enhance Skills",
    summary: "한국어로 작성된 모호한 이미지·영상 생성 요청을 모델별 영어 프롬프트로 정제하는 스킬 묶음",
    observation:
      "이미지와 비디오 생성 모델은 같은 의도라도 프롬프트를 어떻게 쓰느냐에 따라 결과 편차가 크고, 그 노하우가 개인에게만 쌓여 있었다.",
    problem: "팀원마다 결과 품질이 달라지고, 잘 쓰는 사람의 감각이 조직에 전파되지 않는다.",
    hypothesis:
      "프롬프트 작성 노하우를 스킬과 참조 컨텍스트로 구조화해 배포하면, 막 쓴 문장도 모델이 해석하기 좋은 프롬프트로 끌어올릴 수 있다.",
    outcome: "스킬 반응 검증 후 제품용 API 구성에 반영",
  },
  {
    name: "Voice Adaptor",
    summary:
      "완성된 생성형 MP4의 음성을 화자별 클립으로 분해하고, 동일한 저장 음성의 TTS·음성 변환 후보를 검토해 선택된 오디오로 다시 구성하는 도구",
    observation:
      "비디오 모델이 생성한 네이티브 오디오는 여러 클립에 걸쳐 같은 화자의 목소리와 발화 품질을 일관되게 유지하지 못한다.",
    problem:
      "동일한 캐릭터의 목소리가 컷마다 달라지면 캐릭터 정체성과 영상의 연속성이 무너지고 후반 작업 비용이 커진다.",
    hypothesis:
      "원본 오디오에서 화자를 분리하고 동일한 TTS 음성으로 다시 구성하면 여러 클립에 걸쳐 목소리의 일관성을 높일 수 있다.",
    outcome: "프로토타입을 토대로 내부 테스트 진행 후 제품에 탑재(엔지니어에게 이관)",
  },
  {
    name: "Reverse Storyboard",
    summary: "완성된 비디오를 샷 순서가 보이는 대표 프레임과 메타데이터로 펼치는 내부 데모",
    observation:
      "이미지 모델은 단일 이미지 안에 요청한 요소를 빠짐없이 담기 위해 인물을 과도하게 중앙과 정면에 배치하는 경향이 있다.",
    problem:
      "이렇게 생성된 이미지는 샷 간 연속성과 다양한 구도가 필요한 스토리보드나 콘티에 곧바로 활용하기 어렵다.",
    hypothesis:
      "먼저 저품질 비디오 모델로 시간적 연속성을 가진 시퀀스를 생성한 뒤 이를 프레임 단위로 펼치면, 스토리보드에 더 적합한 연속 장면을 얻을 수 있다.",
    outcome: "프로토타입으로 내부 테스트 진행 후 제품 탑재(엔지니어에게 이관)",
  },
  {
    name: "Reframer",
    summary: "완성된 가로 영상을 검토 가능한 9:16 세로 초안으로 바꾸는 도구",
    observation:
      "상업 애니메이션은 주로 가로 비율로 제작되지만, 실제 홍보와 소비 환경에서는 버티컬 영상에 대한 수요가 계속 커지고 있다.",
    problem:
      "완성된 가로 영상을 세로 영상으로 전환하려면 샷마다 주요 대상을 추적하고 프레이밍을 다시 결정해야 하므로 편집 비용이 크다.",
    hypothesis:
      "텍스트 프롬프트와 SAM 3.1로 대상을 추적한 뒤 편집자가 샷별 결과를 검토하고 수정하게 하면, 실무의 출발점으로 쓸 수 있는 9:16 초안을 빠르게 만들 수 있다.",
    outcome: "사내 배포",
  },
  {
    name: "Boundary Deduper",
    summary:
      "짧은 MP4의 시작 프리즈와 인접 경계 중복을 찾아, 사람이 승인한 prefix만 프레임 단위로 잘라내는 검토 도구",
    observation:
      "짧은 생성 영상을 이어 붙이면 다음 클립의 시작이 잠시 멈추거나, 앞 클립의 끝과 다음 클립의 시작에서 같은 프레임이 반복된다.",
    problem:
      "이런 구간은 연결 흐름을 어색하게 만들지만 기존 편집 도구에서 프레임 단위로 찾아 잘라내기 번거롭다.",
    hypothesis:
      "시작 프리즈와 경계 중복을 자동 검출하고, 사용자가 확인하고 승인한 구간만 정밀하게 트리밍하면 연결감을 개선할 수 있다.",
    outcome: "내부 검토용 데모 구현 및 배포 구성 포함",
  },
  {
    name: "IRO Matcher",
    summary:
      "서로 다른 생성 영상 클립의 컬러 톤을 하나의 레퍼런스에 맞춰 검토·조정 가능한 LUT와 영상으로 변환하는 도구",
    observation:
      "서로 다른 생성 영상 클립을 하나의 타임라인에 배치하면 클립마다 색감과 컬러 톤이 달라 보인다.",
    problem: "이 차이가 컷 사이의 시각적 연속성을 해치고 반복적인 수동 색보정을 요구한다.",
    hypothesis:
      "하나의 클립을 레퍼런스로 선택하고 LUT와 유사한 방식으로 나머지 클립의 컬러 톤을 자동 보정하면 전체 영상의 일관성을 높일 수 있다.",
    outcome: "사내 검증용 MVP",
  },
  {
    name: "Loudness Matcher",
    summary:
      "사용자가 고른 레퍼런스 영상의 체감 음량에 생성 영상 클립의 네이티브 오디오를 맞춰 컷 사이 볼륨 점프를 줄이는 웹 도구",
    observation: "비디오 모델이 생성한 네이티브 오디오는 클립마다 체감 음량이 다르다.",
    problem:
      "여러 클립을 이어 붙이면 컷마다 볼륨이 튀어 시청 흐름을 방해하고 수동 조절 비용이 발생한다.",
    hypothesis:
      "하나의 레퍼런스 영상이 가진 체감 음량을 기준으로 나머지 클립의 LUFS를 자동 보정하면 볼륨 편차를 줄일 수 있다.",
    outcome: "사내 배포용 웹 데모",
  },
  {
    name: "Script to BGM",
    summary:
      "스크립트 파일을 음악 생성 프롬프트로 정제하고, 두 음악 API가 만든 MP3를 Slack에서 들어보게 한 내부 PoC",
    observation:
      "짧은 AI 클립을 만들 때 사용자들은 빈약한 스토리성이나 부족한 정합성을 가리기 위해 BGM을 찾는다.",
    problem:
      "그런데 BGM을 구하려면 영상에 어울리는 음악이 무엇인지 먼저 정의하고 음악 생성용 프롬프트를 따로 작성해야 한다.",
    hypothesis:
      "스토리를 담은 스크립트가 이미 있다면, LLM으로 이를 정제해 BGM 생성 프롬프트를 자동으로 만들 수 있다.",
    outcome: "내부 PoC 완료. 후속 구현 없음",
  },
] as const;

const expectedTopLevelKeys = [
  "boundary",
  "diagram",
  "gallery",
  "howItWorks",
  "hypothesis",
  "kind",
  "name",
  "observation",
  "order",
  "outcome",
  "problem",
  "productized",
  "relatedDemo",
  "slug",
  "stack",
  "summary",
  "video",
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function assertLocalizedText(value: unknown, context: string): asserts value is Record<Locale, string> {
  assert.ok(isRecord(value), `${context} must be a localized object`);
  assert.deepEqual(Object.keys(value).sort(), [...SUPPORTED_LOCALES].sort(), `${context} locale keys`);

  for (const locale of SUPPORTED_LOCALES) {
    assert.equal(typeof value[locale], "string", `${context}.${locale} must be text`);
    assert.ok((value[locale] as string).trim().length > 0, `${context}.${locale} must not be blank`);
  }

  assert.equal(value.en, value.ko, `${context} Phase 1 en copy must equal Korean`);
  assert.equal(value.zh, value.ko, `${context} Phase 1 zh copy must equal Korean`);
}

test("demos own the exact ordered schema, product states, video IDs, and related pair", () => {
  const demos = demosJson as unknown as Demo[];
  assert.equal(demos.length, 9);
  assert.deepEqual(demos.map(({ slug }) => slug), expectedSlugs);
  assert.equal(new Set(demos.map(({ slug }) => slug)).size, 9);
  assert.deepEqual(demos.map(({ order }) => order), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
  assert.deepEqual(demos.map(({ kind }) => kind), expectedKinds);
  assert.deepEqual(demos.map(({ productized }) => productized), [
    true,
    true,
    true,
    true,
    false,
    false,
    false,
    false,
    false,
  ]);
  assert.deepEqual(demos.map(({ video }) => video.videoId), expectedVideoIds);

  for (const demo of demos) {
    assert.deepEqual(Object.keys(demo).sort(), expectedTopLevelKeys);
    assert.deepEqual(demo.video, {
      provider: "youtube",
      videoId: expectedVideoIds[demo.order - 1],
    });
  }

  assert.equal(demos[0].relatedDemo, "prompt-enhance-skills");
  assert.equal(demos[1].relatedDemo, "prompt-enhancer");
  assert.ok(demos.slice(2).every(({ relatedDemo }) => relatedDemo === null));
});

test("all localized demo copy is recursively complete and Korean-identical for Phase 1", () => {
  const demos = demosJson as unknown as Demo[];

  for (const demo of demos) {
    for (const field of [
      "summary",
      "observation",
      "problem",
      "hypothesis",
      "outcome",
      "boundary",
    ] as const) {
      assertLocalizedText(demo[field], `${demo.slug}.${field}`);
    }

    assert.ok(demo.howItWorks.length > 0, `${demo.slug}.howItWorks must not be empty`);
    demo.howItWorks.forEach((step, index) =>
      assertLocalizedText(step, `${demo.slug}.howItWorks[${index}]`),
    );

    assert.ok(demo.stack.length > 0, `${demo.slug}.stack must not be empty`);
    demo.stack.forEach((group, groupIndex) => {
      assert.deepEqual(Object.keys(group).sort(), ["items", "label"]);
      assertLocalizedText(group.label, `${demo.slug}.stack[${groupIndex}].label`);
      assert.ok(group.items.length > 0, `${demo.slug}.stack[${groupIndex}].items must not be empty`);
      group.items.forEach((item, itemIndex) =>
        assertLocalizedText(item, `${demo.slug}.stack[${groupIndex}].items[${itemIndex}]`),
      );
    });

    demo.gallery.forEach((image, imageIndex) => {
      assert.deepEqual(Object.keys(image).sort(), ["alt", "caption", "height", "src", "width"]);
      assertLocalizedText(image.alt, `${demo.slug}.gallery[${imageIndex}].alt`);
      assertLocalizedText(image.caption, `${demo.slug}.gallery[${imageIndex}].caption`);
    });
  }
});

test("core demo copy maps to the canonical README sections", () => {
  const demos = demosJson as unknown as Demo[];

  demos.forEach((demo, index) => {
    const expected = expectedCoreCopy[index];
    assert.equal(demo.name, expected.name, `${demo.slug}.name`);
    for (const field of [
      "summary",
      "observation",
      "problem",
      "hypothesis",
      "outcome",
    ] as const) {
      assert.equal(demo[field].ko, expected[field], `${demo.slug}.${field}`);
    }
  });
});

test("canonical measurements, validation stacks, and no-external-model signals are retained", () => {
  const bySlug = new Map((demosJson as unknown as Demo[]).map((demo) => [demo.slug, demo]));
  const copy = (slug: string) => JSON.stringify(bySlug.get(slug));

  for (const fact of ["최대 9개", "4초부터 15초", "GPT Image 2", "nano banana", "Seedance 2.0", "HappyHorse", "pytest", "Ruff", "mypy"]) {
    assert.match(copy("prompt-enhancer"), new RegExp(fact));
  }
  for (const fact of ["15–30초", "최대 8개", "15%", "fal.ai Demucs", "scribe_v2", "eleven_v3", "eleven_multilingual_sts_v2", "dnd-kit", "Vitest", "Testing Library"]) {
    assert.match(copy("voice-adaptor"), new RegExp(fact));
  }
  for (const fact of ["최대 30초", "40개", "15분", "PySceneDetect", "OpenCV", "NumPy", "합성 MP4", "end-to-end smoke test"]) {
    assert.match(copy("reverse-storyboard"), new RegExp(fact));
  }
  for (const fact of ["MP4 2–12개", "frame-accurate", "libx264", "Playwright"]) {
    assert.match(copy("boundary-deduper"), new RegExp(fact));
  }
  for (const fact of ["10·30·50·70·90%", "17³/33³", "MKL/MVGD", "WebGL", "lut3d"]) {
    assert.match(copy("iro-matcher"), new RegExp(fact));
  }
  for (const fact of ["MP4/MOV", "2–8개", "15초 이하", "LUFS", "LRA", "true peak", "-1.5 dBTP", "±0.5 LU", "-1.0 dBTP"]) {
    assert.match(copy("loudness-matcher"), new RegExp(fact));
  }
  for (const fact of ["n8n", "curl", "Webhook", "Slack Trigger", "JavaScript", "Gemini 2.5 Flash", "MiniMax Music 2 via fal.ai", "ElevenLabs Music"]) {
    assert.match(copy("script-to-bgm"), new RegExp(fact));
  }

  for (const slug of ["reverse-storyboard", "boundary-deduper", "iro-matcher", "loudness-matcher"]) {
    const demo = bySlug.get(slug);
    assert.ok(demo);
    const external = demo.stack.find(({ label }) => label.ko === "외부 모델/API");
    assert.ok(external, `${slug} must retain 외부 모델/API`);
    assert.equal(external.items[0]?.ko, "없음", `${slug} must retain exact 없음 signal`);
  }
});

test("demo content excludes private implementation and distribution residue", () => {
  const contentOnly = (demosJson as unknown as Demo[]).map(({ diagram, gallery, ...demo }) => demo);
  const serialized = JSON.stringify(contentOnly);

  assert.doesNotMatch(serialized, /https?:\/\//i);
  assert.doesNotMatch(serialized, /github\.com|\.cinamon\.io/i);
  assert.doesNotMatch(
    serialized,
    /app\/features|tests\/test_|PromptTransformGraph|clarificationMode|includeDiagnostics|totalDurationSeconds|nanotape@|seehorse@|CODEOWNERS|GPL-3\.0|라이선스|재배포/,
  );
  assert.doesNotMatch(
    serialized,
    /j-anime|Pydantic v2|Python 3\.11|Python 3\.12|React 19|\b(?:CFR|MAD|S2S|E2E)\b|A\/V/,
  );
  assert.doesNotMatch(serialized, /"(?:url|href|githubUrl|productUrl|externalUrl)":/i);
});

test("demo accessors expose canonical order and slug lookup", () => {
  assert.deepEqual(getAllDemoSlugs(), expectedSlugs);
  assert.deepEqual(getAllDemos().map(({ slug }) => slug), expectedSlugs);
  assert.equal(getDemoBySlug("iro-matcher")?.order, 7);
  assert.equal(getDemoBySlug("missing-demo"), undefined);
});

test("demo accessors isolate canonical nested data from consumer mutations", () => {
  const fromAll = getAllDemos()[0];
  const fromSlug = getDemoBySlug("prompt-enhancer");
  assert.ok(fromAll);
  assert.ok(fromSlug);

  const originalSummary = fromAll.summary.ko;
  const originalStep = fromSlug.howItWorks[0]?.ko;
  assert.ok(originalStep);

  try {
    fromAll.summary.ko = "mutated summary";
    fromSlug.howItWorks[0].ko = "mutated step";

    const freshFromAll = getAllDemos()[0];
    const freshFromSlug = getDemoBySlug("prompt-enhancer");
    assert.ok(freshFromAll);
    assert.ok(freshFromSlug);
    assert.equal(freshFromAll.summary.ko, originalSummary);
    assert.equal(freshFromSlug.howItWorks[0]?.ko, originalStep);
    assert.notEqual(freshFromAll, fromAll);
    assert.notEqual(freshFromSlug, fromSlug);
  } finally {
    fromAll.summary.ko = originalSummary;
    fromSlug.howItWorks[0].ko = originalStep;
  }
});
