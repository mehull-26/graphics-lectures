/**
 * Generic theme and palette management system
 * Eliminates duplication between theme (dark/light) and palette (colorful/monotonic) logic
 */

import { storage } from './storage';

export type Theme = 'dark' | 'light';
export type Palette = 'colorful' | 'monotonic';
export type FontScale = 'sm' | 'md' | 'lg';

interface ToggleConfig<T extends string> {
    /** Storage key for localStorage */
    storageKey: string;
    /** HTML attribute name (e.g., 'data-theme') */
    attribute: string;
    /** Valid values for this toggle */
    validValues: readonly T[];
    /** Default value if none is stored */
    defaultValue: T;
    /** Function to detect system preference (optional) */
    detectSystemPreference?: () => T;
}

/**
 * Creates a typed toggle manager for theme-like settings
 */
function createToggle<T extends string>(config: ToggleConfig<T>) {
    const { storageKey, attribute, validValues, defaultValue, detectSystemPreference } = config;

    /**
     * Validator function for type safety
     */
    const isValid = (value: string): value is T => {
        return (validValues as readonly string[]).includes(value);
    };

    /**
     * Gets the stored value from localStorage
     */
    const getStored = (): T | null => {
        const value = storage.get<T>(storageKey, isValid, undefined);
        return value;
    };

    /**
     * Sets the value in localStorage
     */
    const setStored = (value: T): boolean => {
        return storage.set(storageKey, value);
    };

    /**
     * Gets the current value from DOM attribute or storage
     */
    const getCurrent = (): T => {
        const attrValue = document.documentElement.getAttribute(attribute);
        if (attrValue && isValid(attrValue)) return attrValue;

        const stored = getStored();
        if (stored) return stored;

        if (detectSystemPreference) {
            return detectSystemPreference();
        }

        return defaultValue;
    };

    /**
     * Applies the value to DOM and storage
     */
    const apply = (value: T): void => {
        document.documentElement.setAttribute(attribute, value);
        setStored(value);
    };

    /**
     * Toggles between two values
     */
    const toggle = (currentValue: T, nextValue: T): void => {
        apply(nextValue);
    };

    /**
     * Initializes the value on page load (should run immediately in <head>)
     */
    const init = (): void => {
        const stored = getStored();
        const initial = stored ?? (detectSystemPreference ? detectSystemPreference() : defaultValue);
        document.documentElement.setAttribute(attribute, initial);
    };

    return {
        getStored,
        setStored,
        getCurrent,
        apply,
        toggle,
        init,
        isValid
    };
}

// Theme toggle configuration
const themeConfig: ToggleConfig<Theme> = {
    storageKey: 'theme',
    attribute: 'data-theme',
    validValues: ['dark', 'light'] as const,
    defaultValue: 'light',
    detectSystemPreference: () => {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
};

// Palette toggle configuration
const paletteConfig: ToggleConfig<Palette> = {
    storageKey: 'palette',
    attribute: 'data-palette',
    validValues: ['colorful', 'monotonic'] as const,
    defaultValue: 'colorful'
};

// Font scale toggle configuration
const fontScaleConfig: ToggleConfig<FontScale> = {
    storageKey: 'fontScale',
    attribute: 'data-font-scale',
    validValues: ['sm', 'md', 'lg'] as const,
    defaultValue: 'md'
};

// Create toggle managers
export const themeManager = createToggle(themeConfig);
export const paletteManager = createToggle(paletteConfig);
export const fontScaleManager = createToggle(fontScaleConfig);

const FONT_SCALE_CYCLE: Record<FontScale, FontScale> = {
    sm: 'md',
    md: 'lg',
    lg: 'sm'
};

/**
 * Binds a toggle button to a manager
 * @param buttonId - ID of the button element
 * @param manager - The toggle manager to bind
 * @param getNext - Function to determine the next value
 * @param datasetKey - Key for tracking if button is already bound
 */
export function bindToggleButton<T extends string>(
    buttonId: string,
    manager: ReturnType<typeof createToggle<T>>,
    getNext: (current: T) => T,
    datasetKey: string
): void {
    const button = document.getElementById(buttonId);
    if (!button || button.dataset[datasetKey] === 'true') return;

    const syncButtonState = () => {
        const current = manager.getCurrent();
        const target = getNext(current);
        button.setAttribute('aria-label', `Switch to ${target} mode`);
        button.setAttribute('title', `Switch to ${target} mode`);
    };

    button.addEventListener('click', () => {
        const current = manager.getCurrent();
        const next = getNext(current);
        manager.toggle(current, next);
        syncButtonState();
    });

    button.dataset[datasetKey] = 'true';
    syncButtonState();
}

/**
 * Initializes both theme and palette on page load
 * This should be called in a blocking <script> in <head>
 */
export function initThemeSystem(): void {
    themeManager.init();
    paletteManager.init();
    fontScaleManager.init();
}

/**
 * Binds the theme toggle button
 */
export function bindThemeToggle(): void {
    bindToggleButton(
        'theme-toggle',
        themeManager,
        (current) => current === 'dark' ? 'light' : 'dark',
        'boundThemeToggle'
    );
}

/**
 * Binds the palette toggle button
 */
export function bindPaletteToggle(): void {
    bindToggleButton(
        'palette-toggle',
        paletteManager,
        (current) => current === 'colorful' ? 'monotonic' : 'colorful',
        'boundPaletteToggle'
    );
}

/**
 * Convenience function to set up all theme-related functionality
 * Call this once on DOMContentLoaded or immediately if DOM is ready
 */
/**
 * Binds the font scale toggle button
 */
export function bindFontScaleToggle(): void {
    bindToggleButton(
        'font-scale-toggle',
        fontScaleManager,
        (current) => FONT_SCALE_CYCLE[current],
        'boundFontScaleToggle'
    );
}

export function setupThemeSystem(): void {
    bindThemeToggle();
    bindPaletteToggle();
    bindFontScaleToggle();
}
