import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  BROKEN,
  OK,
  UNKNOWN,
  checkLink,
  classify,
  collectSources,
  frontmatterOf,
  summarise,
} from './links.mjs';

test('only gone pages count as broken', () => {
  assert.equal(classify(200), OK);
  assert.equal(classify(301), OK);
  assert.equal(classify(404), BROKEN);
  assert.equal(classify(410), BROKEN);
  assert.equal(classify(403), UNKNOWN);
  assert.equal(classify(429), UNKNOWN);
  assert.equal(classify(500), UNKNOWN);
});

test('reads the frontmatter block of a lesson', () => {
  assert.equal(frontmatterOf('---\norder: 1\n---\n\nText'), 'order: 1');
  assert.equal(frontmatterOf('---\r\norder: 1\r\n---\r\nText'), 'order: 1');
  assert.equal(frontmatterOf('No frontmatter'), null);
});

test('each source is checked once, with every lesson that cites it; drafts are skipped', () => {
  const paper = 'https://bitcoin.org/bitcoin.pdf';
  const rfc = 'https://www.rfc-editor.org/rfc/rfc6979';
  const links = collectSources([
    { file: 'en/01-hash.mdx', data: { sources: [{ url: paper }] } },
    { file: 'it/01-hash.mdx', data: { sources: [{ url: paper }] } },
    { file: 'en/05-signatures.mdx', data: { sources: [{ url: rfc }, { url: paper }] } },
    { file: 'en/07-draft.mdx', data: { draft: true, sources: [{ url: 'https://draft.test/' }] } },
    { file: 'en/broken.mdx', data: null },
  ]);
  assert.deepEqual(links, [
    { url: paper, files: ['en/01-hash.mdx', 'it/01-hash.mdx', 'en/05-signatures.mdx'] },
    { url: rfc, files: ['en/05-signatures.mdx'] },
  ]);
});

test('checkLink reports the verdict from the injected fetch', async () => {
  const link = { url: 'https://bitcoin.org/bitcoin.pdf', files: ['en/01-hash.mdx'] };
  const gone = await checkLink(link, async () => ({ status: 404 }));
  assert.equal(gone.verdict, BROKEN);
  assert.equal(gone.detail, 'HTTP 404');
  const fine = await checkLink(link, async () => ({ status: 200 }));
  assert.equal(fine.verdict, OK);
  assert.deepEqual(fine.files, ['en/01-hash.mdx']);
});

test('a network failure is unknown, never broken', async () => {
  const link = { url: 'https://bitcoin.org/bitcoin.pdf', files: [] };
  const result = await checkLink(link, async () => {
    throw new Error('getaddrinfo ENOTFOUND');
  });
  assert.equal(result.verdict, UNKNOWN);
  assert.match(result.detail, /ENOTFOUND/);
});

test('summarise counts each verdict', () => {
  const summary = summarise([
    { verdict: OK },
    { verdict: OK },
    { verdict: BROKEN },
    { verdict: UNKNOWN },
  ]);
  assert.deepEqual(summary, { ok: 2, broken: 1, unknown: 1, total: 4 });
});
