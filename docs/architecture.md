# Application Architecture

## Overview
The Lounge Digital Menu System is built with a clear separation between public-facing customer menus and the admin dashboard. This document outlines the application structure, routing, and layout architecture.

## Application Structure

```
poolsandpool-web/
├── app/                          # Next.js App Router
│   ├── (public)/                 # Public routes group
│   │   ├── layout.tsx           # Public layout wrapper
│   │   ├── page.tsx             # Home/Landing page
│   │   ├── menu/                # Public menu pages
│   │   │   ├── page.tsx         # Menu overview (fetches categories dynamically)
│   │   │   └── [categorySlug]/  # Dynamic category page
│   │   │       ├── page.tsx     # Category view with sections
│   │   │       └── [sectionSlug]/ # Optional: Section detail view
│   │   └── qr/                  # QR code landing
│   │
│   ├── (admin)/                  # Admin routes group (protected)
│   │   ├── layout.tsx           # Admin dashboard layout
│   │   ├── login/               # Admin authentication
│   │   ├── dashboard/           # Overview/Dashboard
│   │   ├── menu/                # Menu Management
│   │   │   ├── categories/      # Categories management
│   │   │   ├── sections/        # Sections management
│   │   │   ├── items/           # Menu items list
│   │   │   └── items/[id]/      # Item detail/edit (includes Temporary Pricing)
│   │   └── events/              # Events Management
│   │       ├── page.tsx         # Events list
│   │       ├── create/          # Create event
│   │       └── [id]/            # Event detail/edit
│   │
│   └── layout.tsx               # Root layout
│
├── components/
│   ├── public/                  # Public-facing components
│   │   ├── menu/
│   │   ├── qr-scanner/
│   │   └── menu-item-card/
│   │
│   ├── admin/                   # Admin dashboard components
│   │   ├── sidebar/
│   │   ├── header/
│   │   ├── forms/
│   │   └── tables/
│   │
│   └── shared/                  # Shared components
│       ├── button/
│       ├── input/
│       └── modal/
│
├── lib/                         # Utilities and helpers
│   ├── api/                     # API client for Node.js backend
│   │   ├── menu.ts
│   │   ├── admin.ts
│   │   └── events.ts
│   ├── pricing/
│   └── validation/
│
└── styles/                      # Global styles
    └── globals.css
```

---

## Layout Architecture

### 1. Root Layout (`app/layout.tsx`)
**Purpose**: Global application wrapper

**Responsibilities**:
- Global providers (theme, auth context)
- Global styles and fonts
- Metadata and SEO
- Error boundaries

**Structure**:
```tsx
Root Layout
├── Theme Provider
├── Auth Provider
├── Global Styles
└── {children}
```

---

### 2. Public Layout (`app/(public)/layout.tsx`)
**Purpose**: Layout for customer-facing pages

**Features**:
- Clean, minimal navigation
- Mobile-first responsive design
- QR code access point
- Brand header/footer
- No admin navigation

**Structure**:
```tsx
Public Layout
├── Header (Logo + Minimal Nav)
├── Main Content Area
│   └── {children} (Menu pages)
└── Footer (Optional)
```

**Routes**:
- `/` - Home/Landing page
- `/menu` - Menu overview (dynamically lists all enabled categories)
- `/menu/[categorySlug]` - Dynamic category page (e.g., `/menu/food`, `/menu/drinks`)
  - Displays sections and items for that category
  - Category slug is generated from category name (lowercase, hyphenated)
- `/menu/[categorySlug]/[sectionSlug]` - Optional: Section detail view
- `/qr` - QR code scanner/landing

**Note**: 
- Routes are dynamic based on admin-created categories. Categories must have a `slug` field for URL generation.
- Slugs should be auto-generated from category/section names (lowercase, hyphenated, URL-safe).
- The backend should handle slug generation when categories/sections are created.
- Example: "Food & Drinks" → slug: "food-drinks"

**Characteristics**:
- ✅ Mobile-optimized
- ✅ Fast loading (< 2 seconds)
- ✅ Clean, uncluttered UI
- ✅ Brand-consistent styling
- ✅ QR code prominently displayed

---

### 3. Admin Dashboard Layout (`app/(admin)/layout.tsx`)
**Purpose**: Layout for admin/staff dashboard

**Features**:
- Sidebar navigation
- Top header bar
- Breadcrumb navigation
- User profile/account menu
- Protected routes (authentication required)

**Structure**:
```tsx
Admin Dashboard Layout
├── Sidebar Navigation
│   ├── Logo/Brand
│   ├── Navigation Menu
│   │   ├── Overview
│   │   ├── Menu Management
│   │   │   ├── Categories
│   │   │   ├── Sections
│   │   │   ├── Menu Items
│   │   │   └── Temporary Pricing (within Menu Items)
│   │   ├── Events Management
│   │   │   ├── Event List
│   │   │   ├── Create Event
│   │   │   └── Event Menu Prices
│   │   └── Settings (Future)
│
├── Main Content Area
│   ├── Top Header Bar
│   │   ├── Page Title
│   │   ├── Breadcrumbs
│   │   └── User Menu
│   │
│   └── Content Wrapper
│       └── {children} (Admin pages)
│
└── Footer (Optional - Admin info)
```

