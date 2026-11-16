import assert from 'node:assert/strict';
import { test } from 'node:test';
import { attackerSuccessProbability, confirmationsNeeded } from '../src/lib/nakamoto.ts';

// The tables in section 11 of the Bitcoin whitepaper, printed to 7 decimal places.
const TABLE_Q_01 = [
  [0, 1.0],
  [1, 0.2045873],
  [2, 0.0509779],
  [3, 0.0131722],
  [4, 0.0034552],
  [5, 0.0009137],
  [6, 0.0002428],
  [7, 0.0000647],
  [8, 0.0000173],
  [9, 0.0000046],
  [10, 0.0000012],
];
const TABLE_Q_03 = [
  [0, 1.0],
  [5, 0.1773523],
  [10, 0.0416605],
  [15, 0.0101008],
  [20, 0.0024804],
  [25, 0.0006132],
  [30, 0.0001522],
  [35, 0.0000379],
  [40, 0.0000095],
  [45, 0.0000024],
  [50, 0.0000006],
];
// "Solving for P less than 0.1%".
const CONFIRMATIONS = [
  [0.1, 5],
  [0.15, 8],
  [0.2, 11],
  [0.25, 15],
  [0.3, 24],
  [0.35, 41],
  [0.4, 89],
  [0.45, 340],
];

function close(actual, expected, label) {
  assert.ok(Math.abs(actual - expected) < 5e-8, `${label}: got ${actual}, expected ${expected}`);
}

test('matches the whitepaper table for q = 0.1', () => {
  for (const [z, p] of TABLE_Q_01) close(attackerSuccessProbability(0.1, z), p, `z=${z}`);
});

test('matches the whitepaper table for q = 0.3', () => {
  for (const [z, p] of TABLE_Q_03) close(attackerSuccessProbability(0.3, z), p, `z=${z}`);
});

test('matches the confirmations needed for less than 0.1%', () => {
  for (const [q, z] of CONFIRMATIONS) assert.equal(confirmationsNeeded(q, 0.001), z, `q=${q}`);
});

test('with half the power or more the attacker always catches up', () => {
  assert.equal(attackerSuccessProbability(0.5, 100), 1);
  assert.equal(attackerSuccessProbability(0.7, 6), 1);
  assert.equal(attackerSuccessProbability(0, 6), 0);
});

test('more confirmations never make the attack more likely', () => {
  let previous = 1;
  for (let z = 0; z <= 60; z++) {
    const p = attackerSuccessProbability(0.25, z);
    assert.ok(p <= previous + 1e-15, `z=${z}`);
    previous = p;
  }
});

test('rejects impossible inputs', () => {
  assert.throws(() => attackerSuccessProbability(-0.1, 1), RangeError);
  assert.throws(() => attackerSuccessProbability(1.1, 1), RangeError);
  assert.throws(() => attackerSuccessProbability(0.1, 1.5), RangeError);
  assert.throws(() => attackerSuccessProbability(0.1, -1), RangeError);
});
