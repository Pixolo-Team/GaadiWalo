# Sales Execution Plan (Current Phase)

This document defines how we will execute frontend implementation for Sales flow only.

## Current Scope

Implement only Sales-facing screens and shared components required by Sales.

Included:
- Sales dashboard
- Sales leads list
- Lead details
- Lead forms (add/import)
- Sales profile, notifications, performance
- Shared UI needed by these screens

Excluded for now:
- Admin screens
- Admin-only components
- Non-essential auth expansion beyond Sales entry needs

## Implementation Order (Mandatory)

1. `project_setup.md`
2. `authentication.md` (only what is needed for Sales access)
3. `layouts_navigation.md` (Sales layout + Sales bottom nav)
4. `sales_dashboard.md`
5. `sales_leads.md`
6. `lead_details.md`
7. `lead_forms.md`
8. `sales_profile_settings.md`

Do not start admin files in this phase:
- `admin_dashboard.md`
- `admin_team_management.md`
- `admin_lead_management.md`
- `admin_reports.md`
- `admin_performance.md`
- `admin_referrers.md`
- `admin_settings.md`

## Build Strategy

### Phase A: UI Foundation

- Build reusable Sales primitives first (`components/ui`, `components/shared`, `components/leads`)
- Reuse tokens and existing design system patterns
- Confirm responsive behavior at `sm`, `md`, `lg`, `xl`, `2xl`

### Phase B: Screen Assembly

- Implement one Sales screen at a time using the defined order
- Complete loading/empty/error states per screen
- Keep route + navigation consistency

### Phase C: Data Wiring

- Wire each screen through `requests/*Request` functions
- Keep business transforms in `services/*Service`
- Maintain typed contracts in `types/*Data`
- Follow standard API envelope (`data: T | null`)

### Phase D: Stabilization

- Verify responsive QA checklist
- Verify lint/build/type checks
- Update docs and `plans/project_status.md`

## Done Criteria Per Sales Step

A Sales step is complete only when:

- UI matches target design intent
- Mobile-first layout is stable
- API calls and local validation are wired correctly
- No `console.*`
- No unused code
- Lint/build pass
- `project_status.md` updated with done + next

## Branching and Delivery

- Create feature branch before each major Sales step
- Branch naming example: `feature/sales-dashboard-ui`
- Never commit directly to `main`/`master`/`development`

## Tracking Command

Use after each completed Sales step:

```bash
scripts/update-project-status.sh \
  --done "Completed <sales step name>" \
  --next "Start <next sales step name>"
```