**Routes** (all protected):
- `/admin/login` - Authentication
- `/admin/dashboard` - Overview/analytics
- `/admin/menu/categories` - Categories management
- `/admin/menu/sections` - Sections management
- `/admin/menu/items` - Menu items list
- `/admin/menu/items/[id]` - Item detail/edit (includes Temporary Pricing tab)
- `/admin/events` - Events list
- `/admin/events/create` - Create event
- `/admin/events/[id]` - Event detail/edit (includes Event Menu Prices)

**Characteristics**:
- ✅ Desktop-first (admin work is on larger screens)
- ✅ Sidebar always visible (desktop)
- ✅ Collapsible sidebar (mobile/tablet)
- ✅ Clear navigation hierarchy
- ✅ Form-heavy interfaces
- ✅ Data tables and lists

---

## Route Groups Explanation

### `(public)` Route Group
- **Purpose**: Customer-facing pages
- **Layout**: Minimal, brand-focused
- **Authentication**: None required
- **Access**: Anyone with QR code or URL
- **Performance**: Optimized for mobile, fast loading

### `(admin)` Route Group
- **Purpose**: Staff/admin dashboard
- **Layout**: Full dashboard with sidebar
- **Authentication**: Required (protected routes)
- **Access**: Staff/admin only
- **Performance**: Desktop-optimized, feature-rich

---

## Component Organization

### Public Components (`components/public/`)
- `MenuCategoryGrid` - Display categories
- `MenuSectionList` - Display sections within category
- `MenuItemCard` - Individual menu item display
- `PriceDisplay` - Smart price rendering (base/temporary)
- `QRCodeDisplay` - QR code generator/display
- `MenuSearch` - Search functionality (future)

### Admin Components (`components/admin/`)
- `AdminSidebar` - Navigation sidebar with Menu Management and Events Management sections
- `AdminHeader` - Top bar with user menu and breadcrumbs
- `CategoryForm` - Create/edit category
- `SectionForm` - Create/edit section
- `MenuItemForm` - Create/edit menu item
- `MenuItemTable` - Data table for items list
- `TemporaryPricingPanel` - Temporary pricing tab/panel (within Menu Item detail)
  - `ActivePriceDisplay` - Shows active temporary price
  - `ScheduledPricesList` - Shows upcoming/expired prices
  - `TemporaryPriceForm` - Add/edit temporary price
- `EventForm` - Create/edit events
- `EventList` - Events list with status (Active, Upcoming, Completed)
- `EventMenuPriceSelector` - Select menu items and set prices for events

### Shared Components (`components/shared/`)
- `Button` - Reusable button component
- `Input` - Form input component
- `Select` - Dropdown select
- `Modal` - Modal/dialog wrapper
- `Badge` - Status badges (Active, Upcoming, etc.)
- `DatePicker` - Date/time picker
- `ImageUpload` - Image upload component

---

## Backend Architecture

### Node.js Backend (Separate Service)
The API layer is built as a separate Node.js backend service. The Next.js frontend communicates with this backend via HTTP requests.

### API Client Library (`lib/api/`)
The frontend uses API client functions to interact with the Node.js backend:

- `lib/api/menu.ts` - Public menu API calls
- `lib/api/admin.ts` - Admin API calls (menu management)
- `lib/api/events.ts` - Events API calls

**Example Structure**:
```typescript
// lib/api/menu.ts
export async function getMenuItems() {
  const response = await fetch(`${API_BASE_URL}/menu/items`);
  return response.json();
}

// lib/api/admin.ts
export async function createCategory(data: CategoryData) {
  const response = await fetch(`${API_BASE_URL}/admin/menu/categories`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return response.json();
}
```

### Node.js Backend API Endpoints

#### Public API Routes
```
GET  /api/menu/items           # Get all menu items with current pricing
GET  /api/menu/categories      # Get categories
GET  /api/menu/sections        # Get sections
GET  /api/events/active        # Get currently active events
```

#### Admin API Routes
```
# Categories
POST   /api/admin/menu/categories          # Create category
PATCH  /api/admin/menu/categories/:id      # Update category
DELETE /api/admin/menu/categories/:id      # Delete category

# Sections
POST   /api/admin/menu/sections            # Create section
PATCH  /api/admin/menu/sections/:id        # Update section
DELETE /api/admin/menu/sections/:id        # Delete section

# Menu Items
POST   /api/admin/menu/items               # Create item
GET    /api/admin/menu/items               # List items
GET    /api/admin/menu/items/:id           # Get item details
PATCH  /api/admin/menu/items/:id           # Update item
DELETE /api/admin/menu/items/:id           # Delete item

# Temporary Prices
POST   /api/admin/menu/items/:id/prices    # Add temporary price
PATCH  /api/admin/menu/items/:id/prices/:priceId  # Update temp price
DELETE /api/admin/menu/items/:id/prices/:priceId  # Delete temp price

# Events
GET    /api/admin/events                   # List events
POST   /api/admin/events                   # Create event
GET    /api/admin/events/:id               # Get event details
PATCH  /api/admin/events/:id               # Update event
PATCH  /api/admin/events/:id/cancel        # Cancel event
POST   /api/admin/events/:id/menu-prices   # Attach menu prices to event
```

