# Backend – API Design

## API Style

- REST via Next.js API routes.
- Versioning target: `/api/v1/*` for stable endpoints.

## Response Envelope

```json
{
  "data": {},
  "error": null,
  "meta": {}
}
```

On failure:

```json
{
  "data": null,
  "error": { "message": "...", "code": "..." },
  "meta": {}
}
```

## Core Resource Groups

- `health`: runtime health endpoint for deployment checks
- `auth`: login, forgot password, OTP verification, reset password
- `sales/leads`: list, details, create, update status, notes, import
- `sales/profile`: profile update, password update, notifications, performance
- `admin/dashboard`: summary, source chart, top performers, top referrers
- `admin/team`: list, detail, create, remove/reassign, reset password
- `admin/leads`: create+assign, bulk import+assignment strategy
- `admin/reports`: overview/source/funnel datasets
- `admin/referrers`: list and detail
- `admin/settings`: business info, lead sources, cars catalogue, export/privacy

## Validation and Status Codes

- Use Zod at route boundary.
- `200/201`: success
- `400`: validation error
- `401`: unauthenticated
- `403`: forbidden
- `404`: missing resource
- `409`: conflict/duplicate
- `500`: internal error

## Pagination Convention

- Query params: `page`, `limit`, optional `sortBy`, `sortOrder`.
- `meta` includes `page`, `limit`, `total`, `totalPages`.

## Implemented Baseline Endpoint

- `GET /api/v1/health`
  - Returns the standardized GaadiWalo envelope
  - Includes service name, version, environment, timestamp, and uptime
