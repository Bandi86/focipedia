# Frontend design and development plan

This plan refines the frontend migration and implementation so we can start building immediately and iterate safely.

## Tech stack (latest stable)
- Next.js (App Router, RSC, Route Handlers, Middleware)
- React 19, TypeScript
- Tailwind CSS, shadcn/ui, lucide-react
- TanStack Query (+ React Query Devtools), Axios
- Zustand (local UI state only)
- react-hook-form (+ zod) for forms and validation
- i18n: react-i18next (HU default)
- Testing: Playwright (e2e), Vitest (unit/integration), MSW (API mocking)

If something is missing during implementation, we will add it (e.g., Sonner toasts, Framer Motion).

## Architecture
- apps/frontend/
  - app/ (App Router)
    - (public)/ (public routes)
    - (auth)/login, register
    - (dashboard)/(protected)
    - leagues/, teams/, players/, matches/
    - api/ (BFF Route Handlers to backend)
    - middleware.ts (auth, locale)
  - components/ (reusable UI)
  - features/ (feature slices)
  - lib/ (axios client, query client, auth helpers, i18n)
  - hooks/, utils/, types/
  - styles/ (globals.css, tailwind config)
  - tests/ (vitest), e2e/ (playwright)

## Env and config
- NEXT_PUBLIC_API_BASE_URL for public fetches; server-only env for secrets.
- Use BFF route handlers to store httpOnly cookies for tokens.

## Auth integration (BFF)
- /api/auth/* proxy to backend auth, manage cookies (access/refresh).
- Middleware protects dashboard; redirect to /login if unauthenticated.
- Axios interceptors handle 401 -> silent refresh via BFF.

## Data fetching & state
- TanStack Query for server/client fetching with SSR hydration on critical pages.
- Zustand only for UI state (modals, theme, filters).

## SEO, SSR/ISR, performance
- Next.js Metadata API; robots.txt and sitemap via Route Handlers.
- ISR for public lists; prefetch detail routes.
- loading.tsx and error.tsx per route; skeletons.

## i18n
- react-i18next with server dictionaries. HU default, EN fallback later.

## UI/Design
- Tailwind + shadcn/ui baseline, theme tokens, global styles migrated from archive where useful.

## Migration phases
1) Bootstrap & tooling
   - Add Tailwind, shadcn/ui, providers (QueryClient, i18n), global layout.
   - Setup Route Handlers (BFF) and middleware for auth.
2) Auth
   - /login, /register pages; forms with react-hook-form + zod; HU hibaüzenetek.
3) Core domain pages
   - Lists + details for leagues, teams, players, matches with pagination and SSR/ISR.
4) Dashboard
   - Protected shell; profile; placeholders for moderation queues (read-only).
5) Public UX polish
   - Skeletons, a11y, performance, Hungarian feedback strings.

## Development tasks
1) Project setup: tailwind, shadcn, layout, header/footer.
2) BFF /api/auth handlers + middleware auth flow.
3) Axios client, DTO types, React Query hooks.
4) Pages: home, lists, details; SSR/ISR; pagination UI.
5) Dashboard shell (protected), basic overview.
6) i18n pass; HU default content.
7) SEO: metadata, sitemap, robots; link prefetch.

## Testing
- Playwright e2e: auth flow, protected route, public list/detail.
- Vitest unit: components, hooks, utils (MSW for API).
- Vitest integration: forms + query hooks.
- Performance: basic Lighthouse budget.
- Accessibility: axe checks in Vitest on key pages.

## Deployment
- Vercel or container; configure envs and BFF cookies.
- GitHub Actions: lint, typecheck, build, vitest, playwright.

## Monitoring
- Optional Sentry; Web Vitals logging.

## DoD (MVP)
- Auth works end-to-end; public lists/details with SSR/ISR; dashboard shell protected; tests green; a11y/SEO baseline.