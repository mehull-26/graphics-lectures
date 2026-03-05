/**
 * Table of Contents scroll tracker and state manager
 * Handles active highlighting, visibility, and navigation controls
 */

export interface TocConfig {
    /** Base width in pixels */
    baseWidth?: number;
    /** Minimum width in pixels */
    minWidth?: number;
    /** Gutter spacing in pixels */
    gutter?: number;
    /** Minimum viewport width to show TOC */
    minViewportWidth?: number;
    /** Breakpoint for tight mode */
    tightBreakpoint?: number;
    /** Breakpoint for compact mode */
    compactBreakpoint?: number;
    /** Header selector for offset calculation */
    headerSelector?: string;
    /** Offset from top in pixels */
    topOffset?: number;
    /** Trigger line percentage (0-1) */
    triggerLinePercentage?: number;
}

const DEFAULT_CONFIG: Required<TocConfig> = {
    baseWidth: 286,
    minWidth: 194,
    gutter: 16,
    minViewportWidth: 980,
    tightBreakpoint: 244,
    compactBreakpoint: 220,
    headerSelector: '.site-header',
    topOffset: 18,
    triggerLinePercentage: 0.25
};

/**
 * Manages TOC state and active section highlighting
 */
export class TocTracker {
    private tocElement: HTMLElement;
    private headings: HTMLElement[];
    private items: HTMLElement[];
    private byId: Map<string, HTMLElement>;
    private config: Required<TocConfig>;
    private expandAll: boolean = false;
    private rafId: number = 0;

    constructor(
        tocElement: HTMLElement,
        headings: HTMLElement[],
        items: HTMLElement[],
        byId: Map<string, HTMLElement>,
        config: TocConfig = {}
    ) {
        this.tocElement = tocElement;
        this.headings = headings;
        this.items = items;
        this.byId = byId;
        this.config = { ...DEFAULT_CONFIG, ...config };
    }

    /**
     * Opens the path to the active item and collapses others
     */
    public openPathFor(activeId: string | null): void {
        // Clear all active and in-path states
        this.items.forEach((item) => item.classList.remove('is-active', 'in-path'));

        if (activeId) {
            const activeItem = this.byId.get(activeId);
            if (activeItem) {
                activeItem.classList.add('is-active');

                // Mark all ancestors as in-path
                let current: HTMLElement | null = activeItem;
                while (current) {
                    current.classList.add('in-path');
                    const parentElement: Element | null = current.parentElement?.closest('.toc-item') ?? null;
                    current = parentElement instanceof HTMLElement ? parentElement : null;
                }
            }
        }

        // Collapse items not in path (unless expandAll is true)
        this.items.forEach((item) => {
            if (!item.classList.contains('has-children')) return;
            const keepOpenByPath = item.classList.contains('in-path');
            const shouldCollapse = !this.expandAll && !keepOpenByPath;
            item.classList.toggle('is-collapsed', shouldCollapse);
        });
    }

    /**
     * Updates TOC visibility and positioning based on available space
     */
    public updateVisibility(): void {
        const main = document.querySelector('main');
        if (!main) return;

        const mainRect = main.getBoundingClientRect();
        const leftSpace = mainRect.left;
        const availableWidth = leftSpace - this.config.gutter - 8;
        const targetWidth = Math.min(this.config.baseWidth, availableWidth);
        const enoughRoom =
            window.innerWidth >= this.config.minViewportWidth &&
            targetWidth >= this.config.minWidth;

        this.tocElement.classList.toggle('is-hidden', !enoughRoom);

        if (enoughRoom) {
            const desiredLeft = leftSpace - targetWidth - this.config.gutter;
            this.tocElement.style.setProperty('--toc-current-width', `${targetWidth}px`);
            this.tocElement.style.left = `${desiredLeft}px`;
            this.tocElement.classList.toggle('is-tight', targetWidth < this.config.tightBreakpoint);
            this.tocElement.classList.toggle('is-compact', targetWidth < this.config.compactBreakpoint);
        } else {
            this.tocElement.style.removeProperty('--toc-current-width');
            this.tocElement.style.left = '';
            this.tocElement.classList.remove('is-tight', 'is-compact');
        }
    }

    /**
     * Determines which heading is currently active based on scroll position
     */
    public getActiveHeadingId(): string | null {
        const header = document.querySelector(this.config.headerSelector);
        const topOffset = (header ? header.getBoundingClientRect().height : 0) + this.config.topOffset;
        const triggerLine = topOffset + Math.max(0, (window.innerHeight - topOffset) * this.config.triggerLinePercentage);

        let current = this.headings[0];
        for (const heading of this.headings) {
            if (heading.getBoundingClientRect().top <= triggerLine) {
                current = heading;
            } else {
                break;
            }
        }

        return current?.id ?? null;
    }

    /**
     * Scroll event handler with requestAnimationFrame throttling
     */
    public onScroll = (): void => {
        if (this.rafId) return;
        this.rafId = window.requestAnimationFrame(() => {
            const activeId = this.getActiveHeadingId();
            this.openPathFor(activeId);
            this.rafId = 0;
        });
    };

    /**
     * Resize event handler
     */
    public onResize = (): void => {
        this.updateVisibility();
        this.onScroll();
    };

    /**
     * Toggles expand/collapse all state
     */
    public toggleExpandAll(): boolean {
        this.expandAll = !this.expandAll;
        this.openPathFor(this.getActiveHeadingId());
        return this.expandAll;
    }

    /**
     * Gets current expand all state
     */
    public getExpandAll(): boolean {
        return this.expandAll;
    }

    /**
     * Initializes tracking (call once after rendering)
     */
    public init(): void {
        this.updateVisibility();
        this.onScroll();
    }

    /**
     * Cleans up event listeners (call when TOC is destroyed)
     */
    public destroy(): void {
        if (this.rafId) {
            window.cancelAnimationFrame(this.rafId);
            this.rafId = 0;
        }
    }
}

/**
 * Binds navigation control buttons
 */
export function bindTocControls(
    tocElement: HTMLElement,
    tracker: TocTracker
): void {
    const expandButton = tocElement.querySelector<HTMLButtonElement>('[data-toc-expand]');
    const topButton = tocElement.querySelector<HTMLButtonElement>('[data-toc-top]');
    const bottomButton = tocElement.querySelector<HTMLButtonElement>('[data-toc-bottom]');

    if (expandButton) {
        expandButton.addEventListener('click', () => {
            const expandAll = tracker.toggleExpandAll();
            expandButton.textContent = expandAll ? 'Collapse all' : 'Expand all';
        });
    }

    if (topButton) {
        topButton.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    if (bottomButton) {
        bottomButton.addEventListener('click', () => {
            window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
        });
    }
}

/**
 * Attaches window event listeners for scroll and resize
 */
export function attachWindowListeners(tracker: TocTracker): void {
    window.addEventListener('resize', tracker.onResize, { passive: true });
    window.addEventListener('scroll', tracker.onScroll, { passive: true });
}
