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

test('the contrast formula matches known values', () => {
  assert.equal(Math.round(contrast('#000000', '#ffffff') * 10) / 10, 21);
  assert.equal(contrast('#777777', '#777777'), 1);
});

for (const [name, t] of [
  ['light', light],
  ['dark', dark],
]) {
  test(`${name} theme: text meets 4.5:1 on every surface it is set on`, () => {
    const pairs = [
      ['ink', 'ground'],
      ['ink', 'paper'],
      ['ink', 'well'],
      ['ink', 'mark-bg'],
      ['quiet', 'ground'],
      ['quiet', 'paper'],
      ['quiet', 'well'],
      ['past', 'ground'],
      ['fail', 'paper'],
      ['fail', 'well'],
      ['ok', 'paper'],
      ['ok', 'well'],
      ['on-bar', 'bar'],
      ['bar-quiet', 'bar'],
      ['on-amber', 'amber'],
    ];
    for (const [fg, bg] of pairs) {
      const ratio = contrast(t[fg], t[bg]);
      assert.ok(ratio >= 4.5, `${name}: ${fg} on ${bg} is ${ratio.toFixed(2)}`);
    }
  });

  test(`${name} theme: borders, rules under links and the focus ring meet 3:1`, () => {
    const pairs = [
      ['line', 'paper'],
      ['line', 'ground'],
      ['amber-rule', 'ground'],
      ['amber-rule', 'paper'],
      ['focus', 'ground'],
      ['focus', 'paper'],
      ['amber', 'bar'],
    ];
    for (const [fg, bg] of pairs) {
      const ratio = contrast(t[fg], t[bg]);
      assert.ok(ratio >= 3, `${name}: ${fg} on ${bg} is ${ratio.toFixed(2)}`);
    }
  });
}
