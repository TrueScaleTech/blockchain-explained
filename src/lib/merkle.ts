// Merkle trees with Bitcoin's rules: nodes are double SHA-256 of the two children concatenated,
// and a level with an odd number of nodes pairs its last node with itself.
//
// Bitcoin hashes in "internal" byte order but displays transaction ids and the root reversed.
// merkleRootFromTxids() takes and returns the displayed form, so it can be checked against any
// block explorer; the tree functions work on internal-order bytes.

import { concatBytes, fromHex, sha256Bytes, toHex } from './sha256.ts';

export async function sha256d(data: Uint8Array<ArrayBuffer>): Promise<Uint8Array<ArrayBuffer>> {
  return sha256Bytes(await sha256Bytes(data));
}

function reversed(bytes: Uint8Array<ArrayBuffer>): Uint8Array<ArrayBuffer> {
  return bytes.slice().reverse();
}

/** All levels of the tree: levels[0] are the leaves, the last level holds only the root. */
export async function buildTree(
  leaves: Uint8Array<ArrayBuffer>[],
): Promise<Uint8Array<ArrayBuffer>[][]> {
  if (leaves.length === 0) throw new Error('a Merkle tree needs at least one leaf');
  const levels = [leaves];
  let level = leaves;
  while (level.length > 1) {
    const next: Uint8Array<ArrayBuffer>[] = [];
    for (let i = 0; i < level.length; i += 2) {
      const left = level[i]!;
      const right = level[i + 1] ?? left;
      next.push(await sha256d(concatBytes(left, right)));
    }
    levels.push(next);
    level = next;
  }
  return levels;
}

export function rootOf(levels: Uint8Array<ArrayBuffer>[][]): Uint8Array<ArrayBuffer> {
  return levels[levels.length - 1]![0]!;
}

export interface ProofStep {
  sibling: Uint8Array<ArrayBuffer>;
  /** The sibling goes on the left of the running hash when the two are concatenated. */
  siblingOnLeft: boolean;
}

/** The sibling hashes needed to rebuild the root from one leaf: one per level below the root. */
export function proofFor(levels: Uint8Array<ArrayBuffer>[][], leafIndex: number): ProofStep[] {
  if (!Number.isInteger(leafIndex) || leafIndex < 0 || leafIndex >= levels[0]!.length) {
    throw new RangeError('leaf index out of range');
  }
  const proof: ProofStep[] = [];
  let index = leafIndex;
  for (const level of levels.slice(0, -1)) {
    const isRight = index % 2 === 1;
    const siblingIndex = isRight ? index - 1 : index + 1;
    proof.push({ sibling: level[siblingIndex] ?? level[index]!, siblingOnLeft: isRight });
    index = Math.floor(index / 2);
  }
  return proof;
}

/** Rebuilds the root from a leaf and its proof and compares it with the expected root. */
export async function verifyProof(
  leaf: Uint8Array<ArrayBuffer>,
  proof: ProofStep[],
  root: Uint8Array<ArrayBuffer>,
): Promise<boolean> {
  let running = leaf;
  for (const step of proof) {
    running = await sha256d(
      step.siblingOnLeft ? concatBytes(step.sibling, running) : concatBytes(running, step.sibling),
    );
  }
  return toHex(running) === toHex(root);
}

/** The Merkle root of a block, from its transaction ids as block explorers display them. */
export async function merkleRootFromTxids(txids: string[]): Promise<string> {
  const leaves = txids.map((txid) => reversed(fromHex(txid)));
  return toHex(reversed(rootOf(await buildTree(leaves))));
}
