# Architecture

This document defines the high-level system architecture, request lifecycle, and component/module boundaries for GaadiWalo.

## System Overview

GaadiWalo uses a mobile-first web architecture with a strict separation between frontend UI concerns and backend business/data concerns.

- Frontend: Next.js App Router + React + Tailwind + shadcn/ui
- Backend: Node.js + Hono API layer
- Data/Auth: Supabase Postgres + Supabase Auth
- API Pattern: REST with standardized envelopes and typed contracts

## Data Flow (MVP)

```text
Sales user interacts with UI
    |
    v
Frontend validates form/filter input (Zod where applicable)
    |
    v
Frontend request layer calls backend endpoint via Axios (`*Request`)
    |
    v
Hono Route -> Controller -> Service -> Supabase
    |
    v
Service returns QueryResponseData<T> = { data: T | null, error: Error | null }
    |
    v
Controller maps result through sendResponse() envelope
    |
    v
Frontend updates loading/success/error states and re-renders screen
```

## Component Architecture

### Frontend Components

- `components/ui/*`
  - base primitives (button, input, dialog, sheet, tabs, badge, etc.)
- `components/layout/*`
  - page shell, headers, bottom navigation, route-aware wrappers
- `components/leads/*`
  - lead card, status badge, filter sheet, add note sheet, lead actions
- `components/auth/*`
  - login/reset/otp/new-password form components
- `components/admin/*`
  - admin dashboard widgets, team rows/dialogs, reports widgets
- `components/shared/*`
  - stat cards, empty states, loading states, reusable section blocks

### Frontend Application Layer

- `app/(sales)/*`
  - dashboard, leads, lead details, profile, notifications, performance
- `app/(auth)/*`
  - authentication screens and recovery flows
- `app/(admin)/*`
  - admin dashboard, team, leads, reports, referrers, settings

### Frontend Data/Logic Layer

- `requests/*`
  - transport/API calls (`*Request` naming)
- `services/*`
  - business transforms/helpers (`*Service` naming)
- `types/*`
  - typed contracts (`*Data` naming)
- `constants/*`
  - shared non-magic values and route/status/source enums
- `hooks/*`
  - page-level and domain-level reusable state hooks
- `lib/*`
  - query client, helpers, and shared utilities

## API Layer Architecture

- Transport style: REST only
- Contract style: typed response envelope + explicit status mapping
- Validation boundary: Zod schema at route/controller entry
- Forbidden patterns:
  - controller DB access
  - service HTTP-context access
  - frontend direct Supabase calls

Primary response envelope:

```json
{
  "data": "<T> | null",
  "status": "success | error",
  "status_code": 200,
  "message": "Human readable message",
  "error": null
}
```

## Backend Module Architecture

Each backend domain follows:

```text
<module>/
├── <module>.routes.ts
├── <module>.controller.ts
├── <module>.service.ts
└── <module>.types.ts
```

Supporting backend layers:

- `config/` (supabase client/config)
- `common/constants/` (regex, pagination, app constants)
- `common/utils/` (shared parsing/validation/formatting helpers)
- `common/types/` (shared typed contracts)
- `modules/health/` (service health route/controller/service/types)

## Security and Policy Alignment

- Secrets are server-only; never exposed to client bundles
- `.env` values must be represented in `.env.example`
- Input validation and sanitization required before data operations
- Supabase auth + role checks enforced server-side

## Current Scope Note

Current implementation focus is the Sales flow first.
Admin and extended authentication hardening are tracked as later milestones in project status/plans.

## Deployment Baseline

- `apps/backend` is container-ready with a Dockerfile.
- Health checks target `GET /health`.
- Initial Google Cloud deployment path is Cloud Run using the backend Docker image.
