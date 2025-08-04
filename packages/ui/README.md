# @focipedia/ui

Shared UI primitives for Focipedia, designed for Next.js projects with Tailwind and shadcn-style patterns.

## Installation

This package is a local workspace. Ensure your Next.js app has peer deps installed:
- react, react-dom, next
- tailwindcss
- class-variance-authority
- clsx
- tailwind-merge

## Usage

```tsx
import { Button, Input, cn } from '@focipedia/ui';

export default function Page() {
  return (
    <div className="p-4">
      <Button variant="default" size="md">Click</Button>
      <Input placeholder="Your name" className="mt-2" />
    </div>
  );
}
```

## Develop

Scripts:
- build: `tsc -p .`
- type-check: `tsc -p . --noEmit`
- clean: `rimraf dist`

Notes:
- Components are minimal and unopinionated; extend per design system needs.