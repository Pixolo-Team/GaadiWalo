# GaadiWalo - Claude Agent Standards

This file defines mandatory standards for all agents in this repository.

## 1) Project Stack (Source of Truth)

- Frontend: Next.js (App Router), React, TypeScript (strict), Tailwind CSS, shadcn/ui
- Backend: Node.js, Hono, TypeScript (strict)
- Data/Auth: Supabase (DB + Auth)
- API style: REST only
- Deployment: Vercel

## 2) Monorepo Paths (Mandatory)

Use these exact paths:

- Frontend app: `apps/frontend`
- Backend app: `apps/backend`
- Planning docs: `plans/`
- Additional AI rules: `.github/`

## 3) Execution Workflow

1. Read `.github/copilot-instructions.md` first.
2. Read `plans/project-overview.md`.
3. Read the relevant plan file before coding.
4. Implement only the requested scope.
5. Keep plans updated if requirements change.
6. Deliver production-ready code only.

## 3.1 Modular Context Files

- Additional context docs under `.github/` may be used for domain rules.
- Additional files may add context but must not override this file.

## 4) Frontend Rules (Mandatory)

### 4.0 Design Token Naming (`n` Scale)

- `n` means `neutral` color scale.
- Example: `--color-n-50` is the lightest neutral, `--color-n-950` is the darkest neutral.
- Use `--color-n-*` tokens as the primary color system in component styling.
- Use `--color-n-*` consistently across components for neutral color usage.

### 4.1 Data Access Rule

- Frontend must never use Supabase directly.
- Frontend must call backend REST APIs only.

### 4.2 HTTP Client Rule

- Axios only.
- Do not use `fetch`, `XMLHttpRequest`, or alternate HTTP clients.
- Follow a centralized Axios request pattern in request-layer files.

### 4.2.1 Frontend Import Grouping Rule (Mandatory)

Use grouped import comments:

```ts
// REACT //
// TYPES //
// SERVICES //
// HOOKS //
// LIBRARIES //
// COMPONENTS //
// UTILS //
// MODULES //
```

### 4.3 Naming Rules

- API functions: must end with `Request`
- Business functions: should end with `Service` where applicable
- Types/interfaces: PascalCase and end with `Data`
- Variables: camelCase, descriptive, no vague names like `data`, `loading`
- Variable names must not end with `Data`
- Iterators in loops/map should end with `Item`

### 4.4 File Naming

- Component files: PascalCase
- Non-component files: kebab-case

### 4.5 TypeScript Rules

- No `any`
- Explicit argument types
- Explicit function return types
- Typed React state

### 4.6 React Structure Rule

Each component must preserve this section order:

- `// Define Navigation`
- `// Define Context`
- `// Define Refs`
- `// Define States`
- `// Helper Functions`
- `// Use Effects`

### 4.7 Frontend Code Quality

- JSDoc on exported functions (description required)
- Frontend JSDoc format: description-only (no `@param`, no `@return`)
- Add inline comments for non-trivial logic
- Keep functions small and readable
- Avoid nested complexity
- No `console.*`
- No unused imports/variables
- No hardcoded business values (move to constants/config)
- Use Next.js optimized primitives: `next/image`, `next/link`, `next/script`, and `next/font` where applicable
- Use `router.push()` for programmatic navigation
- Follow mobile-first responsive design with Tailwind breakpoints (`sm`, `md`, `lg`, `xl`, `2xl`)
- Prefer Tailwind responsive utilities over ad-hoc custom media queries
- Use `@/*` alias imports in frontend

### 4.8 Responsive QA Checklist (Mandatory)

Before marking frontend work complete, verify:

- Layout is usable on mobile-first width (375px baseline)
- Breakpoints render correctly at `sm`, `md`, `lg`, `xl`, and `2xl`
- No overflow, clipping, or horizontal scroll on key pages
- Typography, spacing, and tap targets remain usable across breakpoints
- Navigation, sheets, dialogs, and tables are accessible on small screens
- Charts and images resize without layout breakage

