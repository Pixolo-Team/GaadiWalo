# �� Admin: Lead Management

## Goal
Build Admin's Add Lead form (with salesperson assignment) and the Import Leads flow with duplicate detection and assignment options.

---

## 11.1 — Add Lead (Admin)

### Screen: `/admin/leads/new`
### File: `src/app/(admin)/leads/new/page.tsx`

Same form fields as Sales Person Add Lead () **plus an additional assignment section:**

**ASSIGN TO SALESPERSON section** (shown at the bottom of the form):
- Dropdown: select salesperson (or "Leave unassigned")
- Helper text: "The assigned person will get a notification immediately."

**Buttons:**
- `Create & Assign Lead` (blue, full width)
- `Cancel`

Reuse the `addLeadSchemaService` from , extending it with optional `assignedTo` field.

---

## 11.2 — Import Leads (Admin)

### Screen: `/admin/leads/import`
### File: `src/app/(admin)/leads/import/page.tsx`

Same upload flow as  **plus assignment options after validation:**

**After parsing, additional step: Assign Imported Leads**

Options (radio select):
- ✅ Assign imported leads → team (auto-distribute evenly across team)
- Assign all to one person → dropdown to select
- Leave unassigned (assign later)

This assignment config is sent with the `importLeadsFromExcelRequest()` call.

Add `assignmentStrategy` to the import request payload:
```ts
export type AssignmentStrategyType = "distribute" | "single" | "unassigned";

export interface ImportAssignmentData {
  strategy: AssignmentStrategyType;
  assignToId?: string; // required if strategy = "single"
}
```

---

## 11.3 — Requests (extend from )

```ts
/**
 * Admin bulk lead import with assignment strategy
 */
export async function adminImportLeadsRequest(
  leads: RawLeadRowData[],
  source: string,
  assignment: ImportAssignmentData
): Promise<{ data: { imported: number; skipped: number } | null; error: Error | null }> {
  try {
    return { data: null, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}
```

---

## Checklist

- [ ] Admin Add Lead page — reuse form from  + assignment dropdown
- [ ] Admin Import Leads page — reuse upload flow + assignment strategy step
- [ ] `ImportAssignmentData` type + `AssignmentStrategyType`
- [ ] `adminImportLeadsRequest`

---

**← [Admin Team](./admin_team_management.md) | [Admin Reports →](./admin_reports.md)**
