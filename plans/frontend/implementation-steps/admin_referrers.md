# �� Admin: Referrers

## Goal
Build the Referrers list screen and individual Referrer Profile detail page.

---

## 14.1 — Referrers List

### Screen: `/admin/referrers`
### File: `src/app/(admin)/referrers/page.tsx`

**Header:** "Referrers" title + search bar + sort (All Time / Most Referrals)

**Referrer cards — each shows:**
- Rank number (top badge for #1)
- Avatar (initials)
- Name
- Referral count, Won count, Conversion rate %
- Horizontal conversion rate progress bar

Tapping a card navigates to `/admin/referrers/{id}`.

---

## 14.2 — Referrer Profile

### Screen: `/admin/referrers/[id]`
### File: `src/app/(admin)/referrers/[id]/page.tsx`

**Header:** Back arrow + "Referrer Profile"

**Hero card:**
- Avatar (initials, purple background)
- Name
- "Top Referrer" badge
- Stats row: Total Referred | Won | Conversion %

**CONTACT INFO section:**
- Phone (tappable)
- Email
- City
- Since (join month/year)

**Referred Leads section:**
- List of leads referred by this person
- Each row: Lead name + Status badge + Month/Year
- Shows top 3-5 with "View All" option

---

## 14.3 — Types

```ts
// src/types/referrer.data.ts

/**
 * Referrer record
 */
export interface ReferrerData {
  id: string;
  name: string;
  phone: string;
  email?: string;
  city?: string;
  since: string; // e.g. "Feb 2025"
  totalReferrals: number;
  won: number;
  conversionRate: number;
}

/**
 * A lead attributed to a referrer
 */
export interface ReferredLeadData {
  id: string;
  leadName: string;
  status: LeadStatusType;
  month: string;
}
```

---

## 14.4 — Requests

```ts
// src/requests/referrers.request.ts

/**
 * Fetches all referrers with optional sort
 */
export async function getReferrersRequest(sort?: string): Promise<{
  data: ReferrerData[] | null;
  error: Error | null;
}> {
  try { return { data: null, error: null }; }
  catch (error) { return { data: null, error: error as Error }; }
}

/**
 * Fetches a referrer profile by ID
 */
export async function getReferrerByIdRequest(id: string): Promise<{
  data: ReferrerData | null;
  error: Error | null;
}> {
  try { return { data: null, error: null }; }
  catch (error) { return { data: null, error: error as Error }; }
}

/**
 * Fetches leads attributed to a specific referrer
 */
export async function getReferredLeadsRequest(referrerId: string): Promise<{
  data: ReferredLeadData[] | null;
  error: Error | null;
}> {
  try { return { data: null, error: null }; }
  catch (error) { return { data: null, error: error as Error }; }
}
```

---

## Checklist

- [ ] Referrers list page — search, sort, ranked cards
- [ ] Referrer Profile page — hero card, contact info, referred leads
- [ ] Types: `ReferrerData`, `ReferredLeadData`
- [ ] Requests: `getReferrersRequest`, `getReferrerByIdRequest`, `getReferredLeadsRequest`

---

**← [Admin Performance](./admin_performance.md) | [Admin Settings →](./admin_settings.md)**
