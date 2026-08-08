# Direct YouTube Thumbnails Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox syntax for implementation tracking.

**Goal:** Replace the unused custom-poster layer with direct, privacy-conscious YouTube thumbnails while preserving click-gated playback, and record the Prompt Enhancer/Prompt Enhance Skills consolidation question for Phase 3.

**Architecture:** Keep the existing Demo data and presentation boundaries. A trusted `videoId` remains the only media identifier; pure helpers derive the thumbnail and privacy-enhanced embed URLs. `DemoVideo` owns the two-step thumbnail failure state and continues to instantiate the iframe only after the user clicks play. The export verifier locks the initial HTML contract so future refactors cannot silently reintroduce posters, eager iframes, or thumbnails for non-playable Demos.

**Tech Stack:** Next.js 15 static export, React 19, TypeScript, `next/image` in unoptimized mode, Node test runner through `tsx`, custom static-export verifier.

---

## Task 1: Remove the poster schema and define URL contracts

**Files:**

- Modify: `tests/demo-data.test.ts`
- Modify: `tests/demo-presentation.test.ts`
- Modify: `src/types/demo.ts`
- Modify: `src/data/demos.json`
- Modify: `src/lib/demos.ts`

- [ ] **Step 1: Write the failing data and URL tests**

  Change the exact Demo video assertion to require only:

  ```ts
  {
    provider: "youtube",
    videoId: expectedVideoIds[demo.order - 1],
  }
  ```

  Add exact URL assertions for both supported thumbnail qualities:

  ```ts
  assert.equal(
    getYouTubeThumbnailUrl("NLleH-4c5HY", "maxresdefault"),
    "https://i.ytimg.com/vi/NLleH-4c5HY/maxresdefault.jpg",
  );
  assert.equal(
    getYouTubeThumbnailUrl("NLleH-4c5HY", "hqdefault"),
    "https://i.ytimg.com/vi/NLleH-4c5HY/hqdefault.jpg",
  );
  ```

- [ ] **Step 2: Run the focused tests and confirm RED**

  Run:

  ```bash
  npx tsx --test tests/demo-data.test.ts tests/demo-presentation.test.ts
  ```

  Expected: failure because `poster` still exists and `getYouTubeThumbnailUrl` is not exported.

