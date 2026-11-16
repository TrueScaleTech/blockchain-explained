import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  changedHexPositions,
  differingBits,
  fromHex,
  sha256Hex,
  toHex,
} from '../src/lib/sha256.ts';

// Reference digests from NIST's SHA-256 examples (FIPS 180-2, appendix B).
test('matches the NIST SHA-256 examples', async () => {
  assert.equal(
    await sha256Hex(''),
    'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
  );
  assert.equal(
    await sha256Hex('abc'),
    'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad',
  );
  assert.equal(
    await sha256Hex('abcdbcdecdefdefgefghfghighijhijkijkljklmklmnlmnomnopnopq'),
    '248d6a61d20638b8e5c026930c3e6039a33ce45964ff2167f6ecedd419db06c1',
  );
});

test('hashes text as UTF-8', async () => {
  // "é" is two bytes in UTF-8; hashing must not depend on how the text was typed.
  assert.equal(await sha256Hex('perché'), await sha256Hex('perché'));
  assert.notEqual(await sha256Hex('perché'), await sha256Hex('perche'));
});

test('hex round trip and rejection of non-hex input', () => {
  const bytes = new Uint8Array([0, 1, 15, 16, 255]);
  assert.equal(toHex(bytes), '00010f10ff');
  assert.deepEqual(fromHex('00010f10ff'), bytes);
  assert.throws(() => fromHex('abc'));
  assert.throws(() => fromHex('zz'));
});

test('one changed character changes about half of the bits', async () => {
  const a = await sha256Hex('blockchain');
  const b = await sha256Hex('blockchaim');
  const bits = differingBits(a, b);
  // Any value near 128 of 256 is expected; these bounds are far outside normal variation.
  assert.ok(bits > 80 && bits < 176, `unexpected bit difference ${bits}`);
  assert.equal(differingBits(a, a), 0);
});

test('reports which hex positions changed', () => {
  assert.deepEqual(changedHexPositions('a0f', 'a1f'), [false, true, false]);
  assert.throws(() => changedHexPositions('aa', 'a'));
});
