/**
 * Adds hover/focus label tooltips for truncated side-panel links.
 */

const TOOLTIP_ID = 'side-panel-hover-tooltip';
const HOVER_DELAY_MS = 700;

let hoverTimer = 0;

function ensureTooltipElement(): HTMLElement {
    let tooltip = document.getElementById(TOOLTIP_ID);
    if (tooltip instanceof HTMLElement) return tooltip;

    tooltip = document.createElement('div');
    tooltip.id = TOOLTIP_ID;
    tooltip.className = 'side-panel-hover-tooltip';
    tooltip.setAttribute('role', 'tooltip');
    tooltip.setAttribute('aria-hidden', 'true');
    document.body.appendChild(tooltip);
    return tooltip;
}

function hideTooltip(): void {
    if (hoverTimer) {
        window.clearTimeout(hoverTimer);
        hoverTimer = 0;
    }

    const tooltip = ensureTooltipElement();
    tooltip.classList.remove('is-visible');
    tooltip.setAttribute('aria-hidden', 'true');
    tooltip.removeAttribute('data-placement');
}

function positionTooltip(anchor: HTMLElement, tooltip: HTMLElement): void {
    const anchorRect = anchor.getBoundingClientRect();
    const viewportPadding = 10;

    tooltip.style.maxWidth = `${Math.min(560, window.innerWidth - viewportPadding * 2)}px`;

    const tooltipRect = tooltip.getBoundingClientRect();
    let left = anchorRect.left + anchorRect.width / 2 - tooltipRect.width / 2;
    left = Math.max(viewportPadding, Math.min(window.innerWidth - tooltipRect.width - viewportPadding, left));

    let top = anchorRect.top - tooltipRect.height - 10;
    let placement = 'top';

    if (top < viewportPadding) {
        top = anchorRect.bottom + 10;
        placement = 'bottom';
    }

    tooltip.style.left = `${Math.round(left)}px`;
    tooltip.style.top = `${Math.round(top)}px`;
    tooltip.setAttribute('data-placement', placement);
}

function showTooltip(anchor: HTMLElement): void {
    if (anchor.dataset.overflowing !== 'true') return;

    const fullLabel = anchor.dataset.fullLabel?.trim() || '';
    if (!fullLabel) return;

    const tooltip = ensureTooltipElement();
    tooltip.textContent = fullLabel;
    tooltip.classList.add('is-visible');
    tooltip.setAttribute('aria-hidden', 'false');

    positionTooltip(anchor, tooltip);
}

function scheduleTooltip(anchor: HTMLElement, delayMs: number = HOVER_DELAY_MS): void {
    if (hoverTimer) {
        window.clearTimeout(hoverTimer);
    }

    hoverTimer = window.setTimeout(() => {
        hoverTimer = 0;
        showTooltip(anchor);
    }, delayMs);
}

function bindTooltipEvents(link: HTMLElement): void {
    if (link.dataset.tooltipBound === 'true') return;

    link.dataset.tooltipBound = 'true';

    link.addEventListener('mouseenter', () => {
        if (link.dataset.overflowing !== 'true') return;
        scheduleTooltip(link, HOVER_DELAY_MS);
    });

    link.addEventListener('mouseleave', () => {
        hideTooltip();
    });

    link.addEventListener('focus', () => {
        if (link.dataset.overflowing !== 'true') return;
        scheduleTooltip(link, 240);
    });

    link.addEventListener('blur', () => {
        hideTooltip();
    });

    link.addEventListener('click', () => {
        hideTooltip();
    });
}

function isOverflowing(element: HTMLElement): boolean {
    return element.scrollWidth - element.clientWidth > 1;
}

function setTooltipState(link: HTMLElement, fullLabel: string, overflowing: boolean): void {
    if (!fullLabel) {
        link.removeAttribute('data-full-label');
        link.removeAttribute('data-overflowing');
        return;
    }

    link.setAttribute('data-full-label', fullLabel);
    link.setAttribute('data-overflowing', overflowing ? 'true' : 'false');
}

function updateTocLinkTooltips(): void {
    const tocLinks = [
        ...document.querySelectorAll('.toc-link')
    ].filter((element): element is HTMLElement => element instanceof HTMLElement);

    tocLinks.forEach((link) => {
        const fullLabel = (link.textContent || '').trim();
        const overflowing = isOverflowing(link);
        setTooltipState(link, fullLabel, overflowing);
        bindTooltipEvents(link);
    });
}

function updateLectureNavTooltips(): void {
    const lectureLinks = [
        ...document.querySelectorAll('.lecture-nav-link')
    ].filter((element): element is HTMLElement => element instanceof HTMLElement);

    lectureLinks.forEach((link) => {
        const fullLabel = (link.textContent || '').replace(/\s+/g, ' ').trim();
        const textNode = link.querySelector('.lecture-nav-text');
        const probe = textNode instanceof HTMLElement ? textNode : link;
        const overflowing = isOverflowing(probe);
        setTooltipState(link, fullLabel, overflowing);
        bindTooltipEvents(link);
    });
}

function updateAllSidePanelTooltips(): void {
    updateTocLinkTooltips();
    updateLectureNavTooltips();
}

export function setupSidePanelLabelTooltips(): void {
    let rafId = 0;

    const scheduleUpdate = (): void => {
        if (rafId) return;
        rafId = window.requestAnimationFrame(() => {
            updateAllSidePanelTooltips();
            rafId = 0;
        });
    };

    updateAllSidePanelTooltips();

    window.addEventListener('scroll', hideTooltip, { passive: true });

    window.addEventListener('resize', scheduleUpdate, { passive: true });
    document.addEventListener('astro:page-load', scheduleUpdate);

    const observer = new MutationObserver(scheduleUpdate);
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true,
        attributes: true,
        attributeFilter: ['class', 'style']
    });
}
