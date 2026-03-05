/**
 * Content Collection Utilities
 * 
 * Helper functions for working with Astro content collections.
 * Provides caching and common patterns for fetching series, lectures, and meta pages.
 */

import { getCollection } from 'astro:content';
import { toSeriesSlug, parseMetaPath } from './path';
import type { SeriesEntry, LectureEntry, MetaEntry } from '../types/content';

/** Cached collection data to avoid multiple fetches */
let cachedSeries: SeriesEntry[] | null = null;
let cachedLectures: LectureEntry[] | null = null;
let cachedMeta: MetaEntry[] | null = null;

/**
 * Get all series entries (with caching)
 */
export async function getAllSeries(): Promise<SeriesEntry[]> {
    if (cachedSeries === null) {
        cachedSeries = (await getCollection('series')) as SeriesEntry[];
    }
    return cachedSeries;
}

/**
 * Get all lecture entries (with caching)
 */
export async function getAllLectures(): Promise<LectureEntry[]> {
    if (cachedLectures === null) {
        cachedLectures = (await getCollection('lectures')) as LectureEntry[];
    }
    return cachedLectures;
}

/**
 * Get all meta entries (with caching)
 */
export async function getAllMeta(): Promise<MetaEntry[]> {
    if (cachedMeta === null) {
        cachedMeta = (await getCollection('meta')) as MetaEntry[];
    }
    return cachedMeta;
}

/**
 * Get a single series by slug
 */
export async function getSeriesBySlug(slug: string): Promise<SeriesEntry | undefined> {
    const allSeries = await getAllSeries();
    return allSeries.find((series) => toSeriesSlug(series.id) === slug);
}

/**
 * Get all lectures for a specific series
 * @param seriesSlug - The series slug (e.g., 'rendering')
 * @returns Array of lectures sorted by lecture number
 */
export async function getLecturesBySeries(seriesSlug: string): Promise<LectureEntry[]> {
    const allLectures = await getAllLectures();
    return allLectures
        .filter((lecture) => toSeriesSlug(lecture.id) === seriesSlug)
        .sort((a, b) => a.data.lectureNumber - b.data.lectureNumber);
}

/**
 * Get all meta pages for a specific series
 * @param seriesSlug - The series slug (e.g., 'rendering')
 * @returns Array of meta pages sorted by order
 */
export async function getMetaPagesBySeries(seriesSlug: string): Promise<MetaEntry[]> {
    const allMeta = await getAllMeta();
    return allMeta
        .filter((meta) => toSeriesSlug(meta.id) === seriesSlug)
        .sort((a, b) => a.data.order - b.data.order);
}

/**
 * Get a lecture by series slug and lecture slug
 */
export async function getLectureBySlug(
    seriesSlug: string,
    lectureSlug: string
): Promise<LectureEntry | undefined> {
    const lectures = await getLecturesBySeries(seriesSlug);
    return lectures.find((lecture) => {
        const slug = lecture.id.split('/')[1];
        return slug === lectureSlug;
    });
}

/**
 * Get a meta page by full slug path
 */
export async function getMetaBySlug(
    seriesSlug: string,
    metaSlug: string
): Promise<MetaEntry | undefined> {
    const metaPages = await getMetaPagesBySeries(seriesSlug);
    return metaPages.find((meta) => {
        const { fullSlug } = parseMetaPath(meta.id);
        return fullSlug === metaSlug;
    });
}

/**
 * Get series data with all related content (lectures and meta pages)
 */
export async function getSeriesWithContent(seriesSlug: string) {
    const [series, lectures, metaPages] = await Promise.all([
        getSeriesBySlug(seriesSlug),
        getLecturesBySeries(seriesSlug),
        getMetaPagesBySeries(seriesSlug),
    ]);

    return {
        series,
        lectures,
        metaPages,
    };
}

/**
 * Clear all cached data (useful for development/testing)
 */
export function clearCache(): void {
    cachedSeries = null;
    cachedLectures = null;
    cachedMeta = null;
}