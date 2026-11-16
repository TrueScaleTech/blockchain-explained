import assert from 'node:assert/strict';
import { test } from 'node:test';
import { MAX_DIFFICULTY, expectedAttempts, meetsDifficulty, mine } from '../src/lib/pow.ts';
import { sha256Hex } from '../src/lib/sha256.ts';

const noPause = async () => {};

test('difficulty is a count of leading hex zeros', () => {
  assert.ok(meetsDifficulty('000abc', 3));
  assert.ok(!meetsDifficulty('00abc0', 3));
  assert.ok(meetsDifficulty('abc', 0));
});

test('each extra zero multiplies the expected work by 16', () => {
  assert.equal(expectedAttempts(0), 1);
  assert.equal(expectedAttempts(1), 16);
  assert.equal(expectedAttempts(4) / expectedAttempts(3), 16);
});

test('the nonce found really meets the difficulty', async () => {
  const hashFor = (nonce) => sha256Hex(`hello|${nonce}`);
  const result = await mine(hashFor, 2, { pause: noPause });
  assert.ok(result);
  assert.ok(result.hash.startsWith('00'));
  assert.equal(result.hash, await sha256Hex(`hello|${result.nonce}`));
  assert.equal(result.attempts, result.nonce + 1);
});

test('the search stops on the first nonce that works', async () => {
  // A fake hash that only becomes valid at nonce 7.
  const hashFor = async (nonce) => (nonce === 7 ? '00ff' : 'ffff');
  const result = await mine(hashFor, 2, { pause: noPause, batchSize: 3 });
  assert.deepEqual(result, { nonce: 7, hash: '00ff', attempts: 8 });
});

test('progress is reported and an abort stops the search', async () => {
  const controller = new AbortController();
  const seen = [];
  const result = await mine(async () => 'ffff', 1, {
    batchSize: 10,
    pause: noPause,
    signal: controller.signal,
    onProgress: (attempts) => {
      seen.push(attempts);
      if (attempts >= 30) controller.abort();
    },
  });
  assert.equal(result, null);
  assert.deepEqual(seen, [10, 20, 30]);
});

test('refuses difficulties outside the cap', async () => {
  const hashFor = async () => '0'.repeat(64);
  await assert.rejects(mine(hashFor, MAX_DIFFICULTY + 1), RangeError);
  await assert.rejects(mine(hashFor, -1), RangeError);
  await assert.rejects(mine(hashFor, 1.5), RangeError);
});
