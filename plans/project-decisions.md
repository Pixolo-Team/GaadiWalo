# Product Decisions

## Project: Automotive Sales CRM

This document records important product and architecture decisions for the Automotive Sales CRM project.

The purpose of this file is to help developers, product owners, and future contributors understand why certain product and database decisions were made.

# Decision Log

| Date | Decision 
|---|---|
| 2026-05-12 | CRM will be single-tenant |
| 2026-05-12 | Inventory management excluded from V1 |
| 2026-05-12 | `VEHICLE_NA` will be kept as a lead status |
| 2026-05-12 | `VEHICLE_NA` leads are recoverable |
| 2026-05-12 | Previous status must be preserved in `LEAD_STATUS_LOG` |


---

# 1. Single-Tenant Architecture

## Decision

The CRM will be built as a **single-tenant system**.

> One database belongs to one organization/business.

The system is not being designed as a multi-tenant SaaS platform in V1.

## Reasoning

The current project is intended for one organization at a time. Each deployment/database will serve only one business.

Because of this, the database does not need tenant-level separation on every table.

---

## Implications

The system does not require:

* `tenant_id` on every table
* `organization_id` on every table
* complex tenant-based row-level isolation
* multi-tenant billing logic
* cross-organization user access rules

This simplifies:

* database design
* API logic
* permissions
* dashboard queries
* reporting
* development speed

---

## Current Approach

The system may still keep a `BUSINESSES` table to store business/showroom profile information such as:

* business name
* GST number
* phone number
* WhatsApp number
* email
* address
* working hours

However, this table is treated as a business profile, not as a multi-tenant organization model.

---

# 2. No Inventory Management in V1

## Decision

The CRM will not include vehicle inventory management in V1.

Salespeople may use external tools, spreadsheets, or existing business processes to check whether a vehicle is available.

---

## Reasoning

The primary purpose of this CRM is sales lead management, not inventory control.

Inventory management would require additional complexity such as:

* vehicle stock records
* VIN/chassis tracking
* vehicle purchase records
* vehicle availability lifecycle
* yard/location tracking
* reserved/sold status
* pricing history
* ownership history
* inspection status

These are outside the current V1 scope.

---

## Implications

The system will not include tables such as:

* `VEHICLES`
* `INVENTORY`
* `STOCK`
* `YARD_LOCATIONS`
* `VEHICLE_RESERVATIONS`

Instead, the CRM will only track the customer's vehicle interest/preference on the lead.

---

## Lead Vehicle Preference Fields

The `LEADS` table stores the customer's desired vehicle information:

* `car_brand_id`
* `car_model_id`
* `variant_name`
* `color_preference`
* `budget`
* `is_used`

This represents what the customer is looking for, not what is currently available in stock.

---

# 3. Most Sales Are for Second-Hand Vehicles

## Decision

The CRM should be optimized for second-hand vehicle sales workflows.

---

## Reasoning

Second-hand vehicle sales are more availability-sensitive than new vehicle sales.

A customer may be interested in a very specific combination such as:

* Red Hyundai i10
* Automatic variant
* Specific budget range
* Used vehicle only

If that vehicle is sold or unavailable, the lead may not be lost permanently. The customer may still be interested if a similar vehicle becomes available later.

---

## Implications

The CRM must support workflows where leads can temporarily become unfulfillable due to vehicle unavailability.

This led to the decision to include `VEHICLE_NA` as a lead status.

---

# 4. VEHICLE_NA Will Be Kept as a Lead Status

## Decision

`VEHICLE_NA` will be added to the `STATUSES` table as a valid lead status.

---

## Status List

The lead statuses for V1 are:

* `NEW`
* `CONTACTED`
* `INTERESTED`
* `TEST_DRIVE`
* `NEGOTIATION`
* `WON`
* `LOST`
* `VEHICLE_NA`

---

## Meaning of VEHICLE_NA

`VEHICLE_NA` means:

> The lead is still valid, but the requested vehicle is currently not available.

---

## Important Rule

`VEHICLE_NA` is not the same as `LOST`.

A `LOST` lead means the customer is no longer a valid sales opportunity.

A `VEHICLE_NA` lead means the customer may still convert if a matching vehicle becomes available again.

---

## Reasoning

The business wants sales reps/admins to be able to mark matching leads as Vehicle Not Available when a specific second-hand vehicle is sold or unavailable.

Example:
If a Red Hyundai i10 is sold, all leads looking for a Red Hyundai i10 can be marked as `VEHICLE_NA`.

---

## Risk

If `VEHICLE_NA` is treated like a normal final status, valuable leads may get stuck and never followed up again.

To prevent this, the system must support reactivation of `VEHICLE_NA` leads.

---

# 5. VEHICLE_NA Is Recoverable

## Decision

Leads marked as `VEHICLE_NA` must be recoverable.

When a matching vehicle becomes available again, users should be able to filter and reactivate those leads.

---

## Example

A lead is interested in:

* Brand: Hyundai
* Model: i10
* Color: Red

The current Red Hyundai i10 is sold, so the lead is marked:

```text
VEHICLE_NA
```

Later, another Red Hyundai i10 becomes available.

The admin can filter:

* Status: `VEHICLE_NA`
* Brand: Hyundai
* Model: i10
* Color: Red

Then reactivate those leads for follow-up.

---