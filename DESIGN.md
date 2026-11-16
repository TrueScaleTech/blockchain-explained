---
name: Blockchain Explained
description: Six short protocol specifications on how a blockchain works, each with one figure the reader can operate.
colors:
  ground: '#f4f5f7'
  paper: '#ffffff'
  well: '#eceef2'
  ink: '#101418'
  quiet: '#4a5260'
  past: '#626a78'
  rule: '#c9ccd3'
  line: '#7b8391'
  mark-bg: '#e4e7ec'
  amber: '#ffb81c'
  on-amber: '#101418'
  amber-rule: '#a76f00'
  fail: '#b3261e'
  ok: '#0a6b43'
  bar: '#101418'
  on-bar: '#f4f5f7'
  bar-quiet: '#a9b0bd'
  ground-dark: '#0e1116'
  paper-dark: '#151a21'
  well-dark: '#0b0e13'
  ink-dark: '#e8eaee'
  quiet-dark: '#a2aab7'
  past-dark: '#8a93a1'
  rule-dark: '#2b323d'
  line-dark: '#6b7585'
  mark-bg-dark: '#222a35'
  fail-dark: '#ff8a7a'
  ok-dark: '#5fd99a'
  bar-dark: '#080a0d'
typography:
  display:
    fontFamily: 'Archivo Variable, Arial Narrow, Arial, sans-serif'
    fontSize: 'clamp(2.1rem, 4.8vw, 3.3rem)'
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: '-0.015em'
    fontVariation: "'wdth' 88"
  headline:
    fontFamily: 'Archivo Variable, Arial Narrow, Arial, sans-serif'
    fontSize: 'clamp(1.4rem, 2.4vw, 1.75rem)'
    fontWeight: 700
    lineHeight: 1.15
    fontVariation: "'wdth' 94"
  title:
    fontFamily: 'Archivo Variable, Arial Narrow, Arial, sans-serif'
    fontSize: '1.15rem'
    fontWeight: 700
    lineHeight: 1.25
  body:
    fontFamily: 'Source Serif 4 Variable, Georgia, serif'
    fontSize: '1.125rem'
    fontWeight: 400
    lineHeight: 1.6
  data:
    fontFamily: 'JetBrains Mono Variable, ui-monospace, Consolas, monospace'
    fontSize: '0.95rem'
    fontWeight: 500
    lineHeight: 1.55
    fontFeature: "'tnum'"
  label:
    fontFamily: 'JetBrains Mono Variable, ui-monospace, Consolas, monospace'
    fontSize: '0.72rem'
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: '0.1em'
rounded:
  none: '0px'
  dot: '50%'
spacing:
  xs: '6px'
  sm: '10px'
  md: '16px'
  lg: '24px'
  xl: '48px'
  gutter: 'clamp(16px, 4vw, 48px)'
components:
  button-primary:
    backgroundColor: '{colors.ink}'
    textColor: '{colors.ground}'
    typography: '{typography.label}'
    rounded: '{rounded.none}'
    padding: '10px 20px'
    height: '44px'
  button-primary-hover:
    backgroundColor: '{colors.quiet}'
  button-primary-busy:
    backgroundColor: '{colors.amber}'
    textColor: '{colors.on-amber}'
  button-ghost:
    backgroundColor: 'transparent'
    textColor: '{colors.ink}'
    rounded: '{rounded.none}'
    padding: '10px 20px'
    height: '44px'
  button-ghost-hover:
    backgroundColor: '{colors.well}'
  chip:
    backgroundColor: 'transparent'
    textColor: '{colors.ink}'
    rounded: '{rounded.none}'
    padding: '6px 12px'
    height: '40px'
  chip-chosen:
    backgroundColor: '{colors.amber}'
    textColor: '{colors.on-amber}'
  field:
    backgroundColor: '{colors.paper}'
    textColor: '{colors.ink}'
    rounded: '{rounded.none}'
    padding: '11px 13px'
  readout:
    backgroundColor: '{colors.well}'
    textColor: '{colors.ink}'
    padding: '10px 12px'
  block:
    backgroundColor: '{colors.well}'
    textColor: '{colors.ink}'
    rounded: '{rounded.none}'
    padding: '12px'
  figure-bar:
    backgroundColor: '{colors.bar}'
    textColor: '{colors.on-bar}'
    padding: '9px 16px'
  figure:
    backgroundColor: '{colors.paper}'
    textColor: '{colors.ink}'
    rounded: '{rounded.none}'
