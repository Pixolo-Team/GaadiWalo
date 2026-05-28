# Admin Team API Documentation

This document describes the currently implemented Admin Team backend APIs for GaadiWalo.

Source of truth:

- `apps/backend/src/modules/admin-team/admin-team.routes.ts`
- `apps/backend/src/modules/admin-team/admin-team.controller.ts`
- `apps/backend/src/modules/admin-team/admin-team.service.ts`
- `apps/backend/src/modules/admin-team/admin-team.types.ts`

## Overview

- Base path: `/admin/team`
- Auth: Bearer token
- Allowed role: `admin`
- Response envelope: standardized project envelope via `sendResponse()`

## Endpoints

### 1. Get Team

- Method: `GET`
- Path: `/admin/team`
- Query:
  - `search?`
  - `status? = active | inactive`
  - `branchId?`
  - `period? = this-month | YYYY-MM | Month label`

### 2. Get Team Options

- Method: `GET`
- Path: `/admin/team/options`
- Response:
  - `roles: { id, name }[]`
  - `branches: { id, name }[]`

### 3. Get Salesperson By Id

- Method: `GET`
- Path: `/admin/team/:salespersonId`
- Query:
  - `period?`

### 4. Create Salesperson

- Method: `POST`
- Path: `/admin/team`
- Request body:
  - `fullName`
  - `phone`
  - `email`
  - `branchId`
  - `roleId`

Success `data` shape:

```ts
{
  salesperson: SalespersonData;
  tempPassword: string;
}
```

### 5. Update Salesperson

- Method: `PATCH`
- Path: `/admin/team/:salespersonId`
- Request body may include:
  - `fullName`
  - `phone`
  - `email`
  - `branchId`
  - `roleId`
  - `isActive`

### 6. Reset Salesperson Password

- Method: `POST`
- Path: `/admin/team/:salespersonId/reset-password`

Success `data` shape:

```ts
{
  tempPassword: string;
}
```

### 7. Remove Salesperson

- Method: `DELETE`
- Path: `/admin/team/:salespersonId`
- Request body:
  - `strategy: "reassign" | "unassigned"`
  - `reassignToId?`

Success `data` shape:

```ts
{
  success: true;
  removalStrategy: "reassign" | "unassigned";
  reassignedLeadCount: number;
  unassignedLeadCount: number;
}
```

## Status Codes

- `200`: request successful
- `201`: salesperson created
- `400`: invalid query or body payload
- `401`: missing or invalid bearer token
- `403`: authenticated non-admin user
- `404`: salesperson, branch, role, or reassignment target not found
- `409`: duplicate email, phone, or generated user ID
- `500`: unexpected backend failure
