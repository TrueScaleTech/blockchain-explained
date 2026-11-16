import assert from 'node:assert/strict';
import { test } from 'node:test';
import { linePath, linearScale, logScale, niceTicks } from '../src/lib/svgchart.ts';

test('linear scale maps the ends and the middle, including an inverted range', () => {
  const y = linearScale([0, 1], [200, 0]);
  assert.equal(y(0), 200);
  assert.equal(y(1), 0);
  assert.equal(y(0.5), 100);
  assert.throws(() => linearScale([1, 1], [0, 1]), RangeError);
});

test('log scale puts each power of ten the same distance apart', () => {
  const x = logScale([1, 1000], [0, 300]);
  assert.equal(x(1), 0);
  assert.ok(Math.abs(x(10) - 100) < 1e-9);
  assert.ok(Math.abs(x(100) - 200) < 1e-9);
  assert.throws(() => logScale([0, 10], [0, 1]), RangeError);
});

test('nice ticks are round numbers inside the range', () => {
  assert.deepEqual(niceTicks(0, 1, 5), [0, 0.2, 0.4, 0.6, 0.8, 1]);
  assert.deepEqual(niceTicks(0, 50, 5), [0, 10, 20, 30, 40, 50]);
  assert.deepEqual(niceTicks(3, 3), [3]);
});

test('path strings start with a move and round coordinates', () => {
  assert.equal(
    linePath([
      [0, 0],
      [1.23456, 2],
    ]),
    'M0 0 L1.23 2',
  );
  assert.equal(linePath([]), '');
});
