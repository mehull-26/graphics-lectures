import { inferAltFromSource, resolveImageSource } from './imageResolver';

type ImageRowItem =
    | string
    | {
        src?: string | { src: string };
        name?: string;
        alt?: string;
    };

type ImageRowBlockProps = {
    images: ImageRowItem[];
    perLine?: number;
    scale?: number;
    gap?: number;
    gapRem?: number;
};

export default function ImageRowBlock({
    images,
    perLine = 2,
    scale = 1,
    gap,
    gapRem
}: ImageRowBlockProps) {
    const clampedPerLine = Math.max(1, Math.floor(perLine));
    const clampedScale = Math.min(Math.max(scale, 0.1), 1);
    const effectiveGap = gap ?? gapRem ?? 0.8;
    const clampedGap = Math.max(0, effectiveGap);
    const imageWidth = clampedGap === 0 ? '100%' : `${clampedScale * 100}%`;

    const normalizedImages = images
        .map((image, index) => {
            const rawSource = typeof image === 'string'
                ? image
                : (image.src ?? image.name ?? '');

            const resolvedSource = resolveImageSource(rawSource);
            if (!resolvedSource) return null;

            const altSeed = typeof rawSource === 'string' ? rawSource : rawSource.src;

            const alt = typeof image === 'string'
                ? inferAltFromSource(altSeed, `Image ${index + 1}`)
                : (image.alt ?? inferAltFromSource(altSeed, `Image ${index + 1}`));

            return {
                src: resolvedSource,
                alt
            };
        })
        .filter((image): image is { src: string; alt: string } => image !== null);

    const centeredSlots: Array<{ src: string; alt: string } | null> = [];
    for (let index = 0; index < normalizedImages.length; index += clampedPerLine) {
        const rowImages = normalizedImages.slice(index, index + clampedPerLine);
        const emptyCount = clampedPerLine - rowImages.length;

        if (emptyCount > 0) {
            const leadingEmpty = Math.floor(emptyCount / 2);
            const trailingEmpty = emptyCount - leadingEmpty;

            for (let slot = 0; slot < leadingEmpty; slot += 1) centeredSlots.push(null);
            centeredSlots.push(...rowImages);
            for (let slot = 0; slot < trailingEmpty; slot += 1) centeredSlots.push(null);
        } else {
            centeredSlots.push(...rowImages);
        }
    }

    return (
        <div
            style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${clampedPerLine}, minmax(0, 1fr))`,
                gap: `${clampedGap}rem`,
                alignItems: 'start',
                justifyItems: 'center',
                margin: '0.55rem auto'
            }}
        >
            {centeredSlots.map((image, index) => (
                image ? (
                    <img
                        key={`${image.src}-${index}`}
                        src={image.src}
                        alt={image.alt}
                        loading="lazy"
                        style={{
                            display: 'block',
                            width: imageWidth,
                            maxWidth: '100%',
                            height: 'auto',
                            border: '1px solid var(--border)',
                            borderRadius: '12px'
                        }}
                    />
                ) : (
                    <div key={`empty-${index}`} aria-hidden="true" style={{ width: '100%' }} />
                )
            ))}
        </div>
    );
}
