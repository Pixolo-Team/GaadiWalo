# System Architecture

> This file describes the high-level design of the GaadiWalo system. An AI agent should read this
> before making any decisions that affect how the frontend and backend communicate, how data is
> stored, or how the system is deployed.

---

## What to put in this file

In this file, capture every architectural decision that spans both the frontend and backend so the
agent always has a shared mental model of the system. Include:

- **Diagram or ASCII sketch** – a simple box-and-arrow diagram showing the frontend, backend API,
  database, and any external services, with arrows indicating the direction of data flow.
- **Tech stack table** – a two-column table listing the layer (Frontend, Backend, Database, Cache,
  Auth, Hosting, CI/CD) and the chosen technology or "TBD" if not yet decided.
- **Communication protocol** – how the frontend talks to the backend (REST over HTTPS, GraphQL,
  WebSockets, etc.) and any versioning strategy for the API.
- **Environment breakdown** – describe the Development, Staging, and Production environments,
  including how environment variables are managed and where secrets are stored.
- **Scalability and performance notes** – any known constraints or future-proofing decisions
  (e.g., "images are stored on S3 not in the DB", "backend must be stateless for horizontal scaling").
- **Security posture** – high-level notes on authentication, authorisation, HTTPS enforcement,
  input validation, and OWASP considerations the agent must respect.
- **ADR log** – a short table of Architecture Decision Records (ADRs) with columns: date, decision,
  reason, and alternatives rejected. Add a row every time a significant architectural choice is made.
