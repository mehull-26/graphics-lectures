/**
 * Reference Preview System
 * 
 * Provides hover-to-preview functionality for figure and equation references.
 * On hover: shows a popup preview of the referenced content.
 * On click: smooth scrolls to the target and highlights it briefly.
 */

import { PREVIEW_CONFIG } from '../config/site';

interface PreviewState {
    popup: HTMLDivElement | null;
    currentTarget: string | null;
    hoverTimeout: number | null;
    isHovering: boolean;
}

const state: PreviewState = {
    popup: null,
    currentTarget: null,
    hoverTimeout: null,
    isHovering: false
};

const HOVER_DELAY = PREVIEW_CONFIG.hoverDelay;
const HIGHLIGHT_DURATION = PREVIEW_CONFIG.highlightDuration;
const PREVIEW_MAX_WIDTH = PREVIEW_CONFIG.maxWidth;
const PREVIEW_MAX_HEIGHT = PREVIEW_CONFIG.maxHeight;
const HIDE_DELAY = PREVIEW_CONFIG.hideDelay;

/**
 * Create and inject the popup element into the DOM
 */
function createPopup(): HTMLDivElement {
    const popup = document.createElement('div');
    popup.id = 'ref-preview-popup';
    popup.className = 'ref-preview-popup';
    popup.setAttribute('aria-live', 'polite');
    popup.setAttribute('role', 'tooltip');

    // Apply config dimensions
    popup.style.maxWidth = `${PREVIEW_MAX_WIDTH}px`;

    const content = document.createElement('div');
    content.className = 'ref-preview-content';
    content.style.maxHeight = `${PREVIEW_MAX_HEIGHT}px`;
    popup.appendChild(content);

    document.body.appendChild(popup);
    return popup;
}

/**
 * Find the target element by data-ref-id
 */
function findTargetElement(targetId: string): HTMLElement | null {
    return document.querySelector(`[data-ref-id="${targetId}"]`);
}

/**
 * Fetch and find target element from another page
 */