**Note**: The Node.js backend handles all database operations, authentication, authorization, and business logic. The Next.js frontend is a pure presentation layer that consumes these APIs.

---

## Pricing Resolution Flow

### On Every Menu Request

```
1. Frontend Request: GET /api/menu/items (to Node.js backend)
   ↓
2. Node.js Backend:
   a. Database Query: Fetch all active menu items
   b. For Each Item:
      - Check current server time
      - Query: temporary_prices WHERE 
        - menu_item_id = item.id
        - NOW() BETWEEN start_at AND end_at
      - If temporary price exists → use temporary_price
      - If not → use base_price
   c. Return: Items with resolved prices
   ↓
3. Next.js Frontend: Receives pre-resolved prices and renders
```

**Key Point**: Price resolution happens server-side in the Node.js backend on-demand, no background jobs needed. The frontend receives ready-to-display data.

---

## Authentication & Authorization

### Public Routes
- No authentication required
- Accessible via QR code or direct URL
- Rate limiting may apply

### Admin Routes
- **Authentication**: Required for all `/admin/*` routes
- **Method**: Session-based or JWT (TBD)
- **Login**: `/admin/login`
- **Protected Route Middleware**: Checks auth status
- **Authorization Levels** (Future):
  - Staff (view/edit menu)
  - Manager (full access + events)
  - Owner (all access + settings)

---

## State Management

### Public Pages
- **Server Components**: Primary (Next.js App Router)
- **Client Components**: Only where needed (interactivity)
- **Data Fetching**: Fetch from Node.js backend API (via API client in `lib/api/`)
- **State**: React hooks for UI state only

### Admin Dashboard
- **Server Components**: Initial data loading (fetch from Node.js backend)
- **Client Components**: Forms, tables, interactions
- **Form State**: React Hook Form or similar
- **Data Fetching**: Fetch from Node.js backend API (via API client in `lib/api/`)
- **Optimistic Updates**: For better UX (update UI before API response)

---

## Responsive Design Strategy

### Public Layout (Mobile-First)
- **Mobile**: < 768px - Single column, full-width cards
- **Tablet**: 768px - 1024px - 2-column grid
- **Desktop**: > 1024px - 3-4 column grid (if needed)

### Admin Layout (Desktop-First)
- **Mobile**: < 768px - Collapsed sidebar, hamburger menu
- **Tablet**: 768px - 1024px - Sidebar collapsible
- **Desktop**: > 1024px - Full sidebar always visible

---

## Performance Considerations

### Public Menu Pages
- Static generation where possible (ISR)
- Image optimization (Next.js Image component)
- Price calculation server-side (no client delay)
- Minimal JavaScript bundle

### Admin Dashboard
- Code splitting by route
- Lazy loading for heavy components (tables, forms)
- Optimistic UI updates
- Efficient data fetching (pagination, filtering)

---

## Environment Configuration

### Frontend (Next.js)
- **Development**: `NEXT_PUBLIC_API_URL=http://localhost:3001/api`
- **Production**: `NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api`
- Environment variables for API base URL

### Backend (Node.js - Separate Service)
- **Development**: Local database (PostgreSQL/MySQL), runs on port 3001
- **Production**: Production database, separate hosting (TBD)
- Environment variables for database credentials, JWT secrets, etc.

### Deployment
- **Frontend**: Vercel (Next.js)
- **Backend**: Separate hosting (TBD - AWS, Railway, Render, etc.)
- **Communication**: HTTPS between frontend and backend

---

## Summary

The architecture follows a clear separation of concerns:
- **Frontend (Next.js)**: Presentation layer only - no business logic or database access
- **Backend (Node.js)**: Separate service handling all API endpoints, business logic, and database operations
- **Public Layout**: Fast, mobile-first, brand-focused customer experience
- **Admin Dashboard**: Feature-rich, desktop-optimized dashboard with clear navigation:
  - Overview
  - Menu Management (Categories, Sections, Menu Items, Temporary Pricing)
  - Events Management (Event List, Create Event, Event Menu Prices)
- **Pricing**: On-demand resolution in Node.js backend, no background jobs required

### Key Architecture Decisions
- ✅ **Separate Backend**: Node.js API service keeps business logic separate from presentation
- ✅ **API Client Library**: Centralized API calls via `lib/api/` modules
- ✅ **Clear Route Structure**: Matches UX documentation structure
- ✅ **Server-Side Price Resolution**: All pricing logic handled by backend
- ✅ **Type Safety**: TypeScript throughout frontend and backend

This structure ensures scalability, maintainability, clear boundaries between customer and admin experiences, and separation between frontend and backend concerns.
