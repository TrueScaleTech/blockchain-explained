import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  buildTree,
  merkleRootFromTxids,
  proofFor,
  rootOf,
  sha256d,
  verifyProof,
} from '../src/lib/merkle.ts';
import { concatBytes, toHex, utf8 } from '../src/lib/sha256.ts';

// Public Bitcoin block data, as shown by any block explorer.
test('the genesis block: one transaction, the root is its id', async () => {
  const txid = '4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b';
  assert.equal(await merkleRootFromTxids([txid]), txid);
});

test('block 100000: four transactions give the published Merkle root', async () => {
  const txids = [
    '8c14f0db3df150123e6f3dbbf30f8b955a8249b62ac1d1ff16284aefa3d06d87',
    'fff2525b8931402dd09222c50775608f75787bd2b87e56995a7bdd30f79702c4',
    '6359f0868171b1d194cbee1af2f16ea598ae8fad666d9b012c8ed2b79a236ec4',
    'e9a66845e05d5abc0ad04ec80f774a7e585c6e8db975962d069a522137b80c1d',
  ];
  assert.equal(
    await merkleRootFromTxids(txids),
    'f3e94742aca4b5ef85488dc37c06c3282295ffec960994b2c0d5ac2a25a95766',
  );
});

test('an odd level pairs its last node with itself', async () => {
  const [a, b, c] = await Promise.all(['a', 'b', 'c'].map((s) => sha256d(utf8(s))));
  const ab = await sha256d(concatBytes(a, b));
  const cc = await sha256d(concatBytes(c, c));
  const expected = await sha256d(concatBytes(ab, cc));
  const levels = await buildTree([a, b, c]);
  assert.equal(levels.length, 3);
  assert.equal(toHex(rootOf(levels)), toHex(expected));
});

test('every leaf has a proof that rebuilds the root', async () => {
  const leaves = await Promise.all(['t1', 't2', 't3', 't4', 't5'].map((s) => sha256d(utf8(s))));
  const levels = await buildTree(leaves);
  const root = rootOf(levels);
  for (const [i, leaf] of leaves.entries()) {
    const proof = proofFor(levels, i);
    assert.equal(proof.length, levels.length - 1);
    assert.ok(await verifyProof(leaf, proof, root), `leaf ${i}`);
  }
});

test('a proof fails for a changed leaf or a changed sibling', async () => {
  const leaves = await Promise.all(['t1', 't2', 't3', 't4'].map((s) => sha256d(utf8(s))));
  const levels = await buildTree(leaves);
  const root = rootOf(levels);
  const proof = proofFor(levels, 2);
  assert.ok(!(await verifyProof(await sha256d(utf8('forged')), proof, root)));
  const tampered = proof.map((step, i) => (i === 0 ? { ...step, sibling: leaves[0] } : step));
  assert.ok(!(await verifyProof(leaves[2], tampered, root)));
});

test('rejects an empty tree and an out-of-range leaf', async () => {
  await assert.rejects(buildTree([]));
  const levels = await buildTree([await sha256d(utf8('x'))]);
  assert.throws(() => proofFor(levels, 1), RangeError);
  assert.deepEqual(proofFor(levels, 0), []);
});
