---
version: 1
slug: "src-pages-lang-lessons-slug-astro"
primary_target: "src/pages/[lang]/lessons/[slug].astro"
related_targets: ["src/pages/[lang]/index.astro","src/pages/[lang]/about.astro","src/layouts/Base.astro"]
---

# Lessons (index and lesson pages)

Scope: the whole site shell, the lesson index (`/[lang]/`), every lesson page (`/[lang]/lessons/[slug]/`) and the about page. Mode: Read.
Audience: curious newcomers and IT professionals first (owner's answer), recruiters from the portfolio second. Guided path in order, 01 to 06. Avoid: dry academic, childish or gamified. Owner's later steer: not film or cinema; a technological, professional look with motion suited to blockchain, crypto and programming.
Proof and content: six lessons, each with theory, key points, one widget computed in the browser, primary sources. No invented claims.
Constraints: no third-party loads, CSP script-src 'self', self-hosted fonts, tested contrast, reduced motion, phone width.

## Direction contract

THESIS: Each lesson is a short specification: header block, contents, numbered sections, and a figure you can operate. The simplifications are set out as its security considerations. It refuses the white docs page with a grey widget card and a blue accent, and the dark neon crypto landing.

OWN-WORLD: Cool paper ground #f4f5f7, ink #101418, one amber marker (#ffb81c) that only ever marks what changed or where you are, vermilion for a failed check. Dark theme: ink ground, paper text, same amber. Header block in tabular mono (series, lesson, category, date), headings in a compact grotesque, reading text in a serif, mono only for hashes, numbers and the header block. Contents is a plain numbered list: the current item carries a full-width amber rule, finished lessons dim, no dotted leaders. Figures are numbered boxes with an ink caption bar; an invalid block takes a hatch pattern plus a word, never colour alone.

STORY: The reader sees six numbered lessons, opens one, reads the abstract and the numbered text, then operates Figure 1: digits resolve, changed digits take the marker, a broken link cascades down the chain. They leave able to say why altering an old block is visible and expensive.

FIRST VIEWPORT: Ink bar (brand left, IT|EN and theme right). Three columns on desktop: contents left, a spec header block over the lesson title, abstract and reading column in the middle at about 66ch, key points and limits right. Figure 1 sits in the flow with its caption bar. Previous and next sit at the end as plain text links with their lesson numbers. On a phone the side columns fold into the flow.

FORM: Protocol Spec (own grounded direction, IETF-style publishing), the assigned direction chosen by the owner; seed:5568f186d65eb6bb.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

Signature interaction: digits resolve (scramble then settle) when a hash recomputes and changed digits take the amber marker; in lesson 02 a broken link cascades down the chain block by block, and re-mining a block settles its nonce like an odometer and seals the block.
Motion grammar: purposeful, short (under 600 ms), computing-flavoured: digit resolve, link cascade, nonce odometer, path trace on the Merkle proof, curve draw on the attack chart. Everything is instant under reduced motion.

## Unresolved

- The owner asked to remove the dotted leaders from the contents and keep only the amber rule on the current item (done in the contract).
