import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  GENESIS_PREVIOUS_HASH,
  blockPayload,
  computeChain,
  firstInvalid,
  hashBlock,
  mineBlock,
} from '../src/lib/block.ts';
import { sha256Hex } from '../src/lib/sha256.ts';

const noPause = async () => {};
const DIFFICULTY = 2;

/** Mines every block in order, as the honest network would. */
async function minedInputs(datas) {
  const inputs = [];
  let previousHash = GENESIS_PREVIOUS_HASH;
  for (const [index, data] of datas.entries()) {
    const result = await mineBlock(index, previousHash, data, DIFFICULTY, { pause: noPause });
    inputs.push({ data, nonce: result.nonce });
    previousHash = result.hash;
  }
  return inputs;
}

test('the block hash covers number, previous hash, nonce and data', async () => {
  assert.equal(blockPayload(1, 'ab', 7, 'hi'), '1|ab|7|hi');
  assert.equal(await hashBlock(1, 'ab', 7, 'hi'), await sha256Hex('1|ab|7|hi'));
});

test('a mined chain is valid and each block points to the previous hash', async () => {
  const chain = await computeChain(await minedInputs(['a', 'b', 'c', 'd']), DIFFICULTY);
  assert.equal(firstInvalid(chain), null);
  assert.equal(chain[0].previousHash, GENESIS_PREVIOUS_HASH);
  for (let i = 1; i < chain.length; i++) assert.equal(chain[i].previousHash, chain[i - 1].hash);
});

test('changing old data breaks that block and every block after it', async () => {
  const inputs = await minedInputs(['a', 'b', 'c', 'd']);
  inputs[1] = { ...inputs[1], data: 'B' };
  const chain = await computeChain(inputs, DIFFICULTY);
  assert.equal(firstInvalid(chain), 1);
  assert.ok(chain[0].valid);
  // The later blocks' own content did not change, but their previous hash did.
  assert.ok(chain.slice(1).every((block) => !block.valid));
});

test('re-mining the changed block is not enough: the later blocks must be re-mined too', async () => {
  const inputs = await minedInputs(['a', 'b', 'c', 'd']);
  inputs[1] = { data: 'B', nonce: inputs[1].nonce };

  let chain = await computeChain(inputs, DIFFICULTY);
  const fix = await mineBlock(1, chain[1].previousHash, 'B', DIFFICULTY, { pause: noPause });
  inputs[1] = { data: 'B', nonce: fix.nonce };
  chain = await computeChain(inputs, DIFFICULTY);
  assert.ok(chain[1].valid);
  assert.equal(firstInvalid(chain), 2);

  for (let i = 2; i < inputs.length; i++) {
    const result = await mineBlock(i, chain[i].previousHash, inputs[i].data, DIFFICULTY, {
      pause: noPause,
    });
    inputs[i] = { data: inputs[i].data, nonce: result.nonce };
    chain = await computeChain(inputs, DIFFICULTY);
  }
  assert.equal(firstInvalid(chain), null);
});
