/**
 * Path utility functions for URL handling and content navigation
 */

/**
 * Prepends the base URL to a given path, ensuring proper formatting
 * @param path - The path to prepend with the base URL
 * @returns The full URL with base path
 */
export function withBase(path: string): string {
    const baseUrl = import.meta.env.BASE_URL.replace(/\/?$/, '/');
    const normalizedPath = path.replace(/^\/+/, '');
    return `${baseUrl}${normalizedPath}`;
}

/**
 * Extracts the series slug from a content entry ID
 * @param entryId - The full entry ID (e.g., "rendering/lecture-01/lecture.mdx")
 * @returns The series slug (e.g., "rendering")
 */
export function toSeriesSlug(entryId: string): string {
    return entryId.split('/')[0];
}

/**
 * Parses a meta entry ID into its constituent parts
 * @param entryId - The meta entry ID (e.g., "rendering/.syllabus/course-plan.mdx")
 * @returns Object containing seriesSlug, folderName, fileName, and fullSlug
 */
export function parseMetaPath(entryId: string): {
    seriesSlug: string;
    folderName: string;
    fileName: string;
    fullSlug: string;
} {
    const parts = entryId.split('/');
    const seriesSlug = parts[0];
    const folderName = parts[1]?.replace(/^\./, '') ?? ''; // Remove leading dot
    const fileName = parts[2]?.replace(/\.mdx$/, '') ?? ''; // Remove .mdx extension
    const fullSlug = `${folderName}/${fileName}`;

    return { seriesSlug, folderName, fileName, fullSlug };
}

/**
 * Extracts the lecture slug from a lecture entry ID
 * @param entryId - The lecture entry ID (e.g., "rendering/lecture-01/lecture.mdx")
 * @returns The lecture slug (e.g., "lecture-01")
 */
export function toLectureSlug(entryId: string): string {
    const parts = entryId.split('/');
    return parts[1] ?? '';
}

/**
 * Normalizes a URL path by ensuring it follows BASE_URL conventions
 * @param rawPath - The raw pathname from the URL
 * @param basePath - The base path to normalize against
 * @returns The normalized path
 */
export function normalizePath(rawPath: string, basePath: string): string {
    const normalizedBase = basePath.replace(/\/$/, '');
    return rawPath.startsWith(normalizedBase)
        ? rawPath.slice(normalizedBase.length) || '/'
        : rawPath;
}

/**
 * Creates a series-by-slug Map from an array of series entries
 * Useful for O(1) lookup by series slug
 */
export function createSeriesMap<T extends { id: string }>(entries: T[]): Map<string, T> {
    return new Map(entries.map((entry) => [toSeriesSlug(entry.id), entry]));
}
