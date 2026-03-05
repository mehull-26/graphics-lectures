/**
 * Table of Contents tree builder
 * Extracts headings from content and builds a hierarchical structure
 */

export interface TocNode {
    id: string;
    level: number;
    text: string;
    children: TocNode[];
    element: HTMLElement;
    parentId: string | null;
}

/**
 * Converts text to URL-safe slug
 */
export function slugify(value: string): string {
    return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
}

/**
 * Ensures all headings have unique IDs, adding them if missing
 */
export function ensureHeadingIds(headings: HTMLElement[]): void {
    const usedIds = new Set<string>();

    headings.forEach((heading) => {
        const existingId = heading.getAttribute('id');
        if (existingId) {
            usedIds.add(existingId);
            return;
        }

        const base = slugify(heading.textContent || 'section') || 'section';
        let id = base;
        let index = 2;
        while (usedIds.has(id)) {
            id = `${base}-${index}`;
            index += 1;
        }
        usedIds.add(id);
        heading.setAttribute('id', id);
    });
}

/**
 * Determines which heading levels to include in TOC (top 2 by order of appearance)
 */
export function selectHeadingLevels(headings: HTMLElement[]): Set<number> {
    if (headings.length === 0) return new Set();

    const levelsForOrder = headings.map((heading) => Number(heading.tagName[1]));
    const uniqueSortedLevels = [...new Set(levelsForOrder)].sort((a, b) => a - b);
    const allowedLevels = new Set(uniqueSortedLevels.slice(0, 2));

    // Fallback if somehow no levels selected
    if (allowedLevels.size === 0) {
        const fallbackLevels = [...new Set(headings.map((h) => Number(h.tagName[1])))]
            .sort((a, b) => a - b)
            .slice(0, 2);
        fallbackLevels.forEach((level) => allowedLevels.add(level));
    }

    return allowedLevels;
}

/**
 * Builds hierarchical tree structure from flat list of headings
 */
export function buildTocTree(headings: HTMLElement[]): TocNode[] {
    if (headings.length === 0) return [];

    const nodes: TocNode[] = [];
    const stack: Array<{ level: number; children: TocNode[]; parentId: string | null }> = [
        { level: 0, children: nodes, parentId: null }
    ];

    headings.forEach((heading) => {
        const level = Number(heading.tagName[1]);
        const node: TocNode = {
            id: heading.id,
            level,
            text: (heading.textContent || '').trim(),
            children: [],
            element: heading,
            parentId: null
        };

        // Pop stack until we find the parent level
        while (stack.length > 1 && stack[stack.length - 1].level >= level) {
            stack.pop();
        }

        const parent = stack[stack.length - 1];
        node.parentId = parent.parentId;
        parent.children.push(node);
        stack.push({ level, children: node.children, parentId: node.id });
    });

    return nodes;
}

/**
 * Main function to extract and process headings from content
 */
export function extractHeadings(
    content: Element,
    selector: string = 'h1, h2, h3, h4'
): HTMLElement[] {
    const allHeadings = [...content.querySelectorAll(selector)]
        .filter((heading): heading is HTMLElement =>
            heading instanceof HTMLElement &&
            heading.textContent !== null &&
            heading.textContent.trim().length > 0
        );

    if (allHeadings.length === 0) return [];

    const allowedLevels = selectHeadingLevels(allHeadings);
    const filteredHeadings = allHeadings.filter((heading) =>
        allowedLevels.has(Number(heading.tagName[1]))
    );

    ensureHeadingIds(filteredHeadings);

    return filteredHeadings;
}

/**
 * Creates a map of level numbers to depth indices (0, 1, etc.)
 * Used for CSS class generation
 */
export function createDepthMap(headings: HTMLElement[]): Map<number, number> {
    const levels = [...new Set(headings.map((h) => Number(h.tagName[1])))]
        .sort((a, b) => a - b);
    return new Map(levels.map((level, index) => [level, index]));
}
