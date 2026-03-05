# Graphics Lectures

A well-architected Astro-based lecture archive for long-form technical series with clean, maintainable code structure.

## 🎯 Goals

- Content-first lecture library (not a blog, not a portfolio)
- MDX authoring with math (KaTeX) and code blocks (Expressive Code)
- Scales to many lectures and series
- Clean, maintainable architecture with proper separation of concerns
- Simple GitHub Pages deployment

## 🛠 Tech Stack

- **Astro 5.x** - Static site generator with content collections
- **TypeScript** - Type-safe development with strict mode
- **MDX** - Markdown with JSX components
- **KaTeX** - Math rendering via `remark-math` + `rehype-katex`
- **Expressive Code** - Syntax highlighting with line numbers
- **CSS Modules** - Modular CSS architecture

## 📁 Project Structure

```
src/
├── components/          # UI Components
│   ├── SiteLayout.astro    # Main layout wrapper (~35 lines)
│   ├── BaseHead.astro      # <head> section
│   ├── Header.astro        # Navigation header
│   ├── CustomCursor.astro  # Custom cursor component
│   ├── TableOfContents.astro  # TOC component (~25 lines)
│   └── mdx/                # MDX Custom Components
│       ├── ImageBlock.tsx      # Single image with scaling & caption
│       ├── ImageRowBlock.tsx   # Multi-image grid layout
│       └── imageResolver.ts    # Smart asset path resolution
│
├── config/              # Configuration Files
│   └── site.ts            # Site metadata, navigation, UI text (6 constants)
│
├── lib/                 # Business Logic Libraries
│   ├── storage.ts         # Type-safe localStorage wrapper
│   ├── theme-manager.ts   # Generic theme/palette toggle system
│   ├── cursor.ts          # Custom cursor logic
│   └── toc/               # Table of Contents modules
│       ├── builder.ts        # Heading extraction & tree building
│       ├── renderer.ts       # HTML rendering
│       ├── tracker.ts        # Scroll tracking & active state
│       └── index.ts          # Public API
│
├── utils/               # Pure Utility Functions
│   ├── path.ts            # URL/path manipulation (withBase, toSeriesSlug, etc.)
│   └── content.ts         # Content collection helpers (with caching)
│
├── types/               # TypeScript Type Definitions
│   ├── content.ts         # Content collection types
│   ├── theme.ts           # Theme/palette types
│   └── index.ts           # Barrel export
│
├── styles/              # Modular CSS (split from 1035-line monolith)
│   ├── index.css          # Main import file
│   ├── tokens/
│   │   └── variables.css     # CSS custom properties
│   ├── base/
│   │   ├── reset.css         # Resets & base styles
│   │   └── typography.css    # Typography system
│   ├── layout/
│   │   └── shell.css         # Site shell layout
│   ├── components/
│   │   ├── header.css        # Header/navigation
│   │   ├── toc.css           # Table of contents (182 lines!)
│   │   ├── cursor.css        # Custom cursor
│   │   ├── buttons.css       # Theme/palette toggles
│   │   ├── cards.css         # Series & meta cards
│   │   ├── code.css          # Code blocks
│   │   ├── math.css          # KaTeX styles
│   │   ├── meta.css          # Metadata section
│   │   └── details.css       # Details/summary
│   ├── pages/
│   │   └── home.css          # Home page styles
│   └── responsive.css     # Media queries
│
├── content/             # Content Collections
│   ├── config.ts           # Zod schemas for collections
│   └── series/
│       └── rendering/
│           ├── series.md      # Series metadata
│           └── lecture-01/    # Individual lectures
│
└── pages/               # Astro Pages (Routes)
    ├── index.astro         # Homepage
    └── series/
        ├── index.astro         # Series list
        └── [series]/
            ├── index.astro        # Series detail
            ├── [lecture].astro    # Lecture page
            └── [...slug].astro    # Meta pages
```

## 🏗 Architecture Principles

