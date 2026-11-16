// The Italian and English versions of each lesson must match in everything but the words.
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { parse } from 'yaml';

const root = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  'src',
  'content',
  'lessons',
);
const files = (lang) =>
  readdirSync(path.join(root, lang))
    .filter((f) => f.endsWith('.mdx'))
    .sort();

function read(lang, file) {
  const text = readFileSync(path.join(root, lang, file), 'utf8');
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/.exec(text);
  assert.ok(match, `${lang}/${file} has no frontmatter`);
  return { data: parse(match[1]), body: match[2] };
}

test('both languages have the same lesson files', () => {
  assert.deepEqual(files('it'), files('en'));
  assert.ok(files('en').length >= 6);
});

test('file names follow NN-slug and match the order field', () => {
  for (const file of files('en')) {
    assert.match(file, /^\d{2}-[a-z0-9]+(-[a-z0-9]+)*\.mdx$/);
    const { data } = read('en', file);
    assert.equal(data.order, Number(file.slice(0, 2)), file);
  }
});

test('each pair shares order, widget and sources', () => {
  for (const file of files('en')) {
    const en = read('en', file).data;
    const it = read('it', file).data;
    assert.equal(it.order, en.order, file);
    assert.equal(it.widget, en.widget, file);
    assert.deepEqual(
      it.sources.map((s) => s.url),
      en.sources.map((s) => s.url),
      file,
    );
    assert.equal(it.keyPoints.length, en.keyPoints.length, file);
  }
});

test('every lesson places its widget exactly once and has no draft wording left', () => {
  for (const lang of ['en', 'it']) {
    for (const file of files(lang)) {
      const { body, data } = read(lang, file);
      assert.equal(body.match(/<Widget \/>/g)?.length, 1, `${lang}/${file}`);
      assert.notEqual(data.draft, true, `${lang}/${file} is still a draft`);
    }
  }
});
