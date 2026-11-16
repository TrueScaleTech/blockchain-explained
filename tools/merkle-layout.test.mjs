import assert from 'node:assert/strict';
import { test } from 'node:test';
import { levelSizes, merkleLayout } from '../src/lib/merkle-layout.ts';

test('level sizes halve, rounding up, down to the root', () => {
  assert.deepEqual(levelSizes(1), [1]);
  assert.deepEqual(levelSizes(4), [4, 2, 1]);
  assert.deepEqual(levelSizes(6), [6, 3, 2, 1]);
  assert.deepEqual(levelSizes(7), [7, 4, 2, 1]);
  assert.throws(() => levelSizes(0), RangeError);
});

test('an odd level gets one ghost copy, and its parent sits between the pair', () => {
  const { nodes } = merkleLayout(levelSizes(6));
  const ghosts = nodes.filter((n) => n.ghost);
  assert.equal(ghosts.length, 1);
  assert.equal(ghosts[0].level, 1);
  const level1 = nodes.filter((n) => n.level === 1);
  const parent = nodes.find((n) => n.level === 2 && n.index === 1);
  assert.equal(parent.x, (level1[2].x + level1[3].x) / 2);
});

test('every parent sits midway between its two children', () => {
  const { nodes } = merkleLayout(levelSizes(7));
  for (const node of nodes.filter((n) => n.level > 0 && !n.ghost)) {
    const below = nodes.filter((n) => n.level === node.level - 1);
    const left = below[2 * node.index];
    const right = below[2 * node.index + 1];
    assert.equal(node.x, (left.x + right.x) / 2);
  }
});

test('the root is on top and there is one edge per non-root node', () => {
  const { nodes, edges, height } = merkleLayout(levelSizes(5));
  const root = nodes.find((n) => n.level === 3);
  assert.ok(nodes.every((n) => n.y >= root.y));
  assert.equal(edges.length, nodes.length - 1);
  assert.ok(height > 0);
});
