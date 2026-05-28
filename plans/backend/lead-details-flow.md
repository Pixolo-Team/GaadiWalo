# Backend - Lead Details and Lead Creation API Plan

## Overview

This document defines the backend API plan for Sales lead details, lead updates, and new lead creation.

Primary goals:

- fetch one lead by id
- fetch lead activity ledger
- fetch lead notes
- update lead status
- update lead details
- create a lead note
- create a new lead from scratch

This plan follows the repository backend standard:

`Route -> Controller -> Service -> Supabase`

Source references:

- `AGENTS.md`
- `plans/project-spec.md`
- `plans/backend/api-design.md`
- `plans/backend/database-schema.md`
- `plans/project-decisions.md`

Lead Activities definition:

- `lead_activities` is the Lead ledger.
- It is a timestamped record of something that happened on a Lead.
- Activities can be logged automatically, such as status changes, lead creation, or import events.
- Activities can also be logged manually, such as calls made, WhatsApp messages sent, or notes added.
- Together these entries form the full Lead history.

Activity types:

- `call`
  - records that a call was made to the Lead
- `whatsapp`
  - records that a WhatsApp message was sent to the Lead
- `note`
  - records that a note was added
- `status_change`
  - records that the Lead status was updated
- `system`
  - records an automated event such as lead creation or import

## Endpoint Details

Base route group:

- `/sales/leads`

### 1. Get Lead Details

#### URL

- Method: `GET`
- Path: `/sales/leads/:leadId`

#### Request

- Params:
  - `leadId`
- Body:
  - none

#### Response Codes

- `200` lead fetched successfully
- `401` missing or invalid authentication
- `403` authenticated user is not allowed to access the lead
- `404` lead not found
- `500` unexpected server failure

Role access note:

- `sales` users can access only leads they own or created.
- `admin` users can access any lead in this route group.

### 2. Get Lead Activities

#### URL

- Method: `GET`
- Path: `/sales/leads/:leadId/activities`

#### Request

- Params:
  - `leadId`
- Body:
  - none

#### Response Codes

- `200` lead activity ledger fetched successfully
- `401` missing or invalid authentication
- `403` authenticated user is not allowed to access the lead
- `404` lead not found
- `500` unexpected server failure

### 3. Get Lead Notes

#### URL

- Method: `GET`
- Path: `/sales/leads/:leadId/notes`

#### Request

- Params:
  - `leadId`
- Body:
  - none

#### Response Codes

- `200` notes fetched successfully
- `401` missing or invalid authentication
- `403` authenticated user is not allowed to access the lead
- `404` lead not found
- `500` unexpected server failure

### 4. Update Lead Status

#### URL

- Method: `PATCH`
- Path: `/sales/leads/:leadId/status`

#### Request

- Params:
  - `leadId`
- Body:

```json
{
  "status": "CONTACTED",
  "lostReason": null
}
```

#### Response Codes

- `200` lead status updated successfully
- `400` invalid request payload
- `401` missing or invalid authentication
- `403` authenticated user is not allowed to update the lead
- `404` lead not found
- `500` unexpected server failure

### 5. Update Lead Details

#### URL

- Method: `PATCH`
- Path: `/sales/leads/:leadId`

#### Request

- Params:
  - `leadId`
- Body:

```json
{
  "fullName": "Rahul Sharma",
  "phone": "9876543210",
  "email": "rahul@example.com",
  "source": "CarWale",
  "referrerName": "",
  "referrerPhone": "",
  "carBrand": "Hyundai",
  "carModel": "i10",
  "variantName": "Sportz",
  "colorPreference": "Red",
  "budget": "6-8 Lakh",
  "isUsed": true
}
```

#### Response Codes

- `200` lead details updated successfully
- `400` invalid request payload
- `401` missing or invalid authentication
- `403` authenticated user is not allowed to update the lead
- `404` lead not found
- `409` duplicate or conflicting lead data
- `500` unexpected server failure

### 6. Create Lead Note

#### URL

- Method: `POST`
- Path: `/sales/leads/:leadId/notes`

#### Request

- Params:
  - `leadId`
- Body:

```json
{
  "content": "Customer asked for a callback after 6 PM."
}
```

#### Response Codes