- [ ] **Step 3: Implement the minimal data and helper changes**

  Remove `poster` from `DemoVideo` and all nine Demo records. Add a constrained helper:

  ```ts
  export type YouTubeThumbnailQuality = "maxresdefault" | "hqdefault";

  export function getYouTubeThumbnailUrl(
    videoId: string,
    quality: YouTubeThumbnailQuality,
  ): string {
    return `https://i.ytimg.com/vi/${videoId}/${quality}.jpg`;
  }
  ```

- [ ] **Step 4: Re-run the focused tests and confirm GREEN**

  Run the same focused command. Expected: all tests pass.

- [ ] **Step 5: Commit the schema/API slice**

  ```bash
  git add src/types/demo.ts src/data/demos.json src/lib/demos.ts tests/demo-data.test.ts tests/demo-presentation.test.ts
  git commit -m "refactor: remove Demo poster schema"
  ```

## Task 2: Render the direct thumbnail with one fallback

**Files:**

- Modify: `tests/demo-presentation.test.ts`
- Modify: `src/components/demos/DemoVideo.tsx`
- Modify: `src/components/demos/DemoDetail.tsx`
- Modify: `next.config.ts`

- [ ] **Step 1: Add failing component/config contract tests**

  Lock these source-level boundaries:

  - `DemoVideo` accepts `videoId`, not `poster`.
  - The initial image has `alt=""`, `loading="lazy"`, and `referrerPolicy="no-referrer"`.
  - `onError` moves from `maxresdefault` to `hqdefault`, then removes the broken image.
  - The full-surface play button remains available throughout.
  - `DemoDetail` passes the canonical `videoId`.
  - `next.config.ts` allowlists only HTTPS `i.ytimg.com` under `/vi/**` for this remote image.

- [ ] **Step 2: Run the presentation test and confirm RED**

  ```bash
  npx tsx --test tests/demo-presentation.test.ts
  ```

  Expected: the new thumbnail/component/config assertions fail against the local-poster implementation.

- [ ] **Step 3: Implement the thumbnail state**

  Derive `maxresdefault` and `hqdefault` URLs from `videoId`. Initialize the image state with maxres, switch once to hq on failure, then set it to `null` so the existing gradient remains. Continue to render the iframe only when `loaded` is true.

  The image contract is:

  ```tsx
  <Image
    src={thumbnailSrc}
    alt=""
    fill
    unoptimized
    loading="lazy"
    referrerPolicy="no-referrer"
    onError={handleThumbnailError}
  />
  ```

  Configure:

  ```ts
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "i.ytimg.com", pathname: "/vi/**" },
    ],
  }
  ```

- [ ] **Step 4: Re-run presentation and type checks**

  ```bash
  npx tsx --test tests/demo-presentation.test.ts
  npm run typecheck
  ```

  Expected: both commands pass; no `poster` access remains in the Demo path.

- [ ] **Step 5: Commit the presentation slice**

  ```bash
  git add next.config.ts src/components/demos/DemoDetail.tsx src/components/demos/DemoVideo.tsx tests/demo-presentation.test.ts
  git commit -m "feat: show direct YouTube Demo thumbnails"
  ```

## Task 3: Gate the static export contract

**Files:**

- Modify: `tests/export-verifier.test.ts`
- Modify: `scripts/lib/export-verifier.ts`

- [ ] **Step 1: Add failing verifier mutations**

  Extend `DemoRouteExpectation` with `videoId: string | null`. Add fixtures proving that the verifier rejects:

  - a playable Demo without its exact maxres thumbnail;
  - a playable Demo using another host, ID, or thumbnail quality initially;
  - a playable thumbnail without `loading="lazy"` or `referrerpolicy="no-referrer"`;
  - any `i.ytimg.com` thumbnail on a `pending` or `none` Demo;
  - any initial iframe.

  Retain a valid playable fixture that has the exact image and no iframe.

- [ ] **Step 2: Run the verifier test and confirm RED**

  ```bash
  npx tsx --test tests/export-verifier.test.ts
  ```

  Expected: new mutations currently pass unexpectedly because the verifier checks only video state.

- [ ] **Step 3: Implement exact thumbnail verification**

  Populate `videoId` from canonical Demo data. For `videoMode: "play"`, require exactly one initial `<img>` with:

  ```text
  src=https://i.ytimg.com/vi/{videoId}/maxresdefault.jpg
  loading=lazy
  referrerpolicy=no-referrer
  alt=""
  ```

  For `pending` and `none`, require zero images whose host is `i.ytimg.com`. Keep the existing zero-initial-iframe and video-state count checks.

- [ ] **Step 4: Run focused and production verification**

  ```bash
  npx tsx --test tests/export-verifier.test.ts
  npm run build
  npm run verify:export
  ```

  Expected: focused tests pass; production counts remain 108 HTML / 87 localized / 45 project details / 27 Demo details / 18 legacy documents, with seven playable Demo families across three locales showing the exact initial thumbnail.

- [ ] **Step 5: Commit the verifier slice**

  ```bash
  git add scripts/lib/export-verifier.ts tests/export-verifier.test.ts
  git commit -m "test: gate direct Demo thumbnails"
  ```

## Task 4: Update the canonical record and Phase 3 handoff

**Files:**

- Modify: `/Users/vonvon/Documents/jayjgao/00-ground-truth.md`
- Modify: `/Users/vonvon/Documents/jayjgao/01-decisions.md`
- Modify: `/Users/vonvon/Documents/jayjgao/03-demos-spec.md`
- Modify: `/Users/vonvon/Documents/jayjgao/work-order.md`
- Modify: `/Users/vonvon/Documents/jayjgao/demos-content-template.md`
- Modify: `/Users/vonvon/Documents/jayjgao/initial-prompt-phase1.md`
- Modify: `/Users/vonvon/Documents/jayjgao/initial-prompt-phase3.md`
- Modify: `/Users/vonvon/Documents/jayjgao/README.md`
- Modify: `.local/handoffs/phase1.md`

- [ ] **Step 1: Replace the superseded poster decision everywhere**

  Record the exact maxres → hq → gradient behavior, lazy/no-referrer attributes, accepted IP/browser disclosure, click-gated `youtube-nocookie.com` iframe, and the absence of a local poster asset pipeline. Remove all remaining-work items for seven custom posters.

- [ ] **Step 2: Add the Phase 3 consolidation interview item**

  Keep both records and routes in Phase 1. In the Phase 3 prompt, require a user decision that weighs:

  - redundant information versus proof of skills-to-product progression;
  - one card versus two cards;
  - canonical URL and redirects;
  - merged evidence and the chronology that must survive consolidation.

- [ ] **Step 3: Scan for stale contradictions**

  ```bash
  rg -n "custom poster|video-poster|poster.*null|외부.*thumbnail.*없|thumbnail.*요청하지" \
    /Users/vonvon/Documents/jayjgao .local/handoffs/phase1.md
  ```

  Expected: no superseded custom-poster requirement remains; unrelated project/Spotlight poster references are not changed.

## Task 5: Full verification, companion QA, and delivery

**Files:**

- Verify all changed files and generated `out/` artifacts.

- [ ] **Step 1: Run the complete gate in deployment order**

  ```bash
  npm test
  npm run lint
  npm run typecheck
  npm run build
  npm run verify:export
  git diff --check
  ```

  Expected: tests pass; lint has zero errors; build produces 110 routes; verifier retains the approved inventory and link counts.

- [ ] **Step 2: Inspect static output directly**

  Confirm all 21 localized playable Demo pages contain the exact maxres thumbnail, zero initial iframes, lazy loading, and no-referrer. Confirm all three localized `prompt-enhance-skills` pages contain only `pending`, and all three `script-to-bgm` pages contain no video thumbnail or video state.

- [ ] **Step 3: Run companion browser QA**

  At desktop and mobile widths, verify:

  - Prompt Enhancer shows a YouTube thumbnail immediately.
  - The play control is keyboard reachable and loads only the privacy-enhanced iframe.
  - A forced primary-image failure falls back once, then preserves the playable gradient.
  - Prompt Enhance Skills still communicates `pending`.
  - Script to BGM remains gallery-only.

- [ ] **Step 4: Review scope and push**

  Ensure Prompt records, routes, copy, gallery behavior, and grouping are otherwise unchanged. Push `redesign/2026` only after the full gate and browser QA pass.
