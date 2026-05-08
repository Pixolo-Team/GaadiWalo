# GaadiWalo – Claude Agent Instructions

This is the root instruction file for Claude-like agents.

## Recommended Agentic Structure

Use **one root `CLAUDE.md`** as the global policy file.
Do **not** create one `CLAUDE.md` per step folder by default.

Best practice:
- Keep global rules in root `CLAUDE.md` and root `AGENTS.md`.
- Keep execution details in `plans/...` step files.
- Add folder-level agent docs only when a domain has truly different rules (rare).

This gives maximum consistency across agents and fastest delivery.

## Project Context

GaadiWalo is an end-to-end car sales CRM.

- Frontend: Next.js 16 App Router UI for Sales and Admin roles
- Backend: Node.js + Supabase
- Auth: Supabase Auth (primary)
- API: Next.js API routes (yes)
- Monorepo approach: frontend + backend + plans in one repo

## Monorepo Layout

```
GaadiWalo/
├── app/
│   ├── frontend/
│   └── backend/
├── plans/
│   ├── frontend/implementation-steps/
│   └── backend/
├── .github/
│   ├── copilot-instructions.md
│   └── skills/
│       ├── next-best-practices/
│       └── vercel-react-best-practices/
├── AGENTS.md
└── CLAUDE.md
```

## Execution Workflow (Step-by-Step)

1. Read `plans/project-overview.md`.
2. Read one specific target step (`plans/frontend/implementation-steps/Step-*.md` or backend plan).
3. Implement only that step scope.
4. Run validation checks.
5. Update step/plan notes if requirements changed.
6. Move to next step only after current scope is stable.

## Frontend Rules (Mandatory)

- Scope: `apps/frontend`
- Imports: `@/*` only
- Naming:
  - API/DB calls: `*Request`
  - Business logic: `*Service`
  - Types/interfaces: `*Data`
- JSDoc required on all exports
- No `console.*`
- Explicit error handling required
- No hardcoded business constants
- Use `next/image`, `next/link`, `router.push()`
- React section order comments required:
  - `// Define Navigation`
  - `// Define Context`
  - `// Define Refs`
  - `// Define States`
  - `// Helper Functions`
  - `// Use Effects`

## Backend Rules (Node + Supabase)

- Use Supabase Auth as the default auth path.
- Keep auth/session verification server-side.
- Keep service layer separate from request/data access layer.
- Use typed safe response structures and explicit errors.
- Avoid direct frontend coupling to Supabase secrets.

## Next.js Rules Source of Truth

Always apply these before implementation:

- `.github/copilot-instructions.md`
- `.github/skills/next-best-practices/SKILL.md`
- `.github/skills/vercel-react-best-practices/SKILL.md`

## Conflict Resolution Priority

1. Current user task
2. Root `CLAUDE.md` / `AGENTS.md`
3. `.github` rules
4. Individual step markdown files

## Path Adaptation for Imported Step Files

If a step file says `src/...`, map it to:

- `apps/frontend/src/...` (frontend)
- `apps/backend/src/...` (backend, when applicable)

## Delivery Standard

- Production-ready only
- No placeholders
- No unused code
- No unrelated refactors
