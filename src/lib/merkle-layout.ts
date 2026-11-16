// Where to draw each node of a Merkle tree. Leaves sit on the bottom row, the root on top.
// A level with an odd number of nodes gets a "ghost": the copy of its last node that Bitcoin's
// rule pairs it with. Pure geometry, used both at build time and in the browser.

export interface LayoutNode {
  level: number;
  index: number;
  x: number;
  y: number;
  ghost: boolean;
}

export interface LayoutEdge {
  from: LayoutNode;
  to: LayoutNode;
}

export interface Layout {
  nodes: LayoutNode[];
  edges: LayoutEdge[];
  width: number;
  height: number;
}

export const NODE = { width: 88, height: 34 } as const;
const SLOT = 100;
const ROW = 86;
const PAD = 10;

/** Sizes of each level from the leaves up, e.g. 6 leaves give [6, 3, 2, 1]. */
export function levelSizes(leafCount: number): number[] {
  if (!Number.isInteger(leafCount) || leafCount < 1) throw new RangeError('need at least one leaf');
  const sizes = [leafCount];
  while (sizes[sizes.length - 1]! > 1) sizes.push(Math.ceil(sizes[sizes.length - 1]! / 2));
  return sizes;
}

export function merkleLayout(sizes: number[]): Layout {
  const rows = sizes.length;
  const yOf = (level: number) => PAD + NODE.height / 2 + (rows - 1 - level) * ROW;
  const levels: LayoutNode[][] = [];

  sizes.forEach((size, level) => {
    const row: LayoutNode[] = [];
    if (level === 0) {
      for (let i = 0; i < size; i++) {
        row.push({ level, index: i, x: PAD + SLOT / 2 + i * SLOT, y: yOf(level), ghost: false });
      }
    } else {
      // The level below already holds its ghost, so every parent has two children.
      const below = levels[level - 1]!;
      for (let i = 0; i < size; i++) {
        const left = below[2 * i]!;
        const right = below[2 * i + 1]!;
        row.push({ level, index: i, x: (left.x + right.x) / 2, y: yOf(level), ghost: false });
      }
    }
    // An odd level (other than the root) pairs its last node with a copy of itself.
    if (size % 2 === 1 && level < rows - 1) {
      const last = row[row.length - 1]!;
      const step = row.length > 1 ? row[1]!.x - row[0]!.x : SLOT;
      row.push({ level, index: size, x: last.x + step, y: yOf(level), ghost: true });
    }
    levels.push(row);
  });

  const nodes = levels.flat();
  const edges: LayoutEdge[] = [];
  for (let level = 0; level < rows - 1; level++) {
    for (const node of levels[level]!) {
      const parent = levels[level + 1]![Math.floor(node.index / 2)]!;
      edges.push({ from: node, to: parent });
    }
  }
  const width = Math.max(...nodes.map((n) => n.x)) + NODE.width / 2 + PAD;
  const height = PAD * 2 + NODE.height + (rows - 1) * ROW;
  return { nodes, edges, width, height };
}
