# Backend – Overview

## Stack

- Node.js runtime
- Next.js API routes as backend interface
- Supabase Postgres for data
- Supabase Auth for authentication
- TypeScript strict
- Zod for request validation

## Working Directory

- Main backend code lives under `app/backend`.
- API route integration points may exist under `app/frontend/src/app/api` depending on route ownership.

## Scripts

Run from backend package folder (`app/backend` when initialized):

- Install: `npm install`
- Dev: `npm run dev`
- Build: `npm run build`
- Lint: `npm run lint`
- Test: `npm run test`

## Layering Rules

- Route handlers: HTTP boundary only.
- Requests/repositories: external IO and database calls.
- Services: business rules, pure transforms.
- Types: shared contracts/DTOs.

## Config and Secrets

- Keep env contract in `.env.example`.
- Never expose Supabase service role key to frontend.

## Operational Rules

- Validate all incoming payloads with Zod.
- Return typed safe response structures.
- Keep explicit error handling and role checks.
