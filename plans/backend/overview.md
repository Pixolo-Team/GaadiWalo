# Backend – Overview

> This file is the starting point for any backend work. Read it before creating routes, models,
> services, or middleware.

---

## What to put in this file

In this file, give the agent everything it needs to orient itself inside the backend project.
Include:

- **Framework and version** – the chosen backend framework and its version (e.g., Express 5,
  Fastify 4, NestJS 10, Django 5, Laravel 11, etc.). If not decided yet, write "TBD" and describe
  the criteria you will use to choose.
- **Package manager and key scripts** – the exact commands to install dependencies, start the dev
  server (with hot-reload), run tests, run the linter, and build for production.
- **Folder structure** – a tree showing how `app/backend/` is organised (routes/controllers,
  services/use-cases, repositories/data-access, models/entities, middleware, utils, config, tests,
  etc.) so the agent always puts new files in the correct layer.
- **Layered architecture rules** – which layer is responsible for what (e.g., "routes only parse
  HTTP; services contain business logic; repositories talk to the DB"). The agent must never
  bypass a layer.
- **Configuration and secrets** – which environment variables the backend requires, pointing to
  the `.env.example` file, and how config is loaded at runtime.
- **Error handling convention** – how errors are caught, wrapped, logged, and returned to the
  client (custom error classes, global error handler middleware, HTTP status code rules).
- **Logging** – which logging library is used, the log levels, and what information must always
  be logged (request ID, user ID on authenticated routes, error stack traces).
