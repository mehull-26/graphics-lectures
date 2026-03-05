/**
 * Custom cursor blob effect
 * Follows pointer on devices with fine pointing capability (mouse, trackpad)
 */

export interface CursorConfig {
    /** Selector for interactive elements that should trigger hover state */
    interactiveSelector?: string;
    /** ID of the cursor blob element */
    blobId?: string;
}

const DEFAULT_CONFIG: Required<CursorConfig> = {
    interactiveSelector: 'a, button, [role="button"], summary, input, textarea, select, label',
    blobId: 'cursor-blob'
};

/**
 * Initializes the custom cursor blob effect
 * Only activates on devices with fine pointer (mouse)
 * @param config - Configuration options
 */
export function initCustomCursor(config: CursorConfig = {}): void {
    const { interactiveSelector, blobId } = { ...DEFAULT_CONFIG, ...config };

    const blob = document.getElementById(blobId);
    if (!blob || blob.dataset.boundCustomCursor === 'true') return;

    // Check if device has fine pointer (mouse)
    if (!window.matchMedia('(pointer: fine)').matches) {
        document.documentElement.classList.remove('custom-cursor');
        blob.remove();
        return;
    }

    // Enable custom cursor mode
    document.documentElement.classList.add('custom-cursor');

    let latestX = -100;
    let latestY = -100;
    let frameId = 0;

    /**
     * Renders the cursor position using transform
     */
    const render = (): void => {
        blob.style.transform = `translate3d(${latestX}px, ${latestY}px, 0) translate(-50%, -50%)`;
        frameId = 0;
    };

    /**
     * Handles pointer/mouse move events
     */
    const handleMove = (event: MouseEvent | PointerEvent): void => {
        latestX = event.clientX;
        latestY = event.clientY;

        // Make cursor visible on first movement
        if (!blob.classList.contains('is-visible')) {
            blob.classList.add('is-visible');
        }

        // Check if hovering over interactive element
        if (event.target instanceof Element) {
            const interactive = event.target.closest(interactiveSelector);
            blob.classList.toggle('is-hover', Boolean(interactive));
        } else {
            blob.classList.remove('is-hover');
        }

        // Schedule render with requestAnimationFrame
        if (!frameId) {
            frameId = window.requestAnimationFrame(render);
        }
    };

    /**
     * Handles mouse leaving the document
     */
    const handleLeave = (): void => {
        blob.classList.remove('is-visible');
        blob.classList.remove('is-hover');
    };

    /**
     * Handles pointer down (click)
     */
    const handleDown = (): void => {
        blob.classList.add('is-pressed');
    };

    /**
     * Handles pointer up (release)
     */
    const handleUp = (): void => {
        blob.classList.remove('is-pressed');
    };

    // Attach event listeners
    window.addEventListener('pointermove', handleMove as EventListener, { passive: true });
    window.addEventListener('mousemove', handleMove as EventListener, { passive: true });
    window.addEventListener('pointerdown', handleDown, { passive: true });
    window.addEventListener('pointerup', handleUp, { passive: true });
    document.addEventListener('mouseleave', handleLeave);

    // Mark as initialized
    blob.dataset.boundCustomCursor = 'true';
}

/**
 * Sets up cursor initialization on page load
 * Compatible with Astro view transitions
 */
export function setupCustomCursor(config: CursorConfig = {}): void {
    const init = () => initCustomCursor(config);

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init, { once: true });
    } else {
        init();
    }

    // Support Astro view transitions
    document.addEventListener('astro:page-load', init);
}