---

# Design System: Blockchain Explained

## Overview

**Creative North Star: "Protocol Spec"**

Each lesson is set as a short specification in the manner of an IETF document: a header block of facts, a contents list, numbered sections (3.1, 3.2), a figure that can be operated, and the simplifications stated as the lesson's considerations. The page is a cool paper ground with ink text, flat, ruled and square. It reads as careful, calm and professional work, never as a docs template with a grey card and a blue accent, and never as a dark neon crypto landing.

One amber marker carries all emphasis, and it only ever means two things: where you are, or what changed. Everything else is ink on paper. A failed check is vermilion plus a hatch pattern plus a word, so state never rests on colour alone. Motion is short and computing-flavoured: digits resolve, links cascade, a nonce settles like an odometer, a proof path traces upward.

The system holds in a light and a dark theme from the same token names; dark follows the system preference until the reader uses the toggle, and the toggle always wins. Nothing loads from another origin; every face is self-hosted.

**Key Characteristics:**

- Flat, ruled, square: 1px and 2px ink rules, no shadows, no rounded corners.
- Three voices: compact grotesque for headings, serif for reading, mono for data, labels and the header block.
- One amber marker, reserved for "where you are" and "what changed".
- Failed state is a hatch pattern plus a word, never colour alone.
- Layout is a three-column document: contents, reading column near 66ch, key points.

## Colors

A cool-paper neutral field with ink text, one amber marker, and vermilion held back for failure. Values below are the light theme; the `-dark` tokens in the frontmatter are the same roles in the dark theme (amber and `on-amber` are identical in both).

### Primary

