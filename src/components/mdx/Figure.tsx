import { createNumberedContent } from '../../lib/mdx/factories';
import type { NumberedContentProps } from '../../lib/mdx/types';

/**
 * Figure component with automatic numbering and caption support
 * 
 * @example
 * ```tsx
 * <Figure id="fig-diagram" caption="System architecture" lectureNumber={1}>
 *   <ImageBlock name="diagram.png" alt="Architecture" />
 * </Figure>
 * ```
 */
const FigureBase = createNumberedContent({
    type: 'figure',
    idPrefix: 'fig-',
    label: 'Figure'
});

// Export with backward-compatible prop names (lectureNumber -> contextNumber)
export type FigureProps = Omit<NumberedContentProps, 'contextNumber'> & {
    lectureNumber?: string | number;
};

export default function Figure({ lectureNumber, ...props }: FigureProps) {
    return FigureBase({ ...props, contextNumber: lectureNumber });
}