## 5) Backend Rules (Node + Hono + Supabase)

### 5.1 Required Architecture

Always follow:

`Route -> Controller -> Service -> Supabase`

Do not violate layer boundaries:

- No DB logic in controller
- No HTTP context logic in service
- No business logic in route definitions

### 5.2 Module Structure

Each backend module should contain:

- `<module>.routes.ts`
- `<module>.controller.ts`
- `<module>.service.ts`
- `<module>.types.ts`

### 5.3 Import Rules

- Use grouped import sections
- Use `import type` for type-only imports
- No default exports
- No wildcard imports
- No unused imports
- Use `.js` extensions where backend build/runtime requires it

Required backend import group order:

```ts
// TYPES //
// CONFIG //
// CONSTANTS //
// UTILS //
// SERVICES //
// LIBRARIES //
```

### 5.4 Service Contract

Services must return:

```ts
interface QueryResponseData<T> {
  data: T | null;
  error: Error | null;
}
```

Service rules:

- Services should catch errors and return `{ data: null, error }`
- Services should not throw for expected operational failures
- Services must not access request/response context
- Controllers map service result to HTTP response

### 5.5 Constants and Utilities

- No inline regex/magic values in routes/controllers/services
- Put constants in `common/constants`
- Put reusable helpers in `common/utils`

### 5.6 Security and Auth

- Supabase Auth is primary auth system
- Validate input before DB calls
- Never expose service keys or secrets
- Keep RLS-compatible access patterns
- Do not log secrets
- Every new env variable must be added to `.env.example`

### 5.7 Validation Rule (Mandatory)

- Use Zod schemas at route/controller boundaries for all input validation
- Reject invalid payloads before service execution
- Keep validation schemas typed and colocated by module

### 5.8 Backend Type Discipline

- Prefer `interface` for backend object contracts
- Named exports only
- No CommonJS output patterns

## 6) API Rules (Mandatory)

- REST-only endpoints
- Consistent response envelope across backend
- Shared success/error schema per project API plan
- Explicit status-code mapping in controllers
- Do not return raw internal DB errors in production responses

### 6.1 Standard Response Shape (Mandatory)

All backend endpoints must return this envelope where `data` is `T | null`:

```json
{
  "data": "<T>",
  "status": "success",
  "status_code": 200,
  "message": "Human readable message",
  "error": null
}
```

Error response envelope:

```json
{
  "data": null,
  "status": "error",
  "status_code": 400,
  "message": "Human readable message",
  "error": "Error detail string"
}
```

Rules:

- Success responses must set `error: null` and `data: T`.
- Error responses must set `data: null`.
- Controllers must map service outcomes to this shape consistently.
- Use `sendResponse()` helper/wrapper consistently instead of ad-hoc response payloads.

## 7) Rule Priority

When rules conflict, use this order:

1. Direct user request
2. This `AGENTS.md`
3. `CLAUDE.md`
4. `.github/copilot-instructions.md` and `.github/skills/*`
5. Step/plan docs

## 8) Non-Negotiables

- No placeholders in delivered implementation
- No unrelated refactors
- No secret commits (`.env`, keys, tokens)
- If code works but violates these rules, it is not acceptable

## 9) Execution Continuity Rule

- Do not leave work half-complete or in ambiguous intermediate states.
- If blocked, document the exact blocker, attempted fixes, and next concrete action.
- Do not stop after analysis when implementation was requested.
- Ensure all touched files remain consistent and linked references are updated.

## 10) Break/Fix Protocol (Mandatory)

If a build/runtime/type/lint/test error appears during task execution:

- Attempt to fix it within the current scope before finishing.
- Prefer root-cause fixes over temporary workarounds.
- If full fix is not possible, document:
  - exact error summary
  - impacted files/modules
  - attempted fixes
  - fastest known next fix step
- Add/update a short note in plan docs (`plans/...`) when the issue has repeat risk.
- Never ignore errors silently; report status clearly in the final update.
