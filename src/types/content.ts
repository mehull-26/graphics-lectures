/**
 * Content collection type definitions
 * Shared types for series, lectures, and meta content
 */

import type { CollectionEntry } from 'astro:content';

/**
 * Series entry type from content collections
 */
export type SeriesEntry = CollectionEntry<'series'>;

/**
 * Lecture entry type from content collections
 */
export type LectureEntry = CollectionEntry<'lectures'>;

/**
 * Meta (course materials) entry type from content collections
 */
export type MetaEntry = CollectionEntry<'meta'>;

/**
 * Derivation entry type from content collections
 */
export type DerivationEntry = CollectionEntry<'derivations'>;

/**
 * Union of all content entry types
 */
export type ContentEntry = SeriesEntry | LectureEntry | MetaEntry | DerivationEntry;

/**
 * Series data structure
 */
export interface SeriesData {
    title: string;
    description: string;
    order: number;
}

/**
 * Lecture data structure
 */
export interface LectureData {
    title: string;
    lectureNumber: number;
    publishedAt?: Date;
    readings?: ReadingItem[];
    assignments?: AssignmentItem[];
    resources?: ResourceItem[];
}

/**
 * Meta page data structure
 */
export interface MetaData {
    title: string;
    order: number;
    summary?: string;
}

/**
 * Reading item structure
 */
export interface ReadingItem {
    title: string;
    url?: string;
    author?: string;
    pages?: string;
}

/**
 * Assignment item structure
 */
export interface AssignmentItem {
    title: string;
    description?: string;
    dueDate?: Date;
    url?: string;
}

/**
 * Resource item structure
 */
export interface ResourceItem {
    title: string;
    url: string;
    type?: 'video' | 'slides' | 'code' | 'documentation' | 'other';
}

/**
 * Parsed meta path result
 */
export interface ParsedMetaPath {
    seriesSlug: string;
    folderName: string;
    fileName: string;
    fullSlug: string;
}

/**
 * Navigation link structure
 */
export interface NavigationLink {
    label: string;
    path: string;
    active?: boolean;
}