- `201` note created successfully
- `400` invalid request payload
- `401` missing or invalid authentication
- `403` authenticated user is not allowed to update the lead
- `404` lead not found
- `500` unexpected server failure

### 7. Create New Lead

#### URL

- Method: `POST`
- Path: `/sales/leads`

#### Request

- Params:
  - none
- Body:

```json
{
  "fullName": "Rahul Sharma",
  "phone": "9876543210",
  "email": "rahul@example.com",
  "source": "CarWale",
  "referrerName": "",
  "referrerPhone": "",
  "carBrand": "Hyundai",
  "carModel": "i10",
  "variantName": "Sportz",
  "colorPreference": "Red",
  "budget": "6-8 Lakh",
  "isUsed": true,
  "initialNote": "Interested in weekend visit."
}
```

#### Response Codes

- `201` lead created successfully
- `400` invalid request payload
- `401` missing or invalid authentication
- `403` authenticated user is not allowed to create the lead
- `409` duplicate lead or conflicting phone data
- `500` unexpected server failure

## Database Tables

Primary tables involved:

### `leads`

Used by:

- `GET /sales/leads/:leadId`
- `PATCH /sales/leads/:leadId/status`
- `PATCH /sales/leads/:leadId`
- `POST /sales/leads`

Current known fields from `plans/backend/database-schema.md`:

- `id`
- `full_name`
- `phone`
- `email`
- `source`
- `status`
- `assigned_to`
- `created_by`
- `created_at`
- `updated_at`

Possible additional lead fields referenced by `plans/project-decisions.md`:

- `car_brand_id`
- `car_model_id`
- `variant_name`
- `color_preference`
- `budget`
- `is_used`

Potential additional fields needed for this API scope:

- `lost_reason`
- `referrer_id` or equivalent referral linkage

Schema clarification needed:

- confirm whether vehicle-interest columns already exist in the real database
- confirm where lost reason should be stored
- confirm how referral data should be stored when source is referral

### `lead_activities`

Lead Activities is the backend ledger for Lead history.

Used by:

- `GET /sales/leads/:leadId/activities`
- `PATCH /sales/leads/:leadId/status`
- `PATCH /sales/leads/:leadId`
- `POST /sales/leads/:leadId/notes`
- `POST /sales/leads`

Current known fields:

- `id`
- `lead_id`
- `type`
- `description`
- `meta_json`
- `created_at`

Supported activity types:

- `call`
- `whatsapp`
- `note`
- `status_change`
- `system`

Type purpose:

- `call`
  - A call was made to the Lead
- `whatsapp`
  - A WhatsApp message was sent to the Lead
- `note`
  - A note was added
- `status_change`
  - The Lead status was updated
- `system`
  - An automated event occurred, such as import or lead creation

### `lead_notes`

Used by:

- `GET /sales/leads/:leadId/notes`
- `POST /sales/leads/:leadId/notes`
- optionally `POST /sales/leads` when `initialNote` is provided

Current known fields:

- `id`
- `lead_id`
- `author_id`
- `content`
- `created_at`

### `users`

Used for:

- access control
- joining assigned user name
- joining note author name
- joining created-by user name
- determining assignment for self-created leads

### `referrers`

Used for:

- referral-source lead creation if referrers are stored as a proper entity

Current known fields:

- `id`
- `full_name`
- `phone`
- `source_notes`
- `created_at`

## Validation

Validation must happen at the route or controller boundary using Zod.

### Shared Param Validation

Endpoints with `:leadId` must validate:

- `leadId`: required, non-empty string
- if the DB uses UUID ids, validate UUID format

### Shared Lead Status Enum

- `NEW`
- `CONTACTED`
- `INTERESTED`
- `TEST_DRIVE`
- `NEGOTIATION`
- `WON`
- `LOST`
- `VEHICLE_NA`

### `GET /sales/leads/:leadId`

- validate params only

### `GET /sales/leads/:leadId/activities`

- validate params only

### `GET /sales/leads/:leadId/notes`

- validate params only

### `PATCH /sales/leads/:leadId/status`

- validate params
- validate body:
  - `status`: required enum
  - `lostReason`: required when `status === "LOST"`
  - `lostReason`: `null` or omitted for non-`LOST`

