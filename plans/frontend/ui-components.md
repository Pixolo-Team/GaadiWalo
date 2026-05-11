# Frontend - UI Components

## Purpose

This document defines reusable UI building blocks for GaadiWalo so agents extend existing components instead of creating duplicates.

## Source of Truth

- Functional UI scope: `plans/frontend/implementation-steps/`
- Global rules: `AGENTS.md`, `CLAUDE.md`
- Next.js rules: `.github/skills/next-best-practices/`

## Design Direction

- Primary: `#2563EB`
- Background: `#F8F9FA` / white
- Lead status colors:
  - New: `#3B82F6`
  - Contacted: `#F97316`
  - Interested: `#8B5CF6`
  - Test Drive: `#14B8A6`
  - Won: `#22C55E`
  - Lost: `#EF4444`
- Shape: rounded cards (`rounded-2xl`), subtle shadows
- Form factor: mobile-first (base width 375px)

## Directory Ownership

All paths below are relative to `apps/frontend/src`.

- `components/ui`: shadcn primitives
- `components/layout`: app shells, headers, bottom navigation
- `components/auth`: login/reset/otp UI blocks
- `components/leads`: lead cards, badges, filters, notes sheets
- `components/admin`: team, reports, referrer, and admin-specific widgets
- `components/shared`: stat cards, empty states, avatars, loading placeholders

## Component Catalogue (Planned + Active)

| Component | Path | Purpose |
|------|------|------|
| `BottomNav` | `components/layout/BottomNav.tsx` | Role-based 5-tab bottom navigation |
| `PageHeader` | `components/layout/PageHeader.tsx` | Standardized page headers with optional actions |
| `LeadCard` | `components/leads/LeadCard.tsx` | Lead summary card in list views |
| `LeadStatusBadge` | `components/leads/LeadStatusBadge.tsx` | Status visualization using lead status color tokens |
| `LeadFilterSheet` | `components/leads/LeadFilterSheet.tsx` | Filter UI for status/source/date |
| `AddNoteSheet` | `components/leads/AddNoteSheet.tsx` | Create-note bottom sheet in lead details |
| `TeamMemberRow` | `components/admin/TeamMemberRow.tsx` | Ranked/top performer row |
| `RemoveSalespersonDialog` | `components/admin/RemoveSalespersonDialog.tsx` | Destructive confirmation with reassignment |
| `StatCard` | `components/shared/StatCard.tsx` | KPI card used across sales/admin dashboards |
| `EmptyState` | `components/shared/EmptyState.tsx` | Empty data state with message and CTA |

## Construction Rules

- Use `@/*` imports only.
- Component files use PascalCase.
- Non-component helpers use kebab-case.
- Exported props interfaces/types end with `Data` when they represent DTO models.
- Keep components focused; move business logic to `services/*`.
- Use `cva` for variant-heavy UI and `clsx` + `tailwind-merge` for class composition.

## Accessibility Standard

- Target WCAG 2.1 AA.
- All icon-only buttons must have `aria-label`.
- Dialog/Sheet components must trap focus and support keyboard close.
- Form controls must have visible labels or valid `aria-labelledby`.
- Maintain visible focus rings on keyboard navigation.

## Icons, Images, and Charts

- Icons: use project icons from `apps/frontend/src/icons/neevo-icons` first; use `lucide-react` only as fallback when an icon is not available in `neevo-icons`.
- Images: `next/image` only (no raw `img` for product UI).
- Navigation links: `next/link`.
- Programmatic navigation: `router.push()`.
- Charts: `recharts` for dashboard/report views.

## Motion and Interaction

- Keep transitions subtle and purposeful.
- Prefer CSS/tailwind transitions; avoid heavy animation libs unless required.
- Respect reduced motion preferences for non-essential animation.

## Reuse Policy

Before creating a new component:

1. Check existing files in `components/*`.
2. If similar UI exists, extend via props/variants.
3. Create new component only if reuse would reduce clarity.

## QA Checklist for Component PRs

- Reused existing component where possible
- JSDoc added to all exports
- No `console.*`
- Handles loading/empty/error states where applicable
- Mobile and desktop rendering verified
