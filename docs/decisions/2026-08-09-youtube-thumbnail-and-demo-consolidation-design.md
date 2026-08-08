# YouTube Thumbnail and Demo Consolidation Follow-up

**Date:** 2026-08-09

**Branch:** `redesign/2026`

**Status:** Implemented and verified on `redesign/2026`

## Context

Phase 1 currently renders an internal placeholder before a Demo highlight video is played. The data model also retains a nullable local `poster` field and the canonical documents list seven custom posters as future work.

The preferred operating model is simpler: use each public YouTube video's own thumbnail immediately, keep the privacy-enhanced player click-gated, and stop managing a second poster asset for the same video.

Separately, `Prompt Enhancer` and `Prompt Enhance Skills` may tell one continuous skills-to-product story. Their possible consolidation is a content decision, not part of this follow-up.

## Decisions

### 1. Use YouTube thumbnails directly

- The seven playable Demos render `https://i.ytimg.com/vi/{videoId}/maxresdefault.jpg` as their initial video surface.
- If `maxresdefault.jpg` fails, the client retries once with `https://i.ytimg.com/vi/{videoId}/hqdefault.jpg`.
- If both images fail, the existing internal gradient surface remains visible with the accessible play button.
- The thumbnail is decorative because the full-surface button already names the action and Demo.
- The image uses lazy loading and `referrerPolicy="no-referrer"`.
- Loading a thumbnail may still disclose the visitor's IP address and browser-level request information to Google's image host. This trade-off is explicitly accepted for the public portfolio.

### 2. Keep video playback click-gated

- Initial HTML contains no YouTube iframe and no autoplay parameter.
- Clicking the play control replaces the thumbnail surface with the existing `youtube-nocookie.com` embed.
- `prompt-enhance-skills` remains `pending` and therefore does not request a YouTube thumbnail.
- `script-to-bgm` remains image-only and therefore renders neither a video surface nor a thumbnail.

### 3. Remove the custom-poster layer

- Remove the nullable `poster` property from the Demo video schema and all nine records.
- Remove the `poster` prop and local-poster branch from `DemoVideo`.
- Remove the custom-poster path and remaining-work item from canonical documentation.
- Do not download, optimize, commit, or cache YouTube thumbnails locally.

### 4. Defer Prompt consolidation to Phase 3

- Keep two cards, two slugs, two detail routes, reciprocal links, and the current productized order in this follow-up.
- Add a Phase 3 interview decision: whether `Prompt Enhancer` and `Prompt Enhance Skills` should become one card/story.
- Phase 3 should weigh information redundancy against the value of showing the progression from distributed skills to a product API.
- Any future consolidation must decide canonical URL, redirect behavior, merged evidence, and preservation of the skills-to-product chronology before changing data or routes.

## Implementation Shape

- Add pure URL helpers in `src/lib/demos.ts` for the max-resolution and high-resolution thumbnail URLs.
- Pass `videoId` to `DemoVideo`; derive thumbnail URLs from that trusted canonical ID.
- Render the remote thumbnail with `next/image` in `unoptimized` mode and allow only `i.ytimg.com` in `next.config.ts`.
- Keep the existing `available | pending | none` video-mode contract and `play | loaded | pending` DOM state markers.
- No new data file, API call, proxy, build-time fetch, or asset pipeline is introduced.

## Failure and Privacy Behavior

1. `maxresdefault.jpg` succeeds: show the 1280×720 thumbnail.
2. It fails: retry `hqdefault.jpg` once.
3. The fallback also fails: remove the broken image and expose the existing gradient surface.
4. At every stage the play button remains usable by pointer and keyboard.
5. `no-referrer` prevents the portfolio page URL from being sent as the image request referrer; it does not hide the visitor's IP address from the remote host.

## Verification

- RED/GREEN tests for exact thumbnail URL construction and removal of the custom-poster schema.
- Component contract tests for lazy loading, `no-referrer`, maxres-to-high fallback, click-only iframe, and unchanged pending/none states.
- Export verification for seven localized playable Demo families: thumbnail present, initial iframe absent, no autoplay, and no local poster path.
- Full `npm test`, lint, typecheck, build, and export verifier gates.
- Companion browser QA at desktop and mobile widths, including one maxres thumbnail, fallback behavior, play transition, and the two no-video meanings.

## Non-goals

- Merging the two Prompt records or routes.
- Adding consent UI, a proxy, or a YouTube Data API dependency.
- Reintroducing custom poster production or storage.
- Changing Demo copy, grouping, evidence galleries, or Phase 1 information architecture.
