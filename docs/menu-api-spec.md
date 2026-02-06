## Menu Management API Specification (Phase 1 – No Events)

This document defines the backend API needed for the **Menu Management** module (Phase 1) for both **Admin** and **Public** flows.

- **Exclude for now**: Events management, event-based pricing.
- **Include**: Categories, Sections, Menu Items, Temporary Prices, and Public Menu consumption with resolved prices.

All endpoints are versioned under `/api/v1`.

---

## 0. Authentication & Authorization (Admin Access)

### 0.1 Goal

- Only authenticated staff should access the **admin dashboard** and all `/api/v1/admin/...` endpoints.
- Public menu (`/api/v1/public/...`) stays unauthenticated.

You can adjust the exact auth mechanism (JWT vs session) later; below is a clean baseline.

### 0.2 Auth Model (recommended)

- **Admin user entity (minimal)**:
  - `id` (string, UUID)
  - `email` (string, unique)
  - `passwordHash` (string, stored hashed)
  - `name` (string, optional)
  - `role` (string, e.g. `"admin"`; future: `"manager"`, `"staff"`)
  - `createdAt`, `updatedAt` (ISO datetime)

- **Token model**:
  - Use **JWT access token** (short-lived, e.g. 15–30 mins).
  - Optionally use a **refresh token** (httpOnly cookie or secure storage) if you want long sessions.

- **Admin protection rule**:
  - All endpoints under `/api/v1/admin/**` must:
    - Validate a valid access token.
    - Check user has an allowed `role` (for now: any authenticated user with role `"admin"`).

### 0.3 Auth Endpoints

Base path: `/api/v1/auth`

#### 0.3.1 Login

- **Endpoint**: `POST /api/v1/auth/login`

Request body:
```json
{
  "email": "admin@example.com",
  "password": "secret-password"
}
```

Successful response `200 OK`:
```json
{
  "data": {
    "user": {
      "id": "user_1",
      "email": "admin@example.com",
      "name": "Admin User",
      "role": "admin"
    },
    "accessToken": "jwt-access-token-here",
    "expiresIn": 1800
  }
}
```

Notes:
- `accessToken` should be used by the frontend in `Authorization: Bearer <token>` for all `/api/v1/admin/...` calls.
- Backend can also set an httpOnly cookie if preferred.

Error responses:
- `401 Unauthorized` for invalid credentials.

#### 0.3.2 Logout

- **Endpoint**: `POST /api/v1/auth/logout`

Purpose:
- Invalidate refresh token / session server-side if used.
- Frontend should clear stored tokens.

Request body:
```json
{}
```

Response `200 OK`:
```json
{ "success": true }
```

#### 0.3.3 Get Current User (Session Check)

- **Endpoint**: `GET /api/v1/auth/me`

Headers:
- `Authorization: Bearer <accessToken>`

Response `200 OK`:
```json
{
  "data": {
    "id": "user_1",
    "email": "admin@example.com",
    "name": "Admin User",
    "role": "admin"
  }
}
```

If token is invalid or missing:
- `401 Unauthorized`

> Optional (later): refresh token endpoint `POST /api/v1/auth/refresh` if you want long-lived sessions.

### 0.4 Authorization Rules (Phase 1)

- **Admin endpoints** `/api/v1/admin/**`:
  - Require valid access token.
  - Require `role = "admin"` (for now, single role is fine).
  - On failure, return `401 Unauthorized` or `403 Forbidden`.

- **Public endpoints** `/api/v1/public/**`:
  - No auth required.

---

## 0.5 Future: Customer Authentication for Online Ordering (Scalable Extension)

> This is **not required for Phase 1**, but defines how the current auth model should evolve for **online food ordering** with authenticated customers, without breaking anything.

### 0.5.1 Customer User Model (Same Auth Service)

Reuse the same `User` entity with additional roles:

- `id` (string, UUID)
- `email` (string, unique)
- `passwordHash` (string)
- `name` (string, optional)
- `role` (string enum):
  - `"admin"` – full dashboard access
  - `"customer"` – can place orders, view their history
  - (optional later: `"staff"`, `"manager"`)
