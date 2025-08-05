# Contributing Guide

This repository is a pnpm-based monorepo. The goals are consistent UI tokens across apps/packages and reliable developer safeguards.

## Prerequisites

- Node.js 20.x
- pnpm >= 9
- Git

## Workspace scripts

At the root:

- `pnpm -w install` — install dependencies across workspaces.
- `pnpm -w -r run build --if-present` — build all packages/apps that define a `build` script.
- `pnpm -w -r run lint --if-present` — lint all packages/apps that define a `lint` script.
- `pnpm -w -r run type-check --if-present` — run type checking where available.
- `pnpm -w -r run dev --if-present` — start dev servers.

## Pre-commit checks (Husky + lint-staged)

We use Husky and lint-staged to ensure basic quality on staged files only.

- Lockfile guard: commits fail if `package-lock.json` or `yarn.lock` are staged.
- lint-staged runs ESLint and Prettier for touched files.

Configuration summary:

- Root [`package.json`](package.json:1) contains `lint-staged` config and `prepare` script for Husky.
- Hook file at [`.husky/pre-commit`](.husky/pre-commit:1) runs the lockfile guard and then `lint-staged`.

Run locally before committing:

- Format entire repo: `pnpm format`
- Lint all (if present): `pnpm -w -r run lint --if-present`
- Type-check all (if present): `pnpm -w -r run type-check --if-present`
- Lint only staged files: `npx lint-staged`

## CI overview

GitHub Actions workflow at [`.github/workflows/ci.yml`](.github/workflows/ci.yml:1):

- Triggers on push/PR to `main`/`master`.
- Uses Node 20 and pnpm 9.
- Caches the pnpm store and installs via `pnpm -w install --frozen-lockfile`.
- Guards against npm/yarn lockfiles.
- Runs, in order: type-check, lint, build — with `--if-present` so packages without scripts are skipped.

## UI tokens and shared components

- Tailwind theme is centralized in [`apps/frontend/tailwind.config.ts`](apps/frontend/tailwind.config.ts:1), mapping Tailwind color names to CSS variables from [`apps/frontend/src/app/globals.css`](apps/frontend/src/app/globals.css:1).
- Focus-visible ring defaults are defined in globals to ensure consistent rings across packages while preserving dark mode and reduced motion preferences.

Guidelines for component authors (packages/ui):

- Use token classes (e.g., `bg-primary`, `text-foreground`, `border-input`) rather than hardcoded colors.
- Prefer `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background` for interactive elements.
- Avoid animations unless strictly necessary; rely on existing utilities which respect `prefers-reduced-motion`.

Updated examples:

- Button focus ring and variants: [`packages/ui/src/components/Button.tsx`](packages/ui/src/components/Button.tsx:1)
- Input focus ring and tokens: [`packages/ui/src/components/Input.tsx`](packages/ui/src/components/Input.tsx:1)

## Adding package scripts later

If a package is missing scripts:

- Lint: add `"lint": "eslint ."` with your project config.
- Type-check: add `"type-check": "tsc -p tsconfig.json --noEmit"`.
- Build: add the appropriate build command for your tooling.

These will then be picked up by the root `pnpm -w -r run ... --if-present` commands and CI.
