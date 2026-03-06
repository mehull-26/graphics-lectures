import { createContentRef } from '../../lib/mdx/refFactory';

/**
 * Reference link component for figures
 * Automatically resolves to proper figure numbers and supports cross-page references
 * 
 * @example
 * ```tsx
 * See <FigRef id="fig-diagram" /> for details.
 * Compare with <FigRef id="fig-other" page="/series/rendering/lecture-01" />.
 * ```
 */
const FigRef = createContentRef({
    type: 'figure',
    idPrefix: 'fig-',
    defaultPrefix: 'fig.'
});

export default FigRef;
