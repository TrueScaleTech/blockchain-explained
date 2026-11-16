// Checks every source cited by the published lessons. Exit code 1 only when a page is gone
// (404/410). Unknown results (blocked bots, timeouts) are reported but do not fail the run.
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'yaml';
import { BROKEN, UNKNOWN, checkLink, collectSources, frontmatterOf, summarise } from './links.mjs';

const root = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  'src',
  'content',
  'lessons',
);

const lessons = [];
for (const lang of ['en', 'it']) {
  const dir = path.join(root, lang);
  for (const name of (await readdir(dir)).filter((f) => f.endsWith('.mdx')).sort()) {
    const front = frontmatterOf(await readFile(path.join(dir, name), 'utf8'));
    lessons.push({ file: `${lang}/${name}`, data: front ? parse(front) : null });
  }
}

const results = [];
for (const link of collectSources(lessons)) {
  const result = await checkLink(link);
  results.push(result);
  const mark =
    result.verdict === BROKEN ? 'BROKEN ' : result.verdict === UNKNOWN ? 'unknown' : 'ok     ';
  console.log(`${mark} ${result.url}  (${result.detail}; cited in ${result.files.join(', ')})`);
}

const summary = summarise(results);
console.log(
  `\n${summary.total} checked: ${summary.ok} ok, ${summary.broken} broken, ${summary.unknown} unknown`,
);
process.exit(summary.broken > 0 ? 1 : 0);
