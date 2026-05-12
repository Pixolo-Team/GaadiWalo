# GaadiWalo - Codex Agent Standards

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

## 3.2 Minimal Task Input Mode (Default)

To assign implementation work, user can provide only:

- Figma URL (exact frame/node)
- Step file path

Default interpretation:
- Agent auto-applies all repository standards from this file.
- Agent executes only the requested step scope.
- Agent updates tracking/docs as required by workflow rules.
- Reference: `plans/claude-task-workflow.md`.

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
- Prefer semantic Tailwind typography utilities (`text-xs`, `text-sm`, `text-base`, `text-lg`, `text-xl`, `text-2xl`, etc.) over arbitrary values like `text-[36px]`
- Prefer semantic Tailwind spacing and sizing utilities over arbitrary px classes
- Use `size-*` utility when width and height are equal instead of setting `w-*` and `h-*` separately
- Avoid fixed-width pixel locks (`w-[390px]`, `h-[960px]`) unless strictly required by product behavior
- For page-level layouts, the first root element must be a `section`
- Root `section` should only handle page-level essentials (`min-h`/`h` and background color); avoid putting content spacing/layout styles directly on it
- If content needs padding, max-width/container behavior, or inner layout styling, add an inner `div` inside the `section` and apply those classes on that inner `div`
- Primary font utility: `font-sans` (Sora); secondary font utility: `font-secondary` (DM Sans)
- Avoid `font-[var(...)]` in component classes; use Tailwind font utilities (`font-sans`, `font-secondary`, weight utilities)
- For icon sizing, prefer Tailwind sizing scale (`size-4`, `size-5`, `size-6`, etc.) and use arbitrary values only when no close scale value matches design intent

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

## 11) Git Branching and Workflow (Mandatory)

### Branching

- Always create a feature/fix branch before starting major changes.
- Never commit directly to `main`, `master`, or `development`.
- Branch naming:
  - `feature/sales-dashboard`
  - `bugfix/component-ui-restructure`
  - Equivalent allowed pattern: `feature/<description>` or `fix/<description>`

### Git Workflow for Major Changes

1. Create a new branch:
   - `git checkout -b feature/your-feature-name`
2. Develop and commit on the feature branch only.
3. Validate locally before pushing:
   - `npm run dev`
   - `npm run lint`
   - `npm run build`
4. Push branch to remote:
   - `git push -u origin feature/your-feature-name`
5. Open PR and merge only after review/CI checks pass.

## 12) Constraints and Policy Guardrails

### Security and Secrets

- Keep all secrets server-side; never expose secret keys in client code.
- Use environment variables for sensitive configuration.
- Never commit `.env.local`, `.env`, or any credentials file.
- Validate and sanitize all external/user-provided input before processing.

### Code Quality Baseline

- TypeScript strict mode is mandatory.
- Run lint checks before creating commits or PRs.
- Avoid `any`; if unavoidable, document justification in code review notes.

### Dependency Discipline

- Prefer existing shadcn/ui and in-repo components before adding new UI libraries.
- Keep dependency additions minimal, especially during MVP scope.
- Do not introduce parallel frameworks or duplicate tooling for solved problems.

## 13) Documentation References

- [Plans Index](./plans/README.md) - master index for all planning documents
- [Project Spec](./plans/project-spec.md) - engineering requirements, architecture, API standards
- [Sales Project Spec](./plans/sales-project-spec.md) - sales-scope goals and milestone roadmap
- [Project Overview](./plans/project-overview.md) - product purpose and MVP boundaries
- [Architecture](./plans/architecture.md) - system design decisions and stack mapping
- [Project Status](./plans/project_status.md) - milestones, accomplishments, and immediate next steps
- [Frontend Overview](./plans/frontend/overview.md) - frontend structure and implementation conventions
- [UI Components](./plans/frontend/ui-components.md) - component reuse system and design guidance
- [API Integration](./plans/frontend/api-integration.md) - frontend-to-backend API usage rules
- [Frontend Implementation Steps](./plans/frontend/implementation-steps/README.md) - ordered execution flow

Documentation policy:

- Update relevant docs after major milestones or architecture/API changes.
- Keep docs consistent with implemented behavior; no stale specs.
- After folder structure changes, run `scripts/sync-structure-docs.sh` to refresh structure sections in docs.
