# Sales Profile API Documentation

This document describes the implemented Sales Profile backend APIs for GaadiWalo.

Source of truth:

- `apps/backend/src/modules/sales-profile/sales-profile.routes.ts`
- `apps/backend/src/modules/sales-profile/sales-profile.controller.ts`
- `apps/backend/src/modules/sales-profile/sales-profile.service.ts`
- `apps/backend/src/modules/sales-profile/sales-profile.types.ts`

## Overview

- Base path: `/sales/profile`
- Auth: Bearer token
- Allowed roles:
  - `sales` for self-only access
  - `admin` for self-service profile access plus cross-user sales profile read/update/notifications/performance
- Response envelope: standardized project envelope via `sendResponse()`

## Access Rules

- Sales users may access only their own `user_code`.
- Admin users may read and update any sales profile.
- Admin users may use all sales profile endpoints for their own `user_code`.
- If a different sales rep tries to access another `user_code`, the API returns `403`.

## Schema Contract

This module uses the `users`, `branches`, and `roles` tables only.

- `users`
  - `id`
  - `auth_id`
  - `branch_id`
  - `role_id`
  - `full_name`
  - `email`
  - `phone`
  - `profile_photo_url`
  - `created_at`
  - `updated_at`
  - `deleted_at`
  - configured login identifier column for business `user_code`
  - `language_preference` (optional)
  - `notification_preferences_json` (optional)
- `branches`
  - `id`
  - `city`
- `roles`
  - `id`
  - `name`

If `language_preference` or `notification_preferences_json` are not present on the
`users` row, the API returns backend defaults for those settings.

## Endpoints

### 1. Get Sales Profile

- Method: `GET`
- Path: `/sales/profile/:userCode`

Success `data` shape:

```ts
{
  userId: string;
  fullName: string;
  phone: string;
  email: string;
  role: string;
  branch: string;
  joinedAt: string;
  profilePhotoUrl: string | null;
  languagePreference: string;
  notificationPreferences: {
    overdueFollowUps: boolean;
    testDriveReminders: boolean;
    newLeadAssigned: boolean;
    statusChangeAlerts: boolean;
    wonLostSummary: boolean;
    pushNotification: boolean;
    sms: boolean;
    whatsApp: boolean;
    quietHoursEnabled: boolean;
    quietHoursFrom: string | null;
    quietHoursTo: string | null;
  };
}
```

### 2. Update Sales Profile

- Method: `PATCH`
- Path: `/sales/profile/:userCode`

Request body may include:

- `fullName`
- `phone`
- `email`
- `languagePreference`

### 3. Change Sales Password

- Method: `POST`
- Path: `/sales/profile/:userCode/change-password`

Request body:

```ts
{
  currentPassword: string;
  newPassword: string;
}
```

Success `data` shape:

```ts
{
  success: true;
}
```

### 4. Update Notification Preferences

- Method: `PATCH`
- Path: `/sales/profile/:userCode/notifications`

Request body:

```ts
{
  overdueFollowUps: boolean;
  testDriveReminders: boolean;
  newLeadAssigned: boolean;
  statusChangeAlerts: boolean;
  wonLostSummary: boolean;
  pushNotification: boolean;
  sms: boolean;
  whatsApp: boolean;
  quietHoursEnabled: boolean;
  quietHoursFrom: string | null;
  quietHoursTo: string | null;
}
```

### 5. Get Sales Performance

- Method: `GET`
- Path: `/sales/profile/:userCode/performance`
- Query:
  - `period? = this-month | YYYY-MM | Month label`

Success `data` shape:

```ts
{
  totalLeads: number;
  callsMade: number;
  won: number;
  wonRate: number;
  lost: number;
  lostRate: number;
  rank: number | null;
  pipeline: Record<string, number>;
  weeklyActivity: Array<{
    day: string;
    calls: number;
    leads: number;
  }>;
  sourceBreakdown: Array<{
    source: string;
    count: number;
  }>;
}
```

## Status Codes

- `200`: request successful
- `400`: invalid params, query, or body
- `401`: missing or invalid bearer token
- `403`: another sales rep attempted cross-user access, or an admin attempted to change another user's password
- `404`: unknown sales profile
- `409`: duplicate email or phone on update
- `500`: unexpected backend failure
