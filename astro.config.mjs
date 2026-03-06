import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import expressiveCode from 'astro-expressive-code';
import { pluginLineNumbers } from '@expressive-code/plugin-line-numbers';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { fileURLToPath } from 'url';

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
    vite: {
        resolve: {
            alias: {
                '@utils': fileURLToPath(new URL('./src/utils', import.meta.url)),
                '@lib': fileURLToPath(new URL('./src/lib', import.meta.url)),
                '@components': fileURLToPath(new URL('./src/components', import.meta.url)),
                '@styles': fileURLToPath(new URL('./src/styles', import.meta.url)),
                '@types': fileURLToPath(new URL('./src/types', import.meta.url)),
                '@config': fileURLToPath(new URL('./src/config', import.meta.url)),
            },
        },
    },
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