/**
 * Theme and styling type definitions
 */

/**
 * Theme variants
 */
export type Theme = 'dark' | 'light';

/**
 * Palette variants
 */
export type Palette = 'colorful' | 'monotonic';

/**
 * Storage keys for theme preferences
 */
export const STORAGE_KEYS = {
    theme: 'theme',
    palette: 'palette',
} as const;

/**
 * HTML data attributes for theming
 */
export const DATA_ATTRIBUTES = {
    theme: 'data-theme',
    palette: 'data-palette',
    contentPage: 'data-content-page',
} as const;

/**
 * Branded type for series slug
 * Prevents mixing up different slug types
 */
export type SeriesSlug = string & { readonly __brand: 'SeriesSlug' };

/**
 * Branded type for lecture slug
 */
export type LectureSlug = string & { readonly __brand: 'LectureSlug' };

/**
 * Creates a branded series slug
 */
export function createSeriesSlug(slug: string): SeriesSlug {
    return slug as SeriesSlug;
}

/**
 * Creates a branded lecture slug
 */
export function createLectureSlug(slug: string): LectureSlug {
    return slug as LectureSlug;
}
