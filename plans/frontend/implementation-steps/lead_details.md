# Sales Person: Lead Details

## Goal

Build the Sales Lead Details experience for `/leads/[id]` so a Sales user can view one lead, contact the prospect, review history, add notes, and update status without leaving the detail screen.

This step comes after `sales_leads.md` and before `lead_forms.md` in the active sales execution order.

## Scope

In scope for this step:

- Lead detail page shell and route
- Summary header and contact actions
- Status update flow
- Tabs for `Info`, `Activity`, and `Notes`
- Add note bottom sheet
- API request contracts for reading and mutating lead detail data
- Frontend helper services and types needed by this screen

Out of scope for this step:

- Full lead edit screen
- Admin reassignment actions
- Inventory-aware matching or vehicle reactivation workflows
- Reusing leads-list filters inside the detail page unless product explicitly requests it later

## Data Reference

This plan should follow:

- `plans/frontend/implementation-steps/README.md`
- `plans/backend/database-schema.md`
- `plans/project-decisions.md`

Lead detail work maps to these current backend entities:

- `leads`
  - `id`
  - `full_name`
  - `phone`
  - `email`
  - `source`
  - `status`
  - `assigned_to`
  - `created_by`
  - `created_at`
  - `updated_at`
- `lead_notes`
  - `id`
  - `lead_id`
  - `author_id`
  - `content`
  - `created_at`
- `lead_activities`
  - `id`
  - `lead_id`
  - `type`
  - `description`
  - `meta_json`
  - `created_at`

Important schema note:

- `plans/project-decisions.md` also defines lead vehicle-preference fields such as `car_brand_id`, `car_model_id`, `variant_name`, `color_preference`, `budget`, and `is_used`.
- The detail screen should be planned to display these fields in the `Info` tab, but backend and schema alignment may still be required if those columns are not yet present in the active database implementation.

## Route Plan

### Screen

- Route: `apps/frontend/src/app/(sales)/leads/[id]/page.tsx`
- Dynamic param: `id`
- Root element: `section`

### Supporting Components

- `apps/frontend/src/components/leads/LeadSummaryCard.tsx`
- `apps/frontend/src/components/leads/LeadContactActions.tsx`
- `apps/frontend/src/components/leads/LeadStatusUpdateCard.tsx`
- `apps/frontend/src/components/leads/LeadInfoTab.tsx`
- `apps/frontend/src/components/leads/LeadActivityTab.tsx`
- `apps/frontend/src/components/leads/LeadNotesTab.tsx`
- `apps/frontend/src/components/leads/AddNoteSheet.tsx`

These may be merged if the page stays small, but the preferred direction is to keep the route file thin and push UI blocks into lead-domain components.

## UX Flow

### 1. Entry Flow

1. Sales user taps a lead card from `/leads`.
2. App navigates to `/leads/[id]`.
3. Detail page loads summary data first and shows loading states.
4. Page fetches:
   - lead record
   - lead activity list
   - lead notes list
5. User lands on the `Info` tab by default.

### 2. Contact Flow

1. User taps `Call`.
2. App opens a `tel:` link using the lead phone number.
3. User taps `WhatsApp`.
4. App opens a WhatsApp deep link built from the lead phone number.
5. Optional future action menu can hold edit or share actions.

### 3. Status Update Flow

1. User selects a new status from the dropdown.
2. If status is `LOST`, the lost-reason field appears.
3. If status is `VEHICLE_NA`, keep the flow open for a future vehicle-availability reason or note.
4. User taps `Update Status`.
5. Frontend calls `updateLeadStatusRequest`.
6. On success:
   - refresh lead summary
   - refresh activity tab
   - preserve current tab selection
   - show success feedback

### 4. Notes Flow

1. User opens `AddNoteSheet` from the `Notes` or `Activity` tab.
2. User enters note content.
3. Frontend validates non-empty input.
4. Frontend calls `createLeadNoteRequest`.
5. On success:
   - close sheet
   - prepend the note in `Notes`
   - prepend a corresponding item in `Activity` if backend logs it
   - clear sheet state

