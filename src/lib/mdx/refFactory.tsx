import type { ReactNode } from 'react';
import type { ContentRefProps, RefConfig } from './types';
import { extractIdNumber } from './utils';

/**
 * Factory function that creates a content reference component
 * Eliminates code duplication between FigRef, EqRef, and TabRef components
 * 
 * @param config - Configuration object specifying reference behavior
 * @returns A configured content reference component
 */
export function createContentRef(config: RefConfig) {
    const { type, idPrefix, defaultPrefix } = config;

    return function ContentRef({ id, page, children }: ContentRefProps) {
        // Generate fallback text if no custom children provided
        const fallbackNumber = extractIdNumber(id, idPrefix);
        const defaultText = `${defaultPrefix}${fallbackNumber}`;

        return (
            <a
                href={page ? `${page}#${id}` : `#${id}`}
                data-ref-link
                data-ref-target={id}
                data-ref-page={page}
                data-has-custom-text={children ? 'true' : 'false'}
                className="ref-link"
            >
                {children || defaultText}
            </a>
        );
    };
}
