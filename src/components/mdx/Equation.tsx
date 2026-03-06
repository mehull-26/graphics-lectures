import { createNumberedContent } from '../../lib/mdx/factories';
import type { NumberedContentProps } from '../../lib/mdx/types';

/**
 * Equation component with automatic numbering
 * Displays equations with reference numbers on the right
 * 
 * @example
 * ```tsx
 * <Equation id="eq-rendering" lectureNumber={1}>
 *   $$L_o = L_e + \int f_r L_i \cos\theta d\omega$$
 * </Equation>
 * ```
 */
const EquationBase = createNumberedContent({
    type: 'equation',
    idPrefix: 'eq-',
    label: 'Equation'
});

// Export with backward-compatible prop names
export type EquationProps = Omit<NumberedContentProps, 'contextNumber'> & {
    lectureNumber?: string | number;
    label?: string; // Note: label prop is now mapped to caption
};

export default function Equation({ lectureNumber, label, ...props }: EquationProps) {
    return EquationBase({ ...props, contextNumber: lectureNumber, caption: label });
}
