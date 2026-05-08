# �� Sales Person: Dashboard

## Goal
Build the Sales Person home screen showing today's summary stats, leads by phase, recent leads list, and quick action buttons.

---

## Screen: `/dashboard`

### File: `src/app/(sales)/dashboard/page.tsx`

---

## 4.1 — Page Sections

### Header
- "Good Morning 👋" greeting text (time-based: Morning/Afternoon/Evening)
- Salesperson name (e.g. "Rahul Sharma")
- Avatar with initials (top right)

### Today's Summary
Three stat cards in a row:
| Stat | Description |
|------|-------------|
| Calls Due | Leads that need a call today |
| New Leads | Leads assigned today |
| Won Today | Leads marked Won today |

Use `StatCard` component from .

### Leads by Phase
Horizontal row of phase counts:
- Total (all) | New | Contacted | Interested | Test Drive | Won

Each is a tappable pill/chip. Tapping one navigates to `/leads?status={phase}`.

### Recent Leads
- Section header: "Recent Leads" with "View All →" link (navigates to `/leads`)
- List of 3-5 most recent lead cards
- Each card shows:
  - Lead name
  - Car interest (brand + model)
  - Phone number (with call icon and WhatsApp icon)
  - Status badge

Use `LeadCard` component (build in this step or ).

### Quick Actions
Two action buttons side by side:
- **+ Add New Lead** → navigates to `/leads/new`
- **Import Excel** → navigates to `/leads/import`

---

## 4.2 — Components

### `src/components/leads/LeadCard.tsx`

```ts
interface LeadCardData {
  lead: LeadData;
  onCallPress?: (phone: string) => void;
  onWhatsAppPress?: (phone: string) => void;
  onPress?: (id: string) => void;
}
```

**Design:**
- White card, rounded-2xl, subtle shadow
- Avatar (initials) on left
- Name + car interest in center
- Status badge top-right
- Phone row at bottom with call icon (📞) and WhatsApp icon (💬)

---

## 4.3 — Data & Types

```ts
// src/types/dashboard.data.ts

/**
 * Today's summary stats for a sales person
 */
export interface DashboardSummaryData {
  callsDue: number;
  newLeads: number;
  wonToday: number;
}

/**
 * Leads grouped by pipeline phase count
 */
export interface LeadsByPhaseData {
  total: number;
  new: number;
  contacted: number;
  interested: number;
  testDrive: number;
  won: number;
}
```

---

## 4.4 — Requests

```ts
// src/requests/dashboard.request.ts

/**
 * Fetches today's summary stats for the logged-in sales person
 */
export async function getDashboardSummaryRequest(): Promise<{
  data: DashboardSummaryData | null;
  error: Error | null;
}> {
  try {
    return { data: null, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}

/**
 * Fetches lead counts grouped by pipeline phase
 */
export async function getLeadsByPhaseRequest(): Promise<{
  data: LeadsByPhaseData | null;
  error: Error | null;
}> {
  try {
    return { data: null, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}

/**
 * Fetches the most recently updated leads for the sales person
 */
export async function getRecentLeadsRequest(): Promise<{
  data: LeadData[] | null;
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

## 4.5 — Services

```ts
// src/services/dashboard.service.ts

/**
 * Returns greeting text based on current hour
 */
export function getGreetingService(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}
```

---

## 4.6 — Hook

```ts
// src/hooks/useDashboard.ts

/**
 * Fetches all dashboard data — summary, phases, recent leads
 */
export function useDashboard() {
  // Use TanStack Query to fetch:
  // - getDashboardSummaryRequest
  // - getLeadsByPhaseRequest
  // - getRecentLeadsRequest
}
```

---

## Checklist

- [ ] Dashboard page scaffold
- [ ] Greeting header with avatar
- [ ] Today's Summary — 3 stat cards
- [ ] Leads by Phase — horizontal pill row, tappable
- [ ] `LeadCard` component
- [ ] Recent Leads list with View All link
- [ ] Quick Actions — Add Lead + Import Excel
- [ ] `DashboardSummaryData` and `LeadsByPhaseData` types
- [ ] Requests stubbed: `getDashboardSummaryRequest`, `getLeadsByPhaseRequest`, `getRecentLeadsRequest`
- [ ] `getGreetingService` utility
- [ ] `useDashboard` hook

---

**← [Layouts](./layouts_navigation.md) | [Sales Leads →](./sales_leads.md)**
