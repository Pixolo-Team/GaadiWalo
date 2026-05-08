# AutoLead CRM – Frontend Development Plan

## Project Overview

**AutoLead** is a Car Sales CRM with two user roles:
- **Sales Person** – manages their own leads, activities, and performance
- **Admin** – manages the full team, leads, reports, and system configuration

**Tech Stack:**
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- React Hook Form + Zod (forms & validation)
- Recharts (charts/performance graphs)
- TanStack Query (server state)

---

## Step-by-Step Plan

| Step | Name | Description |
|------|------|-------------|
| [project_setup](./project_setup.md) | Project Setup | Init Next.js, configure TypeScript, Tailwind, shadcn/ui, folder structure, constants, project-wide coding rules |
| [authentication](./authentication.md) | Authentication | Login, Forgot Password, Verify OTP, Set New Password pages |
| [layouts_navigation](./layouts_navigation.md) | Layouts & Navigation | Bottom nav layout for Sales Person, Bottom nav layout for Admin, route guards by role |
| [sales_dashboard](./sales_dashboard.md) | Sales Person – Dashboard | Home screen: today's summary, leads by phase, recent leads, quick actions |
| [sales_leads](./sales_leads.md) | Sales Person – Leads | My Leads list, status tabs (All/New/Contacted/Interested), filter sheet, search |
| [lead_details](./lead_details.md) | Sales Person – Lead Details | Lead detail tabs: Info, Activity log, Notes; Update Status; contact actions |
| [lead_forms](./lead_forms.md) | Sales Person – Lead Forms | Add New Lead form, Import from Excel flow |
| [sales_profile_settings](./sales_profile_settings.md) | Sales Person – Profile & Settings | Profile menu, Edit Profile, Change Password, Notification Preferences, My Performance report |
| [admin_dashboard](./admin_dashboard.md) | Admin – Dashboard | Summary cards, leads by source chart, sales team list, top referrers |
| [admin_team_management](./admin_team_management.md) | Admin – Team Management | Sales Team list, Salesperson detail, Add Salesperson, Remove Salesperson modal |
| [admin_lead_management](./admin_lead_management.md) | Admin – Lead Management | Add Lead (with assign), Import Leads (with duplicate detection + assign flow) |
| [admin_reports](./admin_reports.md) | Admin – Reports | Reports: Overview tab, Source tab, Funnel tab; date range picker |
| [admin_performance](./admin_performance.md) | Admin – Performance | Salesperson performance view: stats, lead status breakdown, weekly activity, source-wise leads |
| [admin_referrers](./admin_referrers.md) | Admin – Referrers | Referrers list, Referrer Profile detail page |
| [admin_settings](./admin_settings.md) | Admin – Settings | Business Info, Lead Sources Config, Cars Catalogue (brands & models), Notification Settings, Export Data, Privacy & Security |

---

## Folder Structure (Target)

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   ├── forgot-password/
│   │   ├── verify-otp/
│   │   └── new-password/
│   ├── (sales)/
│   │   ├── dashboard/
│   │   ├── leads/
│   │   │   ├── [id]/
│   │   ├── notifications/
│   │   ├── performance/
│   │   └── profile/
│   └── (admin)/
│       ├── dashboard/
│       ├── team/
│       │   ├── [id]/
│       ├── leads/
│       ├── reports/
│       ├── referrers/
│       │   ├── [id]/
│       └── settings/
│           ├── business-info/
│           ├── lead-sources/
│           ├── cars-catalogue/
│           ├── notifications/
│           ├── export/
│           └── privacy/
├── components/
│   ├── ui/              # shadcn components
│   ├── layout/          # bottom-nav, page-header, etc.
│   ├── leads/           # lead-card, lead-status-badge, filter-sheet, etc.
│   ├── auth/            # login-form, otp-input, etc.
│   ├── admin/           # team-card, performance-chart, etc.
│   └── shared/          # avatar, stat-card, empty-state, etc.
├── services/
│   ├── auth.service.ts
│   ├── leads.service.ts
│   ├── team.service.ts
│   ├── reports.service.ts
│   └── ...
├── requests/
│   ├── auth.request.ts
│   ├── leads.request.ts
│   ├── team.request.ts
│   └── ...
├── types/
│   ├── lead.data.ts
│   ├── user.data.ts
│   ├── report.data.ts
│   └── ...
├── constants/
│   ├── lead-status.constants.ts
│   ├── lead-sources.constants.ts
│   ├── pagination.constants.ts
│   └── routes.constants.ts
├── lib/
│   ├── utils.ts
│   └── query-client.ts
└── hooks/
    ├── useLeads.ts
    ├── useAuth.ts
    └── ...
```

---

## Naming Convention Cheatsheet

| Type | Convention | Example |
|------|-----------|---------|
| File (non-component) | kebab-case | `leads.service.ts` |
| File (component) | PascalCase | `LeadCard.tsx` |
| Function (API call) | verb + Request | `getLeadsRequest()` |
| Function (business logic) | verb + Service | `mapLeadStatusService()` |
| Type / Interface | PascalCase + Data | `LeadData`, `UserProfileData` |
| Constants | UPPER_SNAKE_CASE | `DEFAULT_PAGE_SIZE` |
| Imports | Always use `@/` alias | `@/services/leads.service` |

---

## Design Reference

- Primary color: `#2563EB` (blue)
- Background: White / Light gray (`#F8F9FA`)
- Status colors: New (blue), Contacted (orange), Interested (purple), Test Drive (teal), Won (green), Lost (red)
- Bottom navigation: 5 tabs per role
- Mobile-first design (375px base)
- Cards use subtle shadows + rounded corners (`rounded-2xl`)