async function fetchTargetFromPage(targetId: string, pageUrl: string): Promise<HTMLElement | null> {
    try {
        const response = await fetch(pageUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const target = doc.querySelector(`[data-ref-id="${targetId}"]`);
        return target as HTMLElement | null;
    } catch (error) {
        console.error(`Failed to fetch content from ${pageUrl}:`, error);
        return null;
    }
}

/**
 * Clone and prepare preview content from target element
 */
function preparePreviewContent(target: HTMLElement): HTMLElement {
    const refType = target.getAttribute('data-ref-type');

    // For equations, extract the rendered math content and show number in top-right
    if (refType === 'equation') {
        // Extract the KaTeX rendered math element (the actual equation content)
        const mathElement = target.querySelector('.katex-display, .katex');
        if (!mathElement) {
            // Fallback: clone entire target if KaTeX element not found
            const clone = target.cloneNode(true) as HTMLElement;
            clone.removeAttribute('id');
            return clone;
        }

        // Get equation number from data attribute (source of truth)
        const equationNumber = target.getAttribute('data-ref-number') || '';

        // Create wrapper with relative positioning for badge
        const wrapper = document.createElement('div');
        wrapper.style.position = 'relative';
        wrapper.style.paddingTop = '2rem'; // Space for badge
        wrapper.style.paddingBottom = '1rem';

        // Add equation number badge in top-right
        if (equationNumber && PREVIEW_CONFIG.showEquationNumbersInPreview) {
            const badge = document.createElement('div');
            badge.textContent = `(${equationNumber})`;
            badge.style.position = 'absolute';
            badge.style.top = '0.5rem';
            badge.style.right = '0.5rem';
            badge.style.fontSize = '0.9em';
            badge.style.color = 'var(--muted)';
            badge.style.opacity = '0.8';
            badge.style.fontWeight = '500';
            badge.style.userSelect = 'none';
            badge.style.pointerEvents = 'none';
            wrapper.appendChild(badge);
        }

        // Clone just the math content (clean, without React wrapper structure)
        const mathClone = mathElement.cloneNode(true) as HTMLElement;
        mathClone.style.maxWidth = '100%';
        mathClone.style.margin = '0 auto';
        mathClone.style.display = 'block';
        wrapper.appendChild(mathClone);

        return wrapper;
    }

    // For figures and other content, clone the whole element
    const clone = target.cloneNode(true) as HTMLElement;

    // Remove ID to avoid duplicates
    clone.removeAttribute('id');

    // Scale down images if present
    const images = clone.querySelectorAll('img');
    images.forEach(img => {
        img.style.maxWidth = '100%';
        img.style.height = 'auto';
    });

    return clone;
}

/**
 * Position popup above the cursor, centered horizontally, constrained to viewport
 */
function positionPopup(popup: HTMLDivElement, event: MouseEvent) {
    const padding = 20; // px from viewport edges
    const offsetY = 15; // px above cursor

    // Get popup dimensions
    const popupRect = popup.getBoundingClientRect();
    const popupWidth = popupRect.width || PREVIEW_MAX_WIDTH;
    const popupHeight = popupRect.height || PREVIEW_MAX_HEIGHT;

    // Center horizontally on cursor
    let left = event.clientX - (popupWidth / 2);

    // Position above cursor
    let top = event.clientY - popupHeight - offsetY;

    // Constrain to viewport horizontally
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Keep within left/right bounds
    if (left < padding) {
        left = padding;
    } else if (left + popupWidth + padding > viewportWidth) {
        left = viewportWidth - popupWidth - padding;
    }

    // If doesn't fit above, position below cursor
    if (top < padding) {
        top = event.clientY + offsetY;
    }

    // Ensure not off bottom edge
    if (top + popupHeight + padding > viewportHeight) {
        top = viewportHeight - popupHeight - padding;
    }

    popup.style.left = `${left}px`;
    popup.style.top = `${top}px`;
}

/**
 * Show preview popup for a reference link
 */
async function showPreview(link: HTMLElement, event: MouseEvent) {
    const targetId = link.getAttribute('data-ref-target');
    const pageUrl = link.getAttribute('data-ref-page');
    if (!targetId) return;

    // Find target element (from current page or remote page)
    let target: HTMLElement | null;
    if (pageUrl) {
        target = await fetchTargetFromPage(targetId, pageUrl);
        if (!target) {
            console.warn(`Reference target not found on page ${pageUrl}: ${targetId}`);
            return;
        }
    } else {
        target = findTargetElement(targetId);
        if (!target) {
            console.warn(`Reference target not found: ${targetId}`);
            return;
        }
    }

    if (!state.popup) {
        state.popup = createPopup();
    }

    const popup = state.popup;
    const content = popup.querySelector('.ref-preview-content');
    if (!content) return;

    // Clear previous content
    content.innerHTML = '';

    // Prepare and insert preview content
    const previewContent = preparePreviewContent(target);
    content.appendChild(previewContent);

    // Position popup
    positionPopup(popup, event);

    // Show popup with animation
    popup.classList.add('show');
    state.currentTarget = targetId;
}

/**
 * Hide preview popup
 */
function hidePreview() {
    if (state.popup) {
        state.popup.classList.remove('show');
        state.currentTarget = null;
    }
}

/**
 * Scroll to target element and highlight it
 * Also opens dropdown if target is inside one
 */
function scrollToTarget(targetId: string, pageUrl: string | null, event: Event) {
    // Only prevent default for same-page references
    if (!pageUrl) {
        event.preventDefault();

        const target = findTargetElement(targetId);
        if (!target) return;

        // Check if target is inside a closed <details> element and open it
        const detailsParent = target.closest('details');
        if (detailsParent && !detailsParent.open) {
            detailsParent.open = true;
        }

        // Smooth scroll to target
        target.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });

        // Add highlight class
        target.classList.add('ref-target-highlight');

        // Remove highlight after duration
        setTimeout(() => {
            target.classList.remove('ref-target-highlight');
        }, HIGHLIGHT_DURATION);
    }
    // For cross-page references, let the browser handle navigation
}

