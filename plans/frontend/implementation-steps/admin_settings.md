# �� Admin: Settings

## Goal
Build the Admin Profile menu and all settings sub-pages: Business Info, Lead Sources Config, Cars Catalogue, Notification Settings, Export Data, and Privacy & Security.

---

## 15.1 — Admin Profile Menu

### Screen: `/admin/profile`
### File: `src/app/(admin)/profile/page.tsx`

**Header card (blue):**
- Avatar (initials)
- Admin name
- Role + Branch (e.g. "Owner | Admin · Mumbai")

**Menu items:**
- Edit Business Info
- Manage Team (→ `/admin/team`)
- Lead Sources Config
- Car Brands & Models
- Notification Settings
- Export All Data
- Privacy & Security
- Logout (red)

---

## 15.2 — Business Info

### Screen: `/admin/settings/business-info`
### File: `src/app/(admin)/settings/business-info/page.tsx`

**Header:** Back + "Business Info" + "Save" button

**Fields:**
| Field | Type |
|-------|------|
| Business / Showroom Name | Text |
| GST Number | Text |
| Phone (Primary) | Tel |
| WhatsApp Business | Tel |
| Email | Email |
| Full Address | Textarea |
| Working Hours | Time range (e.g. 9:00 AM – 7:00 PM) |

**Logo Upload section:** Avatar upload area (tap to upload logo).

---

## 15.3 — Lead Sources Config

### Screen: `/admin/settings/lead-sources`
### File: `src/app/(admin)/settings/lead-sources/page.tsx`

**Header:** Back + "Lead Sources"

Info text: "These sources appear in the Lead form and reports. Tap a brand to manage its models."

**Active Sources list (toggle per source):**
- CarWale (toggle on/off)
- CarDekho
- Walk In
- Referral
- Facebook Ad
- Instagram Ad
- Google Ad

**+ Add Custom Source** row at bottom → inline text input to add new source.

---

## 15.4 — Cars Catalogue

### Screen: `/admin/settings/cars-catalogue`
### File: `src/app/(admin)/settings/cars-catalogue/page.tsx`

**Header:** Back + "Cars Catalogue"

Info text: "Car brands & models appear in the lead form and reports. Tap a brand to manage its models."

**Brands list — each row:**
- Brand name (e.g. Maruti Suzuki)
- Model count (e.g. "5 models")
- "Remove" text button (red)

**+ Add New Brand** button at bottom.

Tapping a brand expands or navigates to model list for that brand:
- List of models (e.g. Swift, Baleno, Dzire)
- "Remove" per model
- "+ Add Model" inline input

---

## 15.5 — Notification Settings (Admin)

### Screen: `/admin/settings/notifications`
### File: `src/app/(admin)/settings/notifications/page.tsx`

**Header:** Back + "Notification Settings"

**ADMIN ALERTS:**
| Toggle | |
|--------|--|
| New lead created | |
| Lead won | |
| Daily summary | |
| Team activity alert | |

**TEAM-LEVEL DEFAULTS (applied to all salespersons):**
| Toggle | |
|--------|--|
| Overdue follow-up reminders | |
| New lead assigned alerts | |
| Test drive reminders | |

**DELIVERY CHANNEL:**
| Toggle | |
|--------|--|
| Push notification (app) | |
| Email | |
| WhatsApp | |
| SMS | |

---

## 15.6 — Export Data

### Screen: `/admin/settings/export`
### File: `src/app/(admin)/settings/export/page.tsx`

**Header:** Back + "Export Data"

Info text: "Exported files contain customer data. Keep secure and do not share externally."

**SELECT DATA RANGE:**
- FROM date picker + TO date picker

**SALESPERSON (optional):**
- "All Salespersons" select or specific person

**WHAT TO EXPORT (checkboxes):**
- All Leads (with status)
- Activity Log
- Notes / Comments
- Source-wise Report
- Salesperson Performance