- `phone` (string, optional) – useful for orders
- `createdAt`, `updatedAt`

The **same auth endpoints** (`/api/v1/auth/login`, `/auth/me`, optional `/auth/register`) work for both admins and customers; only the `role` and the **allowed routes** differ.

### 0.5.2 Additional Auth Endpoints (Later)

#### Register Customer

- **Endpoint**: `POST /api/v1/auth/register`

Request body:
```json
{
  "email": "customer@example.com",
  "password": "password123",
  "name": "John Doe",
  "phone": "+2348000000000"
}
```

Behavior:
- Create user with `role: "customer"`.
- Hash password server-side.

Response `201 Created`:
```json
{
  "data": {
    "user": {
      "id": "user_cust_1",
      "email": "customer@example.com",
      "name": "John Doe",
      "role": "customer"
    },
    "accessToken": "jwt-access-token-here",
    "expiresIn": 1800
  }
}
```

> Note: Admin creation can stay manual / seeded, or later use a separate endpoint like `POST /api/v1/admin/users` restricted to `role = "admin"`.

### 0.5.3 Route-Level Authorization Design

- **Admin dashboard & management**:
  - Path: `/api/v1/admin/**`
  - Allowed roles: `["admin"]` (or `["admin", "manager"]` later)

- **Customer ordering APIs (future)**:
  - Path suggestion: `/api/v1/customer/**` or `/api/v1/orders/**`
  - Allowed roles: `["customer"]` (and optionally `["admin"]` for internal tools)

- **Public menu APIs**:
  - Path: `/api/v1/public/**`
  - Allowed: no auth (anyone).

This way:

- The **auth service is shared**, but:
  - Admin-only logic stays under `/api/v1/admin/**`.
  - Customer-facing order flows live under their own namespace, secured by `role: "customer"`.

### 0.5.4 Impact on Current Design

- No breaking changes needed:
  - Existing admin auth (Phase 1) already uses a generic `User + role` model.
  - Tokens already carry `userId` and `role`, which can be reused.
- When online ordering is added:
  - Add `customer` creation endpoint, order entities, and `/api/v1/customer/**` routes.
  - Keep all existing admin/public menu endpoints as is.

---

## 1. Core Entities

### 1.1 Category

- **Purpose**: Top-level grouping (Food, Drinks, Smoke, etc.)

Fields:
- `id` (string, UUID)
- `name` (string, required, unique per tenant)
- `slug` (string, required, unique, URL-safe)
- `description` (string, optional)
- `imageUrl` (string, optional) – used for public menu cards
- `order` (number, used for manual sorting)
- `enabled` (boolean, default `true`) – controls visibility on public menu
- `createdAt` (ISO datetime, server-generated)
- `updatedAt` (ISO datetime, server-generated)

### 1.2 Section

- **Purpose**: Group items inside a category (Small Chops, Classic Cocktails, etc.)

Fields:
- `id` (string, UUID)
- `categoryId` (string, references `Category.id`)
- `name` (string, required)
- `slug` (string, required, unique within category)
- `description` (string, optional)
- `imageUrl` (string, optional) – used for public section banners / thumbnails
- `order` (number, used for sorting inside category)
- `enabled` (boolean, default `true`)
- `createdAt` (ISO datetime)
- `updatedAt` (ISO datetime)

### 1.3 MenuItem

- **Purpose**: A single purchasable item.

Fields:
- `id` (string, UUID)
- `categoryId` (string, references `Category.id`)
- `sectionId` (string, references `Section.id`)
- `name` (string, required)
- `slug` (string, required, unique within category or global – decide at implementation)
- `description` (string, optional)
- `basePrice` (number, required, in smallest currency unit or decimal – decide and keep consistent)
- `imageUrl` (string, optional)
- `available` (boolean, default `true`) – in stock / out of stock
- `enabled` (boolean, default `true`) – if false, item is not shown on public side
- `createdAt` (ISO datetime)
- `updatedAt` (ISO datetime)

### 1.4 TemporaryPrice

