# Database Design Documentation

## Overview

This document describes the database architecture. 

The CRM is focused primarily on:
- lead management,
- sales workflow tracking,
- salesperson collaboration,
- referral tracking,
- and dealership branch operations.

The database is designed using PostgreSQL and is intended to work seamlessly with Supabase Auth.

Key architectural goals:
- clean relational structure,
- scalability,
- auditability,
- soft delete support,
- future extensibility.

---
# USERS

| Column | Type | Notes |
|---|---|---|
| id | UUID PK | Primary key |
| auth_id | UUID | Supabase auth reference |
| branch_id | UUID FK | References BRANCHES.id |
| role_id | UUID FK | References ROLES.id |
| full_name | VARCHAR | User full name |
| email | VARCHAR | Unique email |
| phone | VARCHAR | User phone |
| dob | DATE | Date of birth |
| profile_photo_url | TEXT | Profile image URL |
| is_active | BOOLEAN | Active/inactive status |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |
| deleted_at | TIMESTAMP NULL | Soft delete timestamp |

---

# ROLES

| Column | Type | Notes |
|---|---|---|
| id | UUID PK | Primary key |
| name | VARCHAR | Role name |
| description | TEXT | Role description |
| created_at | TIMESTAMP | Creation timestamp |

---

# BUSINESSES

| Column | Type | Notes |
|---|---|---|
| id | UUID PK | Primary key |
| name | VARCHAR | Business name |
| gst_no | VARCHAR | GST number |
| phone | VARCHAR | Contact number |
| whatsapp_no | VARCHAR | WhatsApp number |
| email | VARCHAR | Business email |
| city | VARCHAR | City |
| address | TEXT | Full address |
| working_hours | TEXT | Business hours |
| status | VARCHAR | Active/inactive |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |
| deleted_at | TIMESTAMP NULL | Soft delete timestamp |

---

# BRANCHES

| Column | Type | Notes |
|---|---|---|
| id | UUID PK | Primary key |
| business_id | UUID FK | References BUSINESSES.id |
| phone | VARCHAR | Branch phone |
| whatsapp_no | VARCHAR | WhatsApp number |
| email | VARCHAR | Branch email |
| city | VARCHAR | City |
| address | TEXT | Full address |
| working_hours | TEXT | Working hours |
| is_active | BOOLEAN | Active status |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |
| deleted_at | TIMESTAMP NULL | Soft delete timestamp |

---

# CAR_BRANDS

| Column | Type | Notes |
|---|---|---|
| id | UUID PK | Primary key |
| name | VARCHAR | Brand name |
| logo_url | TEXT | Brand logo |
| is_active | BOOLEAN | Active status |

---

# CAR_MODELS

| Column | Type | Notes |
|---|---|---|
| id | UUID PK | Primary key |
| car_brand_id | UUID FK | References CAR_BRANDS.id |
| name | VARCHAR | Model name |
| category | VARCHAR | SUV/Sedan/etc |
| is_active | BOOLEAN | Active status |
| price_range | VARCHAR | Display price range |
| image_url | TEXT | Model image URL |

---

# LEADS

| Column | Type | Notes |
|---|---|---|
| id | UUID PK | Primary key |
| full_name | VARCHAR | Customer name |
| phone | VARCHAR | Customer phone |
| email | VARCHAR | Customer email |
| city | VARCHAR | Customer city |
| state | VARCHAR | Customer state |
| branch_id | UUID FK | References BRANCHES.id |
| lead_source_id | UUID FK | References LEAD_SOURCES.id |
| referred_by_referrer_id | UUID FK NULL | References REFERRERS.id |
| status_id | UUID FK | References STATUSES.id |
| lost_reason_id | UUID FK NULL | References LOST_REASONS.id |
| car_brand_id | UUID FK | References CAR_BRANDS.id |
| car_model_id | UUID FK | References CAR_MODELS.id |
| variant_name | VARCHAR | Vehicle variant |
| color_preference | VARCHAR | Preferred color |
| budget | DECIMAL(12,2) | Budget amount |
| is_used | BOOLEAN | Used car interest |
| creator_user_id | UUID FK | References USERS.id |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |
| deleted_at | TIMESTAMP NULL | Soft delete timestamp |

---

# REFERRERS

| Column | Type | Notes |
|---|---|---|
| id | UUID PK | Primary key |
| full_name | VARCHAR | Referrer name |
| phone | VARCHAR | Referrer phone |
| email | VARCHAR | Referrer email |
| city | VARCHAR | Referrer city |
| notes | TEXT | Internal notes |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

---

# LEAD_SOURCES

| Column | Type | Notes |
|---|---|---|
| id | UUID PK | Primary key |
| name | VARCHAR | Source name |
| description | TEXT | Source description |
| created_at | TIMESTAMP | Creation timestamp |
| is_active | BOOLEAN | Active status |

---

# LOST_REASONS

| Column | Type | Notes |
|---|---|---|
| id | UUID PK | Primary key |
| name | VARCHAR | Lost reason |
| description | TEXT | Reason description |

---

# STATUSES

| Column | Type | Notes |
|---|---|---|
| id | UUID PK | Primary key |
| name | VARCHAR | Status name |
| description | TEXT | Status description |
| created_on | TIMESTAMP | Creation timestamp |
| is_active | BOOLEAN | Active status |

---

# LEAD_USER

| Column | Type | Notes |
|---|---|---|
| lead_id | UUID FK | References LEADS.id |
| user_id | UUID FK | References USERS.id |
| is_primary | BOOLEAN | Primary sales rep |

---

# LEAD_STATUS_LOG

| Column | Type | Notes |
|---|---|---|
| lead_id | UUID FK | References LEADS.id |
| from_status_id | UUID FK | References STATUSES.id |
| to_status_id | UUID FK | References STATUSES.id |
| updated_at | TIMESTAMP | Status update timestamp |
| user_id | UUID FK | References USERS.id |

---

# LEAD_NOTES_LOG

| Column | Type | Notes |
|---|---|---|
| lead_id | UUID FK | References LEADS.id |
| note_text | TEXT | Lead note |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |
| user_id | UUID FK | References USERS.id |
