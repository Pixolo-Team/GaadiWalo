# Backend – API Design

## API Style

- REST via Hono backend endpoints.
- Current auth routes live under `/auth/*`.
- Versioning target remains `/api/v1/*` when route groups are formally versioned.

## Response Envelope

```json
{
  "data": "<T>",
  "status": "success",
  "status_code": 200,
  "message": "Human readable message",
  "error": null
}
```

On failure:

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

- Success responses must set `error: null`.
- Error responses must set `data: null`.
- Controllers must return the envelope through `sendResponse()`.

## Core Resource Groups

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
- `429`: rate-limited request
- `500`: internal error
