// Proof of work for the toy chain. Difficulty is the number of leading hex zeros a block hash
// must have: a simplification of Bitcoin's compact target, stated as such on the page.

/** Above this the search could keep a phone busy for minutes, so the widgets never ask for more. */
export const MAX_DIFFICULTY = 5;

export function meetsDifficulty(hash: string, difficulty: number): boolean {
  return hash.startsWith('0'.repeat(difficulty));
}

/** Each hex character is one of 16 values, so each extra zero multiplies the expected work by 16. */
export function expectedAttempts(difficulty: number): number {
  return 16 ** difficulty;
}

export interface MineResult {
  nonce: number;
  hash: string;
  attempts: number;
}

export interface MineOptions {
  startNonce?: number;
  /** Hashes tried between two pauses, so the page stays responsive. */
  batchSize?: number;
  onProgress?: (attempts: number) => void;
  signal?: AbortSignal;
  /** How to pause between batches. Tests pass a no-op. */
  pause?: () => Promise<void>;
}

const defaultPause = () => new Promise<void>((resolve) => setTimeout(resolve, 0));

/**
 * Tries nonces from startNonce upwards until hashFor(nonce) meets the difficulty.
 * Returns null if the signal aborts the search first.
 */
export async function mine(
  hashFor: (nonce: number) => Promise<string>,
  difficulty: number,
  options: MineOptions = {},
): Promise<MineResult | null> {
  if (!Number.isInteger(difficulty) || difficulty < 0 || difficulty > MAX_DIFFICULTY) {
    throw new RangeError(`difficulty must be an integer from 0 to ${MAX_DIFFICULTY}`);
  }
  const { startNonce = 0, batchSize = 400, onProgress, signal, pause = defaultPause } = options;
  let nonce = startNonce;
  let attempts = 0;
  for (;;) {
    for (let i = 0; i < batchSize; i++) {
      if (signal?.aborted) return null;
      const hash = await hashFor(nonce);
      attempts++;
      if (meetsDifficulty(hash, difficulty)) {
        onProgress?.(attempts);
        return { nonce, hash, attempts };
      }
      nonce++;
    }
    onProgress?.(attempts);
    await pause();
  }
}
