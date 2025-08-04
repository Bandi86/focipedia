# @focipedia/utils

Isomorphic, runtime-safe utilities for Focipedia. Uses `zod` for validation. Designed to be shared by both Next.js (frontend) and NestJS (backend).

## Usage

```ts
import { emailSchema, passwordSchema, getEnvOrThrow } from '@focipedia/utils';
```

## Develop

Scripts:
- build: `tsc -p .`
- type-check: `tsc -p . --noEmit`
- clean: `rimraf dist`

Notes:
- Avoid Node-specific APIs by default to keep utilities portable (browser/server).
- Validation helpers are intentionally minimal and can be extended per PRD.