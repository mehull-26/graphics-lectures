type ResolvedAsset = string | { src: string };

const contentAssetModules = import.meta.glob('/src/content/series/**/assets/*.{png,jpg,jpeg,webp,gif,svg,avif}', {
    eager: true,
    import: 'default'
}) as Record<string, ResolvedAsset>;

const toUrl = (asset: ResolvedAsset | undefined) => {
    if (!asset) return '';
    return typeof asset === 'string' ? asset : asset.src;
};

const isAbsoluteOrRelativePath = (value: string) => {
    return value.startsWith('/')
        || value.startsWith('./')
        || value.startsWith('../')
        || /^[a-z]+:\/\//i.test(value);
};

export const resolveImageSource = (value: string | { src: string } | undefined) => {
    if (!value) return '';
    if (typeof value !== 'string') return value.src;
    if (isAbsoluteOrRelativePath(value)) return value;

    const suffix = `/assets/${value}`;
    const matches = Object.entries(contentAssetModules)
        .filter(([filePath]) => filePath.endsWith(suffix))
        .sort(([pathA], [pathB]) => pathA.localeCompare(pathB));

    if (matches.length > 0) {
        return toUrl(matches[0][1]);
    }

    return value;
};

export const inferAltFromSource = (value: string | undefined, fallback = 'Image') => {
    if (!value) return fallback;

    const filename = value.split('/').pop() ?? value;
    const withoutExtension = filename.replace(/\.[^.]+$/, '');
    const normalized = withoutExtension.replace(/[-_]+/g, ' ').trim();

    return normalized.length > 0 ? normalized : fallback;
};
