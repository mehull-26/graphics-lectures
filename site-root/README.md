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
/site-root
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

## Add a new lecture (no route/config edits)

For rendering lecture 02:

```txt
src/content/series/rendering/lecture-02/
  lecture.mdx
  assets/
```

Add frontmatter in `lecture.mdx`:

```yaml
---
title: Lecture 02 - Your Topic
lectureNumber: 2
summary: Short summary.
starterRepo: https://github.com/your-org/rendering-l02-starter
finishedRepo: https://github.com/your-org/rendering-l02-finished
---
```

Routes are generated automatically from content collections:

- `/series`
- `/series/rendering`
- `/series/rendering/lecture-02`

## Add a new series

Create:

```txt
src/content/series/<series-name>/
  series.md
  lecture-01/
    lecture.mdx
    assets/
```

Set metadata in `series.md` frontmatter:

```yaml
---
title: Simulation
description: Your series description.
order: 2
---
```

## GitHub Pages

This project is configured for a repo named `graphics-lectures`.

1. Update `site` in `astro.config.mjs`:

   ```js
   site: 'https://<your-github-username>.github.io'
   ```

2. Keep base path as:

   ```js
   base: '/graphics-lectures'
   ```

3. Build and deploy:

   ```bash
   npm run deploy
   ```

Alternative: use GitHub Actions to publish `dist/` to Pages.

## Code repositories policy

Lecture starter/finished code should live in separate repositories and be linked from lecture frontmatter.