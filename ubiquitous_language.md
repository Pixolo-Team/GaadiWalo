# Ubiquitous Language — GaadiWalo

This document defines the shared domain vocabulary for GaadiWalo. When we talk about the product — in conversations, planning, or with AI — these terms have precise meanings that everyone must use consistently.

---

## Entities

### Lead

A prospective car buyer who has expressed interest in purchasing a car. A Lead has a status, a source, an assigned Sales Person, contact details, car interest details, notes, and an activity log.

### Sales Person

A dealership team member responsible for managing and converting their own assigned Leads. They can contact leads, update statuses, add notes, and track their personal performance.

### Admin

A dealership manager with full visibility across the team. The Admin manages team members, assigns Leads, reviews reports, manages Referrers, and configures business settings.

### Referrer

A person or entity outside the dealership who refers Leads into the pipeline (e.g. a broker or a loyal past customer). Referrers are tracked separately to measure their contribution.

### Cars Catalogue

The Admin-maintained list of car brands, models, and variants likely to be available at the dealership. Sales Persons select from this catalogue when capturing a Lead's Car Interest.

---

## Lead Concepts

### Lead Status

The current stage of a Lead in the sales pipeline. Every Lead is always in exactly one of these statuses:

| Status               | Meaning                                                       |
| -------------------- | ------------------------------------------------------------- |
| New                  | Lead has been captured but no contact has been made yet       |
| Contacted            | The Sales Person has made first contact with the Lead         |
| Interested           | The Lead has shown genuine buying intent                      |
| Test Drive Scheduled | The Lead has been scheduled for or has completed a test drive |
| Test Drive Completed | The Lead has been scheduled for or has completed a test drive |
| Vehicle NA           | The vehicle required by the Lead is not available with us     |
| Won                  | The Lead converted — a car was sold                           |
| Lost                 | The Lead dropped out of the pipeline and will not convert     |

### Lost Reason

The reason recorded when a Lead is marked as Lost. One of: "Went to competitor", "Budget issue", "No response", "Changed mind".

### Lead Source

The channel through which a Lead was captured. Examples: CarWale, CarDekho, Walk In. The list is configurable by the Admin.

### Car Interest

The specific car a Lead wants to buy. Includes brand, model, variant, colour preference, and budget range.

### Note

A free-text observation a Sales Person writes on a Lead — typically context, a conversation summary, or a reminder. Notes are private to the team.

### Activity

A timestamped record of something that happened on a Lead. Activities are logged automatically (status changes, imports) or manually (calls, WhatsApp messages, notes added). Together they form the Lead's history.

Activity types:
| Type | What it records |
|------|----------------|
| Call | A call was made to the Lead |
| WhatsApp | A WhatsApp message was sent to the Lead |
| Note | A note was added |
| Status Change | The Lead's status was updated |
| System | An automated event (e.g. Lead was created via import) |

---

## Pipeline & Sales Concepts

### Pipeline

The full journey of a Lead from first capture through to Won or Lost. The pipeline is measured as a funnel — showing how many Leads exist at each status and where they drop off.

### Conversion

When a Lead moves from any earlier status to Won. This is the primary goal of every Sales Person.

### Lead-to-Test-Drive Rate

The percentage of Leads that reach Test Drive status. An intermediate milestone before full conversion.

### Lead-to-Won Rate

The percentage of Leads that reach Won status. The primary sales effectiveness metric.

### Follow-up

An action taken by a Sales Person to progress a Lead — a call, a WhatsApp message, or a visit. The speed of the first follow-up after a Lead is captured is a key SLA metric.

### Follow-up SLA

The maximum acceptable time between a Lead being captured and the Sales Person making first contact. Used to measure responsiveness.

### Assignment

The act of an Admin allocating one or more Leads to a specific Sales Person. Leads can be assigned individually or in bulk.

### Bulk Assignment

Assigning a large batch of Leads to one or more Sales Persons at once. Can follow a distribution strategy such as round-robin (spreading evenly across the team) or assigning all to a single person.

### Import

Adding multiple Leads at once by uploading an Excel or CSV file, rather than creating them one by one.

### Duplicate

A Lead whose phone number already exists in the system. Detected during import to avoid double-handling the same person.

---

## Performance & Reporting Concepts

### Performance

A Sales Person's individual numbers: how many Leads they have at each status, their conversion rates, weekly activity, and breakdown by source. Reviewed by the Sales Person themselves and by the Admin.

### Top Performer

A Sales Person who has the highest conversion rate (Leads Won ÷ total assigned Leads) within a given period. In case of a tie, the Sales Person with more total Leads Won ranks higher.

### Top Referrer

The Referrer who has contributed the most Leads in a given period. Used to recognise and prioritise high-value referral relationships.

### Funnel Report

A view showing how many Leads exist at each pipeline stage, making it clear where volume is strong and where Leads are dropping off.

### Source Report

A breakdown of Lead counts and conversion rates by Lead Source, showing which channels bring the most valuable Leads.

### Overview Report

A high-level summary for the Admin: total Leads, overall conversion rate, team activity, and active Sales Persons.

---

## Roles & Access Concepts

### Role

Every User has one role — either Sales Person or Admin — which determines what they can see and do in the system.

### Sales Scope

A Sales Person can only see and act on Leads assigned to them. They cannot view other team members' Leads or access team-wide reports.

### Admin Scope

An Admin can see all Leads, all team members, all reports, and all settings. They do not handle individual Leads directly but oversee the full operation.

---

## Abbreviations

| Term | Meaning                                                                      |
| ---- | ---------------------------------------------------------------------------- |
| CRM  | Customer Relationship Management — what GaadiWalo is                         |
| SLA  | Service Level Agreement — a time target for an action (e.g. follow-up speed) |

---

_Last updated: 2026-05-12. Update this document whenever a new domain concept is introduced or an existing definition changes._
