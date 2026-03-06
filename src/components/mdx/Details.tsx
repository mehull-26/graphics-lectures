import type { ReactNode } from 'react';

export interface DetailsProps {
    /** Summary text or content */
    summary?: ReactNode;
    /** Optional custom icon (defaults to chevron) */
    icon?: string;
    /** Visual variant */
    variant?: 'default' | 'derivation' | 'note' | 'example';
    /** Whether to start open */
    defaultOpen?: boolean;
    /** Child content */
    children: ReactNode;
}

/**
 * Enhanced Details/Dropdown component for collapsible content
 * 
 * @example
 * ```tsx
 * <Details summary="Derivation" variant="derivation">
 *   Content here...
 * </Details>
 * ```
 */
export default function Details({
    summary = 'Show details',
    icon,
    variant = 'default',
    defaultOpen = false,
    children
}: DetailsProps) {
    return (
        <details
            className={`details-enhanced details-${variant}`}
            open={defaultOpen}
        >
            <summary className="details-summary">
                {icon && <span className="details-icon-custom">{icon}</span>}
                <span className="details-label">{summary}</span>
            </summary>
            <div className="details-content">
                {children}
            </div>
        </details>
    );
}
