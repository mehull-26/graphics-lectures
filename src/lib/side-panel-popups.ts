/**
 * Converts hidden side panels into edge-launcher popups.
 */

type PanelKind = 'toc' | 'nav';

interface PanelSpec {
    kind: PanelKind;
    label: string;
    panel: HTMLElement;
    handle: HTMLButtonElement;
}

const OVERLAY_ID = 'side-panel-popup-overlay';

let activeKind: PanelKind | null = null;
let escapeBound = false;

function isPanelHidden(panel: HTMLElement): boolean {
    const style = window.getComputedStyle(panel);
    if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') {
        return true;
    }

    return panel.getClientRects().length === 0;
}

function ensureOverlay(): HTMLElement {
    let overlay = document.getElementById(OVERLAY_ID);
    if (overlay instanceof HTMLDivElement) return overlay;

    overlay = document.createElement('div');
    overlay.id = OVERLAY_ID;
    overlay.className = 'side-panel-popup-overlay';
    document.body.appendChild(overlay);

    return overlay;
}

function ensureCloseButton(panel: HTMLElement): void {
    if (panel.querySelector('[data-side-panel-close]')) return;

    const close = document.createElement('button');
    close.type = 'button';
    close.className = 'side-panel-popup-close';
    close.setAttribute('data-side-panel-close', 'true');
    close.setAttribute('aria-label', 'Close panel');
    close.innerHTML = '&times;';

    panel.appendChild(close);
}

function closeAllPanels(specs: PanelSpec[]): void {
    activeKind = null;
    document.body.classList.remove('side-panel-popup-active');

    specs.forEach((spec) => {
        spec.panel.classList.remove('is-popup-open', 'is-popup-left');
        spec.handle.classList.remove('is-active');
    });

    const overlay = ensureOverlay();
    overlay.classList.remove('is-visible');
}

function openPanel(spec: PanelSpec, specs: PanelSpec[]): void {
    if (activeKind === spec.kind) {
        closeAllPanels(specs);
        return;
    }

    closeAllPanels(specs);

    activeKind = spec.kind;
    document.body.classList.add('side-panel-popup-active');

    spec.panel.classList.add('is-popup-open');
    spec.panel.classList.add('is-popup-left');
    spec.handle.classList.add('is-active');

    const overlay = ensureOverlay();
    overlay.classList.add('is-visible');

    ensureCloseButton(spec.panel);

    spec.panel.setAttribute('tabindex', '-1');
    spec.panel.focus({ preventScroll: true });
}

function createHandle(kind: PanelKind, label: string): HTMLButtonElement {
    const handle = document.createElement('button');
    handle.type = 'button';
    handle.className = 'side-panel-handle';
    handle.setAttribute('data-panel-kind', kind);
    handle.setAttribute('aria-label', `Open ${label}`);

    const fullLabel = kind === 'toc' ? 'Table of Contents' : 'Lecture Navigation';

    handle.innerHTML = [
        '<span class="side-panel-handle-text side-panel-handle-text--short" aria-hidden="true">',
        label,
        '</span>',
        '<span class="side-panel-handle-text side-panel-handle-text--full" aria-hidden="true">',
        fullLabel,
        '</span>'
    ].join('');

    document.body.appendChild(handle);
    return handle;
}

function collectSpecs(): PanelSpec[] {
    const specs: PanelSpec[] = [];

    const toc = document.querySelector('[data-toc]');
    if (toc instanceof HTMLElement) {
        specs.push({
            kind: 'toc',
            label: 'TOC',
            panel: toc,
            handle: createHandle('toc', 'TOC')
        });
    }

    const nav = document.querySelector('.lecture-nav-shell');
    if (nav instanceof HTMLElement) {
        specs.push({
            kind: 'nav',
            label: 'NAV',
            panel: nav,
            handle: createHandle('nav', 'NAV')
        });
    }

    return specs;
}

function bindEvents(specs: PanelSpec[]): void {
    const overlay = ensureOverlay();

    specs.forEach((spec) => {
        spec.handle.addEventListener('click', () => {
            openPanel(spec, specs);
        });

        spec.panel.addEventListener('click', (event) => {
            const target = event.target;
            if (!(target instanceof Element)) return;
            if (target.closest('[data-side-panel-close]')) {
                closeAllPanels(specs);
            }
        });
    });

    overlay.addEventListener('click', () => {
        closeAllPanels(specs);
    });

    if (!escapeBound) {
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                closeAllPanels(specs);
            }
        });
        escapeBound = true;
    }
}

function updateHandleVisibility(specs: PanelSpec[]): void {
    specs.forEach((spec) => {
        const popupOpen = spec.panel.classList.contains('is-popup-open');
        const hidden = popupOpen ? true : isPanelHidden(spec.panel);
        spec.handle.classList.toggle('is-visible', hidden);

        // If panel becomes visible in normal layout, close popup state.
        if (!hidden && !popupOpen && activeKind === spec.kind) {
            closeAllPanels(specs);
        }
    });
}

export function setupSidePanelPopups(): void {
    const specs = collectSpecs();
    if (specs.length === 0) return;

    bindEvents(specs);

    let rafId = 0;
    const scheduleUpdate = (): void => {
        if (rafId) return;
        rafId = window.requestAnimationFrame(() => {
            updateHandleVisibility(specs);
            rafId = 0;
        });
    };

    updateHandleVisibility(specs);

    window.addEventListener('resize', scheduleUpdate, { passive: true });
    document.addEventListener('astro:page-load', scheduleUpdate);

    const observer = new MutationObserver(scheduleUpdate);
    observer.observe(document.body, {
        subtree: true,
        attributes: true,
        attributeFilter: ['class', 'style']
    });
}
