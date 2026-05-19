# Admin Reports API Documentation

This document describes the implemented Admin Reports backend APIs for GaadiWalo.

Source of truth:

- `apps/backend/src/modules/admin-reports/admin-reports.routes.ts`
- `apps/backend/src/modules/admin-reports/admin-reports.controller.ts`
- `apps/backend/src/modules/admin-reports/admin-reports.service.ts`
- `apps/backend/src/modules/admin-reports/admin-reports.types.ts`

## Overview

- Base path: `/admin/reports`
- Auth: Bearer token
- Allowed role: `admin`
- Response envelope: standardized project envelope via `sendResponse()`
- Export note: file export/download is not part of this module and remains owned by the admin settings/export flow

## Endpoints

### 1. Get Report Overview

- Method: `GET`
- Path: `/admin/reports/overview`
- Query:
  - `from = YYYY-MM-DD`
  - `to = YYYY-MM-DD`

Success `data` shape:

```ts
{
  totalLeads: number;
  totalLeadsChange: number;
  converted: number;
  conversionRate: number;
  won: number;
  testDrive: number;
  lostLeads: number;
  lostRate: number;
  dailyTrend: Array<{
    date: string;
    leads: number;
    won: number;
  }>;
}
```

### 2. Get Source Performance

- Method: `GET`
- Path: `/admin/reports/sources`
- Query:
  - `from = YYYY-MM-DD`
  - `to = YYYY-MM-DD`

Success `data` shape:

```ts
{
  sources: Array<{
    source: string;
    leads: number;
    won: number;
    rate: number;
    trend: number;
  }>;
  bestSource: {
    source: string;
    leads: number;
    won: number;
    rate: number;
    guidance: string;
  } | null;
}
```

### 3. Get Funnel Report

- Method: `GET`
- Path: `/admin/reports/funnel`
- Query:
  - `from = YYYY-MM-DD`
  - `to = YYYY-MM-DD`

Success `data` shape:

```ts
{
  stages: Array<{
    stage: "NEW" | "CONTACTED" | "INTERESTED" | "TEST_DRIVE" | "WON";
    count: number;
    percentage: number;
  }>;
  lostReasons: Array<{
    reason: string;
    count: number;
    percentage: number;
  }>;
}
```

## Status Codes

- `200`: request successful
- `400`: invalid or incomplete date-range query
- `401`: missing or invalid bearer token
- `403`: authenticated non-admin user
- `500`: unexpected backend failure
