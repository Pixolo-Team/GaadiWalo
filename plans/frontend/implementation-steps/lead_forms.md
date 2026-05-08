# �� Sales Person: Lead Forms

## Goal
Build two lead creation flows: manual Add New Lead form and Import from Excel flow with validation preview.

---

## 7.1 — Add New Lead

### Screen: `/leads/new`
### File: `src/app/(sales)/leads/new/page.tsx`

**Header:** Back arrow + "Add New Lead" title

**Form Sections:**

### PERSONAL INFO
| Field | Type | Required |
|-------|------|----------|
| Full Name | Text input | ✅ |
| Phone Number | Tel input (+91 prefix) | ✅ |
| Email | Email input | ❌ |

### LEAD SOURCE
| Field | Type | Required |
|-------|------|----------|
| Source | Select dropdown | ✅ |

Source options from `LEAD_SOURCES` constant.

**Referrer Details** (shown only when Source = "Referral"):
| Field | Type |
|-------|------|
| Referrer full name | Text |
| Referrer phone | Tel |

### CAR INTEREST
| Field | Type | Required |
|-------|------|----------|
| Car Brand | Select dropdown | ✅ |
| Model | Select dropdown (depends on Brand) | ✅ |
| Variant / Category | Select | ❌ |
| Budget Range | Select | ❌ |

Brand options and models come from the Cars Catalogue (). For now, use constants.

### INITIAL NOTE
| Field | Type |
|-------|------|
| Initial Note | Textarea (optional) |
| Placeholder: "Any additional info about this lead..." | |

**Buttons:**
- `Create Lead` (blue, full width)
- `Cancel` (text button, navigates back)

---

## 7.2 — Form Validation (Zod schema)

```ts
// src/services/lead-form.service.ts
import { z } from "zod";

/**
 * Zod schema for the Add New Lead form
 */
export const addLeadSchemaService = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  source: z.string().min(1, "Please select a source"),
  referrerName: z.string().optional(),
  referrerPhone: z.string().optional(),
  carBrand: z.string().min(1, "Please select a car brand"),
  carModel: z.string().min(1, "Please select a model"),
  variant: z.string().optional(),
  budgetRange: z.string().optional(),
  initialNote: z.string().optional(),
});

export type AddLeadFormData = z.infer<typeof addLeadSchemaService>;
```

---

## 7.3 — Requests

```ts
// src/requests/leads.request.ts (extend)

/**
 * Creates a new lead record
 */
export async function createLeadRequest(payload: AddLeadFormData): Promise<{
  data: LeadData | null;
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

## 7.4 — Import from Excel

### Screen: `/leads/import`
### File: `src/app/(sales)/leads/import/page.tsx`

**Header:** Back arrow + "Import from Excel" title

### : Upload File

**Upload Area:**
- Dashed border box
- Upload icon
- "Tap to Upload" text
- "or drag & drop your file here" (desktop fallback)
- Supported formats: `.xls, .xlsx, .csv`

**Expected columns info:**
- Name, Phone, Email, Source, Car Brand, Car Model

**Download Sample Template** link

---

### : Validation Preview (shown after file is parsed)

Shows a summary before importing:
| Indicator | Count |
|-----------|-------|
| ✅ Valid | 48 |
| 🔁 Duplicates | 2 |
| ❌ Errors | 0 |

Total rows: 50

**Where is this data from?** dropdown — allows user to tag all leads in the file with a source

**Action Buttons:**
- `Import 48 Leads` (blue, full width)
- `← Back` (text button)

---

## 7.5 — Services

```ts
// src/services/excel-import.service.ts

/**
 * Parses an uploaded Excel/CSV file and returns structured lead rows
 */
export async function parseExcelFileService(file: File): Promise<{
  valid: RawLeadRowData[];
  duplicates: RawLeadRowData[];
  errors: RawLeadRowData[];
}> {
  // Use a library like xlsx or papaparse
}

/**
 * Validates a single raw lead row from Excel
 */
export function validateLeadRowService(row: RawLeadRowData): boolean {
  return !!(row.name && row.phone && row.phone.length === 10);
}
```

```ts
// src/types/excel-import.data.ts

/**
 * Raw row data as parsed from the Excel/CSV file
 */
export interface RawLeadRowData {
  name: string;
  phone: string;
  email?: string;
  source?: string;
  carBrand?: string;
  carModel?: string;
}

/**
 * Result of parsing an Excel file
 */
export interface ExcelParseResultData {
  valid: RawLeadRowData[];
  duplicates: RawLeadRowData[];
  errors: RawLeadRowData[];
  totalRows: number;
}
```

---

## 7.6 — Requests

```ts
/**
 * Bulk imports validated leads from Excel
 */
export async function importLeadsFromExcelRequest(leads: RawLeadRowData[], source: string): Promise<{
  data: { imported: number; skipped: number } | null;
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

**Add New Lead:**
- [ ] Page scaffold at `/leads/new`
- [ ] Personal Info section (Name, Phone, Email)
- [ ] Lead Source select with conditional Referrer fields
- [ ] Car Interest section (Brand → Model cascade)
- [ ] Initial Note textarea
- [ ] Zod schema (`addLeadSchemaService`)
- [ ] React Hook Form integration
- [ ] `createLeadRequest`
- [ ] Navigate to lead detail on success

**Import from Excel:**
- [ ] Page scaffold at `/leads/import`
- [ ] File upload dropzone (tap + drag)
- [ ] Download sample template link
- [ ] Validation preview (valid/duplicate/error counts)
- [ ] Source tagging dropdown
- [ ] `parseExcelFileService`
- [ ] `validateLeadRowService`
- [ ] `importLeadsFromExcelRequest`
- [ ] Types: `RawLeadRowData`, `ExcelParseResultData`

---

**← [Lead Details](./lead_details.md) | [Sales Profile →](./sales_profile_settings.md)**
