import { getCollection, type CollectionEntry } from 'astro:content';
import type { Locale } from './i18n';

export type Lesson = CollectionEntry<'lessons'>;

/** Entry ids look like "en/01-hash": the folder is the language. */
export function localeOf(lesson: Lesson): Locale {
  return lesson.id.split('/')[0] as Locale;
}

/** The URL slug: the file name without its two-digit order prefix ("01-hash" gives "hash"). */
export function slugOf(lesson: Lesson): string {
  const file = lesson.id.split('/')[1] ?? '';
  return file.replace(/^\d{2}-/, '');
}

/** Published lessons of one language, in reading order. SHOW_DRAFTS=1 also shows drafts. */
export async function getLessons(locale: Locale): Promise<Lesson[]> {
  const showDrafts = process.env.SHOW_DRAFTS === '1';
  const lessons = await getCollection(
    'lessons',
    (entry) => localeOf(entry) === locale && (showDrafts || !entry.data.draft),
  );
  return lessons.sort((a, b) => a.data.order - b.data.order);
}

/** A short contents label: the title up to its colon ("Hashing: a fingerprint…" gives "Hashing"). */
export function shortTitle(lesson: Lesson): string {
  return lesson.data.title.split(':')[0]!.trim();
}
