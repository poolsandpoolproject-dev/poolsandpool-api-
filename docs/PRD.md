# Product Requirements Document (PRD)

## Product Name
**Lounge Digital Menu System**

## Overview
The Lounge Digital Menu System is a web-based menu platform designed for lounges and bars. Customers access the menu via a QR code, while lounge staff manage menu items, prices, and availability through an admin dashboard.

The system must support temporary pricing (e.g., show days, happy hour, events) that automatically activates and deactivates based on predefined dates and times, without manual switching.

This PRD focuses on the Menu Module (Phase 1), which includes automated temporary pricing and an Events module. Future expansion includes food ordering and reservations.

## Goals & Objectives
- Provide a clean, mobile-first digital menu accessible via QR code
- Allow admins to manage menu items without technical knowledge
- Support automated temporary pricing for events and special days
- Eliminate manual price switching by staff
- Ensure scalability for future features (ordering, events)

## Target Users

### 1. Customers (End Users)
- Scan QR code
- View menu categories and items
- See correct prices based on the current date/time

### 2. Admin Users (Lounge Staff / Management)
- Create and manage menu items
- Set base prices
- Configure temporary prices with date/time rules
- Manage menu visibility

## Scope (Phase 1 – Menu Module)

### Included
- Home page
- Menu pages and sub-pages
- Admin dashboard
- Automated pricing logic
- Events module (creates temporary prices automatically)

### Excluded (Future Phases)
- Online ordering
- Payments
- User accounts for customers
- Event ticketing/promotion features beyond pricing

## Menu Structure

### Menu Pages (Customer Side)
- `/menu`
- `/menu/food`
- `/menu/drinks`
- `/menu/smoke`

### Food Sections
- Small Chops
- Grills & BBQ
- Main Dishes
- Sides
- Platters

### Drinks Sections
- Signature Cocktails
- Classic Cocktails
- Beers & Ciders
- Wines
- Spirits
- Non-Alcoholic

### Smoke Sections
- Shisha
- Cigars
- Cigarettes

## Core Features

### 1. Menu Management (Admin Dashboard)
Admins can:
- Create menu categories (Food, Drinks, Smoke)
- Create sections under each category
- Add menu items
- Set base price per item
- Upload optional images
- Toggle item availability (In Stock / Out of Stock)

### 2. Base Pricing
Each menu item must have:
- Item name
- Base price (default price)
- Optional description

The base price is used whenever no temporary pricing rule is active.

### 3. Temporary Pricing (Key Feature)

#### Purpose
Allow lounges to apply special prices for:
- Show days
- Events
- Happy hours
- Specific dates

Without manual intervention.

#### Temporary Price Rules
Each menu item can have zero or more temporary price rules.

A temporary price rule includes:
- Temporary price
- Start date
- End date
- Optional start time
- Optional end time
- Rule name (e.g., "Live Band Night")

**Example:**
- Base price: ₦5,000
- Temporary price: ₦6,500
- Active from: Friday 6pm
- Active until: Friday 11:59pm

#### Pricing Logic (Automatic)
The system determines the price using this logic:
1. Check if a temporary price rule is active for the current date/time
2. If multiple rules exist, apply the highest-priority or most recent rule
3. If no rule is active, display the base price

This process runs automatically on every menu request.

⚠️ **Admins do NOT manually switch prices on or off.**

## Admin Dashboard Features

### Menu Item Form
**Fields:**
- Item name
- Category
- Section
- Base price
- Description (optional)
- Image (optional)

### Temporary Price Configuration
Admins can:
- Add a temporary price to an item
- Select start date and end date
- Optionally set time range
- Save multiple temporary prices per item

UI must clearly show:
- Base price
- Active temporary price (if any)
- Upcoming scheduled prices

### Automation Requirement (Critical)
- Temporary prices must activate and deactivate automatically
- No manual toggling required
- System uses server time

### Events Module

#### Overview
The Events Module allows lounges to run events (DJ night, live band, watch party) and have menu prices change automatically during that time. Events leverage the existing temporary pricing system by automatically creating temporary price rules.

#### Core Concept
**Events do NOT invent new pricing logic.** They reuse the existing `menu_item_temporary_prices` system. Events simply create those temporary prices automatically based on event start/end times.

#### Database Schema

**`events` table:**
- `id` (uuid, primary key)
- `name` (varchar) — e.g., "Live Band Night"
- `description` (text, nullable)
- `start_at` (timestamp)
- `end_at` (timestamp)
- `status` (enum: scheduled, active, completed, cancelled)
- `created_at`, `updated_at`

**`event_menu_prices` table:**
- `id` (uuid, primary key)
- `event_id` (foreign key → events.id)
- `menu_item_id` (foreign key → menu_items.id)
- `temporary_price` (decimal)
- `created_at`, `updated_at`

#### Event Creation Flow
1. Admin creates event with name, description, start/end date/time
2. Admin selects affected menu items and sets temporary prices per item
3. System automatically creates `menu_item_temporary_prices` records using event start/end times
4. Prices activate and deactivate automatically — no manual intervention

#### Price Resolution
On every menu request:
1. System checks current time against `menu_item_temporary_prices` start/end dates
2. If active temporary price exists → use temporary price
3. If no active temporary price → use base price
4. **No cron job required** — resolution happens on-demand

#### API Endpoints
- `POST /admin/events` — Create event
- `POST /admin/events/{eventId}/menu-prices` — Attach menu items with prices
- `PATCH /admin/events/{id}/cancel` — Cancel event (disables pricing)
- `GET /admin/events/{id}` — Get event details
- `GET /events/active` — Public API for active events (optional)

#### Benefits
- Reuses existing temporary pricing logic
- No manual price switching
- Scales to multiple simultaneous events
- Easy to duplicate/reuse events

**📋 For detailed Admin Dashboard UX/UI specifications, see [Admin Dashboard UX Documentation](./docs/admin-dashboard-ux.md)**

## Non-Functional Requirements

### Performance
- Menu must load in under 2 seconds on mobile

### Reliability
- Pricing logic must be deterministic and accurate

### Usability
- Admin dashboard must be usable by non-technical staff

### Scalability
- Menu system must support future features (ordering, events)

## Technical Considerations (High Level)

### Frontend
- Next.js (App Router)
- Mobile-first design

### Backend (Later Phase)
- API for menu and pricing
- Database with pricing rules
- Server-side price calculation

### Hosting
- Vercel (Frontend)
- Backend hosting TBD

## Success Metrics
- 100% automated price switching
- Zero manual price updates for events
- Reduced staff errors
- Improved customer experience

## Future Enhancements
- Recurring events/rules (e.g., "Every Friday Happy Hour")
- Happy hour recurring rules with pattern matching
- Admin roles and permissions
- Online ordering system integration
- Event ticketing and promotion features
- Analytics and reporting dashboard

## Summary
This PRD defines a scalable lounge menu system with a strong focus on automated temporary pricing, ensuring accuracy, ease of use, and future expansion readiness.
