# Sales Leads API - QA Guide

This file is a simplified version of the Sales Leads API documentation.

- which endpoint to call
- what request body to send
- what the API does internally
- what response to expect

Technical source of truth:

- `plans/backend/sales-leads-api-docs.md`
- `apps/backend/src/modules/sales-leads/sales-leads.routes.ts`
- `apps/backend/src/modules/sales-leads/sales-leads.controller.ts`
- `apps/backend/src/modules/sales-leads/sales-leads.types.ts`

## Before Testing

### Base Route

All endpoints in this guide start with:

```txt
/sales/leads
```

### Auth Requirement

All endpoints require a bearer token:

```http
Authorization: Bearer <accessToken>
```

You get this token from the login API:

```txt
POST /auth/login
```

### Common Success Response

```json
{
  "data": {},
  "status": "success",
  "status_code": 200,
  "message": "Human readable message",
  "error": null
}
```

### Common Error Response

```json
{
  "data": null,
  "status": "error",
  "status_code": 400,
  "message": "Human readable message",
  "error": "Error detail string"
}
```

## Full QA Flow

This is the normal testing flow for Sales Leads APIs:

1. Login and get `accessToken`.
2. If you already have a lead, open that lead using `GET /sales/leads/:leadId`.
3. Check activity history using `GET /sales/leads/:leadId/activities`.
4. Check notes using `GET /sales/leads/:leadId/notes`.
5. Update the lead status using `PATCH /sales/leads/:leadId/status`.
6. Update customer details using `PATCH /sales/leads/:leadId`.
7. Add a note using `POST /sales/leads/:leadId/notes`.
8. Create a fresh lead using `POST /sales/leads`.

