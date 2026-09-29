# Contributing to Merid

Thank you for helping. This guide explains how the repository is organised and what a pull request needs to be merged.

## Ground rules

- Be kind. Everyone taking part follows the [Code of Conduct](CODE_OF_CONDUCT.md).
- Read [`DESIGN.md`](DESIGN.md) before touching components or styles. It is the binding design contract: if a value is not a token, derive it from an existing one — do not invent new colours, radii or shadows.
- For a new component or a public API change, open an issue first so the API can be agreed before you write code.

## Repository layout

```
packages/react   @merid/react — components, CSS, tokens, font
apps/docs        documentation site (Next.js + MDX), port 3210
.changeset       pending release notes
```

## Setup

Requires Node.js 20 (see `.nvmrc`).

```bash
git clone https://github.com/ahmetcantryk/merid.git
cd merid
npm install
npm run dev
```

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Runs the documentation site |
| `npm run lint` | ESLint and Stylelint in every workspace |
| `npm run typecheck` | TypeScript in every workspace |
| `npm test` | Vitest with Testing Library and axe |
| `npm run build` | Builds the package, then the docs |

## Writing components

- Semantic HTML first; ARIA only where no native element fits. Follow the WAI-ARIA Authoring Practices pattern and document the keyboard interactions.
- Class names use the `mrd-` prefix. Variants and states are data attributes, never modifier classes.
- All CSS goes inside `@layer merid.components` and uses tokens only.
- Support controlled and uncontrolled use, forward refs and merge `className`.
- Tests cover behaviour, keyboard interaction and an axe check for each state.
- Check light and dark themes, 200% zoom and `prefers-reduced-motion`.

## Commits and changesets

Commit messages follow Conventional Commits (`feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`).

Any change to the published package needs a changeset:

```bash
npx changeset
```

## Pull requests

Fill in the pull request template. CI must pass. A maintainer reviews for API, accessibility and adherence to the design contract; expect questions rather than silent rejection.

## Licence

By contributing you agree that your contributions are licensed under the [MIT License](LICENSE).
