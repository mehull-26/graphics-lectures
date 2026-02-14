# graphics-lectures

Minimal Astro-based lecture archive for long-form technical series.

## Goals

- Content-first lecture library (not a blog, not a portfolio)
- MDX authoring with math and code blocks
- Scales to many lectures and series
- Simple GitHub Pages deployment

## Stack

- Astro (static output)
- `@astrojs/mdx`
- KaTeX via `remark-math` + `rehype-katex`
- Astro content collections for route generation

## Styling guidelines

The site uses a minimal editorial style inspired by technical long-form writing.

- Single shared layout: `src/components/SiteLayout.astro`
- Single shared stylesheet: `src/styles/site.css`
- Keep visual changes centralized in these two files

### Visual principles

- Content-first layout with generous whitespace
- Clean sans-serif typography
- Minimal header with only archive navigation + mode toggle
- No decorative effects, no animations beyond subtle color transitions

### Theme system (black/white mode)

- Theme tokens are CSS variables in `:root` and `:root[data-theme='dark']`
- Toggle is in the site header and persists in `localStorage`
- Keep new colors mapped through existing tokens (`--bg`, `--fg`, `--muted`, etc.)

### Math and code readability

- Math uses KaTeX globally
- Responsive math sizing and horizontal overflow handling are defined in `.katex` and `.katex-display`
- Display equations should remain readable on mobile without layout breakage
- Code blocks use shared monospace styling from `site.css`

### Content authoring note for MDX math

If editor diagnostics show false parser errors for LaTeX commands, prefer unicode-safe math notation in lecture content (for example `Φ`, `ω`, `θ`, `²`, and `·`) while keeping equations inside `$$ ... $$` blocks.

## Structure

```txt
/
  astro.config.mjs
  package.json

  /public

  /src
    /pages
      index.astro
      /series
        index.astro
        /[series]
          index.astro
          /[lecture].astro

    /content
      config.ts
      /series
        /rendering
          series.md
          /lecture-01
            lecture.mdx
            /assets
```

## Local workflow

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start dev server:

   ```bash
   npm run dev
   ```

3. Build static site:

   ```bash
   npm run build
   ```

## Content workflow (cards are auto-generated)

You do **not** manually create cards in page files.

- Home page series cards are generated from `src/content/series/*/series.md`
- Series lecture links are generated from `src/content/series/*/lecture-*/lecture.mdx`

If you create the files in the correct folder format, cards and routes appear automatically.

## Quick add: new lecture in existing series

Example: add `lecture-02` under `rendering`:

```txt
src/content/series/rendering/lecture-02/
  lecture.mdx
  assets/
```

Use this `lecture.mdx` frontmatter template:

```yaml
---
title: Radiance Transport Basics
lectureNumber: 2
summary: Building the rendering equation intuition from radiance flow.
publishedAt: 2026-02-13
starterRepo: https://github.com/your-org/rendering-l02-starter
finishedRepo: https://github.com/your-org/rendering-l02-finished
---
```

Resulting route:

- `/series/rendering/lecture-02`

## Quick add: new lecture series

Create this structure:

```txt
src/content/series/<series-slug>/
  series.md
  lecture-01/
    lecture.mdx
    assets/
```

Use this `series.md` template:

```yaml
---
title: Simulation
description: Numerical simulation notes from fundamentals to implementation.
order: 2
---
```

Use this initial `lecture-01/lecture.mdx` template:

```yaml
---
title: Simulation Foundations
lectureNumber: 1
summary: Core simulation concepts and notation.
publishedAt: 2026-02-13
---
```

Resulting routes:

- `/series`
- `/series/<series-slug>`
- `/series/<series-slug>/lecture-01`

## Images in lectures (MDX)

Preferred pattern:

```mdx
import diagram from './assets/diagram.png';

<img src={diagram.src} alt="Diagram" loading="lazy" />
```

Optional inline scaling:

```mdx
<img src={diagram.src} alt="Diagram" class="img-inline" style={{ '--img-inline-width': '520px' }} />
```

## Deploy (GitHub Pages + custom domain)

This repo uses GitHub Actions deployment via:

- `.github/workflows/deploy-pages.yml`

Current custom-domain setup:

- `site` in `astro.config.mjs`: `https://mehull.dev`
- `base` in `astro.config.mjs`: `'/'`
- `public/CNAME`: `mehull.dev`

After pushing to `main`, GitHub Actions builds and deploys automatically.

## Code repositories policy

Lecture starter/finished code should live in separate repositories and be linked from lecture frontmatter.