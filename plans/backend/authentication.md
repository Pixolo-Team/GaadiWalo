# Backend Authentication Flow Reference

## Purpose and Scope

This document is the detailed backend reference for authentication in GaadiWalo. It is intended for implementing or reviewing authentication work in the backend.

This file covers:

- authentication route design under `/auth/*`
- backend flow ownership using `Route -> Controller -> Service -> Supabase`
- request validation and response mapping
- Supabase-specific integration boundaries for login, session verification, and password reset flows

This file does not replace frontend auth plans. Frontend screen behavior remains defined separately in `plans/frontend/implementation-steps/authentication.md`.

## Mandatory Project Rules

- Frontend must never call Supabase directly.
- All authentication calls must go through backend REST endpoints only.
- Backend auth must follow `Route -> Controller -> Service -> Supabase`.
- Zod validation is mandatory at the route/controller boundary before service execution.
- Services must return `QueryResponseData<T>`.
- Controllers must map service results through the shared `sendResponse()` helper.
- Protected routes must verify authentication server-side.
- Production responses must not expose raw Supabase or internal system errors.

## Auth Architecture and Ownership

The backend owns all authentication coordination with Supabase Auth.

### Layer responsibilities

#### Route

- declares the `/auth/*` endpoint
- applies request parsing and hands off to the controller
- contains no business logic and no Supabase logic

#### Controller

- validates request input with Zod
- calls the service with typed input
- maps service output to HTTP status and the standard response envelope
- never performs direct Supabase queries or auth calls

#### Service

- contains the authentication business flow
- calls Supabase Auth or supporting Supabase-backed data lookups
- catches operational errors and returns `QueryResponseData<T>`
- never reads request/response context directly

#### Supabase

- authenticates credentials
- manages password storage and recovery primitives
- verifies tokens/sessions used for protected backend access

## Canonical Backend Contracts

### Route prefix

- `/auth/*`

### Service contract

```ts
interface QueryResponseData<T> {
  data: T | null;
  error: Error | null;
}
```

### Standard response envelope

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

## Validation Rules

- All auth request payloads must be validated with Zod before entering service logic.
- Validation must reject malformed or incomplete payloads with `400`.
- Password validation rules must be enforced in backend logic even if frontend already validates them.
- `newPassword` must be at least 8 characters long.
- `newPassword` must contain at least 1 uppercase letter.
- `newPassword` must contain at least 1 numeric digit.
- Identifier validation for reset flows should support the approved login/recovery identifier format used by the project.
- OTP input must be validated as a fixed-length code before service execution.
- Reset tokens must be treated as single-use recovery credentials.

## Endpoint Flows

Each auth endpoint must follow the same high-level pattern:

`Route -> Controller -> Zod Validation -> Service -> Supabase -> Controller -> sendResponse()`

### `POST /auth/login`

#### Expected request payload

```json
{
  "userId": "SP001",
  "password": "StrongPassword123"
}
```

#### Route responsibility

- expose `POST /auth/login`
- pass request body to the controller

#### Controller responsibility

- validate required fields
- reject invalid payloads with `400`
- call the login service
- map invalid credentials to `401`
- return successful auth response through `sendResponse()`

#### Service responsibility

- resolve the login identifier format expected by Supabase
- authenticate with Supabase using the supplied credentials
- return safe user/session data for the controller response

#### Supabase interaction

- use Supabase Auth to validate credentials

#### Success response behavior

- `200`
- return authenticated user context and the session/token data the backend chooses to expose safely
- set `error: null`

#### Failure cases and status mapping

- `400`: malformed body or missing fields
- `401`: invalid credentials or invalid session creation
- `429`: rate-limited auth attempts if applicable
- `500`: unexpected backend or Supabase integration failure

### `POST /auth/forgot-password`

#### Expected request payload

```json
{
  "identifier": "sales@example.com"
}
```

#### Route responsibility

- expose `POST /auth/forgot-password`
- pass request body to the controller

#### Controller responsibility

- validate identifier input
- reject malformed input with `400`
- call the forgot-password service
- return a safe response message through `sendResponse()`

#### Service responsibility

- normalize and validate the identifier format used by the project
- initiate the Supabase-compatible password recovery flow
- avoid leaking unnecessary account existence details unless product requirements explicitly allow it
- return a success/failure outcome to the controller

#### Supabase interaction

- trigger the supported Supabase password recovery or OTP mechanism configured by the project

#### Success response behavior

- `200`
- return a human-readable message indicating the next recovery step

#### Failure cases and status mapping

- `400`: invalid identifier payload
- `404`: account not found
- `429`: resend/request frequency exceeded
- `500`: unexpected backend or Supabase integration failure

### `POST /auth/verify-otp`

#### Expected request payload

