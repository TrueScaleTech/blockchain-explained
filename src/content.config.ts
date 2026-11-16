import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// One interactive widget per lesson, chosen by name in the lesson's frontmatter.
export const WIDGETS = ['hash', 'chain', 'mining', 'merkle', 'signature', 'attack'] as const;

const httpsUrl = z.string().refine((u) => URL.canParse(u) && u.startsWith('https://'), {
  message: 'must be a valid https link',
});

// One MDX file per lesson and per language: src/content/lessons/<en|it>/<NN>-<slug>.mdx.
// The file name gives the URL slug (the same in both languages); there is deliberately no
// `slug` field, because the glob loader would use it as the entry id and the two languages
// would collide. The two files of a lesson share order, widget and sources (a unit test checks).
const lessons = defineCollection({
  loader: glob({ pattern: '{en,it}/[0-9][0-9]-*.mdx', base: './src/content/lessons' }),
  schema: z.object({
    order: z.number().int().positive(),
    title: z.string().min(1).max(80),
    summary: z.string().min(1).max(220),
    keyPoints: z.array(z.string().min(1).max(200)).min(2).max(5),
    widget: z.enum(WIDGETS),
    // Primary sources only: whitepapers, standards, specifications, official documentation.
    sources: z
      .array(z.object({ title: z.string().min(1), url: httpsUrl }))
      .min(1)
      .max(6),
    // Drafts are left out of the built site.
    draft: z.boolean().default(false),
  }),
});

export const collections = { lessons };
