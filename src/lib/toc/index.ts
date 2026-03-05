/**
 * Table of Contents module
 * Main entry point that combines builder, renderer, and tracker
 */

export * from './builder';
export * from './renderer';
export * from './tracker';

import { extractHeadings, buildTocTree, createDepthMap } from './builder';
import { renderToc, getTocItems } from './renderer';
import { TocTracker, bindTocControls, attachWindowListeners, type TocConfig } from './tracker';

/**
 * Initializes a single TOC instance
 * @returns true if successful, false if content/nav not found
 */
export function initializeToc(
    tocElement: HTMLElement,
    contentSelector: string = 'article',
    config: TocConfig = {}
): boolean {
    // Prevent duplicate initialization
    if (tocElement.dataset.boundToc === 'true') return true;

    const content = document.querySelector(contentSelector);
    const nav = tocElement.querySelector('[data-toc-nav]');

    if (!content || !nav) {
        return false;
    }

    // Extract and process headings
    const headings = extractHeadings(content);

    if (headings.length < 1) {
        tocElement.classList.add('is-hidden');
        tocElement.dataset.boundToc = 'true';
        return true;
    }

    // Build tree structure
    const tree = buildTocTree(headings);
    const depthMap = createDepthMap(headings);

    // Render HTML
    renderToc(nav, tree, depthMap);

    // Get rendered items
    const { items, byId } = getTocItems(tocElement);

    // Create tracker
    const tracker = new TocTracker(tocElement, headings, items, byId, config);

    // Bind controls
    bindTocControls(tocElement, tracker);

    // Attach window listeners
    attachWindowListeners(tracker);

    // Initialize
    tracker.init();

    // Mark as initialized
    tocElement.dataset.boundToc = 'true';

    return true;
}

/**
 * Initializes all TOC instances on the page
 */
export function initializeAllTocs(): boolean {
    const tocs = [...document.querySelectorAll('[data-toc]')]
        .filter((el): el is HTMLElement => el instanceof HTMLElement);

    if (tocs.length === 0) return true;

    let allReady = true;
    tocs.forEach((toc) => {
        const selector = toc.getAttribute('data-content-selector') || 'article';
        const ready = initializeToc(toc, selector);
        allReady = allReady && ready;
    });

    return allReady;
}

/**
 * Bootstrap TOC with retry logic (for async content loading)
 */
export function bootstrapToc(maxAttempts: number = 40): void {
    let attempts = 0;

    const run = () => {
        const ready = initializeAllTocs();
        if (!ready && attempts < maxAttempts) {
            attempts += 1;
            window.requestAnimationFrame(run);
        }
    };

    run();
}

/**
 * Sets up TOC initialization on page load
 * Compatible with Astro view transitions
 */
export function setupToc(): void {
    const bootstrap = () => bootstrapToc();

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bootstrap, { once: true });
    } else {
        bootstrap();
    }

    // Support Astro view transitions
    document.addEventListener('astro:page-load', bootstrap);
}
