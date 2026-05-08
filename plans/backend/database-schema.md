# Backend – Database Schema

> This file defines the data model for GaadiWalo. The agent should read this before creating
> migrations, writing queries, or adding new fields to existing tables/collections.

---

## What to put in this file

In this file, describe the database and every entity (table or collection) in enough detail that
the agent can generate migrations and write queries without guessing. Include:

- **Database engine and version** – which database is used (PostgreSQL, MySQL, MongoDB, SQLite,
  etc.) and the version, so the agent uses the correct SQL dialect or ODM features.
- **ORM / query builder** – which library manages the database layer (Prisma, TypeORM, Sequelize,
  Mongoose, Drizzle, SQLAlchemy, Eloquent, etc.), where the schema/model files live, and how to
  run migrations.
- **Entity catalogue** – for each entity, list: table/collection name, purpose, all fields (name,
  type, nullable, default, indexed), primary key, and any unique constraints. For relational
  databases, note the foreign keys and describe the relationship type (one-to-many, many-to-many).
- **Entity-relationship diagram** – an ASCII or Mermaid ERD showing how entities relate to each
  other, so the agent can understand joins and embedded documents at a glance.
- **Seed data** – describe any seed data the agent should create for local development and testing
  (e.g., sample vehicle listings, test user accounts, dealer profiles).
- **Indexing strategy** – which columns are indexed for performance and the reasoning, so the
  agent adds indexes when adding new query patterns.
- **Soft delete and auditing** – whether records are hard- or soft-deleted, and whether an audit
  log (`created_at`, `updated_at`, `deleted_at`, `created_by`) is required on every entity.
