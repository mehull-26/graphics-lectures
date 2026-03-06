# Engineering Reference

Architecture, styling, component development, and configuration for the Graphics Lectures site.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Configuration Layer](#configuration-layer)
- [Style System](#style-system)
- [Component System](#component-system)
- [MDX Component Factory Pattern](#mdx-component-factory-pattern)
- [Library Systems](#library-systems)
- [Routing & Pages](#routing--pages)
- [Type System](#type-system)
- [Adding a New MDX Component](#adding-a-new-mdx-component)
- [Extending Styles](#extending-styles)
- [Path Aliases](#path-aliases)

---

## Tech Stack

| Package | Version | Purpose |
|---|---|---|
| Astro | 5.18 | Static site generation, routing, content collections |
| React | 19.2 | MDX interactive components |
| TypeScript | 5.9 | Strict typing throughout |
| `@astrojs/mdx` | — | MDX pipeline with component mapping |
| `@astrojs/react` | — | React integration for MDX components |
| KaTeX | 0.16 | Math rendering |
| Expressive Code | — | Syntax-highlighted code blocks |
| remark-math + rehype-katex | — | `$...$` and `$$...$$` → KaTeX |

---

## Project Structure

```
src/
├── components/          # UI components
│   ├── mdx/             # React components used inside MDX
│   ├── BaseHead.astro
│   ├── CustomCursor.astro
│   ├── Footer.astro
│   ├── Header.astro
│   ├── LectureNav.astro
│   ├── SiteLayout.astro
│   └── TableOfContents.astro
├── config/
│   ├── mdx-components.ts   # Registry: which React components MDX can use
│   └── site.ts             # All site-wide constants and configuration
├── content/             # Content collections (MDX/Markdown)
│   ├── config.ts        # Zod schemas for each collection
│   ├── series/          # Series and lecture files
│   └── derivations/     # Standalone derivation files
├── lib/                 # Core business logic
│   ├── cursor.ts
│   ├── ref-preview.ts
│   ├── storage.ts
│   ├── theme-manager.ts
│   ├── mdx/             # MDX component factories
│   └── toc/             # Table of contents system
├── pages/               # Astro route templates
├── styles/
│   ├── index.css        # Import manifest (controls load order)
│   ├── responsive.css
│   ├── base/            # reset.css, typography.css
│   ├── components/      # Per-component stylesheets
│   ├── layout/          # shell.css
│   ├── pages/           # Page-specific overrides
│   └── tokens/          # variables.css (design tokens)
├── types/               # TypeScript definitions
└── utils/               # Pure utility functions
```

---

## Configuration Layer

### `src/config/site.ts`

Single source of truth for all site-wide values. Edit this file first for any branding or text changes.

```typescript
SITE_CONFIG          // title, fullTitle, author, description, tagline
UI_TEXT              // all user-visible labels (TOC title, button text, ARIA labels)
EXTERNAL_RESOURCES   // KaTeX CDN URL
CONTENT_CONFIG       // defaultContentSelector, defaultHeadingSelector
SOCIAL_LINKS         // github, email, linkedin
LICENSE_INFO         // CC BY-NC-ND 4.0
PREVIEW_CONFIG       // hover timing, popup sizing, highlight duration for ref-preview
```

`PREVIEW_CONFIG` controls the hover-preview behaviour on `<EqRef>`, `<FigRef>`, `<TabRef>`:

```typescript
PREVIEW_CONFIG = {
    hoverDelay: 200,         // ms before popup appears
    hideDelay: 150,          // ms before popup hides
    highlightDuration: 2000, // ms element stays highlighted after click
    maxWidth: 700,           // px, popup width cap
    maxHeight: 500,          // px, popup height cap
    showEquationNumbersInPreview: true,
}
```

### `src/config/mdx-components.ts`

Registering a component here makes it available in every MDX file **without** an import:

```typescript
import Details from '../components/mdx/Details';

export default {
    // ...existing
    Details,
};
```

After registering here you still need to pass it via `components={{...}}` in the page template — see [Adding a New MDX Component](#adding-a-new-mdx-component).

---

## Style System

Styles are modular. `src/styles/index.css` is the single import used by `SiteLayout.astro` and controls load order:

```
tokens/variables.css
base/reset.css
base/typography.css
layout/shell.css
components/header.css
components/toc.css
components/lecture-nav.css
... (other components)
pages/home.css
responsive.css
```

**Never import individual CSS files directly** from components. Add new files to `index.css` in the appropriate section.

### Design Tokens (`src/styles/tokens/variables.css`)

All colours, spacing, and timing are CSS custom properties. Every component uses tokens — never hardcode values.

**Core tokens:**

| Token | Purpose |
|---|---|
| `--bg`, `--fg` | Page background and foreground text |
| `--muted` | Secondary/subdued text |
| `--border` | Border and separator lines |
| `--link` | Anchor colour |
| `--code-bg`, `--code-fg` | Inline code styling |

**Themes** are applied via `data-theme="dark"` on `<html>`. Both `dark` and `light` values are defined in the same file under `:root` and `[data-theme="dark"]` blocks.

**Palettes** are applied via `data-palette="colorful"` on `<html>`. In `colorful` mode the headings and emphasis get distinct colours per level. In `monotonic` mode everything falls back to `--fg`.

**Other token groups:**

```css
--transition-fast / --transition-normal / --transition-slow / --transition-xslow
--spacing-tight / --spacing-normal / --spacing-loose
--radius-small / --radius-normal / --radius-large
--z-toc / --z-header / --z-cursor
--content-max-width: 980px
```

### Adding a Component Stylesheet

1. Create `src/styles/components/my-component.css`
2. Add `@import './components/my-component.css';` to `src/styles/index.css` in the components section

---

## Component System

### Layout Components (Astro)

| Component | Purpose |
|---|---|
| `SiteLayout.astro` | Root layout: imports CSS, renders Header + Footer, sets `data-content-page` attribute |
| `BaseHead.astro` | `<head>` management: charset, viewport, title, KaTeX CSS, FOUC-prevention script |
| `Header.astro` | Top nav with logo, series link, theme toggle (#theme-toggle), palette toggle (#palette-toggle) |
| `Footer.astro` | Copyright, license, social links, citation popup |
| `CustomCursor.astro` | Cursor blob overlay (only on `pointer: fine` devices) |
| `TableOfContents.astro` | Sticky TOC sidebar; props: `contentSelector?` |
| `LectureNav.astro` | Right-fixed series navigation; props: `lectures[]`, `metaPages[]`, `seriesSlug`, `seriesTitle`, `currentPath` |

`SiteLayout` accepts:
```typescript
{
    title: string,
    description?: string,
    isContentPage?: boolean,   // adds data-content-page attr, used for layout shifts
    seriesTitle?: string,      // passed to Footer for citation
}
```

### MDX Components (React)

All live in `src/components/mdx/`. They are React components rendered server-side during Astro build.

| Component | Purpose |
|---|---|
| `Details` | Collapsible section with variants (default/derivation/note/example) |
| `Equation` | Display-mode math with numbering and ID |
| `Figure` | Image/content figure with caption and numbering |
| `Table` | Table wrapper with above-caption and numbering |
| `EqRef` | Inline link to an equation, resolves display number |
| `FigRef` | Inline link to a figure |
| `TabRef` | Inline link to a table |
| `ImageBlock` | Single image with asset resolution and scale |
| `ImageRowBlock` | CSS grid of images with uniform sizing |

---

## MDX Component Factory Pattern

Numbered content (Figure, Equation, Table) and their references (FigRef, EqRef, TabRef) are generated from shared factories in `src/lib/mdx/` to avoid duplication.

### `createNumberedContent(config)` — `src/lib/mdx/factories.tsx`

Creates a component that renders numbered, referenceable content:

```typescript
import { createNumberedContent } from '../../lib/mdx/factories';

const MyBlock = createNumberedContent({
    type: 'figure',      // 'figure' | 'equation' | 'table'
    idPrefix: 'fig-',    // expected prefix on the id prop
    label: 'Figure',     // display label: "Figure 1.2"
});
```

The resulting component handles:
- Hierarchical numbering: `contextNumber=1, number=2` → **Figure 1.2**
- `data-ref-id`, `data-ref-type`, `data-ref-number` attributes (used by the hover-preview system)
- Auto-generating IDs from caption text if none is provided

### `createContextWrapper(Component, contextNumber)` — `src/lib/mdx/utils.ts`

Pre-binds a `contextNumber` (the lecture or derivation number) to all numbered components on a page, so they automatically produce hierarchical numbers:

```typescript
// In a page template:
const FigureWithLecture = createContextWrapper(Figure, lectureEntry.data.lectureNumber);
// Now <Figure id="fig-x" number={1} /> automatically produces "Figure 1.1"
```

### `createContentRef(config)` — `src/lib/mdx/refFactory.tsx`

Creates inline reference link components:

```typescript
import { createContentRef } from '../../lib/mdx/refFactory';

const MyRef = createContentRef({
    type: 'figure',
    idPrefix: 'fig-',
    defaultPrefix: 'fig.',   // text shown before number when no children: "fig. 1.2"
});
```

Cross-page references are supported via the `page` prop:

```tsx
<FigRef id="fig-diagram" page="/series/rendering/lecture-02" />
```

---

## Library Systems

### Theme Manager (`src/lib/theme-manager.ts`)

Manages `dark/light` theme and `colorful/monotonic` palette via DOM attributes and `localStorage`.

- `initThemeSystem()` — call early in `<head>` to prevent FOUC
- `setupThemeSystem()` — binds the toggle buttons; call on `DOMContentLoaded`

The toggle buttons must have IDs `#theme-toggle` and `#palette-toggle`.

### Table of Contents (`src/lib/toc/`)

Automatically extracted from content headings. Key behaviours:
- Only the **top 2 heading levels** present in the content are included
- Scroll tracking highlights the active section
- Responsive: hidden below 980px viewport width
- Expand/collapse controls for nested items

The `TableOfContents.astro` component handles initialisation via `setupToc()`. Pass a `contentSelector` if your content isn't in `<article>`.

### Ref Preview (`src/lib/ref-preview.ts`)

Hover popups and click-to-scroll for any element with `data-ref-link` attribute. Handles:
- **Same-page**: highlights the target element directly
- **Cross-page**: fetches the remote page and extracts the target HTML
- **Touch devices**: hover disabled; click-to-navigate works instead
- Opens `<details>` elements that contain the target automatically

Configured via `PREVIEW_CONFIG` in `src/config/site.ts`.

### Custom Cursor (`src/lib/cursor.ts`)

Renders a translucent blob that tracks the cursor. Only activates on `pointer: fine` (mouse/trackpad). Interactive elements (links, buttons) trigger a hover state.

### Storage (`src/lib/storage.ts`)

Type-safe `localStorage` wrapper used by the theme system. Guards against SSR and private browsing mode failures.

---

## Routing & Pages

| Route | File | Purpose |
|---|---|---|
| `/` | `pages/index.astro` | Home / series listing |
| `/series` | `pages/series/index.astro` | All series |
| `/series/[series]` | `pages/series/[series]/index.astro` | Single series overview |
| `/series/[series]/[lecture]` | `pages/series/[series]/[lecture].astro` | Lecture page |
| `/derivations` | `pages/derivations/index.astro` | All derivations |
| `/derivations/[derivationSlug]` | `pages/derivations/[derivationSlug].astro` | Single derivation |

All routes are statically generated. `getStaticPaths()` in each page fetches the content collection and produces the path params.

### Registering Components in Page Templates

After adding a component to `mdx-components.ts`, also add it to the `<Content components={{...}} />` call in the relevant page template:

```astro
<!-- src/pages/series/[series]/[lecture].astro -->
<Content components={{
    Figure: FigureWithLecture,
    Equation: EquationWithLecture,
    Details,       // ← add here
    FigRef,
    EqRef,
}} />
```

Do the same for `src/pages/derivations/[derivationSlug].astro` if the component should also work in derivations.

---

## Type System

| File | Contents |
|---|---|
| `src/types/content.ts` | `SeriesEntry`, `LectureEntry`, `MetaEntry`, `DerivationEntry`, `NavigationLink` |
| `src/types/theme.ts` | `Theme`, `Palette`, branded `SeriesSlug` / `LectureSlug`, `STORAGE_KEYS`, `DATA_ATTRIBUTES` |
| `src/types/index.ts` | Re-export barrel |

Content schemas (Zod) live in `src/content/config.ts`. Both the schemas and the TypeScript types must be kept in sync.

---

## Adding a New MDX Component

Full checklist for adding a component available in MDX:

1. **Create** `src/components/mdx/MyComponent.tsx`
2. **Register** it in `src/config/mdx-components.ts`
3. **Add** it to the `components={{}}` prop in:
   - `src/pages/series/[series]/[lecture].astro`
   - `src/pages/derivations/[derivationSlug].astro` (if needed)
4. **Add CSS** in `src/styles/components/my-component.css` and import it in `src/styles/index.css`

---

## Extending Styles

### Changing a Design Token

Edit `src/styles/tokens/variables.css`. All components pick up the change automatically.

### Overriding a Component

Each component has its own CSS file. Find the relevant file in `src/styles/components/` and add/modify rules there. Avoid modifying `reset.css` or `typography.css` for component-specific overrides.

### Adding a New Theme or Palette

In `variables.css`:
1. Define the new values inside a new attribute selector: `[data-theme="my-theme"] { ... }`
2. Update `theme-manager.ts` to include the new value in the valid values list
3. Add a toggle button in `Header.astro` and bind it in `theme-manager.ts`

---

## Path Aliases

Configured in `tsconfig.json` and `astro.config.mjs`:

| Alias | Resolves to |
|---|---|
| `@utils/*` | `src/utils/*` |
| `@lib/*` | `src/lib/*` |
| `@components/*` | `src/components/*` |
| `@styles/*` | `src/styles/*` |
| `@types/*` | `src/types/*` |
| `@config/*` | `src/config/*` |
