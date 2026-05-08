# �� Sales Person: Leads List

## Goal
Build the My Leads screen with status tab filtering, search, sort, and a filter bottom sheet with multiple filter options.

---

## Screen: `/leads`

### File: `src/app/(sales)/leads/page.tsx`

---

## 5.1 — Page Sections

### Header
- Title: "My Leads"
- Right: Settings/filter icon → opens Filter Sheet

### Search Bar
- Placeholder: "Search by name, phone, car..."
- Filters the visible list in real-time (client-side) or triggers API query

### Status Tabs
Horizontal scrollable tab row:
`All (12)` | `New (4)` | `Contacted (3)` | `Interested` | (scrollable)

- Active tab: blue underline + blue text
- Count shown in parentheses next to each label
- Tapping a tab filters the list to that status

### Sort Row
- Small text: "Sort: Newest ↓" — tapping opens a sort options bottom sheet
- Sort options: Newest First, Oldest First, Name A-Z, Name Z-A

### Leads List
- Full-width scrollable list of `LeadCard` components (from )
- Each card navigates to `/leads/{id}` on tap
- Show `EmptyState` if no leads match the current filter

---

## 5.2 — Filter Bottom Sheet

### Component: `src/components/leads/LeadFilterSheet.tsx`

Triggered by the filter icon in the page header. Uses shadcn `Sheet` component (slides from bottom).

**Filter Sections:**

**STATUS**
- Toggle chips: All | New | Contacted | Interested | Test Drive | Won | Lost
- Multi-select

**SOURCE**
- Toggle chips: CarWale | CarDekho | Walk In | (from `LEAD_SOURCES` constant)
- Multi-select

**DATE RANGE**
- Two date pickers: `dd-mm-yyyy` → `dd-mm-yyyy`

**Buttons:**
- `Clear All` — resets all filters
- `Apply Filters` — applies and closes sheet

```ts
// src/types/leads-filter.data.ts

/**
 * Active filter state for the leads list
 */
export interface LeadsFilterData {
  statuses: LeadStatusType[];
  sources: LeadSourceType[];
  dateFrom?: string;
  dateTo?: string;
}
```

---

## 5.3 — Data & Requests

```ts
// src/requests/leads.request.ts

/**
 * Fetches paginated leads for the logged-in sales person with optional filters
 */
export async function getLeadsRequest(params: {
  status?: LeadStatusType;
  sources?: LeadSourceType[];
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  page?: number;
}): Promise<{ data: LeadData[] | null; error: Error | null }> {
  try {
    return { data: null, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}
```

---

## 5.4 — Services

```ts
// src/services/leads.service.ts

/**
 * Counts leads grouped by status from a local leads array
 */
export function countLeadsByStatusService(leads: LeadData[]): Record<LeadStatusType, number> {
  // returns a count map per status
}

/**
 * Filters and sorts a leads array based on active filter/sort state
 */
export function filterAndSortLeadsService(
  leads: LeadData[],
  filter: LeadsFilterData,
  sort: string
): LeadData[] {
  // returns filtered + sorted array
}
```

---

## 5.5 — Hook

```ts
// src/hooks/useLeads.ts

/**
 * Manages leads list state: data fetching, filter state, sort state, search
 */
export function useLeads() {
  // TanStack Query for getLeadsRequest
  // Local state for filter, sort, search, active tab
}
```

---

## Checklist

- [ ] Leads list page scaffold
- [ ] Search bar (controlled input)
- [ ] Status tab row — horizontal scroll, active state, counts
- [ ] Sort row + sort bottom sheet
- [ ] `LeadFilterSheet` component (shadcn Sheet)
  - [ ] Status multi-select chips
  - [ ] Source multi-select chips
  - [ ] Date range pickers
  - [ ] Clear All + Apply Filters
- [ ] `LeadsFilterData` type
- [ ] `getLeadsRequest` with filter params
- [ ] `countLeadsByStatusService` and `filterAndSortLeadsService`
- [ ] `useLeads` hook
- [ ] Empty state when no results

---

**← [Dashboard](./sales_dashboard.md) | [Lead Details →](./lead_details.md)**
