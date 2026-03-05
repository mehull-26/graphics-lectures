/**
 * Type-safe localStorage abstraction with error handling
 */

/**
 * Safely retrieves a value from localStorage with type validation
 * @param key - The storage key
 * @param validator - Optional function to validate the retrieved value
 * @param defaultValue - Default value if retrieval fails or validation fails
 * @returns The stored value or default value
 */
export function get<T extends string = string>(
    key: string,
    validator?: (value: string) => value is T,
    defaultValue?: T
): T | null {
    try {
        const value = localStorage.getItem(key);
        if (value === null) return defaultValue ?? null;

        if (validator) {
            return validator(value) ? (value as unknown as T) : (defaultValue ?? null);
        }

        return value as unknown as T;
    } catch {
        return defaultValue ?? null;
    }
}

/**
 * Safely stores a value in localStorage
 * @param key - The storage key
 * @param value - The value to store
 * @returns true if successful, false otherwise
 */
export function set<T>(key: string, value: T): boolean {
    try {
        localStorage.setItem(key, String(value));
        return true;
    } catch {
        return false;
    }
}

/**
 * Safely removes a value from localStorage
 * @param key - The storage key
 * @returns true if successful, false otherwise
 */
export function remove(key: string): boolean {
    try {
        localStorage.removeItem(key);
        return true;
    } catch {
        return false;
    }
}

/**
 * Checks if localStorage is available
 * @returns true if localStorage is accessible, false otherwise
 */
export function isAvailable(): boolean {
    try {
        const testKey = '__storage_test__';
        localStorage.setItem(testKey, 'test');
        localStorage.removeItem(testKey);
        return true;
    } catch {
        return false;
    }
}

// Export as default object for convenience
export const storage = {
    get,
    set,
    remove,
    isAvailable
};