### 1. **Zero Code Duplication**
- `withBase()` function: **1 implementation** (was 5 copies)
- Theme toggle logic: **Generic system** (eliminated ~100 lines of duplication)
- localStorage access: **Type-safe wrapper** (replaced 6 try-catch blocks)

### 2. **Separation of Concerns**
- **Components**: UI presentation only
- **Config**: Centralized constants (no hardcoded strings)
- **Lib**: Business logic (themes, TOC, cursor)
- **Utils**: Pure functions (path, content helpers)
- **Types**: Shared TypeScript definitions

### 3. **Modular CSS**
- Split 1035-line monolith into **16 semantic modules**
- Clear import order in `index.css`
- Easy to locate and modify specific styles

### 4. **Type Safety**
- Branded types for slugs (`SeriesSlug`, `LectureSlug`)
- Strict TypeScript configuration
- Content collection type definitions

## ⚙️ Configuration System

### Site Configuration - `config/site.ts` ✅

**ACTIVELY USED** by 8+ files throughout the project:
- `SiteLayout.astro` - Uses `SITE_CONFIG.title`, `SITE_CONFIG.description`
- `Header.astro` - Uses `NAVIGATION.items`, `UI_TEXT`
- `TableOfContents.astro` - Uses `CONTENT_CONFIG.defaultContentSelector`
- All page routes - Use site metadata and navigation constants

**Changes to `site.ts` take effect immediately** (requires dev server restart).

```typescript
// Example: Changing site title
export const SITE_CONFIG = {
  title: 'My Graphics Lectures',  // ← Shows in browser title, header
  author: 'Your Name',            // ← Shows in meta tags
  // ...
};
```

### Design Tokens - CSS Custom Properties ✅

All design values (colors, transitions, spacing, etc.) are now **CSS custom properties** in [styles/tokens/variables.css](src/styles/tokens/variables.css).

**These actually work!** Edit these values to change the visual design:

```css
/* styles/tokens/variables.css */
:root {
    /* Colors */
    --bg: #ffffff;
    --fg: #101010;
    --link: #007bc3;
    
    /* Transitions - Edit these to change animation speed */
    --transition-fast: 120ms;     /* UI feedback */
    --transition-normal: 160ms;   /* Most elements */
    --transition-slow: 180ms;     /* Theme changes */
    --transition-xslow: 220ms;    /* Major changes */
    
    /* Spacing */
    --spacing-tight: 0.8rem;
    --spacing-normal: 1rem;
    --spacing-loose: 1.2rem;
    
    /* Z-index layers */
    --z-toc: 60;
    --z-header: 100;
    --z-cursor: 9999;
    
    /* Content widths */
    --content-max: 980px;
    --home-max: 1000px;
}
```

**Example customizations:**

```css
/* Make all transitions faster */
--transition-fast: 80ms;
--transition-normal: 100ms;
--transition-slow: 120ms;

/* Change link color */
--link: #0066cc;

/* Adjust content width */
--content-max: 1200px;

/* Make TOC darker blue */
--link: #0052a3;
```

### Quick Reference: What to Edit

| Want to change... | Edit this file | Property |
|-------------------|----------------|----------|
| **Site title, author** | `config/site.ts` | `SITE_CONFIG.title` |
| **Navigation links** | `config/site.ts` | `NAVIGATION.items` |
| **Colors (theme)** | `styles/tokens/variables.css` | `--bg`, `--fg`, `--link` |
| **Animation speed** | `styles/tokens/variables.css` | `--transition-*` |
| **Spacing** | `styles/tokens/variables.css` | `--spacing-*` |
| **Content width** | `styles/tokens/variables.css` | `--content-max` |
| **Z-index layers** | `styles/tokens/variables.css` | `--z-*` |

## 🎨 Styling System

### Theme System

The site supports **dual theme modes**:
- **Dark/Light**: Core color scheme via `data-theme` attribute
- **Colorful/Monotonic**: Accent palette via `data-palette` attribute

