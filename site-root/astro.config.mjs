import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import expressiveCode from 'astro-expressive-code';
import { pluginLineNumbers } from '@expressive-code/plugin-line-numbers';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

function remarkCodeFenceMeta() {
    return (tree) => {
        const visit = (node) => {
            if (!node || typeof node !== 'object') return;

            if (node.type === 'code') {
                const langRaw = String(node.lang ?? '').trim();
                const hasEqualsLineNumbers = /=$/.test(langRaw);
                const normalizedLang = langRaw.replace(/=$/, '');

                node.lang = normalizedLang;

                if (hasEqualsLineNumbers) {
                    const metaRaw = String(node.meta ?? '').trim();
                    node.meta = `${metaRaw} showLineNumbers`.trim();
                }
            }

            if (Array.isArray(node.children)) {
                node.children.forEach(visit);
            }
        };

        visit(tree);
    };
}
export default defineConfig({
    site: 'https://mehull.dev',
    base: '/',
    output: 'static',
    integrations: [
        react(),
        expressiveCode({
            themes: ['github-light', 'github-dark'],
            useDarkModeMediaQuery: false,
            themeCssSelector: (theme) => (theme.name === 'github-dark' ? "[data-theme='dark']" : "[data-theme='light']"),
            plugins: [pluginLineNumbers()],
            defaultProps: {
                showLineNumbers: true
            },
            frames: {
                showCopyToClipboardButton: true
            }
        }),
        mdx()
    ],
    markdown: {
        syntaxHighlight: false,
        remarkPlugins: [remarkMath, remarkCodeFenceMeta],
        rehypePlugins: [rehypeKatex]
    }
});