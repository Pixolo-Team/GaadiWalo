# �� Sales Person: Lead Details

## Goal
Build the Lead Detail screen with 3 tabs (Info, Activity, Notes), status update flow, contact actions (Call/WhatsApp), and the filter panel from the leads list.

---

## Screen: `/leads/[id]`

### File: `src/app/(sales)/leads/[id]/page.tsx`

---

## 6.1 — Page Header

- Back arrow (←)
- Title: "Lead Details"
- Right: Edit icon → future use (or navigates to edit form)
- Lead name, status badge, and time since created shown just below header:
  - Avatar (initials) + Name + Status badge ("Contacted")
  - "X days ago" subtitle

---

## 6.2 — Contact Action Row

Three action buttons in a horizontal row:
| Button | Icon | Action |
|--------|------|--------|
| Call | Phone icon | `tel:` link or call handler |
| WhatsApp | WhatsApp icon | Opens WhatsApp deep link |
| More (···) | 3 dots | Opens action menu |

---

## 6.3 — Status Update Section

Below the action row, visible on all tabs:

**UPDATE STATUS dropdown:**
- Shows current status (e.g. "Contacted")
- Tapping opens a picker with all status options
- Select Lost Reason dropdown (shown when status = Lost):
  - Options: "Went to competitor", "Budget issue", "No response", "Changed mind"

**Update Status** button (blue, full width) — calls `updateLeadStatusRequest()`

---

## 6.4 — Tabs: Info / Activity / Notes

shadcn `Tabs` component.

### Tab 1: Info

**CONTACT INFO section:**
- Phone (with copy icon)
- Email (with copy icon)
- Source (e.g. CarWale)

**CAR INTEREST section:**
- Brand (e.g. Maruti Suzuki)
- Model (e.g. Swift ZXI+)
- Colour Pref
- Budget (e.g. ₹8–9 Lakh)

---

### Tab 2: Activity

Chronological activity log — newest first.

Each activity item:
- Icon (phone/whatsapp/note/status/system)
- Description text
- Timestamp (relative: "2 days ago", or absolute for older)

Activity types:
- 📞 Call log (e.g. "Called — Not answered. Tried 2 times.")
- 💬 WhatsApp (e.g. "WhatsApp sent — EMI sheet shared.")
- 📋 Status change (e.g. "Status changed: New → Contacted")
- 🤖 System (e.g. "Lead created via CarWale import.")
- 📝 Note

**Add Note button** at bottom (floating or fixed) → opens `AddNoteSheet`

---

### Tab 3: Notes

- List of notes with author + timestamp
- Floating `+` button → opens `AddNoteSheet`

### Component: `src/components/leads/AddNoteSheet.tsx`
- shadcn `Sheet` from bottom
- Textarea: "Add a note about this lead..."
- Submit button

---

## 6.5 — Types

```ts
// src/types/lead-detail.data.ts

/**
 * Lead status update payload
 */
export interface UpdateLeadStatusData {
  leadId: string;
  status: LeadStatusType;
  lostReason?: string;
}

/**
 * Note creation payload
 */
export interface CreateNoteData {
  leadId: string;
  content: string;
}
```

---

## 6.6 — Requests

```ts
// src/requests/leads.request.ts (extend existing file)

/**
 * Fetches full lead details by ID
 */
export async function getLeadByIdRequest(id: string): Promise<{
  data: LeadData | null;
  error: Error | null;
}> {
  try {
    return { data: null, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}

/**
 * Fetches activity log for a lead
 */
export async function getLeadActivityRequest(leadId: string): Promise<{
  data: LeadActivityData[] | null;
  error: Error | null;
}> {
  try {
    return { data: null, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}

/**
 * Updates lead pipeline status
 */
export async function updateLeadStatusRequest(payload: UpdateLeadStatusData): Promise<{
  data: { success: boolean } | null;
  error: Error | null;
}> {
  try {
    return { data: null, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}

/**
 * Adds a note to a lead
 */
export async function createLeadNoteRequest(payload: CreateNoteData): Promise<{
  data: { success: boolean } | null;
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

## 6.7 — Services

```ts
// src/services/leads.service.ts (extend)

/**
 * Builds the WhatsApp deep link URL for a given phone number
 */
export function buildWhatsAppLinkService(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");
  return `https://wa.me/91${cleaned}`;
}

/**
 * Maps activity type to display icon name
 */
export function getActivityIconService(type: LeadActivityData["type"]): string {
  const map: Record<LeadActivityData["type"], string> = {
    call: "phone",
    whatsapp: "message-circle",
    note: "file-text",
    status_change: "refresh-cw",
    system: "cpu",
  };
  return map[type];
}
```

---

## Checklist

- [ ] Lead detail page with dynamic route `/leads/[id]`
- [ ] Header with lead name + status badge + back arrow
- [ ] Contact action row: Call / WhatsApp / More
- [ ] Status update section (dropdown + lost reason + Update button)
- [ ] Tab navigation: Info / Activity / Notes (shadcn Tabs)
- [ ] Info tab — Contact Info + Car Interest sections
- [ ] Activity tab — log list with icons + timestamps
- [ ] `AddNoteSheet` component
- [ ] Notes tab — list + add note
- [ ] Types: `UpdateLeadStatusData`, `CreateNoteData`
- [ ] Requests: `getLeadByIdRequest`, `getLeadActivityRequest`, `updateLeadStatusRequest`, `createLeadNoteRequest`
- [ ] Services: `buildWhatsAppLinkService`, `getActivityIconService`

---

**← [Leads](./sales_leads.md) | [Lead Forms →](./lead_forms.md)**
