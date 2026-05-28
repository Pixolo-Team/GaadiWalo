# Admin Referrers API Documentation

This document describes the implemented Admin Referrers backend APIs for GaadiWalo.

Source of truth:

- `apps/backend/src/modules/admin-referrers/admin-referrers.routes.ts`
- `apps/backend/src/modules/admin-referrers/admin-referrers.controller.ts`
- `apps/backend/src/modules/admin-referrers/admin-referrers.service.ts`
- `apps/backend/src/modules/admin-referrers/admin-referrers.types.ts`

## Overview

- Base path: `/admin/referrers`
- Auth: Bearer token
- Allowed role: `admin`
- Response envelope: standardized project envelope via `sendResponse()`
- Data scope: all-time by default

## Referrers Data Contract

This module expects `referrers` to expose at least:

- `id`
- `full_name`
- `phone`
- `email`
- `city`
- `created_at`

## Endpoints

### 1. Get Referrers

- Method: `GET`
- Path: `/admin/referrers`
- Query:
  - `search?`
  - `sort? = most-referrals | best-conversion`
  - `page?`
  - `limit?`

Success `data` shape:

```ts
{
  items: Array<{
    id: string;
    name: string;
    phone: string;
    email: string | null;
    city: string | null;
    since: string;
    totalReferrals: number;
    won: number;
    conversionRate: number;
  }>;
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}
```

### 2. Get Referrer By Id

- Method: `GET`
- Path: `/admin/referrers/:referrerId`

Success `data` shape:

```ts
{
  id: string;
  name: string;
  phone: string;
  email: string | null;
  city: string | null;
  since: string;
  totalReferrals: number;
  won: number;
  conversionRate: number;
  isTopReferrer: boolean;
}
```

### 3. Get Referred Leads

- Method: `GET`
- Path: `/admin/referrers/:referrerId/leads`
- Query:
  - `page?`
  - `limit?`

Success `data` shape:

```ts
{
  items: Array<{
    id: string;
    leadName: string;
    status: string;
    month: string;
  }>;
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}
```

## Status Codes

- `200`: request successful
- `400`: invalid query or params
- `401`: missing or invalid bearer token
- `403`: authenticated non-admin user
- `404`: referrer not found
- `500`: unexpected backend failure
