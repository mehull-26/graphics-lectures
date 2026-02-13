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
        starterRepo: z.string().url().optional(),
        finishedRepo: z.string().url().optional()
    })
});

export const collections = {
    series,
    lectures
};