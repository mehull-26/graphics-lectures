# Graphics Lectures

A well-architected Astro-based lecture archive for long-form technical series.

## Documentation

- **[ENGINEERING.md](/src/content/ENGINEERING.md)** - Modifying styles, components, and configuration
- **[CONTENT-AUTHORING.md](/src/content/CONTENT-AUTHORING.md)** - Creating lectures, series, and derivations

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Deploy to GitHub Pages
npm run deploy
```

## Tech Stack

- **Astro 5.x** - Static site generator
- **TypeScript** - Type-safe development
- **MDX** - Markdown with JSX components
- **KaTeX** - Math rendering
- **Expressive Code** - Syntax highlighting

## Project Structure

```
src/
├── components/      # UI components (Astro & React)
├── config/          # Site configuration
├── content/         # Lectures, series, derivations (MDX)
├── lib/             # Business logic (TOC, themes, cursor)
├── pages/           # Routes
├── styles/          # Modular CSS
├── types/           # TypeScript definitions
└── utils/           # Pure functions
```

See [ENGINEERING.md](ENGINEERING.md) for detailed architecture and [CONTENT-AUTHORING.md](CONTENT-AUTHORING.md) for content creation.
