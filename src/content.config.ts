import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const mapSchema = z.object({
  slug: z.string(),
  title: z.string(),
  tagline: z.string().optional(),
});

const maps = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/maps' }),
  schema: mapSchema,
});

const mapsFr = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/maps-fr' }),
  schema: mapSchema,
});

export const collections = { maps, 'maps-fr': mapsFr };
