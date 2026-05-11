# Frontend – Overview

## Stack

- Next.js 16 (App Router)
- React 19
- TypeScript strict
- Tailwind CSS v4
- shadcn/ui
- React Hook Form + Zod
- TanStack Query
- Recharts

## Package Manager and Scripts

Run from `apps/frontend`:

- Install: `npm install`
- Dev: `npm run dev`
- Build: `npm run build`
- Lint: `npm run lint`
- Test: `npm run test` (when configured)

## Folder Layout

```text
<!-- AUTO_FRONTEND_STRUCTURE_START -->
frontend/
<!-- AUTO_FRONTEND_STRUCTURE_END -->
```

## Routing Strategy

- App Router route groups by role:
  - `(auth)`
  - `(sales)`
  - `(admin)`
- Dynamic routes for detail pages, e.g. `[id]`.
- Route guards enforced by auth role context.

## State Strategy

- Server state: TanStack Query.
- Local UI state: React state/hooks.
- Shared/auth context only when needed globally.

## Styling Strategy

- Tailwind utilities first.
- Reusable variants with `cva` + `clsx` + `tailwind-merge`.
- Follow status colors and design tokens from step docs.

## Environment Variables

- Use `.env.example` as source of truth.
- Public frontend keys must use `NEXT_PUBLIC_*` prefix.

## Execution Rule

Implement frontend in strict order from:

- `plans/frontend/implementation-steps/README.md`
