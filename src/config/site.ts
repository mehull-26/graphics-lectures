/**
 * Site configuration and constants
 * Central location for all site-wide metadata and settings
 */

export const SITE_CONFIG = {
    /** Site title */
    title: 'Mehul Yadav',

    /** Full site title with subtitle */
    fullTitle: 'Graphics & Simulation Notes',

    /** Site author/brand name */
    author: 'Mehul Yadav',

    /** Site description */
    description: 'A structured set of lecture notes on rendering, physics, and simulation. This site is a long-term technical archive rather than a blog.',

    /** Additional tagline */
    tagline: 'Each lecture focuses on building intuition first, then connecting physics, mathematics, and implementation. Over time this will expand into multiple series covering rendering, numerical methods, and simulation systems.',
} as const;

export const ICON_PATHS = {
    /** Main site favicon */
    favicon: 'icon.ico',

    /** Palette toggle icon */
    palette: 'palette.ico',

    /** Theme/dark mode toggle icon */
    darkMode: 'dark_mode.ico',
} as const;

export const NAVIGATION = {
    /** Main navigation items */
    items: [
        { label: 'Series', path: 'series' },
    ] as const,

    /** Home link label */
    homeLabel: 'Home',

    /** Return to home text */
    returnHome: 'Return to home',
} as const;

export const UI_TEXT = {
    /** Table of contents title */
    tocTitle: 'On this page',

    /** TOC control button labels */
    tocControls: {
        expand: 'Expand all',
        collapse: 'Collapse all',
        top: 'Back to top',
        bottom: 'Go to bottom',
    },

    /** Section headings */
    sections: {
        courseMaterials: 'Course Information',
        lectures: 'Lectures',
        lectureSeries: 'Lecture Series',
    },

    /** Aria labels */
    ariaLabels: {
        primaryNav: 'Primary',
        toc: 'Table of contents',
        themeToggle: 'Toggle theme',
        paletteToggle: 'Toggle palette',
    },

    /** Theme toggle text */
    themeSwitch: {
        toDark: 'Switch to dark mode',
        toLight: 'Switch to light mode',
    },

    /** Palette toggle text */
    paletteSwitch: {
        toColorful: 'Switch to colorful palette',
        toMonotonic: 'Switch to monotonic palette',
    },
} as const;

export const EXTERNAL_RESOURCES = {
    /** KaTeX CSS CDN URL */
    katexCss: 'https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css',
} as const;

export const CONTENT_CONFIG = {
    /** Default content selector for TOC */
    defaultContentSelector: 'article',

    /** Default heading selector for TOC */
    defaultHeadingSelector: 'h1, h2, h3, h4',
} as const;

export const SOCIAL_LINKS = {
    /** GitHub profile URL */
    github: 'https://github.com/mehull-26',

    /** Email address */
    email: 'mehulyadav2605@gmail.com',

    /** LinkedIn profile URL */
    linkedin: 'https://www.linkedin.com/in/mehul-yadav-12718428b/',
} as const;

export const LICENSE_INFO = {
    /** License name */
    name: 'CC BY-NC-ND 4.0',

    /** Full license name */
    fullName: 'Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International',

    /** License URL */
    url: 'https://creativecommons.org/licenses/by-nc-nd/4.0/',
} as const;

export const PREVIEW_CONFIG = {
    /** Hover delay before showing preview (ms) */
    hoverDelay: 200,

    /** Duration to highlight target after scroll (ms) */
    highlightDuration: 2000,

    /** Maximum width of preview popup (px) */
    maxWidth: 700,

    /** Maximum height of preview popup (px) */
    maxHeight: 500,

    /** Delay before hiding preview when mouse leaves (ms) */
    hideDelay: 150,

    /** Show equation numbers in preview as badge in top-right corner */
    showEquationNumbersInPreview: true,
} as const;
