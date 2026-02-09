# Menu Items & Temporary Prices API

Base URL: `https://your-api.com` (or `http://localhost:3333`)  
All admin endpoints require: **Authorization: Bearer &lt;token&gt;** (from `POST /api/v1/auth/login`).

---

## Menu Items

### 1. List menu items

**GET** `/api/v1/admin/menu-items`

**Query params**

| Param            | Type    | Default | Description                                  |
|-----------------|---------|--------|----------------------------------------------|
| categoryId      | string  | —      | Filter by category UUID                      |
| sectionId       | string  | —      | Filter by section UUID                      |
| search          | string  | —      | Search in name and description              |
| includeDisabled | boolean | true   | If false, only enabled items                |
| available       | boolean | —      | Filter by available (true/false)            |
| enabled         | boolean | —      | Filter by enabled (true/false)              |
| page            | integer | 1      | Page number                                 |
| perPage         | integer | 20     | Items per page (1–100)                     |

**Body:** none

**Response:** `{ "data": [ ... ], "meta": { "total", "perPage", "currentPage", "lastPage", ... } }`  
Each item includes slim `section` and `category`: `{ id, name, slug, imageUrl }`.

---

### 2. Get one menu item

**GET** `/api/v1/admin/menu-items/:id`

**Params:** `id` = menu item UUID

**Body:** none

**Response:** `{ "data": { id, categoryId, sectionId, name, slug, description, basePrice, imageUrl, available, enabled, ..., section: { id, name, slug, imageUrl }, category: { id, name, slug, imageUrl } } }`

---

### 3. Create menu item

**POST** `/api/v1/admin/menu-items`

Use **multipart/form-data** when uploading an image (recommended). Use **application/json** only when you have no image or pass an existing `imageUrl`.

**Form-data (recommended — with image)**

| Field        | Type   | Required | Notes                                      |
|-------------|--------|----------|--------------------------------------------|
| categoryId  | string | Yes      | Category UUID                              |
| sectionId   | string | Yes      | Section UUID (must be in category)        |
| name        | string | Yes      | Min length 1                               |
| basePrice   | number | Yes      | Min 0 (e.g. cents)                         |
| description | string | No       |                                            |
| **image**   | file   | No       | Image file (jpg, jpeg, png, webp, max 10mb) — uploads to Cloudinary |
| imageUrl    | string | No       | Alternative: existing image URL (skip if sending `image`) |
| available   | boolean| No       | Default true                               |
| enabled     | boolean| No       | Default true                               |

Example: send as `multipart/form-data` with `categoryId`, `sectionId`, `name`, `basePrice`, and `image` (file). The server uploads `image` to Cloudinary and stores the returned URL.

**JSON body (no image or imageUrl only)**

```json
{
  "categoryId": "uuid-of-category",
  "sectionId": "uuid-of-section",
  "name": "Chicken Wings",
  "description": "Spicy grilled wings",
  "basePrice": 5000,
  "imageUrl": "https://example.com/image.jpg",
  "available": true,
  "enabled": true
}
```

Use this when you are not uploading a file (e.g. image already hosted, or no image).

**Response:** `201 Created` with `{ "data": { ...menuItem, section, category } }`

---

### 4. Update menu item

**PATCH** `/api/v1/admin/menu-items/:id`

**Content-Type:** `application/json` or `multipart/form-data` (use form-data to upload a new **image** file; image is uploaded to Cloudinary and replaces the item’s image).

**JSON body (all optional)**

```json
{
  "categoryId": "uuid",
  "sectionId": "uuid",
  "name": "Chicken Wings (BBQ)",
  "description": "Updated desc",
  "basePrice": 5500,
 **image**   | file   | No       | Image file (jpg, jpeg, png, webp, max 10mb) — uploads to Cloudinary 
  "imageUrl": "https://...",
  "available": false,
  "enabled": true
}
```

**Response:** `200 OK` with `{ "data": { ... } }`

---

### 5. Toggle availability

