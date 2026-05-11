# Part 2: Engineering Requirements

## Tech Stack

- Frontend: Next.js (App Router), React, TypeScript (strict), Tailwind CSS, shadcn/ui
- Backend: Node.js + Hono (TypeScript strict)
- Database/Auth: Supabase (Postgres + Supabase Auth)
- API Architecture: REST only
- HTTP Client: Axios only (frontend)
- Validation: Zod at route/controller boundary
- Deployment: Vercel

## Technical Architecture

### Data Flow (MVP)

```text
Sales user opens app
    |
    v
Frontend renders screen and validates local input (Zod where applicable)
    |
    v
Frontend request layer calls REST API via Axios (`*Request`)
    |
    v
Hono Route -> Controller -> Service -> Supabase
    |
    v
Service returns QueryResponseData<T> = { data: T | null, error: Error | null }
    |
    v
Controller maps service result to standard response envelope via sendResponse()
    |
    v
Frontend receives typed response and updates UI states (loading/success/error)
```

### Project Structure

```text
<!-- AUTO_PROJECT_STRUCTURE_START -->
GaadiWalo/
├── app/
│   frontend/
│   backend/
├── apps/
│   frontend/
│   backend/
├── plans/
└── AGENTS.md / CLAUDE.md
<!-- AUTO_PROJECT_STRUCTURE_END -->
```

## API Design

### API Layering Standard (Mandatory)

```text
Route -> Controller -> Service -> Supabase
```

Rules:
- Routes define endpoints only.
- Controllers parse/validate request and map response.
- Services contain business logic + Supabase queries.
- No DB logic in controller.
- No HTTP context logic in service.

### Request/Response Pattern (Pixolo Standard)

Service return contract:

```ts
interface QueryResponseData<T> {
  data: T | null;
  error: Error | null;
}
```

Rules:
- Services catch errors and return `{ data: null, error }`.
- Services do not throw for expected operational failures.
- Controllers decide HTTP status mapping.

### Standard Response Envelope (Mandatory)

Success:

```json
{
  "data": "<T>",
  "status": "success",
  "status_code": 200,
  "message": "Human readable message",
  "error": null
}
```

Error:

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
- Success => `error: null`, `data: T`
- Error => `data: null`
- Use `sendResponse()` wrapper consistently (no ad-hoc payload shape)

### Validation Standard

- Zod validation is mandatory at route/controller boundaries.
- Reject invalid payloads before service execution.
- Validation schemas stay typed and module-scoped.

### Health and Deployment Baseline

- Backend exposes `GET /health` for runtime and container health checks.
- Backend package includes a Dockerfile for containerized deployment.
- Google Cloud deployment target uses Cloud Run via Docker image delivery.

### Frontend API Consumption Standard

- Frontend uses Axios only.
- API call functions must end with `Request`.
- Frontend must never call Supabase directly.
- Frontend consumes backend REST endpoints only.

### Error and Break/Fix Handling

- Never silently ignore API/runtime errors.
- Fix within scope where possible.
- If unresolved, document:
  - error summary
  - impacted modules
  - attempted fixes
  - fastest next action
