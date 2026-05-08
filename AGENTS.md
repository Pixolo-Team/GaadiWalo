# GaadiWalo – Codex Agent Instructions

This is the root instruction file for Codex-like agents.

## Product Context

GaadiWalo is a full CRM workflow for automobile sales teams.

- Frontend: role-based CRM UI (Sales + Admin)
- Backend: Node.js + Supabase (DB + Supabase Auth)
- API surface: Next.js API routes (monorepo backend interface)

## Monorepo Layout

```
GaadiWalo/
├── app/
│   ├── frontend/  # Next.js 16 + React 19 + TypeScript + Tailwind v4
│   └── backend/   # Node services + Supabase integration
├── plans/
│   ├── frontend/
│   │   └── implementation-steps/
│   └── backend/
├── .github/
│   ├── copilot-instructions.md
│   └── skills/
│       ├── next-best-practices/
│       └── vercel-react-best-practices/
├── AGENTS.md
└── CLAUDE.md
```

## Required Workflow

1. Read `plans/project-overview.md`.
2. Read the relevant step from `plans/frontend/implementation-steps/` (or backend plans).
3. Implement only that scoped step.
4. Update plan files if requirements change.
5. Keep changes production-ready (no placeholders, no unused code).

## Frontend Standards (Mandatory)

- Scope by default: `apps/frontend`.
- Use `@/*` imports only (maps to `src/*`).
- Naming:
  - `*Request` for API/HTTP/DB functions
  - `*Service` for business logic
  - `*Data` for DTO/types/interfaces
  - Functions: camelCase + verb-first
  - Files: kebab-case (non-components), PascalCase (components)
- JSDoc on all exports.
- No `console.*`.
- Explicit error handling only.
- No hardcoded business values; use constants/config.
- Use `next/image`, `next/link`, and `router.push()`.
- React component section order/comments must be preserved:
  - `// Define Navigation`
  - `// Define Context`
  - `// Define Refs`
  - `// Define States`
  - `// Helper Functions`
  - `// Use Effects`

## Next.js Rule Sources (Mandatory)

Before writing Next.js code, follow:

- `.github/copilot-instructions.md`
- `.github/skills/next-best-practices/SKILL.md`
- `.github/skills/vercel-react-best-practices/SKILL.md`

If a conflict exists, priority is:
1. User task requirement
2. Root `AGENTS.md` / `CLAUDE.md`
3. `.github` Next.js skill rules
4. Step document details

## Step Document Path Adaptation

Imported step docs often reference `src/...` paths.
In this repo, resolve those as `apps/frontend/src/...`.

## Backend Standards (Node + Supabase)

- Use Supabase Auth as the default authentication system.
- Keep Supabase access in backend/server layers; avoid leaking secrets/client misuse.
- Keep business logic in services and data access in request/repository boundaries.
- Use safe typed responses and explicit error handling.

## Guardrails

- Never commit secrets or `.env` values.
- Never downgrade dependencies without explicit approval.
- No unrelated refactors.
