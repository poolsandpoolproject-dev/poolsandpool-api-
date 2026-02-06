# Admin Dashboard UX/UI Documentation

## Overview
This document outlines the complete Admin Dashboard user experience and interface design. The dashboard is designed for non-technical lounge staff to manage menus, prices, and events without manual intervention or technical knowledge.

## Dashboard Structure (High Level)

```
Admin Dashboard
├── Overview
├── Menu Management
│   ├── Categories
│   ├── Sections
│   ├── Menu Items
│   └── Temporary Pricing
├── Events Management
│   ├── Event List
│   ├── Create Event
│   └── Event Menu Prices
└── Settings (later)
```

**Key Principle**: Admins don't need to think about URLs or logic — only forms and lists.

---

## Screen 1: Categories Management

### Purpose
Manage Food / Drinks / Smoke categories

### UI Layout
**Categories List**
```
Food        [Edit] [Disable]
Drinks      [Edit] [Disable]
Smoke       [Edit] [Disable]
```

### Actions
- ➕ **Add category** — Create new menu category
- ✏️ **Edit name** — Modify category name
- 🔁 **Reorder** — Drag & drop to change display order
- 🚫 **Disable** — Hide category from public menu (safer than delete)

### Important UX Rule
⚠️ **Deleting is optional — disable is safer** (preserves data history)

---

## Screen 2: Sections Management

### Purpose
Organize menu items inside categories

### UI Layout
**Filter by Category**
```
[ Food ▼ ]
```

**Sections List**
```
Small Chops      [Edit] [Disable]
Grills & BBQ     [Edit] [Disable]
Platters         [Edit] [Disable]
```

### Actions
- ➕ **Add section** — Create new section
- **Assign to category** — Link section to Food/Drinks/Smoke
- **Reorder** — Change display order within category
- **Enable/Disable** — Toggle section visibility

---

## Screen 3: Menu Items Management (Core Screen)

This is the **most-used screen** in the dashboard.

### UI Layout

**Menu Items List**
```
Filtered by:
[ Category ▼ ]  [ Section ▼ ]

Grilled Chicken     ₦5,000   Available   [Edit]
Chicken Wings       ₦3,500   Show Price  [Edit]
```

### Columns
- **Item name**
- **Base price**
- **Price status**:
  - Base (default)
  - Temporary (Active) — highlighted
- **Availability** — In Stock / Out of Stock

### Actions
- ➕ **Add menu item**
- ✏️ **Edit menu item**
- 🚫 **Toggle availability**

### Add / Edit Menu Item Form

**Fields:**
- Item name *(required)*
- Category *(dropdown)*
- Section *(dropdown, filtered by category)*
- Base price *(required, numeric)*
- Description *(optional, textarea)*
- Image *(optional, upload)*
- Availability toggle *(In Stock / Out of Stock)*

**After saving** → Admin sees **Pricing panel** (see Screen 4)

---

## Screen 4: Temporary Pricing (KEY UX)

This is where the system **wins** — the most critical UX feature.

### Location
Inside Menu Item → **Pricing Tab**

### Layout Structure

#### Section A: Base Price (Read-only)
```
Base Price: ₦5,000
```
- Always visible
- Grayed out / muted style
- Cannot be edited here (edit in main form)

#### Section B: Active Temporary Price (Highlighted)
```
┌─────────────────────────────────────┐
│  ⚡ ACTIVE PRICE                    │
│                                     │
│  Live Band Night                    │
│  ₦6,500                             │
│  Today: 6:00pm – 11:59pm            │
│  [Edit] [Duplicate]                 │
└─────────────────────────────────────┘
```
- **Highlighted** with badge / color (green or accent)
- Shows rule name
- Shows temporary price
- Shows active time range
- **Optional**: Countdown timer ("Ends in 2h 30m")
- Action buttons: Edit, Duplicate

#### Section C: Scheduled Prices
```
UPCOMING PRICES
─────────────────────────────────────
Friday Night Show
₦6,500
May 24 | 6pm – 11:59pm
[Edit] [Duplicate] [Delete]
─────────────────────────────────────
Expired (Last Week)
DJ Night Special
₦6,000
May 17 | 8pm – 11pm
[Duplicate] [Delete]
```

- **Upcoming** — Future scheduled prices (blue/muted)
- **Expired** — Past prices (grayed out, collapsed by default)
- Each entry shows: Rule name, price, date/time range

#### Section D: Add / Edit Temporary Price Form

**Button Trigger:**
```
+ Add Temporary Price
```

**Form Fields:**
- **Rule name** *(required, e.g., "DJ Night")*
- **Temporary price** *(required, numeric)*
- **Start date** *(required, date picker)*
- **Start time** *(optional, time picker)*
- **End date** *(required, date picker)*
- **End time** *(optional, time picker)*
- **Priority** *(optional / advanced, for conflict resolution)*

**Save Actions:**
- Create new temporary price rule
- System validates date/time ranges
- Shows success message

### Important UX Rules

✅ **Admin never sees "Activate" or "Deactivate" buttons**
- Dates control everything automatically

