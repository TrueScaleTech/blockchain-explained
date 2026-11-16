# Contributing

Corrections, clearer explanations and bug reports are welcome. The choice of lessons is decided by the maintainer.

## Set up

You need Node.js 22 or newer.

```bash
npm install
npm run dev
```

## Before sending a change

```bash
npm run format:check && npm run check && npm test && npm run build
```

Run `npm run format` to fix formatting. The CI runs the same steps on Linux and Windows.

## House rules

- Code, comments, commits and documentation are in English. Every lesson exists in English and Italian, with the same order, widget and sources.
- Commits follow Conventional Commits (`feat:`, `fix:`, `docs:`, `test:`, `ci:`, `chore:`), one change per commit, with the reason in the message.
- Every number a widget shows comes from a pure function in `src/lib/` with a test. Prefer tests against published reference values (standards, test vectors, real block data) over values computed by the code itself.
- Widgets render a correct starting state at build time and show their controls only when their script runs.
- No inline scripts, no third-party scripts, fonts, images or APIs, no trackers. The Content-Security-Policy and the CI check exist to keep the site that way.
- Colours come from the tokens in `src/styles/global.css`; the contrast test must keep passing in both themes.
- Say where a lesson simplifies the real system.

## Adding or changing a lesson

Lessons live in `src/content/lessons/<en|it>/NN-slug.mdx`. The frontmatter gives the title, a summary, two to five key points, the widget and at least one primary source (specifications, papers, official documentation). In the text, `<Widget />` places the lesson's widget and `<Note label="…">` adds a note such as a simplification.

## Out of scope

Prices, market data, investment opinions, wallets, real keys or seed phrases, accounts, comments, and embedded third-party content.
