# Backend – Database Schema

## Engine and Access

- Database: Supabase Postgres
- Access: Supabase client on server + SQL migrations

## Core Entities (MVP)

- `users`
  - id, full_name, phone, email, role (`sales|admin`), branch, status, joined_at, optional `language_preference`, optional `notification_preferences_json`
- `leads`
  - id, full_name, phone, email, source, status, assigned_to, created_by, created_at, updated_at
- `lead_notes`
  - id, lead_id, author_id, content, created_at
- `lead_activities`
  - id, lead_id, type, description, meta_json, created_at
- `referrers`
  - id, full_name, phone, source_notes, created_at
- `cars_catalogue`
  - id, brand, model, variant, is_active

## Relationships

- `users (1) -> (many) leads` via `assigned_to`
- `leads (1) -> (many) lead_notes`
- `leads (1) -> (many) lead_activities`

## Indexing Priorities

- leads: `(assigned_to, status)`, `(created_at)`, `(phone)` unique/near-unique strategy
- activities/notes: `(lead_id, created_at)`
- users: `(role, status)`

## Audit Fields

Use `created_at` and `updated_at` on mutable entities.
Add `created_by` where actor tracking is needed.

## Migration Rule

Every schema change must include migration notes in backend plan updates.
