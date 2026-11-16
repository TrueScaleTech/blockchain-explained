// The toy chain: each block's hash covers its number, the previous block's hash, its nonce and
// its data. Changing anything in one block changes its hash, and therefore the "previous hash"
// of every block after it.

import { meetsDifficulty, mine, type MineOptions } from './pow.ts';
import { sha256Hex } from './sha256.ts';

export const GENESIS_PREVIOUS_HASH = '0'.repeat(64);

export interface BlockInput {
  data: string;
  nonce: number;
}

export interface Block extends BlockInput {
  index: number;
  previousHash: string;
  hash: string;
  /** The hash meets the chain's difficulty, i.e. the work for this exact content was done. */
  valid: boolean;
}

/** The exact text that is hashed. Shown on the page, so it is kept simple and readable. */
export function blockPayload(index: number, previousHash: string, nonce: number, data: string) {
  return `${index}|${previousHash}|${nonce}|${data}`;
}

export function hashBlock(index: number, previousHash: string, nonce: number, data: string) {
  return sha256Hex(blockPayload(index, previousHash, nonce, data));
}

/** Rebuilds the whole chain from its inputs, linking each block to the one before. */
export async function computeChain(inputs: BlockInput[], difficulty: number): Promise<Block[]> {
  const chain: Block[] = [];
  let previousHash = GENESIS_PREVIOUS_HASH;
  for (const [index, { data, nonce }] of inputs.entries()) {
    const hash = await hashBlock(index, previousHash, nonce, data);
    chain.push({
      index,
      data,
      nonce,
      previousHash,
      hash,
      valid: meetsDifficulty(hash, difficulty),
    });
    previousHash = hash;
  }
  return chain;
}

/** Index of the first block whose work is missing, or null if the whole chain is valid. */
export function firstInvalid(chain: Block[]): number | null {
  const broken = chain.find((block) => !block.valid);
  return broken ? broken.index : null;
}

/** Finds a nonce that makes one block valid, keeping its number, previous hash and data. */
export function mineBlock(
  index: number,
  previousHash: string,
  data: string,
  difficulty: number,
  options?: MineOptions,
) {
  return mine((nonce) => hashBlock(index, previousHash, nonce, data), difficulty, options);
}
