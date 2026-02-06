# Backend (AdonisJS + PostgreSQL) Setup & Architecture

This document defines how to set up the backend service for the Lounge Digital Menu System using **AdonisJS** with a **PostgreSQL** database, and the recommended backend architecture aligned with `docs/menu-api-spec.md`.

## Scope (Phase 1)

- Admin authentication for `/api/v1/admin/**`
- Menu management entities: Categories, Sections, Menu Items, Temporary Prices
- Public menu consumption endpoints with **server-side price resolution**

Events management is excluded for Phase 1 (but the architecture below keeps it easy to add later).

## Tech Choices

- **Framework**: AdonisJS (TypeScript)
- **ORM**: Lucid
- **Database**: PostgreSQL
- **Validation**: VineJS (Adonis default)
- **Auth**: Adonis Auth using Bearer tokens (DB-backed access tokens)

This keeps Phase 1 fast to ship as a solo developer while still supporting a clean API boundary for the Next.js frontend.

---

## Local Setup

### Prerequisites

- Node.js 20+ (LTS recommended)
- PostgreSQL 14+
- npm or pnpm

### Create the AdonisJS project

From the backend repo root:

```bash
npm create adonisjs@latest .
```

Recommended selections:

- **Project type**: API
- **Language**: TypeScript
- **Package manager**: your preference (npm/pnpm)

### Install and configure Lucid (PostgreSQL)

If not selected during scaffolding:

```bash
node ace add @adonisjs/lucid
```

Choose:

- Database: PostgreSQL

### Environment variables

Create `.env` (or update it) with:

```env
TZ=UTC
PORT=3001
HOST=0.0.0.0
NODE_ENV=development
APP_KEY=replace-with-generated-app-key

DB_CONNECTION=pg
PG_HOST=127.0.0.1
PG_PORT=5432
PG_USER=postgres
PG_PASSWORD=postgres
PG_DB_NAME=poolsandpool
```

Generate an `APP_KEY`:

```bash
node ace generate:key
```

### Run migrations

```bash
node ace migration:run
```

### Start the server

```bash
node ace serve --watch
```

---

## Architecture Overview

The backend is an HTTP API service consumed by Next.js.

### Principles

- Keep controllers thin (HTTP only)
- Put business logic in services
- Use validators for request input
- Keep DB queries in services/repositories (not in controllers)
- Resolve pricing on-demand (no cron required), using server time

### Suggested project layout (Adonis conventions)

```text
app/
  controllers/
    http/
      auth_controller.ts
      admin/
        categories_controller.ts
        sections_controller.ts
        menu_items_controller.ts
        temporary_prices_controller.ts
      public/
        public_menu_controller.ts
  middleware/
    require_role_middleware.ts
  models/
    admin_user.ts
    category.ts
    section.ts
    menu_item.ts
    temporary_price.ts
  services/
    pricing_service.ts
    slug_service.ts
    menu_read_service.ts
    admin_menu_service.ts
start/
  routes.ts
database/
  migrations/
  seeders/
```

### Routing structure

Organize routes exactly like the spec:

- `/api/v1/auth/*`
- `/api/v1/admin/*` (protected)
- `/api/v1/public/*` (unauthenticated)

In `start/routes.ts`, use route groups:

```ts
import router from '@adonisjs/core/services/router'

router.group(() => {
  router.post('auth/login', '#controllers/http/auth_controller.login')
  router.post('auth/logout', '#controllers/http/auth_controller.logout')
  router.get('auth/me', '#controllers/http/auth_controller.me')

  router
    .group(() => {
      router.resource('categories', '#controllers/http/admin/categories_controller').apiOnly()
      router.post('categories/reorder', '#controllers/http/admin/categories_controller.reorder')
      router.patch('categories/:id/enabled', '#controllers/http/admin/categories_controller.setEnabled')

      router.resource('sections', '#controllers/http/admin/sections_controller').apiOnly()
      router.post('sections/reorder', '#controllers/http/admin/sections_controller.reorder')
      router.patch('sections/:id/enabled', '#controllers/http/admin/sections_controller.setEnabled')

      router.resource('menu-items', '#controllers/http/admin/menu_items_controller').apiOnly()
      router.patch('menu-items/:id/availability', '#controllers/http/admin/menu_items_controller.setAvailability')
      router.patch('menu-items/:id/enabled', '#controllers/http/admin/menu_items_controller.setEnabled')

      router.get('menu-items/:id/temporary-prices', '#controllers/http/admin/temporary_prices_controller.index')
      router.post('menu-items/:id/temporary-prices', '#controllers/http/admin/temporary_prices_controller.store')
      router.patch(
        'menu-items/:itemId/temporary-prices/:tempPriceId',
        '#controllers/http/admin/temporary_prices_controller.update'
      )
      router.patch(
        'menu-items/:itemId/temporary-prices/:tempPriceId/enabled',
        '#controllers/http/admin/temporary_prices_controller.setEnabled'
      )
      router.post(
        'menu-items/:itemId/temporary-prices/:tempPriceId/duplicate',
        '#controllers/http/admin/temporary_prices_controller.duplicate'
      )
      router.delete(
        'menu-items/:itemId/temporary-prices/:tempPriceId',
        '#controllers/http/admin/temporary_prices_controller.destroy'
      )
    })
    .prefix('admin')
    .use(['auth'])

  router.group(() => {
    router.get('menu/categories', '#controllers/http/public/public_menu_controller.categories')
    router.get('menu/categories/:slug', '#controllers/http/public/public_menu_controller.categoryBySlug')
    router.get('menu/overview', '#controllers/http/public/public_menu_controller.overview')
  }).prefix('public')
})
  .prefix('api/v1')
```

