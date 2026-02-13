import { inferAltFromSource, resolveImageSource } from './imageResolver';

type ImageBlockProps = {
    src?: string | { src: string };
    name?: string;
    alt?: string;
    scale?: number;
    caption?: string;
};

export default function ImageBlock({ src, name, alt, scale = 1, caption }: ImageBlockProps) {
    const rawSource = src ?? name ?? '';
    const resolvedSource = resolveImageSource(rawSource);
    const altSeed = typeof rawSource === 'string' ? rawSource : rawSource.src;
    const altText = alt ?? inferAltFromSource(altSeed);
    const clampedScale = Math.min(Math.max(scale, 0.1), 1);

    return (
        <figure
            style={{
                margin: '1.75rem auto',
                width: `${clampedScale * 100}%`,
                maxWidth: '100%'
            }}
        >
            <img
                src={resolvedSource}
                alt={altText}
                loading="lazy"
                style={{
                    display: 'block',
                    width: '100%',
                    height: 'auto',
                    border: '2px solid var(--border)',
                    borderRadius: '12px'
                }}
            />
            {caption ? (
                <figcaption
                    style={{
                        marginTop: '0',
                        textAlign: 'center',
                        color: 'var(--muted)',
                        fontSize: '0.72em',
                        lineHeight: 0.15
                    }}
                >
                    {caption}
                </figcaption>
            ) : null}
        </figure>
    );
}
