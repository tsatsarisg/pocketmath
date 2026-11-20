# PocketMath

A Greek tax calculator for employees, sole proprietors, mplokaki workers,
single-member IKE owners and general partners of an E.E. with one limited
partner. The comparison opens with the offer and optional shared expenses.
It starts from a full-year, first-opening scenario and offers E.E. as an option.

## Development

Use Node.js 24.22.1 (the current Node 24 LTS patch, pinned in `.nvmrc`) and
Corepack with the integrity-pinned pnpm 12.14.0 from `package.json`.

On macOS with Homebrew:

```sh
brew upgrade node@24
node --version     # Must satisfy engines.node in package.json
corepack enable
pnpm install --frozen-lockfile
pnpm dev
```

If you use nvm instead, `nvm install` and `nvm use` read the same `.nvmrc` pin.

Open http://localhost:3000. React, Next.js, Zod, and all other dependencies use
exact versions. TypeScript 7 checks application code, configuration, and tests;
[Oxlint](https://oxc.rs/docs/guide/usage/linter/type-aware.html) runs strict
type-aware rules plus the React Hooks compiler rules.
`eslint-plugin-react-hooks` is loaded by Oxlint and does not require ESLint.

```sh
pnpm typecheck      # Generate Next route types, then run TypeScript
pnpm lint          # Zero warnings; unsafe types and unhandled promises are errors
pnpm lint:fix
pnpm format:check
pnpm format
pnpm test
pnpm check         # Types, lint, formatting, tests, and production build
pnpm build:pages   # Also verify the GitHub Pages static export before shipping
pnpm assets:generate
```

## Dependency maintenance

[Supply-chain policy](https://pnpm.io/supply-chain-security) lives in
`pnpm-workspace.yaml`: seven-day release quarantine,
exact versions, strict engines and peers, blocked exotic subdependencies,
provenance downgrade protection, and explicitly denied lifecycle builds. Do not
bypass the quarantine or allow build scripts to make an upgrade pass. New build
script requests need inspection; use prebuilt optional platform packages when
available. Node security patches and pnpm upgrades are reviewed separately.

```sh
pnpm deps:check
pnpm update --latest
pnpm audit
pnpm check
pnpm build:pages
pnpm install --frozen-lockfile
```

Review manifests and the lockfile together, including peer compatibility and any
new lifecycle scripts. An upstream latest release can remain quarantined: keep
the newest eligible release instead of adding exclusions. Keep `@types/node` on
the Node 24 line. For pnpm upgrades, update the integrity-pinned `packageManager`
and `engines.pnpm` together. For Node upgrades, update `.nvmrc` and
`engines.node`; both GitHub workflows read `.nvmrc`.

The shadcn CLI and Testing Library packages are unnecessary for this project.
The UI components are local source, their Base UI state variants live in
`src/app/globals.css`, and tests use Vitest with React's server renderer.
Sharp remains required by the asset-generation script. Vite is an explicit
Vitest 5 peer dependency; optional browser-mocking and ESLint peers are not
installed.

## Project structure

- `src/components/`: local React UI components
- `src/lib/tax/`: tax calculations and regression tests
- `src/app/`: Next.js routes, layouts, and styles
- `src/i18n/`: Greek and English translations
- `docs/tax-formulas.md`: calculation documentation

GitHub Pages uses `GITHUB_PAGES=true` to export the `/pocketmath` subpath;
normal development and server builds use the root path.

## Security boundary

The GitHub Pages build runs calculations in browser memory. The app has no
backend or analytics. Only language and theme preferences are stored locally.

`pnpm build:pages` hashes the inline scripts in the generated HTML and places the
CSP before page scripts. Inline styles support the UI. GitHub Pages serves the
CSP as HTML metadata. Frame-embedding protection for the application itself
requires an HTTP response header at the hosting layer. The server build and
hosts that support `_headers` have their own header configuration.

The deployment workflow checks the lockfile for high and critical npm advisories
before uploading the site.
