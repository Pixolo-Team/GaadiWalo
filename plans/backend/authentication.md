# Backend – Authentication & Authorization

## Auth Strategy

- Supabase Auth is the primary auth system.
- Email/password and OTP-based reset flows as defined in `plans/frontend/implementation-steps/authentication.md`.

## Session and Token Policy

- Client uses Supabase session.
- Server verifies token/session on protected routes.
- Sensitive operations require fresh auth checks where needed.

## Roles

- `sales`: access only own leads/profile/performance scope.
- `admin`: full team, reporting, assignment, and configuration scope.

## Authorization Rules

- Enforce role checks server-side on every protected route.
- Never rely on client role flags for access control.

## Required Protected Behaviors

- Missing/invalid auth => `401`
- Authenticated but wrong role => `403`
- Log security-relevant auth events

## Password and Reset

- Use Supabase-managed password storage.
- Enforce strong password policy in UI + backend validation.
- Reset flow uses OTP/email verification before password change.
