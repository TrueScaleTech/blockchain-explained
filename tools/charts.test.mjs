import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  ATTACK_FLOOR,
  CHART,
  attackPath,
  attackPoint,
  expectedMiningPath,
  miningPoint,
  miningScales,
  percent,
} from '../src/lib/charts.ts';

test('the expected mining line climbs one step per extra zero', () => {
  const { y } = miningScales();
  const steps = expectedMiningPath()
    .split(/[ML]/)
    .filter(Boolean)
    .map((pair) => Number(pair.trim().split(' ')[1]));
  assert.equal(steps.length, 5);
  // On a log scale every factor of 16 is the same distance.
  const gap = y(16) - y(256);
  for (let i = 1; i < steps.length; i++) assert.ok(Math.abs(steps[i - 1] - steps[i] - gap) < 0.02);
});

test('mining points stay inside the plot even for extreme attempt counts', () => {
  const low = miningPoint(1, 0);
  const high = miningPoint(5, 1e12);
  assert.ok(low.cy <= CHART.height - CHART.bottom + 1e-9);
  assert.ok(high.cy >= CHART.top - 1e-9);
});

test('the attack curve stops at the floor instead of drawing values it cannot show', () => {
  const steep = attackPath(0.05).split('L').length;
  const flat = attackPath(0.45).split('L').length;
  assert.ok(steep < flat, 'a weak attacker falls below the floor sooner');
  assert.equal(attackPoint(0.05, 20), null);
  assert.ok(attackPoint(0.3, 5));
  assert.ok(ATTACK_FLOOR > 0);
});

test('percentages keep meaningful digits', () => {
  assert.equal(percent(1), 100);
  assert.equal(percent(0.2045873), 20.5);
  assert.equal(percent(0.0009137), 0.0914);
});
