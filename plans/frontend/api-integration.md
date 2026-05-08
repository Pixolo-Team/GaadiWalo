# Frontend – API Integration

## API Access Rule

- Frontend pages/components do not call database directly.
- Client code consumes backend via API routes through `*Request` functions.

## Base URL Strategy

- Browser calls relative `/api/*` routes.
- For server-side calls, resolve from env when needed.

## Request Layer Conventions

- Keep HTTP/transport code in `src/requests/*`.
- Keep transformation/business logic in `src/services/*`.
- Function naming:
  - HTTP calls: `verbThingRequest`
  - Business logic: `verbThingService`

## Auth Handling

- Supabase Auth session is source of truth.
- On 401/403:
  - clear local protected state
  - redirect to login
  - show safe user-facing message

## Error Pattern

All request functions should return:

```ts
{ data: T | null; error: Error | null }
```

Never throw raw errors to component trees unless explicitly required.

## Loading + Mutation UX

- Use TanStack Query hooks for loading/error/cache states.
- Use optimistic updates only for low-risk UX actions.
- Show actionable error feedback in UI.

## Mocking Strategy

- Before backend completion, keep request stubs and mock fixtures in services.
- Remove temporary mocks as each backend endpoint becomes available.
