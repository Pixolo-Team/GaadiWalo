# Backend – Authentication & Authorisation

> This file defines the auth strategy for GaadiWalo. The agent must read this before adding any
> protected route, user model field, token-handling code, or permission check.

---

## What to put in this file

In this file, document every aspect of identity, access control, and session management so the
agent implements auth correctly and consistently throughout the backend. Include:

- **Auth strategy** – which mechanism is used: JWT (stateless), sessions (stateful with a store),
  OAuth 2.0 / social login, magic-link email, OTP via SMS, or a combination. State the library
  used (Passport.js, Auth.js, better-auth, Firebase Auth, Supabase Auth, etc.).
- **Token lifecycle** – for JWT: access token expiry, refresh token expiry, where tokens are
  stored on the client (httpOnly cookie vs Authorization header), and the refresh flow. For
  sessions: session store engine, TTL, and rolling session rules.
- **User roles and permissions** – list every role (e.g., `guest`, `buyer`, `dealer`, `admin`)
  and what each role can and cannot do. Document how roles are stored (column on user table,
  separate roles table, claims in JWT) and how the agent should check permissions in middleware
  or service code.
- **Registration and login flows** – step-by-step description of the sign-up and sign-in
  processes, including email verification, phone OTP, or social provider callback handling.
- **Password rules** – if passwords are used: minimum length, complexity requirements, hashing
  algorithm (bcrypt rounds, Argon2 parameters), and reset-password flow.
- **Protected route conventions** – how routes are marked as protected (middleware name, decorator,
  guard), what happens on an unauthenticated request (401 vs redirect), and how the agent should
  attach the authenticated user to the request context for downstream use.
- **Security checklist** – items the agent must always verify: CSRF protection, brute-force
  lockout, token revocation on logout, audit logging of auth events.
