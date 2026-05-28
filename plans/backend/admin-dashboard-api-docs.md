# Admin Dashboard API Documentation

This document describes the currently implemented Admin Dashboard backend APIs for GaadiWalo.

Source of truth:

- `apps/backend/src/modules/admin-dashboard/admin-dashboard.routes.ts`
- `apps/backend/src/modules/admin-dashboard/admin-dashboard.controller.ts`
- `apps/backend/src/modules/admin-dashboard/admin-dashboard.service.ts`
- `apps/backend/src/modules/admin-dashboard/admin-dashboard.types.ts`

## Overview

- Base path: `/admin/dashboard`
- Auth: Bearer token
- Allowed role: `admin`
- Response envelope: standardized project envelope via `sendResponse()`

## Endpoints

### 1. Get Summary

- Method: `GET`
- Path: `/admin/dashboard/summary`
- Query:
  - `period` optional
  - Supported values:
    - `this-month`
    - `YYYY-MM`
    - Month label formats like `May 2026` or `may-2026`

Success `data` shape:

```ts
interface AdminSummaryData {
  totalLeads: number;
  totalLeadsChange: number;
  converted: number;
  conversionRate: number;
  activeLeads: number;
  won: number;
  wonChange: number;
}
```

### 2. Get Leads By Source

- Method: `GET`
- Path: `/admin/dashboard/sources`
- Query:
  - `period` optional

Success `data` shape:

```ts
interface LeadsBySourceData {
  source: string;
  count: number;
  color: string;
}
```

### 3. Get Top Performers

- Method: `GET`
- Path: `/admin/dashboard/top-performers`
- Query:
  - `period` optional
  - `limit` optional, default `3`, max `25`

Success `data` shape:

```ts
interface TeamPerformerData {
  rank: number;
  userId: string;
  name: string;
  leads: number;
  won: number;
  winRate: number;
}
```

### 4. Get Top Referrers

- Method: `GET`
- Path: `/admin/dashboard/top-referrers`
- Query:
  - `period` optional
  - `limit` optional, default `3`, max `25`

Success `data` shape:

```ts
interface TopReferrerData {
  id: string;
  name: string;
  referrals: number;
  converted: number;
  conversionRate: number;
}
```

## Status Codes

- `200`: request successful
- `400`: invalid query parameters
- `401`: missing or invalid bearer token
- `403`: authenticated non-admin user
- `500`: unexpected backend failure

## Current Calculation Assumptions

- `converted` counts leads in `WON` only
- `activeLeads` counts open pipeline leads in `NEW`, `CONTACTED`, `INTERESTED`, `TEST_DRIVE`, `NEGOTIATION`, or `VEHICLE_NA`
- `won` counts leads in `WON`
- Top performers are ranked by current-period won count, then total assigned leads
- Top referrers are ranked by current-period won count, then total referrals