**SALESPERSON CAN SEE:**
- Own leads only
- Full customer phone numbers
- Own performance reports

**EXPORT FORMAT:**
- Excel (.xlsx) (radio)

**DELIVERY CHANNEL:**
- Download Export button (blue, full width)

**DANGER ZONE:**
- "Delete All Data" — red destructive button with confirmation dialog

---

## 15.7 — Privacy & Security

### Screen: `/admin/settings/privacy`
### File: `src/app/(admin)/settings/privacy/page.tsx`

**Header:** Back + "Privacy & Security"

**ACCOUNT SECURITY:**
- Change Password (→ change password page)
- Two-Factor Auth (2FA) toggle

**DATA PERMISSIONS section:**
Salesperson can see:
- Own leads only (toggle)
- Full customer phone numbers (toggle)
- Own performance reports (toggle)

**LEGAL:**
- Privacy Policy (link)
- Terms of Service (link)

**DANGER ZONE:**
- "Delete All Data" — red button, opens confirmation dialog

---

## 15.8 — Types

```ts
// src/types/business-info.data.ts
export interface BusinessInfoData {
  name: string;
  gstNumber?: string;
  phone: string;
  whatsappBusiness?: string;
  email: string;
  address: string;
  workingHoursFrom: string;
  workingHoursTo: string;
  logoUrl?: string;
}

// src/types/cars-catalogue.data.ts
export interface CarBrandData {
  id: string;
  name: string;
  models: CarModelData[];
}

export interface CarModelData {
  id: string;
  name: string;
  brandId: string;
}

// src/types/export-settings.data.ts
export interface ExportSettingsData {
  dateFrom: string;
  dateTo: string;
  salespersonId?: string;
  includeLeads: boolean;
  includeActivityLog: boolean;
  includeNotes: boolean;
  includeSourceReport: boolean;
  includePerformance: boolean;
  format: "xlsx";
}
```

---

## 15.9 — Requests

```ts
// src/requests/settings.request.ts

export async function getBusinessInfoRequest(): Promise<{ data: BusinessInfoData | null; error: Error | null }> { ... }
export async function updateBusinessInfoRequest(payload: BusinessInfoData): Promise<{ data: BusinessInfoData | null; error: Error | null }> { ... }

export async function getCarsBrandsRequest(): Promise<{ data: CarBrandData[] | null; error: Error | null }> { ... }
export async function addCarBrandRequest(name: string): Promise<{ data: CarBrandData | null; error: Error | null }> { ... }
export async function removeCarBrandRequest(brandId: string): Promise<{ data: { success: boolean } | null; error: Error | null }> { ... }
export async function addCarModelRequest(brandId: string, modelName: string): Promise<{ data: CarModelData | null; error: Error | null }> { ... }
export async function removeCarModelRequest(modelId: string): Promise<{ data: { success: boolean } | null; error: Error | null }> { ... }

export async function getLeadSourcesRequest(): Promise<{ data: string[] | null; error: Error | null }> { ... }
export async function updateLeadSourcesRequest(sources: string[]): Promise<{ data: { success: boolean } | null; error: Error | null }> { ... }

export async function exportDataRequest(settings: ExportSettingsData): Promise<{ data: Blob | null; error: Error | null }> { ... }
```

---

## Checklist

- [ ] Admin Profile menu page
- [ ] Business Info form
- [ ] Lead Sources Config (toggle list + add custom)
- [ ] Cars Catalogue (brand list + model list + add/remove)
- [ ] Admin Notification Settings (3 sections + delivery channels)
- [ ] Export Data page (date range, checkboxes, download button)
- [ ] Privacy & Security page (toggles + legal links + danger zone)
- [ ] All types defined
- [ ] All requests stubbed

---

**← [Referrers](./admin_referrers.md)**

---

> 🎉 All 15 steps complete. The full AutoLead CRM frontend is planned and ready for agent-driven development. Refer to [main.md](./main.md) for the master overview.