```json
{
  "identifier": "sales@example.com",
  "otp": "123456"
}
```

#### Route responsibility

- expose `POST /auth/verify-otp`
- pass request body to the controller

#### Controller responsibility

- validate identifier and OTP format
- reject malformed input with `400`
- call the OTP verification service
- map invalid or expired verification attempts to a safe client response

#### Service responsibility

- verify the OTP against the configured Supabase-compatible recovery flow
- return the verified recovery state needed for the password reset step
- keep recovery artifacts short-lived and backend-controlled

#### Supabase interaction

- use the supported Supabase verification mechanism for recovery OTP/token validation

#### Success response behavior

- `200`
- return the temporary recovery/reset context required for the next step

#### Failure cases and status mapping

- `400`: invalid payload or expired/incorrect OTP
- `401`: verification state not trusted or not recoverable
- `429`: too many verification attempts
- `500`: unexpected backend or Supabase integration failure

### `POST /auth/resend-otp`

#### Expected request payload

```json
{
  "identifier": "sales@example.com"
}
```

#### Route responsibility

- expose `POST /auth/resend-otp`
- pass request body to the controller

#### Controller responsibility

- validate identifier input
- call the resend service
- return a safe confirmation response

#### Service responsibility

- check resend eligibility based on the configured recovery flow
- trigger the recovery OTP resend through the supported Supabase path
- avoid creating duplicate or conflicting reset states

#### Supabase interaction

- request another recovery OTP or restart the supported recovery mechanism

#### Success response behavior

- `200`
- return a resend confirmation message

#### Failure cases and status mapping

- `400`: invalid identifier payload
- `404`: account not found only if the product intentionally exposes this outcome
- `429`: resend cooldown or rate limit reached
- `500`: unexpected backend or Supabase integration failure

### `POST /auth/reset-password`

#### Expected request payload

```json
{
  "resetToken": "short-lived-reset-token",
  "newPassword": "StrongPassword123"
}
```

#### Route responsibility

- expose `POST /auth/reset-password`
- pass request body to the controller

#### Controller responsibility

- validate reset token and password payload
- reject invalid payloads with `400`
- call the reset-password service
- return final recovery completion response

#### Service responsibility

- validate the recovery/reset context
- enforce password policy before making the Supabase update
- guarantee the reset token is one-time use
- prevent replay of the reset token across repeated requests
- prevent reuse of the same reset token after a successful password change
- update the password through Supabase
- invalidate or close the reset state immediately after success

#### Supabase interaction

- use Supabase Auth password update capabilities tied to the verified recovery context
- persist or verify reset-state invalidation in a way that blocks replay and reuse

#### Success response behavior

- `200`
- return a success message indicating password reset completion

#### Failure cases and status mapping

- `400`: invalid payload, weak password, or mismatched reset state
- `401`: untrusted, expired, replayed, or already-used reset context
- `429`: too many reset attempts if applicable
- `500`: unexpected backend or Supabase integration failure

## Authorization and Protected Route Enforcement

- Every protected backend route must verify the caller identity server-side before business logic runs.
- Missing or invalid authentication must return `401`.
- Authenticated users without the required access scope must return `403`.
- Never trust frontend-provided access hints for authorization.
- Any user access scope must be derived server-side from trusted backend data after authentication.
- Sensitive actions may require fresh auth or stronger session checks depending on the operation risk.

## Supabase Integration Rules

- Keep Supabase Auth calls in backend services only.
- Do not expose service role credentials to the frontend.
- Keep environment-based Supabase configuration server-side only.
- Prefer Supabase-managed password storage and recovery primitives over custom password handling.
- Do not invent custom auth storage patterns that bypass Supabase security guarantees.
- Keep flows compatible with RLS-aware data access patterns.

## Response and Error Mapping Rules

- All controllers must return the standard envelope through `sendResponse()`.
- Success responses must always set `error: null`.
- Error responses must always set `data: null`.
- Human-readable `message` values should explain the outcome without leaking sensitive internals.
- Internal errors from Supabase should be logged safely on the server but converted to sanitized client error strings.
- Security-relevant auth failures and suspicious repeated attempts should be logged without exposing secrets.

## Implementation Checklist for Future AI Tasks

- Read `AGENTS.md`, `plans/project-spec.md`, and `plans/architecture.md` before changing auth code.
- Keep all auth routes under `/auth/*`.
- Preserve `Route -> Controller -> Service -> Supabase`.
- Add Zod schemas for every auth payload.
- Return `QueryResponseData<T>` from services.
- Use `sendResponse()` consistently in controllers.
- Do not add frontend Supabase usage.
- Do not expose raw Supabase errors or secrets.
- Keep `.env.example` updated if new backend auth environment variables are introduced.