- **Purpose**: Time-bound temporary price for a single menu item.
- **Logic**: If a temporary price is enabled and current time is within `[startAt, endAt]`, it overrides `basePrice`. If multiple active rules exist, **the most recent `startAt` wins**.

Fields:
- `id` (string, UUID)
- `menuItemId` (string, references `MenuItem.id`)
- `ruleName` (string, required, e.g. "Live Band Night")
- `price` (number, required)
- `startAt` (ISO datetime, required)
- `endAt` (ISO datetime, required)
- `enabled` (boolean, default `true`) – when `false`, rule is ignored even if within date range
- `createdAt` (ISO datetime)
- `updatedAt` (ISO datetime)

Derived (backend-side only, not stored):
- `status`: `"ACTIVE" | "UPCOMING" | "EXPIRED"` based on current server time.

---

## 2. Admin Features and Endpoints

Base path for admin APIs: `/api/v1/admin`

Authentication / authorization details can be added later; assume all admin endpoints require an authenticated admin.

### 2.1 Category Management

#### 2.1.1 List Categories

- **Endpoint**: `GET /api/v1/admin/categories`
- **Query params**:
  - `includeDisabled` (boolean, optional, default `true`) – if `false`, only `enabled = true`

Response `200 OK`:
```json
{
  "data": [
    {
      "id": "cat_1",
      "name": "Drinks",
      "slug": "drinks",
      "description": "All beverages",
      "imageUrl": "https://cdn.example.com/images/categories/drinks.jpg",
      "order": 1,
      "enabled": true,
      "createdAt": "2025-01-01T12:00:00Z",
      "updatedAt": "2025-01-02T12:00:00Z"
    }
  ]
}
```

#### 2.1.2 Get Single Category

- **Endpoint**: `GET /api/v1/admin/categories/:id`

Response `200 OK`:
```json
{
  "data": {
    "id": "cat_1",
    "name": "Drinks",
    "slug": "drinks",
    "description": "All beverages",
    "imageUrl": "https://cdn.example.com/images/categories/drinks.jpg",
    "order": 1,
    "enabled": true,
    "createdAt": "2025-01-01T12:00:00Z",
    "updatedAt": "2025-01-02T12:00:00Z"
  }
}
```

#### 2.1.3 Create Category

- **Endpoint**: `POST /api/v1/admin/categories`

Request body:
```json
{
  "name": "Drinks",
  "slug": "drinks",
  "description": "All beverages",
  "imageUrl": "https://cdn.example.com/images/categories/drinks.jpg",
  "order": 1,
  "enabled": true
}
```

Required:
- `name`

Optional:
- `slug` (if omitted, backend can generate from `name`)
- `description`
- `imageUrl`
- `order`
- `enabled` (default `true`)

Response `201 Created`:
```json
{
  "data": { "id": "cat_1", "...": "..." }
}
```

#### 2.1.4 Update Category

- **Endpoint**: `PATCH /api/v1/admin/categories/:id`

Request body (partial update):
```json
{
  "name": "New Drinks Name",
  "slug": "new-drinks",
  "description": "Updated description",
  "imageUrl": "https://cdn.example.com/images/categories/new-drinks.jpg",
  "order": 2,
  "enabled": false
}
```

Response `200 OK`:
```json
{
  "data": { "id": "cat_1", "...": "updated fields..." }
}
```

#### 2.1.5 Reorder Categories

- **Endpoint**: `POST /api/v1/admin/categories/reorder`

Request body:
```json
{
  "categoryIds": ["cat_2", "cat_1", "cat_3"]
}
```

Behavior:
- Backend updates `order` field based on index of each `id` in the array.

Response `200 OK`:
```json
{ "success": true }
```

#### 2.1.6 Enable / Disable Category

- **Endpoint**: `PATCH /api/v1/admin/categories/:id/enabled`

Request body:
```json
{ "enabled": false }
```

Response `200 OK`:
```json
{
  "data": { "id": "cat_1", "enabled": false }
}
```

Deletion (hard delete) can be added later if needed; for now, disable is safer.

