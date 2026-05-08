# GaadiWalo – Claude Agent Instructions

> This file is read automatically by Claude Code (and similar Claude-powered agents) at the start of
> every session. Use it to give Claude a project-wide understanding of the codebase, conventions,
> and constraints.

---

## What to put in this file

In this file, give Claude a clear one-paragraph description of what GaadiWalo is and who it is for,
so every response is grounded in the right product context. Describe the monorepo layout: the
`app/frontend` folder holds the UI, the `app/backend` folder holds the API/server, and both are
independent projects that communicate over HTTP/WebSockets.

List the exact shell commands Claude should run to set up, develop, test, and build each sub-project.
Specify which package manager to use (npm / yarn / pnpm / pip / etc.) and any scripts defined in
`package.json` or equivalent that Claude should prefer over running tools directly.

Document the code style rules you want Claude to enforce: language (TypeScript vs JavaScript),
formatter (Prettier, ESLint config location, etc.), commit message format, and branch naming
conventions. Note any architectural constraints, such as "never add business logic to the frontend"
or "all DB access must go through the repository layer in the backend".

Tell Claude to always check `plans/` for an existing plan before creating new files, and to keep
plans updated as it works. Point Claude to the `plans/project-overview.md` file as the single source
of truth for product requirements.

---

## Repository layout (update as the project grows)

```
GaadiWalo/
├── app/
│   ├── frontend/   ← Frontend app (framework TBD)
│   └── backend/    ← Backend app  (framework TBD)
├── plans/          ← All planning documents live here
├── AGENTS.md       ← Codex agent instructions
└── CLAUDE.md       ← You are here (Claude instructions)
```
