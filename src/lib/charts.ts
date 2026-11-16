// Geometry of the two charts (mining and attack), computed without the DOM. The same functions
// draw the static figure at build time and update it live in the browser.

import { attackerSuccessProbability } from './nakamoto.ts';
import { MAX_DIFFICULTY, expectedAttempts } from './pow.ts';
import { linePath, linearScale, logScale } from './svgchart.ts';

export interface Frame {
  width: number;
  height: number;
  left: number;
  right: number;
  top: number;
  bottom: number;
}

export const CHART: Frame = { width: 560, height: 280, left: 58, right: 18, top: 18, bottom: 46 };

export interface Tick {
  value: number;
  at: number;
}

// ---------- Mining: attempts against difficulty ----------

export const MINING_Y = [1, 1e7] as const;

export function miningScales(frame: Frame = CHART) {
  const x = linearScale([0.5, MAX_DIFFICULTY + 0.5], [frame.left, frame.width - frame.right]);
  const y = logScale([MINING_Y[0], MINING_Y[1]], [frame.height - frame.bottom, frame.top]);
  return { x, y };
}

/** The line of expected attempts, 16 to the power of the difficulty, for 1 to MAX_DIFFICULTY. */
export function expectedMiningPath(frame: Frame = CHART): string {
  const { x, y } = miningScales(frame);
  const points: [number, number][] = [];
  for (let d = 1; d <= MAX_DIFFICULTY; d++) points.push([x(d), y(expectedAttempts(d))]);
  return linePath(points);
}

export function miningXTicks(frame: Frame = CHART): Tick[] {
  const { x } = miningScales(frame);
  return Array.from({ length: MAX_DIFFICULTY }, (_, i) => ({ value: i + 1, at: x(i + 1) }));
}

export function miningYTicks(frame: Frame = CHART): Tick[] {
  const { y } = miningScales(frame);
  return [1, 1e2, 1e4, 1e6].map((value) => ({ value, at: y(value) }));
}

/** Where one finished run sits on the chart. Attempts below 1 are drawn at 1. */
export function miningPoint(difficulty: number, attempts: number, frame: Frame = CHART) {
  const { x, y } = miningScales(frame);
  const clamped = Math.min(Math.max(attempts, MINING_Y[0]), MINING_Y[1]);
  return { cx: x(difficulty), cy: y(clamped) };
}

// ---------- Attack: success probability against confirmations ----------

export const ATTACK_Z_MAX = 20;
export const ATTACK_FLOOR = 1e-6;

export function attackScales(frame: Frame = CHART) {
  const x = linearScale([0, ATTACK_Z_MAX], [frame.left, frame.width - frame.right]);
  const y = logScale([ATTACK_FLOOR, 1], [frame.height - frame.bottom, frame.top]);
  return { x, y };
}

/**
 * The curve for one attacker share q, from z = 0 to ATTACK_Z_MAX. Values below the chart's
 * floor end the line there: the chart does not pretend to draw what it cannot show.
 */
export function attackPath(q: number, frame: Frame = CHART): string {
  const { x, y } = attackScales(frame);
  const points: [number, number][] = [];
  for (let z = 0; z <= ATTACK_Z_MAX; z++) {
    const p = attackerSuccessProbability(q, z);
    if (p < ATTACK_FLOOR) {
      points.push([x(z), y(ATTACK_FLOOR)]);
      break;
    }
    points.push([x(z), y(p)]);
  }
  return linePath(points);
}

/** The marker for the current q and z, or null when it falls below the chart's floor. */
export function attackPoint(q: number, z: number, frame: Frame = CHART) {
  const { x, y } = attackScales(frame);
  const p = attackerSuccessProbability(q, z);
  return p < ATTACK_FLOOR ? null : { cx: x(z), cy: y(p) };
}

export function attackXTicks(frame: Frame = CHART): Tick[] {
  const { x } = attackScales(frame);
  return [0, 5, 10, 15, 20].map((value) => ({ value, at: x(value) }));
}

export function attackYTicks(frame: Frame = CHART): Tick[] {
  const { y } = attackScales(frame);
  return [1, 1e-2, 1e-4, 1e-6].map((value) => ({ value, at: y(value) }));
}

/** A probability as a percentage with enough digits to be meaningful (0.0009137 gives 0.09137). */
export function percent(p: number): number {
  if (p >= 0.1) return Math.round(p * 1000) / 10;
  return Number((p * 100).toPrecision(3));
}