---

### 2.2 Section Management

#### 2.2.1 List Sections

- **Endpoint**: `GET /api/v1/admin/sections`
- **Query params**:
  - `categoryId` (string, optional) – filter by category
  - `includeDisabled` (boolean, default `true`)

Response `200 OK`:
```json
{
  "data": [
    {
      "id": "sec_1",
      "categoryId": "cat_1",
      "name": "Classic Cocktails",
      "slug": "classic-cocktails",
      "description": null,
      "imageUrl": "https://cdn.example.com/images/sections/classic-cocktails.jpg",
      "order": 1,
      "enabled": true,
      "createdAt": "2025-01-01T12:00:00Z",
      "updatedAt": "2025-01-02T12:00:00Z"
    }
  ]
}
```

#### 2.2.2 Get Single Section

- **Endpoint**: `GET /api/v1/admin/sections/:id`

Response `200 OK`:
```json
{ "data": { "id": "sec_1", "...": "..." } }
```

#### 2.2.3 Create Section

- **Endpoint**: `POST /api/v1/admin/sections`

Request body:
```json
{
  "categoryId": "cat_1",
  "name": "Classic Cocktails",
  "slug": "classic-cocktails",
  "description": null,
  "imageUrl": "https://cdn.example.com/images/sections/classic-cocktails.jpg",
  "order": 1,
  "enabled": true
}
```

Required:
- `categoryId`
- `name`

Optional:
- `slug` (auto-generate if not provided)
- `description`
- `imageUrl`
- `order`
- `enabled` (default `true`)

Response `201 Created`:
```json
{ "data": { "id": "sec_1", "...": "..." } }
```

#### 2.2.4 Update Section

- **Endpoint**: `PATCH /api/v1/admin/sections/:id`

Request body (partial):
```json
{
  "name": "New Section Name",
  "slug": "new-section",
  "description": "Updated description",
  "imageUrl": "https://cdn.example.com/images/sections/new-section.jpg",
  "order": 2,
  "enabled": false,
  "categoryId": "cat_2"
}
```

Response `200 OK`:
```json
{ "data": { "id": "sec_1", "...": "updated..." } }
```

#### 2.2.5 Reorder Sections Inside a Category

- **Endpoint**: `POST /api/v1/admin/sections/reorder`

Request body:
```json
{
  "categoryId": "cat_1",
  "sectionIds": ["sec_3", "sec_1", "sec_2"]
}
```

Response `200 OK`:
```json
{ "success": true }
```

#### 2.2.6 Enable / Disable Section

- **Endpoint**: `PATCH /api/v1/admin/sections/:id/enabled`

Request body:
```json
{ "enabled": false }
```

Response `200 OK`:
```json
{ "data": { "id": "sec_1", "enabled": false } }
```

---

### 2.3 Menu Item Management

#### 2.3.1 List Menu Items (Admin Table)

- **Endpoint**: `GET /api/v1/admin/menu-items`
- **Query params**:
  - `page` (number, default `1`)
  - `pageSize` (number, default `10`)
  - `search` (string, optional, search by name)
  - `categoryId` (string, optional)
  - `sectionId` (string, optional)
  - `availability` (string, optional: `"available" | "unavailable"`)
  - `priceStatus` (string, optional: `"base" | "temporary-active" | "temporary-scheduled"`)
  - `includeDisabled` (boolean, optional, default `true`)

Response `200 OK`:
```json
{
  "data": [
    {
      "id": "item_1",
      "categoryId": "cat_1",
      "sectionId": "sec_1",
      "name": "Chicken Wings",
      "slug": "chicken-wings",
      "description": "Spicy grilled wings",
      "basePrice": 5000,
      "imageUrl": null,
      "available": true,
      "enabled": true,
      "currentPrice": 6500,
      "hasActiveTemporaryPrice": true,
      "activeTemporaryPrice": {
        "id": "tp_1",
        "ruleName": "Live Band Night",
        "price": 6500,
        "startAt": "2025-05-24T18:00:00Z",
        "endAt": "2025-05-24T23:59:00Z",
        "enabled": true,
        "status": "ACTIVE"
      },
      "createdAt": "2025-01-01T12:00:00Z",
      "updatedAt": "2025-01-02T12:00:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "pageSize": 10,
    "totalItems": 32,
    "totalPages": 4
  }
}
```

