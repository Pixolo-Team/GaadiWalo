# System Architecture

## High-Level Diagram

```text
[Web Client: Next.js Frontend]
          |
          | HTTPS (JSON)
          v
[Next.js API Routes / Backend Services]
          |
          | Supabase SDK (service role + user session context)
          v
[Supabase Postgres + Supabase Auth]
```

## Stack Decisions

| Layer | Technology |
|------|------------|
| Frontend | Next.js 16 (App Router), React 19, TypeScript strict, Tailwind v4 |
| Backend | Node.js services exposed via Next.js API routes |
| Database | Supabase Postgres |
| Auth | Supabase Auth |
| Charts | Recharts |
| Form Validation | React Hook Form + Zod |
| Data Fetching | TanStack Query |
| Hosting | Vercel |

## Communication Model

- Frontend communicates with backend through internal API routes (`/api/*`).
- Backend routes call Supabase using safe server-side credentials and role checks.
- Response pattern should stay consistent (`data`, `error`, optional `meta`).

## Environments

- Development: local app + Supabase project
- Staging: Vercel preview + staging Supabase
- Production: Vercel production + production Supabase

## Security Posture

- Supabase Auth for login/session/token lifecycle.
- Server-side role enforcement for Admin-only endpoints.
- Input validation with Zod at API boundary.
- Do not expose service role keys to client bundles.

## ADR Log

| Date | Decision | Reason | Alternatives Rejected |
|------|----------|--------|------------------------|
| 2026-05-08 | Use step-driven plan execution | Deterministic agent workflows | Free-form implementation |
| 2026-05-08 | Supabase Auth as primary auth | Faster secure auth rollout | Custom auth from scratch |
| 2026-05-08 | Next.js API routes for backend surface | Monorepo speed and shared types | Separate backend deployment initially |
