// Small pure helpers for the hand-drawn SVG charts: scales, ticks and path strings.

export type Scale = (value: number) => number;

export function linearScale([d0, d1]: [number, number], [r0, r1]: [number, number]): Scale {
  if (d0 === d1) throw new RangeError('the domain must not be empty');
  return (value) => r0 + ((value - d0) / (d1 - d0)) * (r1 - r0);
}

/** Base-10 logarithmic scale; the domain must be strictly positive. */
export function logScale([d0, d1]: [number, number], [r0, r1]: [number, number]): Scale {
  if (!(d0 > 0 && d1 > 0) || d0 === d1) throw new RangeError('log domain must be positive');
  const l0 = Math.log10(d0);
  const l1 = Math.log10(d1);
  return (value) => r0 + ((Math.log10(value) - l0) / (l1 - l0)) * (r1 - r0);
}

/** About `count` round tick values covering [min, max] (steps of 1, 2 or 5 times a power of 10). */
export function niceTicks(min: number, max: number, count = 5): number[] {
  if (!(max > min)) return [min];
  const rough = (max - min) / count;
  const power = 10 ** Math.floor(Math.log10(rough));
  const step = [1, 2, 5, 10].map((m) => m * power).find((s) => s >= rough) ?? 10 * power;
  const ticks: number[] = [];
  for (let v = Math.ceil(min / step) * step; v <= max + step * 1e-9; v += step) {
    ticks.push(Number(v.toPrecision(12)));
  }
  return ticks;
}

/** An SVG path through the points, with coordinates rounded to keep the markup short. */
export function linePath(points: [number, number][]): string {
  return points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${round(x)} ${round(y)}`).join(' ');
}

function round(n: number): number {
  return Math.round(n * 100) / 100;
}
