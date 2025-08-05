# PNPM Usage and Enforcement

This monorepo is configured to use pnpm exclusively. Using npm, yarn, or bun for dependency management is blocked and will fail fast.

## Why pnpm

- Deterministic, content-addressable store
- Faster installs and disk efficiency
- First-class monorepo workspaces

## Getting Started

1. Ensure pnpm is available:

```bash
corepack enable
corepack prepare pnpm@9.12.3 --activate
# or:
npm i -g pnpm@9
```

2. Install dependencies for the entire workspace:

```bash
pnpm -w install
```

3. Common commands (workspace-aware):

```bash
pnpm -r build
pnpm -r dev
pnpm -r lint
pnpm -r test
pnpm -r clean
pnpm -r type-check
```

- -w / --workspace-root: run at workspace root
- -r / --recursive: run across all packages
- --filter: target specific packages (e.g. `pnpm -r --filter @focipedia/backend dev`)

## Enforcement

### Preinstall Guard

The root `package.json` wires a preinstall guard:

```json
{
  "scripts": {
    "preinstall": "node ./scripts/preinstall.js"
  }
}
```

[`scripts/preinstall.js`](scripts/preinstall.js:1) detects the package manager via env and blocks npm/yarn/bun with a clear message.

### Engines and Package Manager

- Root `package.json` defines:
  - `"packageManager": "pnpm@9.12.3"`
  - `"engines": { "node": ">=18.17.0", "pnpm": ">=9" }`
  - `"engineStrict": true`
- Each package under `apps/*` and `packages/*` declares `"engines"` for Node and pnpm.
- `.npmrc` enforces pnpm and engine checks.

### Lockfiles

Only `pnpm-lock.yaml` should be present and committed.

- `.gitignore` blocks `package-lock.json` and `yarn.lock`.
- A Husky hook is configured to block committing `package-lock.json` or `yarn.lock`.

If Husky is not installed on your machine yet, run:

```bash
pnpm prepare
```

This runs `husky install` (already wired in root `package.json`), then you can commit as usual. The hook will prevent bad lockfiles.

If Husky is not desirable in your environment, configure Git to use the optional `.githooks` directory:

```bash
git config core.hooksPath .githooks
```

The repository may provide equivalent hook scripts there to enforce the same policy.

## Workspace Scripts Guidance

Inside individual packages (apps/_, packages/_):

- Use local scripts like `dev`, `build`, `lint`, `test` without cross-invoking other packages via pnpm filters from within the package.
- Let the root orchestrate cross-package tasks with `pnpm -r` and/or `--filter`.

## Troubleshooting

- If you see "[PREINSTALL GUARD] Blocked installation via npm/yarn/bun", ensure you're running pnpm commands and that Corepack is properly activated.
- If `pnpm-lock.yaml` is missing, run:

```bash
pnpm -w install
```

to generate it at the root.
