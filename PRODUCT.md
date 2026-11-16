# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

A mixed audience, none privileged: people who keep hearing about blockchain and want to understand how it actually works, without hype; students and IT professionals who know some programming or networking and want the mechanism, not the marketing; and recruiters or technical leads arriving from the owner's portfolio, who judge the owner's ability to explain a technical subject clearly and build careful interactive work. Readers are Italian and international (the site is bilingual, Italian and English).

## Product Purpose

A short, interactive explanation of how a blockchain works, built up in layers: hashing, blocks and the chain, mining (proof of work), Merkle trees, digital signatures, and consensus with the 51% attack. Each lesson pairs brief theory with a widget the reader can operate (change one character and watch the hash change, alter a block and watch the chain break). It exists to make the mechanism tangible in a few minutes per lesson, and to show the owner's ability to explain and build. Success: a reader can explain in their own words why altering an old block is detectable and expensive; a visitor from the portfolio sees careful, correct, professional work.

## Positioning

An explainer of the mechanism, not a crypto site: no prices, no coins to buy, no market data, no predictions, no opinions on investing. Every interactive result is computed in the reader's browser by small, tested functions whose outputs are checked against published reference values (NIST test vectors, Bitcoin block data, the table in the Bitcoin whitepaper). It is private by construction: no cookies, no analytics, no third-party scripts, fonts, images or APIs.

## Operating Context

Static site on GitHub Pages, published from the public repository `TrueScaleTech/blockchain-explained` with a manual deploy. Visited mostly via a link from the owner's portfolio or GitHub profile, on desktop and phone. Lessons are maintained as one MDX file per lesson and per language; a weekly job checks that the cited sources still exist.

## Capabilities and Constraints

- Six lessons in the first version, in a fixed order: hashing, blocks and chain, mining, Merkle trees, digital signatures, consensus and the 51% attack.
- Each lesson has a short theory text, key points, an interactive widget and a list of primary sources (whitepapers, BIPs, official documentation, standards).
- Widgets run entirely in the browser. The hash uses the browser's built-in Web Crypto; signatures use throwaway ECDSA P-256 keys that live only in memory and are never stored or sent. The text says plainly that Bitcoin and Ethereum use the secp256k1 curve and that the principle is the same.
- Widgets are an enhancement: without JavaScript every lesson's text and a static figure remain readable, and no dead controls appear.
- Nothing is loaded from another origin. A Content-Security-Policy allows only the site's own files, and CI fails if a built page loads anything from another host.
- Never: prices or market data, financial or investment advice, wallets, real private keys or seed phrases, transactions, accounts, comments, cookies, analytics, or embedded third-party content.
- Simplifications are stated where they are made (for example, the toy chain uses a hex-zero difficulty instead of Bitcoin's compact target).
- Code, comments and documentation in English; user-facing text in Italian and English.

## Brand Commitments

The site is presented as the owner's professional work, linked from the portfolio and the TrueScaleTech profile, so it must read as carefully made, accurate and calm. It is an independent educational project, not affiliated with or endorsed by any blockchain project, foundation or company, and says so. The theory text is a neutral, textbook-style draft written with AI assistance: it never speaks in the owner's first person, and the README declares the AI assistance.

## Evidence on Hand

The reference values come from public sources and must be cited: NIST SHA-256 examples, the Bitcoin genesis block and a public block with a known Merkle root, and the attacker-success table in section 11 of the Bitcoin whitepaper. No testimonials, usage numbers or endorsements exist and none may be invented.

## Product Principles

1. Correct before clever: every number a widget shows is produced by a tested function, and the tests use published reference values.
2. Touch the mechanism: each concept has one thing the reader can change and see the consequence of.
3. Short layers: each lesson builds on the previous one and can be read in a few minutes.
4. Honest about simplifications: the page says where the toy differs from the real system.
5. Private and light by construction: nothing loads from elsewhere, nothing is stored about the reader.

## Accessibility & Inclusion

Practical baseline: every widget is operable by keyboard with visible focus, results are announced to screen readers (`aria-live`), colour is never the only signal (broken blocks also carry a label), contrast is tested for light and dark themes, reduced motion is respected, and the Italian and English pages carry correct language attributes.
