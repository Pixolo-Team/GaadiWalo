# �� Admin: Dashboard

## Goal
Build the Admin home screen showing business-wide summary stats, leads by source chart, top sales team performers, and top referrers.

---

## Screen: `/admin/dashboard`

### File: `src/app/(admin)/dashboard/page.tsx`

---

## 9.1 — Page Header

- "Admin Panel" label (small, gray)
- Admin name (e.g. "Rajiv Verma")
- Bell icon (notifications) + Avatar (top right)
- Month picker: "This Month — May 2026"

---

## 9.2 — Summary Stats Row

Three stat cards in a row:

| Stat | Description |
|------|-------------|
| Total Leads | e.g. 186 (with % change vs last month) |
| Converted | e.g. 34 (with conversion rate %) |
| Active Leads | e.g. 108 |

Below that, a secondary row:
| | |
|--|--|
| Won | 44 |
| (vs last month % indicator) | |

---

## 9.3 — Leads by Source Chart

- Section title: "Leads by Source"
- Donut chart (Recharts `PieChart`) showing:
  - CarWale (blue)
  - CarDekho (green)
  - Walk In (orange)
  - Referral (purple)
  - Other
- Legend below the chart with color dot + label

---

## 9.4 — Sales Team Section

- Section title: "Sales Team" + "View All →" link (→ `/admin/team`)
- Ranked list (top 3 performers):
  - Rank number
  - Avatar + Name
  - Lead count + Won count + Win rate %

### Component: `src/components/admin/TeamMemberRow.tsx`

---

## 9.5 — Top Referrers Section

- Section title: "Top Referrers" + "View All →" link (→ `/admin/referrers`)
- List of top referrers:
  - Avatar + Name
  - Referral count + Converted count + Conversion %
- Progress bar showing conversion rate

---

## 9.6 — Types

```ts
// src/types/admin-dashboard.data.ts

/**
 * Admin-level summary stats
 */
export interface AdminSummaryData {
  totalLeads: number;
  totalLeadsChange: number; // % vs last month
  converted: number;
  conversionRate: number;
  activeLeads: number;
  won: number;
  wonChange: number;
}

/**
 * Leads grouped by source for the donut chart
 */
export interface LeadsBySourceData {
  source: LeadSourceType;
  count: number;
  color: string;
}

/**
 * Top sales team performer summary
 */
export interface TeamPerformerData {
  rank: number;
  userId: string;
  name: string;
  leads: number;
  won: number;
  winRate: number;
}

/**
 * Top referrer summary
 */
export interface TopReferrerData {
  id: string;
  name: string;
  referrals: number;
  converted: number;
  conversionRate: number;
}
```

---

## 9.7 — Requests

```ts
// src/requests/admin-dashboard.request.ts

/**
 * Fetches admin-level summary stats for the selected period
 */
export async function getAdminSummaryRequest(period: string): Promise<{
  data: AdminSummaryData | null;
  error: Error | null;
}> {
  try {
    return { data: null, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}

/**
 * Fetches leads grouped by source for the admin dashboard chart
 */
export async function getLeadsBySourceRequest(period: string): Promise<{
  data: LeadsBySourceData[] | null;
  error: Error | null;
}> {
  try {
    return { data: null, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}

/**
 * Fetches top performing sales team members
 */
export async function getTopPerformersRequest(limit: number): Promise<{
  data: TeamPerformerData[] | null;
  error: Error | null;
}> {
  try {
    return { data: null, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}

/**
 * Fetches top referrers by conversion
 */
export async function getTopReferrersRequest(limit: number): Promise<{
  data: TopReferrerData[] | null;
  error: Error | null;
}> {
  try {
    return { data: null, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}
```

---

## Checklist

- [ ] Admin dashboard page scaffold
- [ ] Header with admin name + bell + avatar + month picker
- [ ] Summary stats row (3 cards + secondary won row)
- [ ] Leads by source donut chart (Recharts PieChart + legend)
- [ ] Sales Team section — top 3 performers + View All
- [ ] `TeamMemberRow` component
- [ ] Top Referrers section + View All
- [ ] Types: `AdminSummaryData`, `LeadsBySourceData`, `TeamPerformerData`, `TopReferrerData`
- [ ] Requests: all 4 stubbed

---

**← [Sales Profile](./sales_profile_settings.md) | [Admin Team →](./admin_team_management.md)**
