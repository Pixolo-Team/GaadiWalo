# Sales Project Spec

## Q1: What are we really trying to do? What are the goals for this project?

Build a mobile-first Sales CRM flow for GaadiWalo so a sales executive can:

- See daily priorities immediately
- Manage leads quickly
- Take action fast (call, WhatsApp, add/import lead)
- Track personal performance clearly

Current focus is Sales flow only.
Admin and full Auth flow are separate tracks.

## Tech Stack (Source of Truth: AGENTS.md)

- Frontend: Next.js (App Router), React, TypeScript (strict), Tailwind CSS, shadcn/ui
- Backend: Node.js + Hono (TypeScript strict)
- Data/Auth: Supabase (DB + Auth)
- API: REST only
- HTTP Client: Axios only
- Validation: Zod at route/controller boundary
- Deployment: Vercel

## Q2: What are the milestones of functionality?

### MVP (Sales UI + Core Flow)

- Sales Dashboard:
  - greeting
  - today summary
  - leads by phase
  - recent leads
  - quick actions
- Leads list with:
  - search
  - status tabs
  - sort/filter trigger
- Lead cards with:
  - call action
  - copy action
  - WhatsApp action
- Add New Lead form (manual)
- Import Leads (Excel/CSV basic flow)
- Bottom navigation:
  - Home
  - Leads
  - Add
  - Alerts
  - Profile
- Profile basics + notification preferences + quiet hours UI
- Performance screen:
  - stats
  - pipeline progress
  - weekly chart
  - source breakdown
- Responsive mobile-first behavior and reusable component system

### v1 (Sales Completion)

- Lead details screen:
  - info
  - activity
  - notes
- Update lead status flow (including lost reason handling)
- Add note interactions and activity logging UI
- Strong empty/loading/error states across all sales screens
- Connected API integration with typed responses (`data: T | null`)

### v2 (Sales Optimization)

- Advanced filters/sorting on leads:
  - date ranges
  - source
  - multi-select
- Better import validation UX:
  - duplicates/errors preview
  - recoverability
- Performance insights polish (better trend summaries)
- Reusable UI tokens/components hardened for future Admin reuse

### Later

- Admin screens implementation track
- Full production auth hardening and role guard refinements
- Reports/history/audit conveniences for sales actions

### Not in scope for now

- Admin module delivery
- Complete Auth feature set rollout beyond required Sales entry points
- Payment/billing/multi-tenant enterprise controls

## Notes

- Design source: Figma Sales flow (`node-id=176:2`) and child Sales frames.
- Implementation should follow conventions in `AGENTS.md` and `CLAUDE.md`.
- Path conventions and plan sequencing should remain aligned with `plans/frontend/implementation-steps/`.