Notes:
- `currentPrice` should already apply temporary pricing logic.

#### 2.3.2 Get Single Menu Item (Details + Pricing)

- **Endpoint**: `GET /api/v1/admin/menu-items/:id`

Response `200 OK`:
```json
{
  "data": {
    "item": {
      "id": "item_1",
      "categoryId": "cat_1",
      "sectionId": "sec_1",
      "name": "Chicken Wings",
      "slug": "chicken-wings",
      "description": "Spicy grilled wings",
      "basePrice": 5000,
      "imageUrl": null,
      "available": true,
      "enabled": true,
      "createdAt": "2025-01-01T12:00:00Z",
      "updatedAt": "2025-01-02T12:00:00Z"
    },
    "pricing": {
      "currentPrice": 6500,
      "active": {
        "id": "tp_1",
        "ruleName": "Live Band Night",
        "price": 6500,
        "startAt": "2025-05-24T18:00:00Z",
        "endAt": "2025-05-24T23:59:00Z",
        "enabled": true,
        "status": "ACTIVE"
      },
      "upcoming": [
        {
          "id": "tp_2",
          "ruleName": "Friday Night Show",
          "price": 6500,
          "startAt": "2025-05-31T18:00:00Z",
          "endAt": "2025-05-31T23:59:00Z",
          "enabled": true,
          "status": "UPCOMING"
        }
      ],
      "expired": [
        {
          "id": "tp_3",
          "ruleName": "Old Promo",
          "price": 4500,
          "startAt": "2025-04-01T18:00:00Z",
          "endAt": "2025-04-01T23:59:00Z",
          "enabled": true,
          "status": "EXPIRED"
        }
      ],
      "disabled": [
        {
          "id": "tp_4",
          "ruleName": "Test Promo",
          "price": 6000,
          "startAt": "2025-06-01T18:00:00Z",
          "endAt": "2025-06-01T23:59:00Z",
          "enabled": false,
          "status": "UPCOMING"
        }
      ]
    }
  }
}
```

#### 2.3.3 Create Menu Item

- **Endpoint**: `POST /api/v1/admin/menu-items`

Request body:
```json
{
  "categoryId": "cat_1",
  "sectionId": "sec_1",
  "name": "Chicken Wings",
  "slug": "chicken-wings",
  "description": "Spicy grilled wings",
  "basePrice": 5000,
  "imageUrl": null,
  "available": true,
  "enabled": true
}
```

Required:
- `categoryId`
- `sectionId`
- `name`
- `basePrice`

Optional:
- `slug` (auto-generate if omitted)
- `description`
- `imageUrl`
- `available` (default `true`)
- `enabled` (default `true`)

Response `201 Created`:
```json
{ "data": { "id": "item_1", "...": "..." } }
```

#### 2.3.4 Update Menu Item (Details Tab)

- **Endpoint**: `PATCH /api/v1/admin/menu-items/:id`

Request body (partial):
```json
{
  "categoryId": "cat_1",
  "sectionId": "sec_2",
  "name": "Chicken Wings (BBQ)",
  "slug": "chicken-wings-bbq",
  "description": "Updated desc",
  "basePrice": 5500,
  "imageUrl": "https://...",
  "available": false,
  "enabled": true
}
```

Response `200 OK`:
```json
{ "data": { "id": "item_1", "...": "updated..." } }
```

#### 2.3.5 Toggle Availability

- **Endpoint**: `PATCH /api/v1/admin/menu-items/:id/availability`

Request body:
```json
{ "available": false }
```

Response `200 OK`:
```json
{ "data": { "id": "item_1", "available": false } }
```

#### 2.3.6 Enable / Disable Menu Item

- **Endpoint**: `PATCH /api/v1/admin/menu-items/:id/enabled`

Request body:
```json
{ "enabled": false }
```

