# Claude Task Workflow

Use this workflow whenever assigning implementation work to Claude.

## 1) Task Assignment Template

Copy and fill this format:

```md
Task: <short objective>

Scope:

- <allowed file/folder 1>
- <allowed file/folder 2>
- Do not modify <restricted files/folders>

Design:

- Figma URL: <URL>

Rules:

- Follow AGENTS.md and CLAUDE.md
- Follow project-spec.md and architecture.md
- Use existing components/tokens first
- No console logs
- Axios only in request layer

Done criteria:

- Matches design intent and responsive behavior
- Loading/empty/error states handled
- Lint/build/type checks pass
- Update plans/project_status.md with done + next
```

## 2) When to Provide Figma

- Provide Figma at task time (per screen/feature), not all at once.
- Always share exact frame/node URL for the current task.
- Keep scope tight: one screen or one feature chunk per task.

## 3) Suggested Task Size

- One of the following per prompt:
  - one screen UI
  - one shared component set
  - one API integration slice
  - one bugfix cluster in same module

## 4) Execution Sequence

1. Shared UI primitives
2. Screen assembly
3. Data wiring (`*Request`, `*Service`, `*Data`)
4. State handling and polish
5. Validation and status update

## 5) Status Update Command

After each completed task:

```bash
scripts/update-project-status.sh \
  --done "Completed <task name>" \
  --next "Start <next task name>"
```

## 6) Branch Workflow

```bash
git checkout -b feature/<task-name>
# assign work to Claude
# review output
git add .
git commit -m "feat: <task summary>"
git push -u origin feature/<task-name>
```

## 7) Example Assignment

```md
Task: Implement Sales Dashboard UI.

Scope:

- apps/frontend/src/app/(sales)/dashboard/page.tsx
- apps/frontend/src/components/shared/\*
- Do not modify backend files.

Design:

- Figma URL: https://www.figma.com/design/...?...&node-id=124-143&m=dev
- Node ID: 124:143

Rules:

- Follow AGENTS.md and CLAUDE.md
- Reuse existing tokens/components first
- No console logs
- Keep mobile-first responsive behavior

Done criteria:

- UI matches Figma intent
- Responsive on mobile and desktop breakpoints
- Lint/build pass
- Update project_status.md done + next
```