## UI Sections

### Header and Summary

- Back navigation to `/leads`
- Title: `Lead Details`
- Optional right-side action button reserved for future edit flow
- Lead summary block:
  - initials avatar
  - full name
  - status badge
  - relative created time
  - optional source label

### Contact Actions

- `Call`
- `WhatsApp`
- `More`

Actions should be large enough for touch use on the 375px baseline.

### Status Update Card

- Current status select
- Conditional lost-reason select for `LOST`
- Update button

Recommended status list from `plans/project-decisions.md`:

- `NEW`
- `CONTACTED`
- `INTERESTED`
- `TEST_DRIVE`
- `NEGOTIATION`
- `WON`
- `LOST`
- `VEHICLE_NA`

### Tabs

- `Info`
- `Activity`
- `Notes`

Use shadcn `Tabs`.

### Info Tab

Display grouped read-only blocks:

- Contact Info
  - phone
  - email
  - source
- Car Interest
  - brand
  - model
  - variant
  - color preference
  - budget
  - used/new preference if available
- Ownership
  - assigned sales user
  - created by
  - created at
  - updated at

### Activity Tab

Display newest-first activity items using `lead_activities`.

Supported activity types should include:

- `call`
- `whatsapp`
- `note`
- `status_change`
- `system`

### Notes Tab

Display newest-first notes using `lead_notes`.

Each note should show:

- author name
- note content
- timestamp

## Frontend Types

### File

- `apps/frontend/src/types/lead-detail.data.ts`

### Planned Contracts

```ts
/**
 * Lead status values shown on the lead details screen
 */
export type LeadStatusType =
  | "NEW"
  | "CONTACTED"
  | "INTERESTED"
  | "TEST_DRIVE"
  | "NEGOTIATION"
  | "WON"
  | "LOST"
  | "VEHICLE_NA";

/**
 * Lead activity item for timeline rendering
 */
export interface LeadActivityData {
  id: string;
  leadId: string;
  type: "call" | "whatsapp" | "note" | "status_change" | "system";
  description: string;
  metaJson: Record<string, unknown> | null;
  createdAt: string;
}

/**
 * Lead note item for notes rendering
 */
export interface LeadNoteData {
  id: string;
  leadId: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: string;
}

/**
 * Lead detail payload used by the detail screen
 */
export interface LeadDetailData {
  id: string;
  fullName: string;
  phone: string;
  email: string | null;
  source: string;
  status: LeadStatusType;
  assignedToUserId: string | null;
  assignedToUserName: string | null;
  createdByUserId: string | null;
  createdByUserName: string | null;
  createdAt: string;
  updatedAt: string;
  carBrand: string | null;
  carModel: string | null;
  variantName: string | null;
  colorPreference: string | null;
  budget: string | null;
  isUsed: boolean | null;
}

/**
 * Lead status update payload
 */
export interface UpdateLeadStatusData {
  leadId: string;
  status: LeadStatusType;
  lostReason: string | null;
}

/**
 * Note creation payload
 */
export interface CreateLeadNoteData {
  leadId: string;
  content: string;
}
```

## Request Layer Plan

### File

- `apps/frontend/src/requests/leads.request.ts`

### Required Requests

```ts
/**
 * Fetches a lead by id for the detail screen
 */
export async function getLeadByIdRequest(
  leadId: string,
): Promise<{ data: LeadDetailData | null; error: Error | null }> {}

/**
 * Fetches the activity list for one lead
 */
export async function getLeadActivityRequest(
  leadId: string,
): Promise<{ data: LeadActivityData[] | null; error: Error | null }> {}

/**
 * Fetches the notes list for one lead
 */
export async function getLeadNotesRequest(
  leadId: string,
): Promise<{ data: LeadNoteData[] | null; error: Error | null }> {}

/**
 * Updates a lead status from the detail screen
 */
export async function updateLeadStatusRequest(
  payload: UpdateLeadStatusData,
): Promise<{ data: LeadDetailData | null; error: Error | null }> {}

/**
 * Creates a new note for one lead
 */
export async function createLeadNoteRequest(
  payload: CreateLeadNoteData,
): Promise<{ data: LeadNoteData | null; error: Error | null }> {}
```