/**
 * Check if device supports hover (not touch-only)
 */
function supportsHover(): boolean {
    return window.matchMedia('(hover: hover) and (pointer: fine)').matches;
}

/**
 * Check if an element is at least partially visible in the viewport
 */
function isElementInViewport(el: HTMLElement): boolean {
    const rect = el.getBoundingClientRect();
    return (
        rect.top < window.innerHeight &&
        rect.bottom > 0 &&
        rect.left < window.innerWidth &&
        rect.right > 0
    );
}

/**
 * Flash the highlight animation on a target element, restarting it if already active
 */
function highlightElement(target: HTMLElement) {
    // Remove first to allow re-triggering the animation
    target.classList.remove('ref-target-highlight');
    // Flush style recalculation so the class removal takes effect before re-adding
    void target.offsetWidth;
    target.classList.add('ref-target-highlight');
    setTimeout(() => {
        target.classList.remove('ref-target-highlight');
    }, HIGHLIGHT_DURATION);
}

/**
 * Setup event listeners for a reference link
 */
function setupRefLink(link: HTMLElement) {
    const targetId = link.getAttribute('data-ref-target');
    const pageUrl = link.getAttribute('data-ref-page');
    if (!targetId) return;

    // Click handler - always enabled
    link.addEventListener('click', (e) => {
        scrollToTarget(targetId, pageUrl, e);
    });

    // Hover handlers - only on devices with hover support
    if (supportsHover()) {
        link.addEventListener('mouseenter', (e) => {
            state.isHovering = true;

            // Clear any existing timeout
            if (state.hoverTimeout !== null) {
                clearTimeout(state.hoverTimeout);
            }

            state.hoverTimeout = window.setTimeout(() => {
                if (!state.isHovering) return;

                // For same-page references: if target is in viewport, highlight instead of preview
                if (!pageUrl) {
                    const target = findTargetElement(targetId);
                    if (target && isElementInViewport(target)) {
                        highlightElement(target);
                        return;
                    }
                }

                showPreview(link, e as MouseEvent);
            }, HOVER_DELAY);
        });

        link.addEventListener('mouseleave', () => {
            state.isHovering = false;

            // Clear timeout if preview hasn't shown yet
            if (state.hoverTimeout !== null) {
                clearTimeout(state.hoverTimeout);
                state.hoverTimeout = null;
            }

            // Delay hiding to allow moving to popup
            setTimeout(() => {
                if (!state.isHovering) {
                    hidePreview();
                }
            }, HIDE_DELAY);
        });
    }
}

/**
 * Setup popup hover handlers to keep it open when hovering over it
 */
function setupPopupHoverHandlers(popup: HTMLDivElement) {
    popup.addEventListener('mouseenter', () => {
        state.isHovering = true;
    });

    popup.addEventListener('mouseleave', () => {
        state.isHovering = false;
        setTimeout(() => {
            if (!state.isHovering) {
                hidePreview();
            }
        }, HIDE_DELAY);
    });
}

/**
 * Initialize the reference preview system
 */
export function setupRefPreview() {
    // Clean up existing popup if present
    if (state.popup) {
        state.popup.remove();
        state.popup = null;
    }

    // Find all reference links
    const refLinks = document.querySelectorAll('[data-ref-link]');

    // Setup each reference link
    refLinks.forEach((link) => {
        setupRefLink(link as HTMLElement);
    });

    // Create popup container (will be shown/hidden as needed)
    state.popup = createPopup();

    // Setup hover handlers for popup itself
    if (supportsHover()) {
        setupPopupHoverHandlers(state.popup);
    }
}
