import { createContentRef } from '../../lib/mdx/refFactory';

/**
 * Reference link component for tables
 * Automatically resolves to proper table numbers and supports cross-page references
 * 
 * @example
 * ```tsx
 * Results are shown in <TabRef id="tab-performance" />.
 * Compare with <TabRef id="tab-baseline" page="/series/rendering/lecture-01" />.
 * ```
 */
const TabRef = createContentRef({
    type: 'table',
    idPrefix: 'tab-',
    defaultPrefix: 'tab.'
});

export default TabRef;
