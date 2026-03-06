import type { ComponentType, JSX } from 'react';
import { createElement } from 'react';

/**
 * Utility functions for MDX content components
 */

/**
 * Formats a display number from context and item numbers
 * @param contextNumber - Lecture or derivation number (e.g., 1, 2)
 * @param itemNumber - Item-specific number (e.g., 1, 2, 3)
 * @returns Formatted number string (e.g., "1.1", "2.3")
 */
export function formatDisplayNumber(
    contextNumber: string | number | undefined,
    itemNumber: string | number
): string {
    return contextNumber !== undefined
        ? `${contextNumber}.${itemNumber}`
        : String(itemNumber);
}

/**
 * Extracts number from an ID by removing a prefix
 * @param id - The full ID (e.g., "fig-diagram", "eq-rendering")
 * @param prefix - The prefix to remove (e.g., "fig-", "eq-")
 * @returns The extracted number/identifier
 */
export function extractIdNumber(id: string, prefix: string): string {
    return id.replace(new RegExp(`^${prefix}`), '');
}

/**
 * Creates a wrapper component with pre-bound context number
 * Used in page templates to bind lecture/derivation numbers to content components
 * 
 * @example
 * ```ts
 * const FigureWithLecture = createContextWrapper(Figure, lectureNumber);
 * ```
 * 
 * @param Component - The component to wrap
 * @param contextNumber - The lecture/derivation number to bind
 * @returns Wrapped component with contextNumber prop bound
 */
export function createContextWrapper<T extends { lectureNumber?: string | number }>(
    Component: ComponentType<T>,
    contextNumber: number
): ComponentType<Omit<T, 'lectureNumber'>> {
    return (props: Omit<T, 'lectureNumber'>) =>
        createElement(Component, { ...props as T, lectureNumber: contextNumber });
}
