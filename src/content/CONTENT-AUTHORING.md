# Content Authoring Guide

Everything you need to write lectures, derivations, and series pages.

---

## Table of Contents

- [Content Types Overview](#content-types-overview)
- [Creating a Series](#creating-a-series)
- [Creating a Lecture](#creating-a-lecture)
- [Creating a Derivation](#creating-a-derivation)
- [Creating Meta Pages](#creating-meta-pages)
- [MDX Components Reference](#mdx-components-reference)
  - [Details (Collapsible Sections)](#details-collapsible-sections)
  - [Equations](#equations)
  - [Figures](#figures)
  - [Tables](#tables)
  - [Cross-References](#cross-references)
  - [Images](#images)
- [Math Syntax](#math-syntax)
- [Cross-Page References](#cross-page-references)
- [File & Asset Conventions](#file--asset-conventions)

---

## Content Types Overview

| Type | Location | Description |
|---|---|---|
| Series | `src/content/series/[series-slug]/series.md` | Groups a set of lectures |
| Lecture | `src/content/series/[series-slug]/lecture-NN/lecture.mdx` | Individual lecture |
| Meta Page | `src/content/series/[series-slug]/.meta/[slug].mdx` | Supplementary pages (syllabus, notes, etc.) |
| Derivation | `src/content/derivations/derivation-NN/derivation.mdx` | Standalone mathematical derivation |

---

## Creating a Series

Create `src/content/series/[series-slug]/series.md`:

```markdown
---
title: Rendering Foundations
description: Core theory and implementation of physically based rendering.
order: 1
---
```

| Field | Type | Required | Notes |
|---|---|---|---|
| `title` | string | ✅ | Displayed in nav and headings |
| `description` | string | ✅ | Short summary shown on series index |
| `order` | number | — | Controls sort order on the series listing (default: 0) |

The folder name (e.g., `rendering`) becomes the URL slug: `/series/rendering`.

---

## Creating a Lecture

Create `src/content/series/[series-slug]/lecture-NN/lecture.mdx`:

```markdown
---
title: Radiometry Foundations
lectureNumber: 1
summary: Core radiometric quantities and why they matter for physically based rendering.
publishedAt: 2026-02-13
readings:
    - label: PBRT Radiometry Chapter
      href: https://pbr-book.org/4ed/Radiometry,_Spectra,_and_Color
assignments:
    - label: Assignment 1 - Radiometry worksheet
      href: https://example.com/assignments/worksheet
resources:
    - label: Starter repository
      href: https://github.com/your-org/starter
---

## Section heading

Your lecture content here...
```

### Frontmatter Fields

| Field | Type | Required | Notes |
|---|---|---|---|
| `title` | string | ✅ | Page `<h1>` and `<title>` |
| `lectureNumber` | integer | ✅ | Used for numbering figures/equations (e.g., "Figure 1.2") |
| `summary` | string | — | Short description shown in metadata block |
| `publishedAt` | date (YYYY-MM-DD) | — | Displayed in header as "Feb 13" |
| `readings` | `{label, href}[]` | — | Linked reading list |
| `assignments` | `{label, href}[]` | — | Linked assignments |
| `resources` | `{label, href}[]` | — | Starter repos, slides, reference notes |

### Numbering

`lectureNumber` drives the prefix on all numbered content. `lectureNumber: 1` with `<Equation number={3}>` produces **Equation 1.3**.

---

## Creating a Derivation

Create `src/content/derivations/derivation-NN/derivation.mdx`:

```markdown
---
title: Derivation of the Rendering Equation
derivationNumber: 1
summary: Step-by-step derivation starting from energy conservation.
publishedAt: 2026-03-01
order: 1
---

## Starting point

Your derivation content here...
```

### Frontmatter Fields

| Field | Type | Required | Notes |
|---|---|---|---|
| `title` | string | ✅ | |
| `derivationNumber` | integer | ✅ | Prefix for numbered content ("Equation 1.2") |
| `summary` | string | — | |
| `publishedAt` | date | — | |
| `order` | integer | — | Sort order on derivations index (default: 0) |

URL: `/derivations/derivation-01`

---

## Creating Meta Pages

Meta pages are supplementary content attached to a series (e.g., a syllabus, notation guide, or problem set index). They appear in the **Course Materials** section of the lecture nav.

Create `src/content/series/[series-slug]/.meta/[slug].mdx`:

```markdown
---
title: Syllabus
order: 1
summary: Course schedule and grading breakdown.
---

## Week 1

...
```

| Field | Type | Required | Notes |
|---|---|---|---|
| `title` | string | ✅ | |
| `order` | integer | — | Sort order in the nav (default: 0) |
| `summary` | string | — | |

---

## MDX Components Reference

All components below are available in any lecture or derivation `.mdx` file without importing them.

---

### Details (Collapsible Sections)

```mdx
<Details summary="Derivation" variant="derivation">

Content that starts collapsed.

$E = \frac{d\Phi}{dA}$

</Details>
```

| Prop | Type | Default | Notes |
|---|---|---|---|
| `summary` | string or JSX | `"Show details"` | Text shown in the summary bar |
| `variant` | `default` \| `derivation` \| `note` \| `example` | `default` | Controls the colour accent |
| `defaultOpen` | boolean | `false` | Start expanded |
| `icon` | string | — | Optional emoji/character shown before the label |

**Variants:**

| Variant | Accent Colour | Use for |
|---|---|---|
| `default` | Neutral | General collapsible content |
| `derivation` | Blue | Mathematical derivations |
| `note` | Purple | Asides, clarifications, deeper dives |
| `example` | Green | Worked examples |

**Examples:**

```mdx
<Details summary="Proof" variant="derivation">

Starting from flux $\Phi$...

</Details>

<Details summary="Common mistake" variant="note" icon="⚠️">

Don't confuse irradiance with radiance.

</Details>

<Details summary="Worked example" variant="example" defaultOpen={true}>

Given $E = 5 \, \text{W/m}^2$...

</Details>
```

---

### Equations

Numbered, referenceable display math:

```mdx
<Equation id="eq-irradiance" number={1}>

$$
E = \frac{d\Phi}{dA}
$$

</Equation>
```

| Prop | Type | Required | Notes |
|---|---|---|---|
| `id` | string | ✅ | Must be unique on the page; used by `<EqRef>` |
| `number` | number | ✅ | Local number for this equation on the page |
| `caption` | string | — | Optional caption below the block |

The displayed number is: **`{lectureNumber}.{number}`** (e.g., "Equation 1.3"). The `lectureNumber` is injected automatically from the frontmatter — you never need to pass it manually.

---

### Figures

Numbered, referenceable figure wrappers:

```mdx
<Figure id="fig-radiometry-diagram" number={1} caption="Geometric relationships in radiometry">
  <ImageBlock name="radiometry.png" alt="Radiometry diagram" scale={0.6} />
</Figure>
```

| Prop | Type | Required | Notes |
|---|---|---|---|
| `id` | string | ✅ | Must be unique on the page; used by `<FigRef>` |
| `number` | number | ✅ | Local figure number |
| `caption` | string | — | Caption displayed below the figure |

Any content can go inside a `<Figure>` — `<ImageBlock>`, `<ImageRowBlock>`, or inline HTML.

---

### Tables

Numbered table with caption rendered **above** the table (per convention):

```mdx
<Table id="tab-comparison" number={1} caption="Radiometric quantities summary">

| Quantity | Symbol | Unit |
|---|---|---|
| Flux | $\Phi$ | W |
| Irradiance | $E$ | W/m² |
| Radiance | $L$ | W/m²·sr |

</Table>
```

| Prop | Type | Required | Notes |
|---|---|---|---|
| `id` | string | ✅ | |
| `number` | number | ✅ | |
| `caption` | string | — | Shown above the table |

---

### Cross-References

Inline links that resolve to the correct display number and show a hover preview popup:

```mdx
See <EqRef id="eq-irradiance" /> for the definition.

As shown in <FigRef id="fig-radiometry-diagram" />, the geometry is...

The comparison in <TabRef id="tab-comparison" /> lists all quantities.
```

All three components (`EqRef`, `FigRef`, `TabRef`) take the same props:

| Prop | Type | Required | Notes |
|---|---|---|---|
| `id` | string | ✅ | The `id` of the target Figure/Equation/Table |
| `page` | string | — | URL of another page for cross-page references |
| `children` | string | — | Custom link text (overrides auto-generated number) |

**Custom text:**

```mdx
<EqRef id="eq-irradiance">irradiance formula</EqRef>
```

**Cross-page:**

```mdx
<FigRef id="fig-diagram" page="/series/rendering/lecture-02" />
```

The reference will fetch the target page at build/runtime to resolve the correct number.

---

### Images

#### Single Image — `<ImageBlock>`

```mdx
<ImageBlock
  name="radiometry.png"
  alt="Diagram showing radiometric angles"
  scale={0.6}
/>
```

| Prop | Type | Default | Notes |
|---|---|---|---|
| `name` | string | — | Bare filename — resolved from the lecture's `assets/` folder |
| `src` | string | — | Explicit path or URL (alternative to `name`) |
| `alt` | string | auto | Alt text; auto-inferred from filename if omitted |
| `scale` | number | `1` | Width as a fraction of content width (0.1–1.0) |
| `caption` | string | — | Optional caption |

#### Image Grid — `<ImageRowBlock>`

```mdx
<ImageRowBlock
  perLine={3}
  scale={0.9}
  gapRem={0.5}
  images={[
    { name: 'step-01.png', alt: 'Step 1' },
    { name: 'step-02.png', alt: 'Step 2' },
    { name: 'step-03.png', alt: 'Step 3' },
  ]}
/>
```

| Prop | Type | Default | Notes |
|---|---|---|---|
| `images` | `{name?, src?, alt?}[]` | — | List of images |
| `perLine` | number | `2` | Columns per row |
| `scale` | number | `1` | Scales all images uniformly |
| `gap` | number | — | Gap in pixels |
| `gapRem` | number | — | Gap in rems (preferred) |

The last row auto-centers if it has fewer items than `perLine`.

---

## Math Syntax

Inline math uses single `$`:

```mdx
The irradiance is $E = d\Phi / dA$ where $\Phi$ is flux.
```

Block/display math uses double `$$` (inside or outside `<Equation>`):

```mdx
$$
L = \frac{d^2\Phi}{dA \, d\omega \, \cos\theta}
$$
```

Inside an `<Equation>` component the `$$` block gets the numbered wrapper:

```mdx
<Equation id="eq-radiance" number={2}>

$$
L = \frac{d^2\Phi}{dA \, d\omega \, \cos\theta}
$$

</Equation>
```

KaTeX is used for rendering. Full KaTeX syntax reference: https://katex.org/docs/supported.html

---

## Cross-Page References

References can point to content on other pages by adding the `page` prop:

```mdx
<EqRef id="eq-rendering-equation" page="/series/rendering/lecture-03" />
```

The system fetches the remote page and extracts the referenced element to display the correct number in the hover preview. The `page` value should be the **absolute path** relative to the site root (no domain, no trailing slash).

---

## File & Asset Conventions

### Folder structure for a lecture

```
src/content/series/rendering/
├── series.md
├── lecture-01/
│   ├── lecture.mdx
│   └── assets/
│       ├── radiometry.png
│       └── diagram-02.png
└── lecture-02/
    ├── lecture.mdx
    └── assets/
```

- All images for a lecture go inside `assets/` next to the `lecture.mdx` file
- Reference them by bare filename: `name="radiometry.png"`

### Naming conventions

| Thing | Convention | Example |
|---|---|---|
| Series folder | kebab-case | `rendering-foundations` |
| Lecture folders | `lecture-NN` (zero-padded) | `lecture-01`, `lecture-12` |
| Derivation folders | `derivation-NN` | `derivation-01` |
| Asset filenames | kebab-case | `radiometry-diagram.png` |
| Figure IDs | `fig-[descriptive-name]` | `fig-radiometry-diagram` |
| Equation IDs | `eq-[descriptive-name]` | `eq-irradiance` |
| Table IDs | `tab-[descriptive-name]` | `tab-quantities` |

### ID uniqueness

Figure, equation, and table `id` values must be **unique per page**. Cross-page references work by `id` so keep names descriptive enough to avoid collisions between pages if you later link across them.
