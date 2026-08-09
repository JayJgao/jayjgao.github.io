# AGENTS.md

## Project

This repository builds Jay Ko's multilingual resume and portfolio as a Next.js static export for GitHub Pages.

## Architecture

- Keep `output: "export"`, `trailingSlash: true`, and unoptimized images.
- Do not add API routes, Server Actions, ISR, middleware, or runtime-only data fetching.
- Preserve `/ko`, `/en`, and `/zh`, current legacy aliases, and locale-aware metadata.

## Content workflow

- Interview-approved Korean copy is the source of truth. Do not invent, strengthen, or merge claims.
- Preserve numbers, dates, proper nouns, ownership boundaries, confidentiality limits, and approved English technical terms.
- Use `humanize-korean` only for noncanonical Korean prose. Do not aggressively rewrite agreed interview copy.
- Use `humanizer` for English and Chinese drafts, then verify every fact against the Korean source.
- Keep Korean fallback notices and `lang` markers until a locale-specific MDX file exists.

## Design language

- Use Bone and cream surfaces, Ink text, Cobalt structure, and Ember Orange accents.
- Use `#ff5c00` for vivid fills and `#b83c00` for readable orange text on cream.
- Prefer editorial typography, thin rules, generous spacing, text-led Project cards, and restrained media.
- Do not reintroduce dark mode, decorative icons, arbitrary gradients, or dense dashboard styling.
- Avoid forced line breaks in prose. Use layout measures and `text-wrap` instead.

## Assets and privacy

- `.reference/` is local-only and must never be committed or exported.
- Every file under `public/` must be referenced by the production export.
- Keep `src/data/asset-manifest.json`, source data, MDX, and real files synchronized.
- Never publish raw source evidence, screenshots with private details, internal URLs, or confidential metrics.

## Verification

For behavior changes, write a failing test first. Before completion run:

```bash
npm test
npm run lint -- --no-cache
npm run typecheck
npm run build
npm run verify:export
git diff --check
```

Expected export inventory: 106 HTML files, 84 localized routes, 45 Project detail routes, 24 Demo detail routes, and 19 legacy routes.
