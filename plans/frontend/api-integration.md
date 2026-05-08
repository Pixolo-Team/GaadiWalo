# Frontend – API Integration

> This file explains how the frontend communicates with the backend. The agent should read this
> before writing any data-fetching code, form submission, or real-time feature.

---

## What to put in this file

In this file, give the agent a precise contract for how the frontend should talk to the backend so
it never makes raw `fetch` calls scattered across components. Include:

- **API base URL** – where the backend is hosted in each environment (development, staging,
  production) and how the frontend resolves the correct URL at runtime (environment variable name).
- **HTTP client setup** – which library is used (Axios, `ky`, native `fetch` wrapper, Apollo
  Client, tRPC client, etc.), where it is configured, and any default headers, base URL, or
  interceptors that are already set up.
- **Authentication flow** – how the frontend obtains, stores, and refreshes the auth token
  (cookie, localStorage, in-memory), and what the agent should do when a 401 response is received.
- **Request conventions** – naming rules for API service files, how to organise endpoints by
  domain (e.g., `services/vehicles.ts`, `services/auth.ts`), and how to handle loading, error,
  and success states consistently across the app.
- **Real-time / WebSocket** – if the app has live features (e.g., live chat with a dealer,
  real-time notifications), describe how WebSocket connections are managed and which events to
  listen for.
- **Error handling** – how API errors are surfaced to the user (toast, inline message, redirect),
  and how the agent should log or report errors in production.
- **Mock / stub strategy** – how the frontend is developed before the backend is ready (MSW,
  hardcoded fixtures, a dedicated mock server) so the agent can work on UI independently.
