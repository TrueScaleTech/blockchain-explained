// WCAG contrast of the colour pairs the site actually uses, read from the CSS tokens, for the
// light theme, the dark theme, and the frame (masthead, rail, bench) that both share.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

const css = readFileSync(
  path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'src', 'styles', 'global.css'),
  'utf8',
);

function tokens(selector) {
  const start = css.indexOf(`${selector} {`);
  assert.ok(start >= 0, `missing ${selector}`);
  const block = css.slice(start, css.indexOf('}', start));
  return Object.fromEntries(
    [...block.matchAll(/--([\w-]+):\s*(#[0-9a-f]{6})/gi)].map((m) => [m[1], m[2]]),
  );
}

function luminance(hex) {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrast(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

const light = tokens(':root');
const dark = { ...light, ...tokens(":root[data-theme='dark']") };

// Text colours written directly in the widget styles (labels on the black bench).
const BENCH_GREYS = ['#c9c9c4', '#b5b5b0', '#a8a8a3', '#8f8f8a'];

test('the contrast formula matches known values', () => {
  assert.equal(Math.round(contrast('#000000', '#ffffff') * 10) / 10, 21);
  assert.equal(contrast('#777777', '#777777'), 1);
});

for (const [name, t] of [
  ['light', light],
  ['dark', dark],
]) {
  test(`${name} theme: reading text meets 4.5:1`, () => {
    const pairs = [
      ['ink', 'window'],
      ['quiet', 'window'],
      ['signal', 'window'],
      ['ink', 'mark-bg'],
      ['ink', 'field'],
    ];
    for (const [fg, bg] of pairs) {
      const ratio = contrast(t[fg], t[bg]);
      assert.ok(ratio >= 4.5, `${name}: ${fg} on ${bg} is ${ratio.toFixed(2)}`);
    }
  });

  test(`${name} theme: the focus ring stands out from the window (3:1)`, () => {
    assert.ok(contrast(t.focus, t.window) >= 3);
  });
}

test('the frame shared by both themes meets 4.5:1', () => {
  const pairs = [
    ['edge', 'black'],
    ['on-orange', 'orange'],
    ['orange', 'black'],
    ['orange', 'charred'],
    ['black', 'edge'],
  ];
  for (const [fg, bg] of pairs) {
    const ratio = contrast(light[fg], light[bg]);
    assert.ok(ratio >= 4.5, `${fg} on ${bg} is ${ratio.toFixed(2)}`);
  }
  for (const grey of BENCH_GREYS) {
    assert.ok(contrast(grey, light.black) >= 4.5, `${grey} on black`);
    assert.ok(contrast(grey, light.charred) >= 4.5, `${grey} on charred`);
  }
});
