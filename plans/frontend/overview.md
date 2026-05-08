# Frontend – Overview

> This file is the starting point for any frontend work. Read it before creating components,
> adding routes, or installing packages.

---

## What to put in this file

In this file, give the agent everything it needs to orient itself inside the frontend project.
Include:

- **Framework and version** – the chosen frontend framework and its version (e.g., React 19,
  Next.js 15, Vue 3, SvelteKit, etc.). If not decided yet, write "TBD" and describe the criteria
  you will use to choose.
- **Package manager and key scripts** – the exact commands to install dependencies (`npm install`),
  start the dev server (`npm run dev`), run tests (`npm test`), and build for production
  (`npm run build`).
- **Folder structure** – a tree showing how `app/frontend/` is organised (pages/routes, components,
  hooks/composables, services/api, stores/state, assets, styles, tests, etc.) so the agent always
  puts new files in the right place.
- **Routing strategy** – how pages/routes are defined (file-based, config-based) and any
  conventions for dynamic segments, layouts, and protected routes.
- **State management** – which state library is used (Context API, Zustand, Pinia, Redux, etc.)
  and the rules for what goes in global state vs local component state.
- **Styling approach** – CSS framework or methodology (Tailwind, CSS Modules, styled-components,
  etc.) and any design tokens or theme file the agent should use.
- **Environment variables** – which `VITE_` / `NEXT_PUBLIC_` / etc. variables the frontend needs,
  pointing to the `.env.example` file.