✅ **Clear visual labels:**
- "ACTIVE" (highlighted, prominent)
- "UPCOMING" (muted, scheduled)
- "EXPIRED" (grayed out, collapsed)

✅ **No manual toggling required**
- System calculates active state based on current time

### Reuse Temporary Prices (Admin Friendly)

For each temporary price entry:
- **[ Edit Date ]** — Modify start/end times
- **[ Duplicate ]** — Create copy for next week
- **[ Delete ]** — Remove rule

**This allows:**
- Reusing same price next week
- Quick rescheduling
- Zero mistakes
- Copy-paste workflow

---

## Real Life Staff Experience

### Scenario: Show Tonight

**Morning (Admin):**
1. Opens menu item (e.g., "Signature Cocktail")
2. Clicks "Pricing Tab"
3. Clicks "+ Add Temporary Price"
4. Enters:
   - Rule name: "Live Band Night"
   - Price: ₦6,500
   - Start: Today 6pm
   - End: Today 11:59pm
5. Clicks "Save"
6. ✅ Done — goes home

**Evening (Automatic):**
- **6:00pm**: Price switches to ₦6,500 automatically
- **During event**: Customers see event price
- **11:59pm**: Price reverts to base price automatically

**Next Day:**
- Admin logs in
- Sees "Live Band Night" in "Expired" section
- Clicks "[ Duplicate ]" for next week
- Adjusts date — done in 30 seconds

**Result:**
- ✅ No calls
- ✅ No panic
- ✅ No forgetting
- ✅ Zero manual work during event

---

## Why This UX Works

🧠 **No technical thinking required**
- Staff don't need to understand "cron jobs" or "background tasks"
- Simple date/time pickers — universal concept

⏱️ **Fast to use**
- Add price in under 30 seconds
- Duplicate workflow for recurring events

🚫 **No manual switching**
- Eliminates human error
- No "forgot to turn off" scenarios

📉 **Reduces staff errors**
- Clear visual feedback (Active/Upcoming/Expired)
- Date validation prevents conflicts

📈 **Scales to events & ordering**
- Same pattern works for complex scenarios
- Foundation for future features

**This is exactly how a real lounge would use it.**

---

## Events Module UX

### Overview
The Events Module lets lounges run events (DJ night, live band, watch party) and have menu prices change automatically during that time.

**Key Features:**
- ✅ No manual switching
- ✅ No cron job required
- ✅ Automatic price activation/deactivation

### 🔑 Core Idea (VERY IMPORTANT)

**Events do NOT invent new pricing logic.**

They **reuse** your existing:
- `menu_item_temporary_prices`

**Events just create those temporary prices automatically.**

### Database Tables

#### 1️⃣ `events`
```sql
id (uuid, pk)
name (varchar)                 -- e.g. "Live Band Night"
description (text, nullable)
start_at (timestamp)
end_at (timestamp)
status (enum: scheduled, active, completed, cancelled)
created_at
updated_at
```

#### 2️⃣ `event_menu_prices`
Links an event to menu items + prices.

```sql
id (uuid, pk)
event_id (fk -> events.id)
menu_item_id (fk -> menu_items.id)
temporary_price (decimal)
created_at
updated_at
```

**👉 When an event is saved, the system creates records in `menu_item_temporary_prices` using:**
- `start_at` → temporary price start
- `end_at` → temporary price end
- `temporary_price` → from event_menu_prices

### 💰 Price Resolution (NO CRON JOB)

**Every time a customer scans the QR:**
```sql
NOW = current_time

if exists temporary_price
where menu_item_id = item.id
and NOW between start_at and end_at
→ use temporary_price

else
→ use base_price
```

**That's it.**
- ✔ Prices activate automatically
- ✔ Prices expire automatically
- ✔ No background job needed

---

## Admin Dashboard Flow: Events

### Step 1: Create Event

**Admin inputs:**
- Event name *(e.g., "Live Band Night")*
- Start date & time *(e.g., Friday 7pm)*
- End date & time *(e.g., Friday 11pm)*
- Description *(optional)*

**UI:**
```
┌─────────────────────────────────────┐
│  Create New Event                   │
│                                     │
│  Event Name:                        │
│  [Live Band Night______________]    │
│                                     │
│  Start: [Date] [Time]               │
│  End:   [Date] [Time]               │
│                                     │
│  Description (optional):            │
│  [____________________________]     │
│                                     │
│  [Cancel]  [Next: Select Items →]  │
└─────────────────────────────────────┘
```

### Step 2: Select Affected Menu Items

**Admin selects:**
- Cocktails 🍸
- Bottles 🍾
- Platters 🍗

**And sets:**
- Temporary price per item

**UI:**
```
┌─────────────────────────────────────┐
│  Select Menu Items                  │
│                                     │
│  [✓] Signature Cocktail    ₦[6500] │
│  [✓] Premium Whiskey       ₦[12000]│
│  [ ] Grilled Chicken       ₦[____] │
│  [✓] Platter for Two       ₦[8000] │
│                                     │
│  [← Back]  [Save Event]            │
└─────────────────────────────────────┘
```

### Step 3: Save Event

