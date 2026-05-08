# Project Setup

## Objective

Establish a production-ready frontend foundation for the CRM before feature implementation begins.

## Scope

- Initialize Next.js App Router project with TypeScript and Tailwind.
- Configure design system primitives and core dependencies.
- Create baseline folders, constants, shared types, and query client setup.
- Enforce naming, aliasing, and code-quality conventions used by all later steps.

## Target Paths

All `src/...` references in this step map to:

- `apps/frontend/src/...`

## Prerequisites

- Root policy files reviewed: `AGENTS.md`, `CLAUDE.md`
- Next.js rule references reviewed from `.github/skills/next-best-practices/`

## 1.1 Initialize Project

```bash
npx create-next-app@latest autolead-crm \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*"
```

Required options:

- TypeScript enabled
- ESLint enabled
- Tailwind enabled
- `src/` directory enabled
- App Router enabled
- Import alias set to `@/*`

## 1.2 Install Core Dependencies

```bash
# Design system
npx shadcn@latest init
npx shadcn@latest add button input label sheet dialog tabs badge avatar skeleton toast select checkbox switch progress

# Forms and validation
npm install react-hook-form zod @hookform/resolvers

# Server state
npm install @tanstack/react-query @tanstack/react-query-devtools

# Charts and utilities
npm install recharts date-fns lucide-react
```

## 1.3 shadcn Initialization Choices

| Prompt | Value |
|------|------|
| Style | Default |
| Base color | Blue |
| CSS variables | Yes |
| Tailwind config | `tailwind.config.ts` |
| Components path | `@/components/ui` |
| Utils path | `@/lib/utils` |

## 1.4 Tailwind Theme Extension

Update `tailwind.config.ts` with CRM status tokens:

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        status: {
          new: "#3B82F6",
          contacted: "#F97316",
          interested: "#8B5CF6",
          "test-drive": "#14B8A6",
          won: "#22C55E",
          lost: "#EF4444",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
```

## 1.5 TypeScript Alias Validation

Confirm `tsconfig.json` includes:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

## 1.6 Create Baseline Folder Structure

```text
src/
├── app/
│   ├── (auth)/
│   ├── (sales)/
│   └── (admin)/
├── components/
│   ├── ui/
│   ├── layout/
│   ├── leads/
│   ├── auth/
│   ├── admin/
│   └── shared/
├── services/
├── requests/
├── types/
├── constants/
├── lib/
└── hooks/
```

Add `.gitkeep` where directories are empty.

## 1.7 Add Core Constants

Create:

- `src/constants/routes.constants.ts`
- `src/constants/lead-status.constants.ts`
- `src/constants/lead-sources.constants.ts`
- `src/constants/pagination.constants.ts`

Use exported `as const` objects/arrays and typed unions for shared safety.

## 1.8 Add Global Types

Create:

- `src/types/user.data.ts`
- `src/types/lead.data.ts`

Include JSDoc on exports and role/status/source typed fields aligned with constants.

## 1.9 Configure Query Client

Create:

- `src/lib/query-client.ts`

Expose a shared `QueryClient` instance with conservative retry/stale defaults.

## Deliverables

- Project initializes and runs with `npm run dev`.
- Base folder structure exists.
- Constants/types/query client files exist and compile.
- Alias imports resolve correctly with `@/*`.

## Acceptance Criteria

- TypeScript strict build passes.
- ESLint passes with no rule violations from project standards.
- No placeholder logic and no unused exports.
- No `console.*` statements introduced.

## Handoff Notes for Next Step

Proceed to  only after setup artifacts are stable and committed to the baseline branch.