**PATCH** `/api/v1/admin/menu-items/:id/availability`

**Content-Type:** `application/json`

**Body**

```json
{
  "available": true
}
```

or `{ "available": false }`.

**Response:** `200 OK` with `{ "data": { "id": "...", "available": true } }`

---

### 6. Enable / disable menu item

**PATCH** `/api/v1/admin/menu-items/:id/enabled`

**Content-Type:** `application/json`

**Body**

```json
{
  "enabled": true
}
```

or `{ "enabled": false }`.

**Response:** `200 OK` with `{ "data": { "id": "...", "enabled": true } }`

---

### 7. Delete menu item

**DELETE** `/api/v1/admin/menu-items/:id`

**Body:** none

**Response:** `200 OK` with `{ "success": true }`  
Deleting a menu item also deletes its temporary prices (cascade).

---

## Temporary Prices

All temporary price endpoints are under a menu item: `/api/v1/admin/menu-items/:menuItemId/temporary-prices`.

**Status** (returned on each temporary price): `ACTIVE` | `UPCOMING` | `EXPIRED` (based on current time vs start/end).

---

### 1. List temporary prices for a menu item

**GET** `/api/v1/admin/menu-items/:menuItemId/temporary-prices`

**Params:** `menuItemId` = menu item UUID

**Body:** none

**Response:** `{ "data": [ { id, menuItemId, ruleName, price, startAt, endAt, enabled, status, createdAt, updatedAt }, ... ] }`

---

### 2. Create temporary price

**POST** `/api/v1/admin/menu-items/:menuItemId/temporary-prices`

**Content-Type:** `application/json`

**Body**

```json
{
  "ruleName": "Live Band Night",
  "price": 6500,
  "startAt": "2026-05-24T18:00:00.000Z",
  "endAt": "2026-05-24T23:59:00.000Z",
  "enabled": true
}
```

| Field    | Type    | Required | Notes                    |
|----------|---------|----------|--------------------------|
| ruleName | string  | Yes      | Min length 1             |
| price    | number  | Yes      | Min 0                    |
| startAt  | string  | Yes      | ISO 8601 date-time       |
| endAt    | string  | Yes      | ISO 8601 date-time       |
| enabled  | boolean | No       | Default true             |

**Response:** `201 Created` with `{ "data": { ...temporaryPrice, status } }`

---

### 3. Update temporary price

**PATCH** `/api/v1/admin/menu-items/:menuItemId/temporary-prices/:id`

**Params:** `menuItemId` = menu item UUID, `id` = temporary price UUID

**Content-Type:** `application/json`

**Body (all optional)**

```json
{
  "ruleName": "Updated Name",
  "price": 7000,
  "startAt": "2026-05-24T19:00:00.000Z",
  "endAt": "2026-05-24T23:30:00.000Z",
  "enabled": false
}
```

**Response:** `200 OK` with `{ "data": { ...temporaryPrice, status } }`

---

### 4. Enable / disable temporary price

**PATCH** `/api/v1/admin/menu-items/:menuItemId/temporary-prices/:id/enabled`

**Params:** `menuItemId`, `id`

**Content-Type:** `application/json`

**Body**

```json
{
  "enabled": true
}
```

or `{ "enabled": false }`.

**Response:** `200 OK` with `{ "data": { "id": "...", "enabled": true } }`

---

### 5. Duplicate temporary price

**POST** `/api/v1/admin/menu-items/:menuItemId/temporary-prices/:id/duplicate`

**Params:** `menuItemId`, `id`

**Body:** none

**Behavior:** Creates a new temporary price with same menuItemId, price, startAt, endAt; `ruleName` = original + `" (Copy)"`; `enabled` = false.

**Response:** `201 Created` with `{ "data": { ...newTemporaryPrice, status } }`

---

### 6. Delete temporary price

**DELETE** `/api/v1/admin/menu-items/:menuItemId/temporary-prices/:id`

**Params:** `menuItemId`, `id`

**Body:** none

**Response:** `200 OK` with `{ "success": true }`