- **Marker Amber** (#ffb81c): the marker. Used only for where the reader is and what changed: the current contents item's rule, the active masthead link underline, the brand mark, the changed-digit highlight, the chosen chip, chart run points and the current point, Merkle proof siblings, the busy button, the pager hover rule, the seal flash on a mined block, text selection and the skip link. Text on amber is always Marker Ink.
- **Marker Ink** (#101418): the only text colour permitted on amber.
- **Amber Underline** (#a76f00 light, #ffb81c dark): amber as a text-decoration colour on white-ish ground, darkened in the light theme so the rule keeps contrast.

### Neutral

- **Cool Paper** (#f4f5f7): page ground.
- **Sheet White** (#ffffff): figure body and fields.
- **Well Grey** (#eceef2): readouts, chain blocks, the sunken ground inside a figure.
- **Spec Ink** (#101418): text, 1-2px structural rules, the masthead bar, primary button fill.
- **Quiet Slate** (#4a5260): secondary text, labels, button hover fill.
- **Past Slate** (#626a78): lessons already behind the reader in the contents.
- **Hairline** (#c9ccd3): row dividers and section rules.
- **Control Line** (#7b8391): field borders, inactive edges, link underlines.
- **Mark Wash** (#e4e7ec): inline code ground and chip hover.
- **Masthead Quiet** (#a9b0bd): secondary text on the ink bar.

### Status

- **Check Vermilion** (#b3261e light, #ff8a7a dark): a failed check. Always paired with the hatch and a word.
- **Check Green** (#0a6b43 light, #5fd99a dark): a passing block or signature, always with a text status.

### Named Rules

**The Marker Rule.** Amber means "where you are" or "what changed" and nothing else. It is never a button fill, a decoration or a brand wash. A new surface that wants emphasis uses ink weight or an ink rule.

**The Hatch Rule.** Failure is the diagonal hatch (135deg, 1px lines every 8px in 40% vermilion) plus a word such as the block status. Colour alone is never the signal.

## Typography

**Display Font:** Archivo Variable (with Arial Narrow, Arial, sans-serif), width axis used: 88% for the page title, 94% for section and reel headings, 100% for small caps subheads.
**Body Font:** Source Serif 4 Variable (with Georgia, serif), optical sizing automatic.
**Label/Mono Font:** JetBrains Mono Variable (with ui-monospace, Consolas, monospace), tabular numerals for anything that changes.

**Character:** A compact grotesque sets the structure, a serif carries the reading, and mono is reserved for what a machine produced or a spec header would hold: hashes, numbers, labels. The three never swap roles.

### Hierarchy

- **Display** (700, clamp(2.1rem, 4.8vw, 3.3rem), 1.05, width 88%): the lesson title, one per page.
- **Headline** (700, clamp(1.4rem, 2.4vw, 1.75rem), 1.15, width 94%): numbered section headings, prefixed by a small mono number (lesson.section) and set under a 1px rule.
- **Title** (700, 1.15rem, 1.25): subsections, pager destinations (1.2rem), reel entries (up to 1.7rem).
- **Body** (400, 1.125rem, 1.6): lesson prose, capped at 66ch; the lede runs clamp(1.15rem, 1.6vw, 1.3rem) at 1.55.
- **Data** (500, 0.95rem, 1.55, tabular): hash and number readouts, wrapped with break-all.
- **Label** (500, 0.72rem, 0.1em, uppercase): field labels, status words, figure titles, the header block (0.78rem, not uppercased), contents (0.8125rem).

### Named Rules

**The Three Voices Rule.** Grotesque for headings, serif for reading, mono for data and labels. Running text is never mono, and headings are never serif.

## Layout

A document frame: a 15.5rem contents column and the document column, inside a 92rem container with a fluid gutter (16px to 48px). Below 56rem the frame collapses to one column and contents becomes a two-column list at the top (sections list hidden). From 88rem a third column of 14.5rem appears to the right, holding the key points sticky beside the text and the limits box. The reading measure is 66ch; figures run up to 56rem and size their internals with container queries (chains go 1, 2, then 4 columns at 30rem and 44rem of figure width). Vertical rhythm is rule-led: 2.4em above section headings with a 1px hairline, a 2px ink rule opening the header block, the pager and the footer. The header block is a two-column tabular mono grid that stacks below 36rem. Touch targets are 40px or more (44px for buttons).

## Elevation & Depth

Flat. There are no shadows. Depth is conveyed by ground steps (paper figure on cool-paper page, well grey sunken inside the figure) and by rules: a 1px ink border around a figure, a 2px ink top rule on notes and the header block. The one `box-shadow` in the build is an inset 1px ring inside a status glyph for the failed state. Diagrams use hatch and dashes (expected line dashed, ghost nodes dashed) instead of lift.

### Named Rules

**The Flat Paper Rule.** Surfaces are separated by ground step or by an ink or hairline rule. No drop shadows, no blur, no glow.

## Shapes

Square. Every control, field, chip, block and figure has 0 radius. The only round form is the chart run point (50%) and the circular key swatch that matches it. Rules are 1px (structure and hairlines) or 2px (header block, pager, footer, masthead link underline) with a 3px amber rule for the contents and pager emphasis. Status glyphs are small squares (8-9px), echoing the three linked blocks of the brand mark.

## Components

### Buttons

- **Shape:** square, 44px minimum height, mono uppercase label (600, 0.8125rem, 0.08em).
- **Primary:** ink fill, cool-paper text, 10px 20px padding. Hover steps the fill to Quiet Slate.
- **Ghost:** transparent with an ink border; hover fills Well Grey.
- **Busy:** amber fill with ink text and a progress cursor (it marks what is happening now).
- **Disabled:** 45% opacity, transparent, Control Line border.
- **Focus:** 2px ink outline (amber on the masthead), 2-3px offset.

### Chips

- **Style:** square, 40px high, ink border, transparent, mono 600. Hover Mark Wash.
- **State:** `aria-pressed=true` takes the amber fill with ink text: the chosen option.

### Figures (the bench)

- **Frame:** Sheet White, 1px ink border, max 56rem; an ink caption bar on top holds a numbered figure tag (outlined) and a mono uppercase title, with a quiet hint on the right.
- **Body:** 14-24px fluid padding, 18px gaps. Without JavaScript the body is hidden and a static note remains.

### Inputs / Fields

- **Style:** Sheet White ground, 1px Control Line border, 0 radius, mono 500 text, 11px 13px padding. Labels sit above in label style.
- **Focus:** 2px ink outline and an ink border.

### Readouts

- **Style:** Well Grey ground, 1px hairline, mono tabular. A changed digit is wrapped in `mark` and takes amber with ink text. Inline stats use a quiet label with a bold 1.15rem value.

### Chain block

- **Style:** Well Grey, 1px ink border, 12px padding, a mono status word with a square glyph (green for valid). Blocks join by a 2px link at wide figure widths.
- **Failed:** vermilion border and link, the Hatch Rule overlay, and the status word changes to failed with a hatched glyph. The change cascades block by block with a 90ms stagger.
- **Sealed:** a re-mined block flashes amber border and Mark Wash ground once for 600ms.

### Navigation

- **Masthead:** ink bar, 52px minimum, brand left (brand mark, then wordmark in Archivo uppercase 700, width 92%), mono uppercase links right. The current page and hovered links take a 2px amber underline. IT|EN is one link; the theme toggle is a 40px sun/moon icon button shown only when scripting runs.
- **Contents:** numbered mono list; the current item is ink, bold, with a full-width 3px amber rule drawn from the left on hover and held on the current item; finished lessons dim to Past Slate. No leaders, no page numbers.
- **Pager:** two plain text links with mono direction labels; the destination takes an amber rule on hover.

### Notes

A bordered paper box with a 2px ink top rule and a small ink square before a mono label. It is where a lesson states a simplification.

### Charts and tree diagrams

Hand-drawn SVG coloured from tokens: grid in hairline, axis in ink, expected curve dashed ink, current curve 3px ink drawn on first scroll into view, run points and the current point amber with an ink ring. In the Merkle tree the proof path is ink-filled nodes with a 3px traced edge; sibling nodes the proof needs are amber; ghost nodes are dashed.

## Do's and Don'ts

### Do:

- **Do** reserve amber (#ffb81c) for "where you are" and "what changed", and set text on it in #101418.
- **Do** pair every failed state with the hatch pattern and a word, and every pass with a text status.
- **Do** keep controls, fields, chips and figures at 0 radius, with 1px or 2px ink and hairline rules for separation.
- **Do** set hashes, numbers, labels and the header block in JetBrains Mono with tabular numerals; set reading text in Source Serif 4 at 66ch.
- **Do** keep motion under 600ms with the ease-out curve cubic-bezier(0.16, 1, 0.3, 1), and switch it all off under `prefers-reduced-motion`.
- **Do** define any new colour as a token in both the light and the dark set, and check contrast in both.
- **Do** self-host every face and asset; nothing loads from another origin.

### Don't:

- **Don't** use amber as a button fill, a card wash, a decoration or a brand colour; it is a marker.
- **Don't** convey state with colour alone.
- **Don't** add shadows, blur, gradients (beyond the amber rule and the hatch) or rounded corners.
- **Don't** set running text in mono or headings in serif.
- **Don't** return to the white docs page with a grey widget card and a blue accent, or to a dark neon crypto look.
- **Don't** add dotted leaders or page numbers to the contents.
- **Don't** add prices, market data or coin imagery; this is an explainer of the mechanism.
