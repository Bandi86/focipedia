# @focipedia/types

Shared TypeScript types for Focipedia, consumable by both Next.js (frontend) and NestJS (backend).

## Usage

```ts
// apps/frontend or apps/backend
import type { Result, Paginated, BrandedId } from '@focipedia/types';
```

## Develop

Scripts:
- build: `tsc -p .`
- type-check: `tsc -p . --noEmit`
- clean: `rimraf dist`

## Notes

- ESM module, emits declaration files only.
- Keep this package free of runtime code beyond types/helpers for broad compatibility.