Response `200 OK`:
```json
{ "data": { "id": "item_1", "enabled": false } }
```

#### 2.3.7 Delete Menu Item

- **Endpoint**: `DELETE /api/v1/admin/menu-items/:id`

Response `200 OK`:
```json
{ "success": true }
```

---

### 2.4 Temporary Pricing Management (Per Menu Item)

Base path for these is per item.

#### 2.4.1 List Temporary Prices for an Item

- **Endpoint**: `GET /api/v1/admin/menu-items/:id/temporary-prices`

Response `200 OK`:
```json
{
  "data": [
    {
      "id": "tp_1",
      "menuItemId": "item_1",
      "ruleName": "Live Band Night",
      "price": 6500,
      "startAt": "2025-05-24T18:00:00Z",
      "endAt": "2025-05-24T23:59:00Z",
      "enabled": true,
      "status": "ACTIVE",
      "createdAt": "2025-05-01T12:00:00Z",
      "updatedAt": "2025-05-01T12:00:00Z"
    }
  ]
}
```

#### 2.4.2 Create Temporary Price

- **Endpoint**: `POST /api/v1/admin/menu-items/:id/temporary-prices`

Request body:
```json
{
  "ruleName": "Live Band Night",
  "price": 6500,
  "startAt": "2025-05-24T18:00:00Z",
  "endAt": "2025-05-24T23:59:00Z",
  "enabled": true
}
```

Required:
- `ruleName`
- `price`
- `startAt`
- `endAt`

Optional:
- `enabled` (default `true`)

Response `201 Created`:
```json
{ "data": { "id": "tp_1", "...": "..." } }
```

#### 2.4.3 Update Temporary Price

- **Endpoint**: `PATCH /api/v1/admin/menu-items/:itemId/temporary-prices/:tempPriceId`

Request body (partial):
```json
{
  "ruleName": "Updated Name",
  "price": 7000,
  "startAt": "2025-05-24T19:00:00Z",
  "endAt": "2025-05-24T23:30:00Z",
  "enabled": false
}
```

Response `200 OK`:
```json
{ "data": { "id": "tp_1", "...": "updated..." } }
```

#### 2.4.4 Enable / Disable Temporary Price

- **Endpoint**: `PATCH /api/v1/admin/menu-items/:itemId/temporary-prices/:tempPriceId/enabled`

Request body:
```json
{ "enabled": false }
```

Response `200 OK`:
```json
{ "data": { "id": "tp_1", "enabled": false } }
```

#### 2.4.5 Duplicate Temporary Price

- **Endpoint**: `POST /api/v1/admin/menu-items/:itemId/temporary-prices/:tempPriceId/duplicate`

Behavior:
- Creates a new temp price with:
  - same `menuItemId`, `price`, `startAt`, `endAt`
  - `ruleName` = original ruleName + `" (Copy)"` (or similar pattern)
  - `enabled` = `false` (backend should set to false so admin must review)

Response `201 Created`:
```json
{ "data": { "id": "tp_new", "enabled": false, "...": "..." } }
```

#### 2.4.6 Delete Temporary Price

- **Endpoint**: `DELETE /api/v1/admin/menu-items/:itemId/temporary-prices/:tempPriceId`

Response `200 OK`:
```json
{ "success": true }
```

---

## 3. Public Menu Endpoints

Base path for public APIs: `/api/v1/public`

These endpoints are used by the customer-facing menu (via QR code). They must:
- Only return `enabled = true` categories/sections/menu items.
- Only show items where `available = true`.
- Resolve `currentPrice` using temporary pricing rules.

### 3.1 Get All Visible Categories (Public)

- **Endpoint**: `GET /api/v1/public/menu/categories`

Response `200 OK`:
```json
{
  "data": [
    {
      "id": "cat_1",
      "name": "Drinks",
      "slug": "drinks",
      "description": "All beverages",
      "imageUrl": "https://cdn.example.com/images/categories/drinks.jpg",
      "order": 1
    }
  ]
}
```

Rules:
- Only categories with `enabled = true`.

