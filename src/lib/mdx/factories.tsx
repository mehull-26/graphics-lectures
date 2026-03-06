import type { ReactNode } from 'react';
import type { NumberedContentProps, ContentConfig } from './types';
import { formatDisplayNumber, extractIdNumber } from './utils';

/**
 * Factory function that creates a numbered content component
 * Eliminates code duplication between Figure, Equation, and Table components
 * 
 * @param config - Configuration object specifying component behavior
 * @returns A configured numbered content component
 */
export function createNumberedContent(config: ContentConfig) {
    const { type, idPrefix, label } = config;

    return function NumberedContent({
        id,
        children,
        caption,
        number,
        contextNumber
    }: NumberedContentProps) {
        // Extract and format the display number
        const itemNumber = number !== undefined
            ? String(number)
            : extractIdNumber(id, idPrefix);
        const displayNumber = formatDisplayNumber(contextNumber, itemNumber);

        // Common data attributes for reference system
        const dataAttributes = {
            'data-ref-id': id,
            'data-ref-type': type,
            'data-ref-number': displayNumber
        };

        // Render based on type
        if (type === 'equation') {
            return (
                <div
                    id={id}
                    className="numbered-content numbered-content-equation"
                    {...dataAttributes}
                >
                    <div className="numbered-content-body">
                        {children}
                    </div>
                    <div className="numbered-content-number" aria-label={`Equation ${displayNumber}`}>
                        <strong className="numbered-content-label">eq.{displayNumber}</strong>
                    </div>
                    {caption && (
                        <div className="numbered-content-caption">
                            {caption}
                        </div>
                    )}
                </div>
            );
        }

        if (type === 'table') {
            return (
                <div
                    id={id}
                    className="numbered-content numbered-content-table"
                    {...dataAttributes}
                >
                    {caption && (
                        <div className="numbered-content-caption numbered-content-caption-above">
                            <strong className="numbered-content-label">
                                {label} {displayNumber}
                            </strong>
                            {': '}
                            {caption}
                        </div>
                    )}
                    <div className="numbered-content-table-wrapper">
                        {children}
                    </div>
                </div>
            );
        }

        // Default: figure
        return (
            <figure
                id={id}
                className="numbered-content numbered-content-figure"
                {...dataAttributes}
            >
                {children}
                {caption && (
                    <figcaption className="numbered-content-caption">
                        <strong className="numbered-content-label">
                            {label} {displayNumber}
                        </strong>
                        {': '}
                        {caption}
                    </figcaption>
                )}
            </figure>
        );
    };
}