Theme state persists in `localStorage` and uses a generic toggle system:

```typescript
import { themeManager, paletteManager } from '@lib/theme-manager';
import { setupThemeSystem } from '@lib/theme-manager';

// Initialize on page load
setupThemeSystem();
```

### Design Tokens & CSS Variables

All design tokens are centralized as CSS custom properties in [src/styles/tokens/variables.css](src/styles/tokens/variables.css):

**Colors:**
- `--bg`, `--fg`, `--muted`, `--border`, `--link`
- `--code-bg`, `--code-fg`
- `--selection-bg`, `--selection-fg`
- `--cursor-blob`

**Transitions:**
- `--transition-fast` (120ms) - UI feedback
- `--transition-normal` (160ms) - Most elements
- `--transition-slow` (180ms) - Theme changes
- `--transition-xslow` (220ms) - Major changes

**Spacing & Sizing:**
- `--spacing-tight`, `--spacing-normal`, `--spacing-loose`
- `--border-radius-small`, `--border-radius`, `--border-radius-large`
- `--content-max`, `--home-max`

**Z-index Layers:**
- `--z-toc` (60) - Table of contents
- `--z-header` (100) - Sticky header
- `--z-cursor` (9999) - Custom cursor

**Edit these values directly in variables.css to customize the design!**

#### Example Customizations

```css
/* Make everything faster */
:root {
    --transition-fast: 80ms;
    --transition-normal: 100ms;
    --transition-slow: 120ms;
}

/* Change primary link color */
:root {
    --link: #0066cc;
}

/* Wider content area */
:root {
    --content-max: 1200px;
}

```css
:root {
  --bg: #ffffff;
  --fg: #101010;
  --muted: #555555;
  --border: #d9d9d9;
  --link: #007bc3;
  /* ... */
}

:root[data-theme='dark'] {
  --bg: #0b0b0b;
  --fg: #f2f2f2;
  /* ... */
}
```

## 🔧 Development

### Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Code Quality

```bash
# Format code with Prettier
npm run format

# Check formatting
npm run format:check

# Lint with ESLint
npm run lint

# Auto-fix lint issues
npm run lint:fix

# Type check
npm run type-check
```

### Path Aliases

The project uses path aliases for cleaner imports:

```typescript
import { withBase } from '@utils/path';
import { themeManager } from '@lib/theme-manager';
import { SITE_CONFIG } from '@config/site';
import type { SeriesEntry } from '@types';
```

Configured in:
- `tsconfig.json` - TypeScript paths
- `astro.config.mjs` - Vite resolve.alias

## 📝 Content Authoring

### Adding a New Lecture

1. Create directory: `src/content/series/[series-name]/[lecture-slug]/`
2. Add `lecture.mdx` with frontmatter:

```mdx
---
lectureNumber: 1
title: "Lecture Title"
summary: "Brief description"
publishedAt: 2024-01-01
---

Your content here with $\LaTeX$ math and code blocks.
```

### Math Notation

Use KaTeX syntax for math:

- Inline: `$E = mc^2$`
- Display: `$$\int_0^\infty f(x) dx$$`

### Code Blocks

Use fenced code blocks with language and optional line numbers:

````markdown
```typescript showLineNumbers
function example() {
  return 'Hello';
}
```
````

### MDX Custom Components

The project includes custom React components for enhanced lecture content:

#### ImageBlock - Single Image with Options

```mdx
import ImageBlock from '../../../../components/mdx/ImageBlock';

<ImageBlock
  name="diagram.png"              // Filename in assets/ folder
  alt="Architecture diagram"      // Optional: alt text (auto-generated from filename if omitted)
  scale={0.6}                     // Optional: scale 0.1-1.0 (default: 1)
  caption="Figure 1: Overview"    // Optional: caption below image
