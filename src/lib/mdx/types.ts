import type { ReactNode } from 'react';

/**
 * Common props for numbered content components (Figure, Equation, Table)
 */
export interface NumberedContentProps {
    /** Unique identifier for the content element */
    id: string;
    /** Child content to render */
    children: ReactNode;
    /** Optional caption or label text */
    caption?: string;
    /** Optional explicit number override */
    number?: string | number;
    /** Lecture or derivation number for hierarchical numbering (e.g., 1.1, 1.2) */
    contextNumber?: string | number;
}

/**
 * Props for content reference links (FigRef, EqRef, TabRef)
 */
export interface ContentRefProps {
    /** Target element ID to reference */
    id: string;
    /** Optional page URL for cross-page references */
    page?: string;
    /** Optional custom text (defaults to auto-generated reference) */
    children?: ReactNode;
}

/**
 * Configuration for creating a numbered content component
 */
export interface ContentConfig {
    /** Type identifier (e.g., 'figure', 'equation', 'table') */
    type: 'figure' | 'equation' | 'table';
    /** Prefix for auto-extracting numbers from IDs (e.g., 'fig-', 'eq-') */
    idPrefix: string;
    /** Display label for captions (e.g., 'Figure', 'Equation') */
    label: string;
}

/**
 * Configuration for creating a content reference component
 */
export interface RefConfig {
    /** Type identifier for the referenced content */
    type: string;
    /** Prefix for auto-extracting numbers from IDs */
    idPrefix: string;
    /** Default text prefix (e.g., 'fig.', 'eq.') */
    defaultPrefix: string;
}
