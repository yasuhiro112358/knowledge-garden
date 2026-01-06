import { defineCollection, z } from 'astro:content';

const topics = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string().optional(),
    date: z.string().optional(),
    tags: z.array(z.string()).optional(),
  }),
});

const daily = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string().optional(),
    date: z.string().optional(),
  }),
});

export const collections = { topics, daily };

