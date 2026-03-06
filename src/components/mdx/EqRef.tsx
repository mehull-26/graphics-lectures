import { createContentRef } from '../../lib/mdx/refFactory';

/**
 * Reference link component for equations
 * Automatically resolves to proper equation numbers and supports cross-page references
 * 
 * @example
 * ```tsx
 * From <EqRef id="eq-rendering" /> we can derive...
 * Using <EqRef id="eq-radiance" page="/series/rendering/lecture-01" />.
 * ```
 */
const EqRef = createContentRef({
    type: 'equation',
    idPrefix: 'eq-',
    defaultPrefix: 'eq.'
});

export default EqRef;
