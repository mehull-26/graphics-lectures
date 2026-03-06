import { createNumberedContent } from '../../lib/mdx/factories';
import type { NumberedContentProps } from '../../lib/mdx/types';

/**
 * Table component with automatic numbering and caption support
 * Caption appears above the table (conventional for tables)
 * 
 * @example
 * ```tsx
 * <Table id="tab-results" caption="Performance comparison" lectureNumber={1}>
 *   <table>
 *     <thead><tr><th>Method</th><th>FPS</th></tr></thead>
 *     <tbody><tr><td>Path Tracing</td><td>30</td></tr></tbody>
 *   </table>
 * </Table>
 * ```
 */
const TableBase = createNumberedContent({
    type: 'table',
    idPrefix: 'tab-',
    label: 'Table'
});

// Export with backward-compatible prop names (lectureNumber -> contextNumber)
export type TableProps = Omit<NumberedContentProps, 'contextNumber'> & {
    lectureNumber?: string | number;
};

export default function Table({ lectureNumber, ...props }: TableProps) {
    return TableBase({ ...props, contextNumber: lectureNumber });
}