## Endpoint Summary

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/sales/leads/:leadId` | Get one lead's full details |
| `GET` | `/sales/leads/:leadId/activities` | Get lead activity timeline |
| `GET` | `/sales/leads/:leadId/notes` | Get notes added on the lead |
| `PATCH` | `/sales/leads/:leadId/status` | Update lead status |
| `PATCH` | `/sales/leads/:leadId` | Update customer and vehicle details |
| `POST` | `/sales/leads/:leadId/notes` | Add a note on the lead |
| `POST` | `/sales/leads` | Create a new lead |

## 1. Get Lead Details

### Endpoint

```http
GET /sales/leads/:leadId
```

### Request Body

No request body.

### Process Flow

1. API checks the bearer token.
2. API validates `leadId`.
3. API checks whether the logged-in user can access the lead.
4. API returns the lead details.

### Expected Success Response

```json
{
  "data": {
    "id": "lead-1",
    "fullName": "Rahul Sharma",
    "phone": "9876543210",
    "email": "rahul@example.com",
    "source": "CarWale",
    "status": "INTERESTED",
    "lostReason": null,
    "referrerName": "Amit Verma",
    "referrerPhone": "9988776655",
    "carBrand": "Hyundai",
    "carModel": "Creta",
    "variantName": "SX",
    "colorPreference": "White",
    "budget": "12-15 Lakh",
    "isUsed": false,
    "assignedTo": {
      "id": "sales-1",
      "name": "Neha Singh"
    },
    "createdBy": {
      "id": "admin-1",
      "name": "Admin User"
    },
    "createdAt": "2026-05-18T10:00:00.000Z",
    "updatedAt": "2026-05-18T12:00:00.000Z"
  },
  "status": "success",
  "status_code": 200,
  "message": "Lead details fetched successfully.",
  "error": null
}
```

## 2. Get Lead Activities

### Endpoint

```http
GET /sales/leads/:leadId/activities
```

### Request Body

No request body.

### Process Flow

1. API checks the bearer token.
2. API validates `leadId`.
3. API fetches the activity timeline for the lead.
4. API returns the activity list.

### Expected Success Response

```json
{
  "data": [
    {
      "id": "activity-1",
      "leadId": "lead-1",
      "type": "call",
      "description": "Customer was called for follow-up.",
      "metaJson": null,
      "createdAt": "2026-05-18T12:30:00.000Z"
    },
    {
      "id": "activity-2",
      "leadId": "lead-1",
      "type": "status_change",
      "description": "Lead status changed from NEW to CONTACTED.",
      "metaJson": null,
      "createdAt": "2026-05-18T12:40:00.000Z"
    }
  ],
  "status": "success",
  "status_code": 200,
  "message": "Lead activities fetched successfully.",
  "error": null
}
```

### Activity Types QA Can Expect

- `call`
- `whatsapp`
- `note`
- `status_change`
- `system`

## 3. Get Lead Notes

### Endpoint

```http
GET /sales/leads/:leadId/notes
```

### Request Body

No request body.

### Process Flow

1. API checks the bearer token.
2. API validates `leadId`.
3. API fetches notes for that lead.
4. API returns the notes list.

### Expected Success Response

```json
{
  "data": [
    {
      "id": "note-1",
      "leadId": "lead-1",
      "author": {
        "id": "sales-1",
        "name": "Neha Singh"
      },
      "content": "Customer asked for a callback after 6 PM.",
      "createdAt": "2026-05-18T13:00:00.000Z"
    }
  ],
  "status": "success",
  "status_code": 200,
  "message": "Lead notes fetched successfully.",
  "error": null
}
```

## 4. Update Lead Status

### Endpoint

```http
PATCH /sales/leads/:leadId/status
```

### Request Body

```json
{
  "status": "CONTACTED",
  "lostReason": null
}
```

### Allowed Status Values

- `NEW`
- `CONTACTED`
- `INTERESTED`
- `TEST_DRIVE`
- `NEGOTIATION`
- `WON`
- `LOST`
- `VEHICLE_NA`

### Important Validation Rule

- If `status` is `LOST`, then `lostReason` is required.
- If `status` is not `LOST`, then `lostReason` should be `null` or empty.

### Process Flow

1. API checks the bearer token.
2. API validates `leadId`.
3. API validates the request body.
4. API updates the lead status.
5. API creates a related activity entry for the status change.
6. API returns the updated lead details.

### Expected Success Response

```json
{
  "data": {
    "id": "lead-1",
    "fullName": "Rahul Sharma",
    "phone": "9876543210",
    "email": "rahul@example.com",
    "source": "CarWale",
    "status": "CONTACTED",
    "lostReason": null,
    "referrerName": "Amit Verma",
    "referrerPhone": "9988776655",
    "carBrand": "Hyundai",
    "carModel": "Creta",
    "variantName": "SX",
    "colorPreference": "White",
    "budget": "12-15 Lakh",
    "isUsed": false,
    "assignedTo": {
      "id": "sales-1",
      "name": "Neha Singh"
    },
    "createdBy": {
      "id": "admin-1",
      "name": "Admin User"
    },
    "createdAt": "2026-05-18T10:00:00.000Z",
    "updatedAt": "2026-05-18T14:00:00.000Z"
  },
  "status": "success",
  "status_code": 200,
  "message": "Lead status updated successfully.",
  "error": null
}
```

## 5. Update Lead Details

### Endpoint

```http
PATCH /sales/leads/:leadId
```

### Request Body

```json
{
  "fullName": "Rahul Sharma",
  "phone": "9876543210",
  "email": "rahul@example.com",
  "source": "CarWale",
  "referrerName": "Amit Verma",
  "referrerPhone": "9988776655",
  "carBrand": "Hyundai",
  "carModel": "Creta",
  "variantName": "SX",
  "colorPreference": "White",
  "budget": "12-15 Lakh",
  "isUsed": false
}
```

### Required or Important Rules

- `fullName` must be at least 2 characters.
- `phone` must be exactly 10 digits.
- `email` must be a valid email or empty string.
- `source` is required.
- `referrerPhone` must be exactly 10 digits if sent.

### Process Flow

1. API checks the bearer token.
2. API validates `leadId`.
3. API validates the request body.
4. API updates lead profile details in the database.
5. API returns the updated lead details.

### Expected Success Response

The response shape is the same as `GET /sales/leads/:leadId`.

```json
{
  "data": {
    "id": "lead-1",
    "fullName": "Rahul Sharma",
    "phone": "9876543210",
    "email": "rahul@example.com",
    "source": "CarWale",
    "status": "CONTACTED",
    "lostReason": null,
    "referrerName": "Amit Verma",
    "referrerPhone": "9988776655",
    "carBrand": "Hyundai",
    "carModel": "Creta",
    "variantName": "SX",
    "colorPreference": "White",
    "budget": "12-15 Lakh",
    "isUsed": false,
    "assignedTo": {
      "id": "sales-1",
      "name": "Neha Singh"
    },
    "createdBy": {
      "id": "admin-1",
      "name": "Admin User"
    },
    "createdAt": "2026-05-18T10:00:00.000Z",
    "updatedAt": "2026-05-18T14:30:00.000Z"
  },
  "status": "success",
  "status_code": 200,
  "message": "Lead details updated successfully.",
  "error": null
}
```

## 6. Create Lead Note

### Endpoint

```http
POST /sales/leads/:leadId/notes
```

### Request Body

```json
{
  "content": "Customer asked for a callback after 6 PM."
}
```

### Important Validation Rule

- `content` is required.
- `content` cannot be empty.
- `content` can be up to 2000 characters.

### Process Flow

1. API checks the bearer token.
2. API validates `leadId`.
3. API validates the request body.
4. API creates the note.
5. API creates a related activity entry.
6. API returns the created note.

### Expected Success Response

```json
{
  "data": {
    "id": "note-2",
    "leadId": "lead-1",
    "author": {
      "id": "sales-1",
      "name": "Neha Singh"
    },
    "content": "Customer asked for a callback after 6 PM.",
    "createdAt": "2026-05-18T15:00:00.000Z"
  },
  "status": "success",
  "status_code": 201,
  "message": "Lead note created successfully.",
  "error": null
}
```

## 7. Create New Lead

### Endpoint

```http
POST /sales/leads
```

### Request Body

```json
{
  "fullName": "Rahul Sharma",
  "phone": "9876543210",
  "email": "rahul@example.com",
  "source": "CarWale",
  "referrerName": "Amit Verma",
  "referrerPhone": "9988776655",
  "carBrand": "Hyundai",
  "carModel": "Creta",
  "variantName": "SX",
  "colorPreference": "White",
  "budget": "12-15 Lakh",
  "isUsed": false,
  "initialNote": "Interested in petrol automatic variant."
}
```

### Important Validation Rules

- `fullName` is required and must be at least 2 characters.
- `phone` is required and must be exactly 10 digits.
- `source` is required.
- `email` must be valid if provided.
- `referrerPhone` must be 10 digits if provided.
- `initialNote` is optional.
- Duplicate phone numbers are not allowed.

### Process Flow

1. API checks the bearer token.
2. API validates the request body.
3. API checks whether a lead with the same phone number already exists.
4. API creates the lead.
5. If `initialNote` is sent, API also creates the first note.
6. API creates a system activity for lead creation.
7. API returns the created lead and optional note.

### Expected Success Response

```json
{
  "data": {
    "lead": {
      "id": "lead-2",
      "fullName": "Rahul Sharma",
      "phone": "9876543210",
      "email": "rahul@example.com",
      "source": "CarWale",
      "status": "NEW",
      "lostReason": null,
      "referrerName": "Amit Verma",
      "referrerPhone": "9988776655",
      "carBrand": "Hyundai",
      "carModel": "Creta",
      "variantName": "SX",
      "colorPreference": "White",
      "budget": "12-15 Lakh",
      "isUsed": false,
      "assignedTo": {
        "id": "sales-1",
        "name": "Neha Singh"
      },
      "createdBy": {
        "id": "sales-1",
        "name": "Neha Singh"
      },
      "createdAt": "2026-05-18T15:30:00.000Z",
      "updatedAt": "2026-05-18T15:30:00.000Z"
    },
    "note": {
      "id": "note-3",
      "leadId": "lead-2",
      "author": {
        "id": "sales-1",
        "name": "Neha Singh"
      },
      "content": "Interested in petrol automatic variant.",
      "createdAt": "2026-05-18T15:30:00.000Z"
    }
  },
  "status": "success",
  "status_code": 201,
  "message": "Lead created successfully.",
  "error": null
}
```

## Common Error Cases for QA

| Status Code | When it happens |
| --- | --- |
| `400` | Bad JSON, invalid `leadId`, invalid request body, wrong field values |
| `401` | Missing token or invalid token |
| `403` | Logged-in user is not allowed to access or create this lead |
| `404` | Lead not found |
| `409` | Duplicate phone number while creating a lead |
| `500` | Unexpected server error |

## Quick QA Checklist

- Check all endpoints with valid token.
- Check all endpoints without token and expect `401`.
- Check wrong `leadId` and expect `400` or `404` depending on input.
- Check `PATCH /status` with `status = LOST` and missing `lostReason`.
- Check `PATCH /status` with non-`LOST` status and non-empty `lostReason`.
- Check invalid phone values in create and update APIs.
- Check note creation with empty `content`.
- Check duplicate phone while creating a lead.
- Check create lead with and without `initialNote`.