Implementation rules:

- Axios only
- API helpers must end with `Request`
- Consume backend REST endpoints only
- Use typed response envelopes and unwrap them consistently

## Service Layer Plan

### Files

- `apps/frontend/src/services/lead-details.service.ts`
- `apps/frontend/src/services/lead-note.service.ts`

### Planned Helpers

```ts
/**
 * Builds a WhatsApp deep link for the provided phone number
 */
export function buildWhatsAppLinkService(phone: string): string {}

/**
 * Returns the icon token for a lead activity type
 */
export function getLeadActivityIconService(
  type: LeadActivityData["type"],
): string {}

/**
 * Returns whether a lost reason is required for the selected status
 */
export function shouldRequireLostReasonService(
  status: LeadStatusType,
): boolean {}
```

## Backend Dependency Plan

The frontend step depends on backend support for:

- `GET /leads/:id`
- `GET /leads/:id/activities`
- `GET /leads/:id/notes`
- `PATCH /leads/:id/status`
- `POST /leads/:id/notes`

Backend rules must stay aligned with repo standards:

- `Route -> Controller -> Service -> Supabase`
- Zod validation at the boundary
- `QueryResponseData<T>` service contract
- standard response envelope through `sendResponse()`

## Suggested Build Order

1. Define `lead-detail.data.ts` contracts.
2. Extend `leads.request.ts` with read and mutation requests.
3. Add lead-detail helper services.
4. Build route shell at `/leads/[id]`.
5. Build summary and contact action components.
6. Build status update card.
7. Build tabs and empty/loading states.
8. Build `AddNoteSheet`.
9. Connect mutations and refresh logic.
10. Validate responsive behavior across `375px`, `sm`, `md`, `lg`, `xl`, and `2xl`.

## QA Checklist

- Dynamic route opens the correct lead by id
- Page uses a `section` root and mobile-first layout
- No frontend direct Supabase access
- Axios-only request layer
- Status change refreshes visible data correctly
- Lost reason appears only when required
- Notes can be added without page reload
- Activity and notes sort newest-first
- Phone and WhatsApp actions use valid links
- No horizontal overflow on mobile
- Touch targets remain usable on small screens

## Risks and Open Questions

- Vehicle-preference fields are defined in `plans/project-decisions.md`, but the schema summary in `plans/backend/database-schema.md` does not list them under `leads`. Backend confirmation may be needed before implementation.
- The original step mentioned a leads-list filter panel on the detail screen. That interaction does not naturally fit the detail page and should stay out of scope unless there is a product reason to reuse it here.
- If activity creation for notes and status changes is handled only on the backend, frontend should refresh rather than simulate timeline items locally.

## Completion Checklist

- [ ] Route scaffold for `/leads/[id]`
- [ ] Summary header and status badge
- [ ] Contact action row
- [ ] Status update card
- [ ] `Tabs` for `Info`, `Activity`, and `Notes`
- [ ] `Info` tab content sections
- [ ] `Activity` tab timeline
- [ ] `Notes` tab list
- [ ] `AddNoteSheet`
- [ ] `LeadDetailData`, `LeadActivityData`, `LeadNoteData`
- [ ] `getLeadByIdRequest`
- [ ] `getLeadActivityRequest`
- [ ] `getLeadNotesRequest`
- [ ] `updateLeadStatusRequest`
- [ ] `createLeadNoteRequest`
- [ ] Responsive QA pass

**← [Leads](./sales_leads.md) | [Lead Forms →](./lead_forms.md)**
