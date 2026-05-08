# Project Overview

GaadiWalo is a role-based Car Sales CRM for dealership teams to manage leads end-to-end, from capture to conversion, with dedicated workflows for Sales and Admin users.

## Problem Statement

Dealership teams currently track leads across WhatsApp, sheets, and ad platforms with low visibility and delayed follow-ups. GaadiWalo centralizes lead intake, assignment, status tracking, reporting, and team performance.

## Target Users

- Sales Person: Manages own leads, follow-ups, notes, and conversion pipeline.
- Admin: Manages team members, lead distribution, reports, referrers, and business settings.

## MVP Features

1. Role-based authentication and protected routing.
2. Sales dashboard with day summary and quick actions.
3. Sales leads list with search, filters, and status tabs.
4. Lead details with activity log, notes, and status updates.
5. Manual lead creation and Excel/CSV import.
6. Sales profile/settings and personal performance.
7. Admin dashboard with source/team/referrer insights.
8. Admin team management (add/remove/reset/reassign).
9. Admin lead management and bulk assignment strategies.
10. Admin reports (overview/source/funnel) and performance analytics.
11. Admin referrers management and profile insights.
12. Admin settings (business, sources, cars, notifications, export, security).

## Out of Scope (Current Phase)

- Payment systems
- Customer-facing marketplace app
- Multi-tenant franchise hierarchy
- AI lead scoring and recommendation engine

## Success Metrics

- Follow-up SLA improvement (time-to-first-contact)
- Lead-to-test-drive conversion rate
- Lead-to-won conversion rate
- Admin assignment turnaround time
- Weekly active sales users

## External Dependencies

- Supabase (Auth + Postgres + optional storage)
- Vercel (deployment)
- Optional SMS/WhatsApp providers for notifications
- Excel/CSV parser libraries for import flow

## Implementation Source of Truth

Frontend execution order and requirements are defined in:

- `plans/frontend/implementation-steps/README.md`
- `plans/frontend/implementation-steps/main.md`
- `plans/frontend/implementation-steps/Step-1-Setup.md` ... `Step-15-Admin-Settings.md`
