# Security policy

## Reporting a vulnerability

Please report security problems privately, using GitHub's [private vulnerability reporting](https://github.com/TrueScaleTech/blockchain-explained/security/advisories/new) for this repository. Do not open a public issue for them.

## What this project is

A static website generated at build time. It has no server, no database, no accounts and no forms, so there is nothing for a visitor to log in to or submit.

## What the site does and does not do

- Every computation runs in the visitor's browser, with the browser's own Web Crypto for SHA-256 and ECDSA. Nothing typed into a widget is stored or sent anywhere.
- The signature demo creates throwaway ECDSA P-256 keys in memory. The private key is created as non-extractable, so it cannot be exported, and it disappears when the page is closed. The site never asks for real keys, seed phrases or wallets.
- No cookies, no analytics, no third-party scripts, fonts, images or APIs. A Content-Security-Policy in every page (apart from the root page, which only redirects to a language) allows scripts, styles, fonts and images only from the site itself (`default-src 'none'`, `script-src 'self'`, no inline scripts, no frames, no forms, `connect-src 'none'`).
- The CI fails if a built page loads a resource from another host or contains an inline script.
- Local storage holds only the chosen theme and the last lesson opened; both are read inside `try/catch`, and the site works when storage is blocked.
- Links to cited sources are plain external links opened with `rel="noopener noreferrer"`.

## Supply chain

- Dependencies are locked in `package-lock.json` and updated through Dependabot.
- Workflows have read-only permissions. Only the manual Pages deploy job can write, and only to Pages.
- The weekly source check sends plain GET requests to the cited sources and nothing else.

## Out of scope

Problems in the cited standards, papers, or in any blockchain software, should be reported to their maintainers.