Business validation:

- reject empty lost reason when status is `LOST`
- allow `VEHICLE_NA` as a valid recoverable status

### `PATCH /sales/leads/:leadId`

- validate params
- validate body:
  - `fullName`: required, trimmed, minimum 2 characters
  - `phone`: required, valid 10-digit mobile format
  - `email`: optional, valid email or empty string
  - `source`: required, non-empty string
  - `referrerName`: optional
  - `referrerPhone`: optional
  - `carBrand`: required if product treats car selection as mandatory
  - `carModel`: required if product treats car selection as mandatory
  - `variantName`: optional
  - `colorPreference`: optional
  - `budget`: optional
  - `isUsed`: optional boolean

Business validation:

- if `source` is referral, validate referrer fields based on product rule
- if phone changes, check duplicate conflict policy

### `POST /sales/leads/:leadId/notes`

- validate params
- validate body:
  - `content`: required
  - trimmed string
  - minimum length `1`
  - recommended max length `2000`

### `POST /sales/leads`

- validate body:
  - `fullName`: required, trimmed, minimum 2 characters
  - `phone`: required, valid 10-digit mobile format
  - `email`: optional, valid email or empty string
  - `source`: required, non-empty string
  - `referrerName`: optional
  - `referrerPhone`: optional
  - `carBrand`: required if product treats car selection as mandatory
  - `carModel`: required if product treats car selection as mandatory
  - `variantName`: optional
  - `colorPreference`: optional
  - `budget`: optional
  - `isUsed`: optional boolean
  - `initialNote`: optional trimmed string

Business validation:

- prevent duplicate creation based on phone policy
- set default lead status to `NEW`
- assign the created lead according to product rule
  - likely the authenticated Sales user for this sales endpoint

## Response Structures For Every Code

All endpoints must use the standard response envelope.

### Generic Success Structure

```json
{
  "data": {},
  "status": "success",
  "status_code": 200,
  "message": "Human readable message",
  "error": null
}
```

### Generic Error Structure

```json
{
  "data": null,
  "status": "error",
  "status_code": 400,
  "message": "Human readable message",
  "error": "Error detail string"
}
```

### 1. GET `/sales/leads/:leadId`

#### `200`

```json
{
  "data": {
    "id": "lead_123",
    "fullName": "Rahul Sharma",
    "phone": "9876543210",
    "email": "rahul@example.com",
    "source": "CarWale",
    "status": "CONTACTED",
    "assignedToUserId": "user_1",
    "assignedToUserName": "Amit Singh",
    "createdByUserId": "user_2",
    "createdByUserName": "Admin User",
    "createdAt": "2026-05-15T10:00:00.000Z",
    "updatedAt": "2026-05-15T12:00:00.000Z",
    "carBrand": "Hyundai",
    "carModel": "i10",
    "variantName": "Sportz",
    "colorPreference": "Red",
    "budget": "6-8 Lakh",
    "isUsed": true
  },
  "status": "success",
  "status_code": 200,
  "message": "Lead details fetched successfully.",
  "error": null
}
```

#### `401`

```json
{
  "data": null,
  "status": "error",
  "status_code": 401,
  "message": "Authentication is required.",
  "error": "Authentication is required."
}
```

#### `403`

```json
{
  "data": null,
  "status": "error",
  "status_code": 403,
  "message": "You are not allowed to access this lead.",
  "error": "You are not allowed to access this lead."
}
```

#### `404`

```json
{
  "data": null,
  "status": "error",
  "status_code": 404,
  "message": "Lead not found.",
  "error": "Lead not found."
}
```

### 2. GET `/sales/leads/:leadId/activities`

#### `200`

```json
{
  "data": [
    {
      "id": "activity_1",
      "leadId": "lead_123",
      "type": "status_change",
      "description": "Status changed: NEW -> CONTACTED",
      "metaJson": {
        "previousStatus": "NEW",
        "nextStatus": "CONTACTED"
      },
      "createdAt": "2026-05-15T12:30:00.000Z"
    }
  ],
  "status": "success",
  "status_code": 200,
  "message": "Lead activity ledger fetched successfully.",
  "error": null
}
```

### 3. GET `/sales/leads/:leadId/notes`

#### `200`

