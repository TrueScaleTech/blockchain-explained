// The probability that an attacker ever catches up with the honest chain, from section 11
// ("Calculations") of the Bitcoin whitepaper: Satoshi Nakamoto, "Bitcoin: A Peer-to-Peer
// Electronic Cash System", 2008.
//
// q: the attacker's share of the hashing power (0..1); the honest share is p = 1 - q.
// z: how many blocks the honest chain is ahead (the confirmations the receiver waited for).

export function attackerSuccessProbability(q: number, z: number): number {
  if (!(q >= 0 && q <= 1)) throw new RangeError('q must be between 0 and 1');
  if (!Number.isInteger(z) || z < 0) throw new RangeError('z must be a whole number from 0');
  const p = 1 - q;
  // With half the power or more, the attacker catches up eventually.
  if (q >= p) return 1;
  // While the honest chain makes z blocks, the attacker's progress follows a Poisson
  // distribution with this expected value.
  const lambda = z * (q / p);
  let sum = 1;
  let poisson = Math.exp(-lambda); // P(k = 0)
  for (let k = 0; k <= z; k++) {
    if (k > 0) poisson *= lambda / k;
    sum -= poisson * (1 - (q / p) ** (z - k));
  }
  // Rounding can leave a tiny negative number for very large z.
  return Math.min(1, Math.max(0, sum));
}

/** The fewest confirmations that push the attacker's chance below the threshold, up to a limit. */
export function confirmationsNeeded(q: number, threshold: number, limit = 1000): number | null {
  for (let z = 0; z <= limit; z++) {
    if (attackerSuccessProbability(q, z) < threshold) return z;
  }
  return null;
}
