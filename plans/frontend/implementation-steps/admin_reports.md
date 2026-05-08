# Admin Reports

## Objective

Implement the Admin Reports experience with three analytical views: Overview, Source, and Funnel, including date-range filtering and export entry-point.

## Route and File

- Route: `/admin/reports`
- Primary file: `src/app/(admin)/reports/page.tsx`
- Repository path mapping: `apps/frontend/src/app/(admin)/reports/page.tsx`

## Scope

- Header with report title, date range controls, and export action.
- Overview tab with KPI cards and daily trend chart.
- Source tab with source-performance table and best-source insight.
- Funnel tab with stage breakdown and lost-reason distribution.
- Typed request contracts for all three report datasets.

## 12.1 Header

Include:

- `Reports` page title.
- Date range picker (`from`, `to`) with sensible defaults.
- Export icon/action button to trigger export flow or route to export settings.

## 12.2 Overview Tab

### KPI Cards

Display:

- Total Leads (+ change percentage)
- Converted (+ conversion rate)
- Won
- Test Drive
- Lost Leads (+ lost percentage)

### Trend Chart

Use Recharts `LineChart`:

- X-axis: date labels for selected range
- Line 1: `leads`
- Line 2: `won`

## 12.3 Source Tab

### Source Performance Table

Columns:

- Source
- Leads
- Won
- Rate
- Trend

### Best Source Insight Card

Show the highest conversion source with short operational guidance.
Avoid decorative emoji in production-facing copy.

## 12.4 Funnel Tab

### Funnel Stage Breakdown

Display each lead stage with:

- Count
- Percentage
- Relative visual bar width

Pipeline order:

- New
- Contacted
- Interested
- Test Drive
- Won

### Lost Reason Breakdown

Table columns:

- Reason
- Count
- Percentage

## 12.5 Types

Create/update `src/types/reports.data.ts`:

- `ReportOverviewData`
- `DailyLeadsData`
- `SourcePerformanceData`
- `FunnelStageData`
- `LostReasonData`

Use existing project type conventions (`*Data`).

## 12.6 Requests

Create/update `src/requests/reports.request.ts` with:

- `getReportOverviewRequest(from, to)`
- `getSourcePerformanceRequest(from, to)`
- `getFunnelDataRequest(from, to)`

Return safe structures:

```ts
{ data: T | null; error: Error | null }
```

## Deliverables

- Reports page with working tab navigation.
- Date range state wired to all three report requests.
- Overview/Source/Funnel views rendered with typed data contracts.
- Export action visible and connected to agreed flow.

## Acceptance Criteria

- All report requests are typed and error-safe.
- Empty/loading/error states are handled in each tab.
- Charts render responsively on mobile and desktop.
- No hardcoded business logic outside constants/sample data adapters.
- No `console.*` usage.

## Dependencies

- `admin_dashboard.md` types/patterns
- Shared constants for lead stages and sources
- Recharts configuration from existing frontend stack

## Step Transition

After this step is stable, continue with:

- `admin_performance.md`

Navigation links:

- Previous: [admin_lead_management](./admin_lead_management.md)
- Next: [admin_performance](./admin_performance.md)