**System automatically:**
1. Creates the event record
2. Creates temporary prices with start/end dates
3. Links event to menu items
4. Shows confirmation: "Event created. Prices will activate automatically."

**UI Feedback:**
```
✅ Event "Live Band Night" created successfully!

📅 Active: Friday, Jan 10, 7:00pm - 11:00pm
🍸 3 menu items will use event pricing
```

### Step 4: Automatic Behavior

**During event:**
- Event prices show automatically
- Event badge displayed on menu items (optional)
- Status: "ACTIVE" (green)

**After event:**
- Base prices return automatically
- Event status: "COMPLETED" (grayed)
- Admin does nothing

---

## Events Dashboard Screen

### Events List View

```
┌────────────────────────────────────────────────────────┐
│  Events                        [+ Create Event]        │
├────────────────────────────────────────────────────────┤
│  ACTIVE                                                │
│  ────────────────────────────────────────────────────  │
│  🎵 Live Band Night                                    │
│  Jan 10, 7pm - 11pm  |  3 items  |  [Edit] [Cancel]  │
│                                                         │
│  UPCOMING                                              │
│  ────────────────────────────────────────────────────  │
│  🎧 DJ Night                                           │
│  Jan 17, 8pm - 12am  |  5 items  |  [Edit] [Cancel]  │
│                                                         │
│  COMPLETED                                             │
│  ────────────────────────────────────────────────────  │
│  🎬 Watch Party (Last Week)                            │
│  Jan 3, 6pm - 10pm   |  4 items  |  [Duplicate]      │
└────────────────────────────────────────────────────────┘
```

**Status Indicators:**
- **ACTIVE** — Currently running (green, prominent)
- **UPCOMING** — Scheduled for future (blue/muted)
- **COMPLETED** — Past events (grayed, collapsed)
- **CANCELLED** — Cancelled events (red, collapsed)

---

## Admin API Endpoints

### Create Event
```
POST /admin/events
```

**Request:**
```json
{
  "name": "Live Band Night",
  "description": "Weekly live music event",
  "start_at": "2026-01-10T18:00:00Z",
  "end_at": "2026-01-10T23:00:00Z"
}
```

**Response:**
```json
{
  "id": "uuid",
  "name": "Live Band Night",
  "status": "scheduled",
  "start_at": "2026-01-10T18:00:00Z",
  "end_at": "2026-01-10T23:00:00Z"
}
```

### Attach Menu Prices
```
POST /admin/events/{eventId}/menu-prices
```

**Request:**
```json
[
  {
    "menu_item_id": "uuid-1",
    "temporary_price": 3500
  },
  {
    "menu_item_id": "uuid-2",
    "temporary_price": 12000
  }
]
```

**System Response:**
- Creates `event_menu_prices` records
- Creates `menu_item_temporary_prices` records automatically
- Returns success confirmation

### Cancel Event
```
PATCH /admin/events/{id}/cancel
```

**Behavior:**
- Immediately disables event pricing
- Sets status to "cancelled"
- Leaves base prices intact
- Temporary prices created by event are disabled

**Request:**
```json
{
  "reason": "Event cancelled due to weather" // optional
}
```

### Get Event Details
```
GET /admin/events/{id}
```

**Response includes:**
- Event details
- List of affected menu items with prices
- Current status
- Temporary prices created

---

## Optional: Public Event API

### Get Active Events
```
GET /events/active
```

**Used for:**
- "🎶 Live Band Tonight" banner on menu
- Event badge on menu items
- Public event listing page

**Response:**
```json
{
  "events": [
    {
      "id": "uuid",
      "name": "Live Band Night",
      "start_at": "2026-01-10T18:00:00Z",
      "end_at": "2026-01-10T23:00:00Z",
      "description": "Weekly live music event"
    }
  ]
}
```

---

## Why This Design Is Solid

✅ **No duplicated logic**
- Events use existing temporary pricing system
- Single source of truth for price calculation

✅ **No staff mistakes**
- Dates control everything
- No manual activation/deactivation buttons
- Clear visual feedback

✅ **Works for:**
- Today's events
- Tomorrow's events
- Reusing the same event again later (duplicate workflow)

✅ **Scales to:**
- Multiple simultaneous events
- Auto-pricing for promotions
- Complex scheduling scenarios

✅ **Maintainable:**
- Events don't add complexity to core pricing logic
- Easy to extend (e.g., recurring events)
- Clear separation of concerns

---

## Design Principles Summary

1. **Automation Over Manual Control**
   - Dates/times drive everything
   - Zero manual toggles

2. **Clarity Over Features**
   - Clear labels: Active / Upcoming / Expired
   - Visual hierarchy matters

3. **Reuse Over Duplication**
   - Duplicate button for recurring events
   - Events leverage existing pricing

4. **Non-Technical Over Technical**
   - No cron jobs, no background tasks
   - Simple date/time pickers

5. **Prevent Errors Over Fix Errors**
   - Date validation
   - Clear status indicators
   - Cannot activate/deactivate manually

This UX ensures that lounge staff can manage complex pricing scenarios without technical knowledge or manual intervention.