```json
{
  "data": [
    {
      "id": "note_1",
      "leadId": "lead_123",
      "authorId": "user_1",
      "authorName": "Amit Singh",
      "content": "Customer asked for a callback after 6 PM.",
      "createdAt": "2026-05-15T13:00:00.000Z"
    }
  ],
  "status": "success",
  "status_code": 200,
  "message": "Lead notes fetched successfully.",
  "error": null
}
```

### 4. PATCH `/sales/leads/:leadId/status`

#### `200`

```json
{
  "data": {
    "id": "lead_123",
    "status": "CONTACTED"
  },
  "status": "success",
  "status_code": 200,
  "message": "Lead status updated successfully.",
  "error": null
}
```

#### `400`

```json
{
  "data": null,
  "status": "error",
  "status_code": 400,
  "message": "Invalid lead status update payload.",
  "error": "Invalid lead status update payload."
}
```

### 5. PATCH `/sales/leads/:leadId`

#### `200`

```json
{
  "data": {
    "id": "lead_123",
    "fullName": "Rahul Sharma",
    "phone": "9876543210",
    "email": "rahul@example.com",
    "source": "CarWale",
    "carBrand": "Hyundai",
    "carModel": "i10",
    "variantName": "Sportz",
    "colorPreference": "Red",
    "budget": "6-8 Lakh",
    "isUsed": true
  },
  "status": "success",
  "status_code": 200,
  "message": "Lead details updated successfully.",
  "error": null
}
```

#### `400`

```json
{
  "data": null,
  "status": "error",
  "status_code": 400,
  "message": "Invalid lead details payload.",
  "error": "Invalid lead details payload."
}
```

#### `409`

```json
{
  "data": null,
  "status": "error",
  "status_code": 409,
  "message": "A lead with this phone number already exists.",
  "error": "A lead with this phone number already exists."
}
```

### 6. POST `/sales/leads/:leadId/notes`

#### `201`

```json
{
  "data": {
    "id": "note_2",
    "leadId": "lead_123",
    "authorId": "user_1",
    "authorName": "Amit Singh",
    "content": "Sent vehicle options on WhatsApp.",
    "createdAt": "2026-05-15T14:00:00.000Z"
  },
  "status": "success",
  "status_code": 201,
  "message": "Lead note created successfully.",
  "error": null
}
```

#### `400`

```json
{
  "data": null,
  "status": "error",
  "status_code": 400,
  "message": "Invalid lead note payload.",
  "error": "Invalid lead note payload."
}
```

### 7. POST `/sales/leads`

#### `201`

```json
{
  "data": {
    "id": "lead_124",
    "fullName": "Rahul Sharma",
    "phone": "9876543210",
    "email": "rahul@example.com",
    "source": "CarWale",
    "status": "NEW",
    "assignedToUserId": "user_1",
    "assignedToUserName": "Amit Singh",
    "createdAt": "2026-05-15T15:00:00.000Z"
  },
  "status": "success",
  "status_code": 201,
  "message": "Lead created successfully.",
  "error": null
}
```

#### `400`

```json
{
  "data": null,
  "status": "error",
  "status_code": 400,
  "message": "Invalid lead creation payload.",
  "error": "Invalid lead creation payload."
}
```

#### `409`

```json
{
  "data": null,
  "status": "error",
  "status_code": 409,
  "message": "A lead with this phone number already exists.",
  "error": "A lead with this phone number already exists."
}
```

## Files To Work On

Primary module files:

- `apps/backend/src/modules/leads/leads.routes.ts`
- `apps/backend/src/modules/leads/leads.controller.ts`
- `apps/backend/src/modules/leads/leads.service.ts`
- `apps/backend/src/modules/leads/leads.types.ts`

Likely supporting files:

- `apps/backend/src/common/constants/lead-status.constants.ts`
- `apps/backend/src/common/constants/lead-activity.constants.ts`
- `apps/backend/src/common/utils/send-response.ts`
- backend app route registration file
- `.env.example` only if new environment variables are introduced

## Responsibility By Layer

### Route

- define REST endpoints only
- attach auth middleware if applicable
- apply Zod validation
- forward request to controller

### Controller