---

## Authentication (Admin)

The API spec uses `Authorization: Bearer <token>`. Adonis Auth with access tokens fits this well for Phase 1.

### Recommended approach

- `AdminUser` model
- Bearer token auth guard
- Store and validate tokens server-side
- Protect `/api/v1/admin/**` with `auth` middleware

### Roles

Phase 1 can be single role (`admin`), but keep the column (`role`) so adding `manager/staff` later does not require migrations that change the auth model.

---

## Database Schema (PostgreSQL)

This is the minimal schema needed to support `docs/menu-api-spec.md`.

### Money representation (recommendation)

To avoid rounding issues, store money as an integer in the smallest currency unit (for NGN, this can be “naira” as whole units if you never need kobo, or “kobo” if you might).

- If you choose integers:
  - `base_price` bigint
  - `price` bigint
- If you choose decimals:
  - use `numeric(12,2)` consistently for both fields

### `users`

- `id` uuid primary key
- `email` text unique
- `password_hash` text
- `first_name` text nullable
- `last_name` text nullable
- `role` text (default `admin`, future: `manager`, `staff`, `customer`)
- timestamps

### `categories`

- `id` uuid primary key
- `name` text (required)
- `slug` text (required, unique)
- `description` text nullable
- `image_url` text nullable
- `order` int not null default 0
- `enabled` boolean not null default true
- timestamps

Indexes/constraints:

- unique(`slug`)
- index(`enabled`, `order`)

### `sections`

- `id` uuid primary key
- `category_id` uuid references `categories.id`
- `name` text
- `slug` text
- `description` text nullable
- `image_url` text nullable
- `order` int not null default 0
- `enabled` boolean not null default true
- timestamps

Indexes/constraints:

- unique(`category_id`, `slug`)
- index(`category_id`, `enabled`, `order`)

### `menu_items`

- `id` uuid primary key
- `category_id` uuid references `categories.id`
- `section_id` uuid references `sections.id`
- `name` text
- `slug` text
- `description` text nullable
- `base_price` bigint or numeric(12,2) (choose one and keep consistent)
- `image_url` text nullable
- `available` boolean not null default true
- `enabled` boolean not null default true
- timestamps

Indexes/constraints:

- index(`category_id`)
- index(`section_id`)
- index(`enabled`, `available`)
- unique constraint for slug, either:
  - unique(`slug`) globally, or
  - unique(`category_id`, `slug`) if slugs are category-scoped

### `temporary_prices`

- `id` uuid primary key
- `menu_item_id` uuid references `menu_items.id`
- `rule_name` text
- `price` bigint or numeric(12,2) (match `base_price`)
- `start_at` timestamptz
- `end_at` timestamptz
- `enabled` boolean not null default true
- timestamps

Indexes (important for performance and correctness):

- index(`menu_item_id`)
- index(`menu_item_id`, `enabled`, `start_at`)
- index(`menu_item_id`, `enabled`, `end_at`)

PostgreSQL optimization (optional but recommended):

- partial index for active-rule scans:
  - `create index ... on temporary_prices (menu_item_id, start_at desc) where enabled = true;`

---

## Pricing Resolution Logic

Implement the rules exactly as described in `docs/menu-api-spec.md`:

- Find temporary prices for a menu item where:
  - `enabled = true`
  - `startAt <= now <= endAt`
- If multiple are active, pick the one with the most recent `startAt`
- Otherwise fall back to `basePrice`

### Query shape (conceptual)

```sql
select *
from temporary_prices
where menu_item_id = $1
  and enabled = true
  and start_at <= now()
  and end_at >= now()
order by start_at desc
limit 1;
```

This query is why the `temporary_prices` indexes above matter.

---

## Admin list endpoints: pagination, filters, search

The spec’s admin listing endpoints (especially `GET /api/v1/admin/menu-items`) include pagination and filtering. Plan for these early:

- **Pagination**: use `page` + `pageSize` with a deterministic sort (for example `created_at desc` or `order asc, created_at desc`).
- **Filters**: `categoryId`, `sectionId`, `availability`, `includeDisabled`.
- **Search**: `search` by name.

Recommended DB support:

- index on `menu_items(category_id)` and `menu_items(section_id)` (already included above)
- composite index on `menu_items(enabled, available)` (already included above)
- for case-insensitive search:
  - simple: index on `lower(name)` and use `whereRaw('lower(name) like ?', ...)`
  - Postgres optimized (optional): `pg_trgm` with a GIN index for fast partial matches

---

## Migrations & Seed Data

### Migrations

- Create tables with UUID primary keys
- Add unique constraints for slugs
- Add the pricing indexes above

### Seeders (local/dev)

- Create a default admin user
- Optionally create starter categories/sections/items to speed up UI development

---

## Deployment Notes

- Run migrations during deployment
- Set `TZ=UTC` and treat all stored times as `timestamptz`
- Keep pricing resolution strictly server-side using server time
- Store image URLs (upload storage can be added later: S3/Cloudinary/etc.)

---

## Phase 2+ Extension Points

- Events can reuse temporary prices by inserting time-bounded rows (as described in the PRD)
- Add role-based access beyond `admin` by extending `require_role_middleware.ts`
- Add ordering without breaking the `/api/v1/public/**` menu APIs

