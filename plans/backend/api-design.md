# Backend – API Design

> This file defines every API endpoint the backend exposes. The agent should check this file
> before adding a new endpoint to avoid duplication and to follow the agreed conventions.

---

## What to put in this file

In this file, document the full API surface so both the frontend and backend agents share the same
contract. Include:

- **API style** – whether the API is REST, GraphQL, tRPC, or a mix. For REST, document the base
  path versioning strategy (e.g., `/api/v1/`). For GraphQL, note the schema-first vs code-first
  approach.
- **Endpoint catalogue** – for each endpoint list: HTTP method, path, request body/params
  (field names and types), success response shape, and possible error codes. Group endpoints by
  resource (e.g., Vehicles, Users, Dealers, Enquiries). Use a table or YAML block — whichever
  makes it easier for the agent to parse.
- **Common response envelope** – document the standard JSON wrapper used for all responses
  (e.g., `{ success, data, error, meta }`) so the agent never invents its own format.
- **Pagination conventions** – cursor-based vs offset-based, which query params to use
  (`page`, `limit`, `cursor`), and the shape of the pagination metadata in the response.
- **Validation rules** – which validation library is used (Zod, Joi, class-validator, Pydantic,
  etc.), where schema files live, and the rules for required vs optional fields.
- **Rate limiting and throttling** – which endpoints are rate-limited, the limits, and how the
  `429` response is structured.
- **Webhooks or event streams** – if the backend emits events to external systems or a message
  queue, document the event names, payload shapes, and delivery guarantees here.