/>
```

**Features:**
- **Smart path resolution**: Just use filename, automatically finds in `content/series/{series-name}/{lecture-name}/assets/`
- **Auto alt text**: Generates from filename (`radiometry-diagram.png` → "radiometry diagram")
- **Responsive scaling**: `scale` prop controls width (0.6 = 60% of container)
- **Theme-aware borders**: Automatically uses `--border` CSS variable

#### ImageRowBlock - Multi-Image Grid

```mdx
import ImageRowBlock from '../../../../components/mdx/ImageRowBlock';

<ImageRowBlock
  perLine={3}                     // Images per row (default: 2)
  scale={0.9}                     // Row width as percentage (default: 1)
  gapRem={0.5}                    // Gap between images in rem (default: 0.8)
  images={[
    'image1.png',                   // Simple string
    { name: 'image2.png', alt: 'Custom alt text' },  // With custom alt
    { name: 'image3.png' }
  ]}
/>
```

**Use cases:**
- Comparison images side-by-side
- Step-by-step process diagrams
- Algorithm visualization sequences
- Before/after examples

#### Image Asset Organization

Place images in lecture asset folders:

```
src/content/series/
└── rendering/
    └── lecture-01/
        ├── lecture.mdx
        └── assets/
            ├── radiometry.png
            ├── flux-diagram.png
            └── irradiance-example.jpg
```

Then reference by filename only:
```mdx
<ImageBlock name="radiometry.png" />
```

## 🚀 Deployment

The site deploys to GitHub Pages:

```bash
npm run deploy
```

This runs:
1. `npm run build` - Builds static site to `dist/`
2. `gh-pages -d dist` - Deploys to `gh-pages` branch

## 📦 Key Refactorings

### Phase 1: Eliminate Duplication
- ✅ Created `src/utils/path.ts` (5 functions, eliminated 5 copies of `withBase()`)
- ✅ Created `src/lib/storage.ts` (replaced 6 try-catch blocks)
- ✅ Created `src/lib/theme-manager.ts` (generic toggle, eliminated ~100 lines)
- ✅ Split TOC script into 4 modules (280 lines → 4 files)
- ✅ Extracted cursor logic (62 lines → separate module)

### Phase 2: Configuration & Types
- ✅ Created `src/config/site.ts` (6 constant groups, no hardcoded strings)
- ✅ Created CSS custom properties in `styles/tokens/variables.css` (transitions, spacing, z-index)
- ✅ Created `src/types/` (content.ts, theme.ts, index.ts)
- ✅ Extracted layout components (BaseHead, Header, CustomCursor)

### Phase 3: CSS Modularization
- ✅ Split 1035-line `site.css` into 16 semantic modules
- ✅ Created `styles/index.css` as main entry point
- ✅ Updated SiteLayout to import modular CSS

### Phase 4: Tooling & Utilities
- ✅ Added path aliases to `tsconfig.json` and `astro.config.mjs`
- ✅ Created content utilities with caching (`src/utils/content.ts`)
- ✅ Added Prettier & ESLint configurations
- ✅ Added npm scripts for formatting and linting
- ✅ Converted design tokens to CSS custom properties for actual functionality

## 📊 Metrics

**Before Refactoring:**
- `site.css`: 1035 lines
- `SiteLayout.astro`: 251 lines
- `TableOfContents.astro`: 299 lines
- `withBase()` function: 5 copies
- Theme toggle code: ~100 lines duplicated

**After Refactoring:**
- `site.css`: Split into 16 modules
- `SiteLayout.astro`: ~35 lines
- `TableOfContents.astro`: ~25 lines  
- `withBase()` function: 1 implementation
- Theme toggle code: Generic system

**Code Reduction:** ~700+ lines eliminated through modularization and deduplication

## 🤝 Contributing

When adding features:

1. Follow the existing architecture patterns
2. Use path aliases for imports
3. Add types for new data structures
4. Update design tokens for new magic numbers
5. Run `npm run format` and `npm run lint:fix` before committing

## 📄 License

Private project

---

**Architecture designed for maintainability, scalability, and developer experience.**
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