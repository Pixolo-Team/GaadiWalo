# Sales Lead Import Flow

This note documents the implemented `/leads/import` flow for Sales users.

## Frontend Behavior

- Upload accepts `.xlsx`, `.xls`, and `.csv`
- Parsing happens client-side for preview only
- Header aliases are normalized for common column names such as:
  - `Name`
  - `Phone`
  - `Email`
  - `Source`
  - `Car Brand`
  - `Car Model`
  - optional fields like `Variant`, `Budget`, and `Initial Note`
- Source precedence:
  - row `Source` value
  - import-level source tag
  - invalid row if both are empty
- Preview groups rows into:
  - valid
  - duplicate within file
  - error
- Duplicate handling is selected before import:
  - `skip`
  - `upsert`
- Only preview-valid rows are sent to backend.

## Backend Contract

### Endpoint

- `POST /sales/leads/import`

### Request

```ts
interface ImportLeadsRequestData {
  duplicateMode: "skip" | "upsert";
  rows: LeadImportRequestRowData[];
}
```

### Response

```ts
interface ImportLeadsResponseData {
  importedCount: number;
  updatedCount: number;
  skippedCount: number;
  errorCount: number;
  totalRows: number;
  results: Array<{
    rowNumber: number;
    status: "imported" | "updated" | "skipped" | "error";
    reason: string;
    leadId: string | null;
  }>;
}
```

## Row Processing Rules

- Backend revalidates every row independently
- New rows use the existing lead-creation path
- Existing phones:
  - `skip` returns `skipped`
  - `upsert` updates editable Lead fields if the user has access
  - inaccessible duplicates return `skipped`
- Optional `initialNote` creates a note for imported Leads and updated Leads
- Partial success is expected; the endpoint is not batch-transactional
