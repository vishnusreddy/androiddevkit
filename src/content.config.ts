import { defineCollection, reference, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Topics are the spine of the site: Coroutines, Jetpack Compose, etc.
 * Each topic is a small data file. Questions reference a topic by id.
 */
const topics = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/topics' }),
  schema: z.object({
    title: z.string(),
    // Short, plain-language summary shown on cards and topic headers.
    description: z.string(),
    // Logical grouping for the topics index, e.g. "Kotlin", "Android", "System Design".
    category: z.string(),
    // Lower numbers sort first within a category.
    order: z.number().default(100),
    // Optional emoji/glyph used as the topic's visual marker.
    icon: z.string().default('▚'),
  }),
});

const difficulty = z.enum(['junior', 'mid', 'senior']);

/**
 * One file = one question + answer. This keeps PRs small and reviewable,
 * and lets each question be filtered, linked, and surfaced on its topic page.
 */
const questions = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/questions' }),
  schema: z.object({
    question: z.string(),
    topic: reference('topics'),
    difficulty: difficulty.default('mid'),
    tags: z.array(z.string()).default([]),
    // Credit the contributor. Optional.
    author: z.string().optional(),
    updated: z.coerce.date().optional(),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    author: z.string().default('AndroidDevKit'),
    tags: z.array(z.string()).default([]),
    heroImage: z.string().optional(),
    heroAlt: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

const experiences = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/experiences' }),
  schema: z.object({
    company: z.string(),
    role: z.string().default('Android Engineer'),
    // Seniority the candidate interviewed for.
    level: z.enum(['Intern', 'Junior', 'Mid', 'Senior', 'Staff+']).default('Mid'),
    location: z.string().optional(),
    remote: z.boolean().default(false),
    outcome: z.enum(['Offer', 'Rejected', 'Withdrew', 'In Progress', 'No Response']).default('Offer'),
    date: z.coerce.date(),
    author: z.string().default('Anonymous'),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { topics, questions, blog, experiences };
