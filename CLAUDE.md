# mail_box_types - AI Development Guide

> **Git policy — never auto-commit or auto-push.** Leave work in the working tree.
> Run `git commit`, `git push`, or `gh pr create` **only when the user explicitly asks in
> that turn**. Approval for an earlier change does not carry forward, and finishing a task is
> not permission to commit it. Stay on the current branch; do not create feature branches.

## Overview

`@sudobility/mail_box_types` is a **types-only TypeScript library** for the Mail Box / 0xMail
protocol. It ships type definitions, enums, type guards, and small factory/helper functions for
four domains: the blockchain **Indexer** API, the **WildDuck** mail server (REST + WebSocket),
**KYC**/Sumsub identity verification, and multi-chain **mailer** smart-contract responses (EVM +
Solana). All runtime values (enums, `is*` guards, `create*` factories, helper consts) ship
alongside the pure types.

- **Package manager**: Bun only — use `bun`/`bun run`, never `npm`.
- **Module format**: **ESM only.** `build` runs `tsc -p tsconfig.esm.json` -> `dist/index.js`
  + `dist/index.d.ts` (with source + declaration maps). There is **no CommonJS/`.cjs` build**;
  `package.json` `exports` exposes only `import`/`types`. (Do not describe this package as dual
  ESM+CJS — that is wrong.)
- **License**: BUSL-1.1.

## Registry / publishing (non-obvious)

- Published to **GitHub Packages**, not public npm. `.npmrc` sets
  `@sudobility:registry=https://npm.pkg.github.com`. Installing `@sudobility/*` deps requires a
  token with `read:packages` (CI uses secret `GH_PACKAGES_READ_TOKEN`).
- Publishing is handled by CI (`.github/workflows/ci-cd.yml`, reusable
  `johnqh/workflows` with `publish-target: github`) on push to `main`/`develop`. `prepublishOnly`
  runs `clean` + `verify`.

## Commands (all verified)

```bash
bun install
bun run typecheck      # tsc --noEmit
bun run lint           # eslint src --ext .ts
bun run lint:fix
bun run format         # prettier --write
bun run format:check
bun run test:unit      # vitest run (NOTE: script is test:unit — there is NO `bun run test`)
bun run test:watch
bun run test:coverage  # v8 provider
bun run build          # tsc -p tsconfig.esm.json -> dist/ (ESM only)
bun run clean          # rimraf dist
bun run verify         # typecheck + lint + test:unit + build  (run before publishing)
bun run dev            # tsc --watch
```

Current state: `typecheck`, `lint`, `build` clean; `test:unit` = 368 tests across 5 files passing.

## Structure

```
src/
  index.ts                 # re-exports ./types
  types/
    index.ts               # barrel: re-exports all 4 modules
    indexer/               # indexer-responses.ts (~50 types), indexer-guards.ts (25 `is*` guards), index.ts, *.test.ts
    wildduck/              # wildduck-types.ts (REST, ~80 types), wildduck-websocket-types.ts (WS, ~50 types), index.ts, *.test.ts
    kyc/                   # kyc-types.ts (~25 interfaces + 6 enums), index.ts, kyc-types.test.ts
    mailer/                # mail-types.ts (~25 interfaces + 3 enums), index.ts, mail-types.test.ts
```

Each module: `*-types.ts` holds interfaces/enums/factories; guards are **co-located in the type
file for wildduck/kyc/mailer** but live in a **separate `indexer-guards.ts`** for indexer. Each
module has an `index.ts` barrel; tests are co-located `*.test.ts`.

## Conventions

- **Named exports only** — no default exports. Pure types via `export type`/`export interface`;
  runtime values via `export function`/`export const`/`export enum`.
- Indexer `is*` guards are `export function`; wildduck REST guards (`isWildduckAuthResponse`,
  `isWildduckMessage`) and helpers (`EmailFolderUtils`) are `export const`.
- Naming: interfaces PascalCase domain-prefixed (`Indexer*`, `Wildduck*`, `KYC*`); guards
  `isXxx`; factories `createXxx`; requests `*Request`, responses `*Response`, paginated entries
  `*ListItem`.
- **Response shapes differ per domain**: indexer wraps data in `ApiResponse<T>` (from
  `@sudobility/types`); wildduck uses `{ success: boolean; ... }`; mailer extends
  `TransactionReceipt`/`BaseTransactionResponse` for chain ops and `BaseResponse`/
  `PaginatedResponse` (from `@sudobility/types`) for queries.
- Intra-package imports use explicit `.js` extensions (e.g. `./types/index.js`) — required for
  ESM resolution; keep them.

## Gotchas

- `@sudobility/types` is a **peerDependency** (`^1.9.78`) and also devDependency. Shared utility
  types (`Optional`, `ChainType`, `WalletData`, `ApiResponse`, `BaseResponse`,
  `PaginatedResponse`, `MessageBase`, `UnifiedError`) come from it — import from there, do not
  redefine.
- **Two eslint configs exist**: `eslint.config.js` is the active flat config ESLint loads;
  `eslint.config.mjs` is stale/unused — edit `eslint.config.js`.
- Prettier (`.prettierrc`): single quotes, semicolons, `trailingComma: es5`, 80-col, 2-space.
- tsconfig: `strict`, `target ES2020`, `moduleResolution bundler`, `isolatedModules`; base
  `tsconfig.json` has `noEmit: true` (typecheck), `tsconfig.esm.json` flips `noEmit: false` +
  `declaration` for the build. `*.test.ts`/`*.spec.ts` are excluded from compilation.
- Coverage (`vitest.config.ts`) excludes `*.test.ts` and `index.ts` barrels.

## Adding types

1. Edit the module's `*-types.ts` (indexer guards go in `indexer-guards.ts`).
2. Re-export from that module's `index.ts`; new modules also need `export * from './mod';` in
   `src/types/index.ts`.
3. Add `is*`/`create*` following the conventions; write/extend the co-located `*.test.ts`
   (cover guards with valid + invalid/partial/null inputs, factory defaults, enum string values).
4. `bun run verify`.

See `plans/IMPROVEMENTS.md` for the standing improvement backlog.