- read validated params and body
- resolve authenticated user context
- call service functions
- map service results to HTTP status codes
- return response through `sendResponse()`

### Service

- perform business logic
- perform Supabase queries
- verify access permissions
- create activity log rows for mutations
- create note rows when needed
- catch errors and return `QueryResponseData<T>`

### Supabase

- store and fetch rows from `leads`, `lead_notes`, `lead_activities`, `users`, and optionally `referrers`
- remain hidden behind service functions

## Implementation Rules

- follow `Route -> Controller -> Service -> Supabase`
- no DB logic in controller
- no HTTP context logic in service
- use `interface` for backend object contracts
- use named exports only
- use grouped imports
- use `import type` for type-only imports
- use Zod validation for every endpoint input
- return the standard response envelope for all outcomes
- do not expose raw internal database errors in production responses
- Sales users can access only their own assigned leads
- Admin users can access any lead if these endpoints are later shared or reused
- `LOST` requires a reason
- `VEHICLE_NA` must remain a valid recoverable status
- status changes must log `status_change` activities
- note creation must log `note` activities
- lead creation should log a `system` activity for the creation event
- manual call logging should create a `call` activity
- manual WhatsApp logging should create a `whatsapp` activity
- initial note during lead creation should create a `note` activity or a note row plus linked activity, depending on implementation
- lead detail updates should log a `system` activity if material fields change

## Open API Integration

This plan should integrate with:

- frontend lead details screen at `/leads/[id]`
- lead edit flow
- add new lead form at `/leads/new`
- notes tab
- activity tab
- status update flow

Expected frontend request mapping:

- `getLeadByIdRequest()` -> `GET /sales/leads/:leadId`
- `getLeadActivityRequest()` -> `GET /sales/leads/:leadId/activities`
- `getLeadNotesRequest()` -> `GET /sales/leads/:leadId/notes`
- `updateLeadStatusRequest()` -> `PATCH /sales/leads/:leadId/status`
- `updateLeadRequest()` -> `PATCH /sales/leads/:leadId`
- `createLeadNoteRequest()` -> `POST /sales/leads/:leadId/notes`
- `createLeadRequest()` -> `POST /sales/leads`

Documentation follow-up after implementation:

- keep `plans/backend/api-design.md` aligned
- update backend schema docs if new columns are added
- add dedicated lead API docs if this module grows further

## Expected Behaviour Summary

- when a valid Sales user opens their own lead, the API returns lead detail data
- when a Sales user tries to access another salesperson's lead, the API returns `403`
- lead activity ledger returns newest-first
- lead activity ledger represents the Lead history across calls, WhatsApp, notes, status changes, and system events
- lead notes return newest-first
- status updates update the lead and create a `status_change` activity entry
- lead detail updates update mutable lead fields and optionally log a `system` activity
- note creation inserts into `lead_notes` and also creates a `note` activity entry
- new lead creation creates the lead with default status `NEW`
- new lead creation assigns the lead according to the sales flow rule
- if `initialNote` is provided during lead creation, the backend should create a note row or equivalent activity log
- invalid payloads are rejected before service execution
- duplicate lead phone conflicts return `409`
- every response follows the standard envelope

## Acceptance Criteria

- [ ] `GET /sales/leads/:leadId` is defined and documented
- [ ] `GET /sales/leads/:leadId/activities` is defined and documented
- [ ] `GET /sales/leads/:leadId/notes` is defined and documented
- [ ] `PATCH /sales/leads/:leadId/status` is defined and documented
- [ ] `PATCH /sales/leads/:leadId` is defined and documented
- [ ] `POST /sales/leads/:leadId/notes` is defined and documented
- [ ] `POST /sales/leads` is defined and documented
- [ ] each endpoint has request, response codes, and example responses documented
- [ ] database tables used by each endpoint are identified
- [ ] validation rules are defined for params and bodies
- [ ] files to implement are clearly listed
- [ ] responsibilities are split correctly by route, controller, service, and Supabase
- [ ] implementation rules match repo backend standards
- [ ] frontend integration points are called out
- [ ] Sales access restriction behavior is documented
- [ ] duplicate-phone conflict behavior is documented
- [ ] schema gaps for vehicle-interest fields, lost reason, and referral storage are explicitly flagged before implementation
