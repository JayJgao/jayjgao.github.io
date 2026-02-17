# Asset Structure

Place static files under this directory so paths are stable in static export.

## Images
- `images/profile/`: profile photos (`jay-ko-main.webp`, `jay-ko-square.webp`)
- `images/hero/`: hero section visuals
- `images/backgrounds/`: textured/gradient background images
- `images/og/`: social preview images (1200x630)
- `images/companies/logos/`: company logos for timeline/cards
- `images/timeline/`: timeline-specific thumbnails/icons
- `images/projects/featured/`: featured project thumbnails
- `images/projects/archive/`: archive project thumbnails
- `images/projects/cinev/`: CineV project images
- `images/projects/buzzni/`: Buzzni project images
- `images/projects/solidware/`: Solidware project images
- `images/projects/lunit/`: Lunit project images
- `images/projects/chroma/`: Chroma Awards images

## Diagrams
- `diagrams/architecture/`: system architecture exports (PNG/SVG)
- `diagrams/flows/`: flowcharts and process diagrams
- Mermaid source of truth is **not** in `public/`.
  - Use `src/content/diagrams/{slug}/*.mmd` for editable sources.
  - Export fallback SVG/PNG into `public/assets/diagrams/...`.

## Media
- `media/projects/`: project GIF/MP4 assets
- `media/demos/`: demo clips for embeds

## Resume
- `resume/`: downloadable resume PDFs
  - `resume_ko.pdf`
  - `resume_en.pdf`

## Suggested naming
- Use lowercase kebab-case.
- Include locale suffix only when needed: `*-ko`, `*-en`, `*-zh`.
- Prefer WebP for images, PNG fallback if transparency/detail is required.
- Project thumbnail contract: `{slug}-thumb.webp` (1200x675 recommended)
- Project detail shot contract: `{slug}-shot-01.webp` (max width 1600)
