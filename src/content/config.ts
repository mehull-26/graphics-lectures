import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const series = defineCollection({
    loader: glob({ pattern: '*/series.md', base: './src/content/series' }),
    schema: z.object({
        title: z.string(),
        description: z.string(),
        order: z.number().int().nonnegative().default(0)
    })
});

const lectures = defineCollection({
    loader: glob({ pattern: '*/lecture-*/lecture.mdx', base: './src/content/series' }),
    schema: z.object({
        title: z.string(),
        lectureNumber: z.number().int().positive(),
        summary: z.string().default(''),
        publishedAt: z.date().optional(),
        readings: z.array(z.object({
            label: z.string().min(1),
            href: z.string().url()
        })).default([]),
        assignments: z.array(z.object({
            label: z.string().min(1),
            href: z.string().url()
        })).default([]),
        resources: z.array(z.object({
            label: z.string().min(1),
            href: z.string().url()
        })).default([])
    })
});

const meta = defineCollection({
    loader: glob({ pattern: '*/.*/**.mdx', base: './src/content/series' }),
    schema: z.object({
        title: z.string(),
        summary: z.string().optional(),
        order: z.number().int().default(0)
    })
});

const derivations = defineCollection({
    loader: glob({ pattern: 'derivation-*/derivation.mdx', base: './src/content/derivations' }),
    schema: z.object({
        title: z.string(),
        derivationNumber: z.number().int().positive(),
        summary: z.string().default(''),
        publishedAt: z.date().optional(),
        order: z.number().int().default(0)
    })
});

export const collections = {
    series,
    lectures,
    meta,
    derivations
};