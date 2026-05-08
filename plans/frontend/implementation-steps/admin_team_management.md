# �� Admin: Team Management

## Goal
Build the Sales Team list, Salesperson Detail view with quick actions, Add Salesperson form, and the Remove Salesperson confirmation modal.

---

## 10.1 — Sales Team List

### Screen: `/admin/team`
### File: `src/app/(admin)/team/page.tsx`

**Header:** "Sales Team" title + search bar

**Team member cards — each shows:**
- Avatar (initials)
- Name
- User ID + Branch (e.g. "SP002 · Mumbai")
- Status badge: Active / Inactive
- This month stats: Leads | Won | Win rate %

Tapping a card navigates to `/admin/team/{id}`.

---

## 10.2 — Salesperson Detail

### Screen: `/admin/team/[id]`
### File: `src/app/(admin)/team/[id]/page.tsx`

**Header:** Back arrow + Salesperson name + "Edit" button (top right)

**Hero card (blue background):**
- Avatar + Name
- User ID + Role (e.g. "SP002 · Mumbai")
- Status badge (Active)
- This month stats: Leads | Won | Win rate %

**QUICK ACTIONS list:**
- View Full Performance (→ performance page filtered to this user)
- View Assigned Leads (→ leads list filtered to this user)
- Assign New Lead (→ opens lead assignment flow)
- Edit Profile Info (→ edit salesperson form)
- Reset Password

**DANGER ZONE (red section):**
- Revoke Access toggle (disables login)
- Remove from Team (red button) → opens confirm delete modal

---

## 10.3 — Add Salesperson

### Screen: `/admin/team/new`
### File: `src/app/(admin)/team/new/page.tsx`

**Header:** Back arrow + "Add Salesperson"

**Form Fields:**
| Field | Type | Required |
|-------|------|----------|
| Full Name | Text | ✅ |
| Phone Number | Tel (+91 prefix) | ✅ |
| Email | Email | ✅ |
| Assign Branch | Select | ✅ |
| Role | Select (Sales Executive, Senior SE, etc.) | ✅ |
| Auto-generate User ID | Read-only, auto-generated (e.g. SP007) | — |
| Temporary Password | Text (auto-filled e.g. Auto@1234) | — |

Info text: "User will be asked to change their password on first login."

**Add Salesperson** button (blue, full width).

---

## 10.4 — Remove Salesperson Modal

### Component: `src/components/admin/RemoveSalespersonDialog.tsx`

shadcn `Dialog` (confirmation modal).

**Content:**
- Red warning header: "Confirm Removal"
- Warning text: "Sneha Kapoor will be removed with her 39 active leads. Leads will be re-assigned. This cannot be undone."
- **Reassign Leads To** dropdown → select another salesperson
- `Yes, Remove Sneha` button (red)
- Cancel

---

## 10.5 — Types

```ts
// src/types/salesperson.data.ts

/**
 * Sales team member record
 */
export interface SalespersonData {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  email: string;
  branch: string;
  role: string;
  status: "Active" | "Inactive";
  joinedAt: string;
  thisMonth: {
    leads: number;
    won: number;
    winRate: number;
  };
}

/**
 * Add salesperson form payload
 */
export interface AddSalespersonFormData {
  fullName: string;
  phone: string;
  email: string;
  branch: string;
  role: string;
}

/**
 * Remove salesperson payload
 */
export interface RemoveSalespersonData {
  salespersonId: string;
  reassignToId: string;
}
```

---

## 10.6 — Requests

```ts
// src/requests/team.request.ts

/**
 * Fetches all salespersons in the team
 */
export async function getTeamRequest(): Promise<{
  data: SalespersonData[] | null;
  error: Error | null;
}> {
  try {
    return { data: null, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}

/**
 * Fetches a single salesperson by ID
 */
export async function getSalespersonByIdRequest(id: string): Promise<{
  data: SalespersonData | null;
  error: Error | null;
}> {
  try {
    return { data: null, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}

/**
 * Creates a new salesperson account
 */
export async function createSalespersonRequest(payload: AddSalespersonFormData): Promise<{
  data: SalespersonData | null;
  error: Error | null;
}> {
  try {
    return { data: null, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}

/**
 * Removes a salesperson and reassigns their leads
 */
export async function removeSalespersonRequest(payload: RemoveSalespersonData): Promise<{
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
 * Resets a salesperson's password to a temporary one
 */
export async function resetSalespersonPasswordRequest(salespersonId: string): Promise<{
  data: { tempPassword: string } | null;
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

## 10.7 — Services

```ts
// src/services/team.service.ts

/**
 * Generates a new sequential User ID for a new salesperson
 */
export function generateUserIdService(existingIds: string[]): string {
  // e.g. SP001, SP002 → next is SP003
  const nums = existingIds.map(id => parseInt(id.replace("SP", ""), 10)).filter(Boolean);
  const next = Math.max(0, ...nums) + 1;
  return `SP${String(next).padStart(3, "0")}`;
}

/**
 * Generates a temporary password for a new salesperson
 */
export function generateTempPasswordService(): string {
  return "Auto@1234"; // In real implementation: random secure temp password
}
```

---

## Checklist

- [ ] Sales Team list page with search
- [ ] Team member card component
- [ ] Salesperson Detail page (`/admin/team/[id]`)
  - [ ] Hero card
  - [ ] Quick actions list
  - [ ] Danger zone (Revoke + Remove)
- [ ] Add Salesperson form page
  - [ ] All fields with validation
  - [ ] Auto-generated User ID + temp password
- [ ] `RemoveSalespersonDialog` modal with reassign dropdown
- [ ] Types: `SalespersonData`, `AddSalespersonFormData`, `RemoveSalespersonData`
- [ ] Requests: all 5 stubbed
- [ ] Services: `generateUserIdService`, `generateTempPasswordService`

---

**← [Admin Dashboard](./admin_dashboard.md) | [Admin Leads →](./admin_lead_management.md)**