### 3.2 Get Category With Sections and Items (By Slug)

- **Endpoint**: `GET /api/v1/public/menu/categories/:slug`

Behavior:
- Find category by `slug`, `enabled = true`.
- Include only `enabled = true` sections.
- Include only `enabled = true & available = true` menu items.
- Resolve `currentPrice` for each item:
  - If any `enabled` temporary price is active at current time, use the most recent `startAt` rule.
  - Otherwise, use `basePrice`.

Response `200 OK`:
```json
{
  "data": {
    "category": {
      "id": "cat_1",
      "name": "Drinks",
      "slug": "drinks",
      "description": "All beverages",
      "imageUrl": "https://cdn.example.com/images/categories/drinks.jpg",
      "order": 1
    },
    "sections": [
      {
        "id": "sec_1",
        "name": "Classic Cocktails",
        "slug": "classic-cocktails",
        "imageUrl": "https://cdn.example.com/images/sections/classic-cocktails.jpg",
        "order": 1,
        "items": [
          {
            "id": "item_1",
            "name": "Chicken Wings",
            "slug": "chicken-wings",
            "description": "Spicy grilled wings",
            "imageUrl": null,
            "basePrice": 5000,
            "currentPrice": 6500,
            "hasActiveTemporaryPrice": true,
            "temporaryPrice": {
              "ruleName": "Live Band Night",
              "price": 6500,
              "startAt": "2025-05-24T18:00:00Z",
              "endAt": "2025-05-24T23:59:00Z"
            }
          }
        ]
      }
    ]
  }
}
```

If category not found or disabled:
- Response `404 Not Found`

### 3.3 Optional: Menu Overview (All Categories + Sections)

If needed for `/menu` overview page.

- **Endpoint**: `GET /api/v1/public/menu/overview`

Response `200 OK`:
```json
{
  "data": [
    {
      "category": {
        "id": "cat_1",
        "name": "Drinks",
        "slug": "drinks",
        "imageUrl": "https://cdn.example.com/images/categories/drinks.jpg",
        "order": 1
      },
      "sections": [
        {
          "id": "sec_1",
          "name": "Classic Cocktails",
          "slug": "classic-cocktails",
          "imageUrl": "https://cdn.example.com/images/sections/classic-cocktails.jpg",
          "order": 1
        }
      ]
    }
  ]
}
```

Only enabled categories/sections should be included.

---

## 4. Pricing Resolution Rules (Backend Logic)

The backend must enforce the following rules whenever it returns prices on **public** and **admin** endpoints that expose `currentPrice` or `status`:

1. For a given `MenuItem` and `now` (server time):
   - Filter `TemporaryPrice` rows where:
     - `menuItemId` matches
     - `enabled = true`
     - `startAt <= now <= endAt`
2. If no such temp prices:
   - `currentPrice = basePrice`
   - `hasActiveTemporaryPrice = false`
3. If one or more temp prices are active:
   - Sort by `startAt` descending
   - Pick the first as the active rule
   - `currentPrice = active.price`
   - `hasActiveTemporaryPrice = true`
4. Status calculation for each temp price:
   - If `enabled = false`: keep `status` based on dates, but do not use in price resolution.
   - Else:
     - If `now < startAt`: `status = "UPCOMING"`
     - If `startAt <= now <= endAt`: `status = "ACTIVE"`
     - If `now > endAt`: `status = "EXPIRED"`

No cron jobs are required; status and pricing should be computed on read.

---

## 5. Summary for Backend Team

- Implement entities: `Category`, `Section`, `MenuItem`, `TemporaryPrice` as described.
- Implement admin endpoints under `/api/v1/admin` for:
  - CRUD + reorder + enable/disable for categories and sections.
  - CRUD + availability + enable/disable for menu items.
  - Full CRUD + enable/disable + duplicate for temporary prices.
- Implement public endpoints under `/api/v1/public` to:
  - List visible categories.
  - Return full category view with sections and items (with resolved `currentPrice`).
  - Optional menu overview.
- Apply the pricing resolution rules consistently for all responses that need prices.

