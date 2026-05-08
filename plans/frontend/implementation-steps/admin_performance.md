# �� Admin: Performance (Salesperson View)

## Goal
Build the admin-facing performance view for a specific salesperson, including stats, lead status breakdown, weekly activity chart, and source-wise leads.

---

## Screen: `/admin/team/[id]/performance`
### File: `src/app/(admin)/team/[id]/performance/page.tsx`

---

## 13.1 — Header

- Back arrow + "Performance" title
- Month picker dropdown: "This Month ▾"

---

## 13.2 — Salesperson Hero Card

- Avatar + Name
- User ID + Status badge (Active) + Branch
- This month summary row: Leads | Won | Win rate %

---

## 13.3 — Stats

| Stat | |
|------|--|
| Total Leads (this month) | |
| Calls Made | |
| Won | Win rate % |
| Lost | Loss rate % |

---

## 13.4 — Lead Status Breakdown

Horizontal progress bars per status:
- New: count + bar
- Contacted: count + bar
- Interested: count + bar
- Test Drive: count + bar
- Won: count + bar

Use status colors from `LEAD_STATUS_COLORS`.

---

## 13.5 — Weekly Activity Bar Chart

- Recharts `BarChart`
- X axis: Mon–Sun
- Two bars: Calls (blue) + Leads (gray)

Reuse `WeeklyActivityData` type from .

---

## 13.6 — Source-wise Leads

List with color dot + source name + count. Same as Sales Person performance () but for the selected salesperson.

---

## 13.7 — Request

```ts
// src/requests/admin-performance.request.ts

/**
 * Fetches performance data for a specific salesperson
 */
export async function getSalespersonPerformanceRequest(
  salespersonId: string,
  period: string
): Promise<{ data: PerformanceData | null; error: Error | null }> {
  try { return { data: null, error: null }; }
  catch (error) { return { data: null, error: error as Error }; }
}
```

---

## Checklist

- [ ] Admin performance page at `/admin/team/[id]/performance`
- [ ] Hero card with salesperson info
- [ ] Stats row
- [ ] Lead status breakdown bars
- [ ] Weekly activity bar chart (Recharts)
- [ ] Source-wise leads list
- [ ] `getSalespersonPerformanceRequest`

---

**← [Reports](./admin_reports.md) | [Referrers →](./admin_referrers.md)**
