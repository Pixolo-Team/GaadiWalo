# GaadiWalo – Codex Agent Instructions

> This file is read automatically by OpenAI Codex and Codex CLI agents at the start of every session.
> Use this file to give the agent a project-wide understanding of the codebase, conventions, and constraints.

---

## What to put in this file

In this file, describe the overall project purpose so the agent knows what it is building. Explain the
monorepo layout (the `app/frontend` and `app/backend` folders) and which framework lives in each folder
once you decide on them. List the commands the agent should use to install dependencies, run dev servers,
execute tests, and lint code for both the frontend and backend so it can perform those tasks without
asking you.

Write down the coding conventions you want the agent to follow: naming rules, folder structure inside
each app, preferred libraries, and anything the agent should never do (e.g., never commit `.env` files,
never downgrade a dependency without asking). Add any environment variables the agent needs to be aware
of, pointing it to `.env.example` files rather than real secrets.

Finally, point the agent to the `plans/` directory and explain that every feature should be planned
in a markdown file there before any code is written. Tell the agent to read the relevant plan file
before starting work on a feature and to update the plan if requirements change during implementation.

---

## Repository layout (update as the project grows)

```
GaadiWalo/
├── app/
│   ├── frontend/   ← Frontend app (framework TBD)
│   └── backend/    ← Backend app  (framework TBD)
├── plans/          ← All planning documents live here
├── AGENTS.md       ← You are here (Codex instructions)
└── CLAUDE.md       ← Claude / Claude Code instructions
```
