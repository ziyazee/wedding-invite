# Admin Dashboard

## Overview

The admin dashboard is the Shaadi Invites studio workspace. It is gated by `DashboardAccess` with `role="ADMIN"` and lives at `/admin/dashboard`. Admins can manage orders across all companies, onboard new client companies, manage music, and view per-company analytics.

## Entry Point

```
AdminDashboard (src/pages/AdminDashboard.tsx)
└── DashboardAccess role="ADMIN"
    └── AdminWorkspace
        ├── Tab: Overview   → order metrics + recent submissions table
        ├── Tab: Orders     → full order list with filters + order detail
        └── AdminSettingsWorkspace (tab: Companies | Music)
            ├── Tab: Companies → AdminCompaniesPanel
            └── Tab: Music     → AdminMusicPanel
```

## Tabs

### Overview
- 5 metric cards: Total orders, New submissions, In progress, Published, Rejected.
- Recent submissions table (last 8 orders) with a "View all →" link to Orders tab.

### Orders
- Search, status filter, company filter, date range filter.
- `AdminOrderTable` — paginated 30/page, real-time via Supabase `postgres_changes`.
- Clicking a row opens the **order detail panel** (replaces the list):
  - Client & submission details card.
  - Wedding details card (date, venue, events).
  - Status transitions: CREATED → IN_PROGRESS → READY | REJECTED.
  - Preview (private, stays unpublished).
  - Publish: generates slug variants from couple names, falls back to `{slug}/{id}`.
  - Correction form: edit published invitation details without changing its URL.
  - Expiry date management.
  - Internal notes.
  - Delete order (with confirm prompt — removes order and all RSVPs).

### Companies

Two-view navigation — the workspace h1 updates to the company name when drilling in.

#### List view
- `StoreOnboarding` panel at top (new company onboarding wizard).
- Full-width card grid: logo/initial, company name, contact, total orders, total revenue, "X this month" badge.
- Search filter across name, contact, email.

#### Company detail page (click any card)
- `onTitleChange` callback updates the `h1` in the parent workspace header to the company name. Back resets it to "Companies".
- **Stat row (4 cards)**:
  - Total orders (amber) — count since onboarding.
  - Platform revenue (green) — sum of `orders.price`, falls back to count × ₹499.
  - This month (blue) — `month_orders` with ↑/↓/→ trend vs. monthly average since onboarding.
  - Invitation uploads (purple) — `pdf_uploads` count.
- **Contact & account strip** — email (mailto link), phone, onboarded date, last active date.
- **Orders table** — full order history: order ID, couple, template name, status pill, submitted date, revenue per order.

#### Company data source
- List: `admin_company_activity` RPC — returns company stats including `total_orders`, `month_orders`, `pdf_uploads`, `last_activity_at`.
- Detail orders: `supabase.from('orders').select(...).eq('company_id', id)` — all orders for the company, ordered by `created_at DESC`.

### Music
- `AdminMusicPanel` — managed via `AdminMusicPanel.tsx`.

## Key Files

| File | Purpose |
|------|---------|
| `src/pages/AdminDashboard.tsx` | Main workspace, tab routing, order management logic |
| `src/pages/AdminDashboard.css` | Admin workspace visual theme (dark sidebar `#17181d`, light content `#f7f8fa`) |
| `src/pages/AdminCompaniesPanel.tsx` | Companies list + company detail page |
| `src/pages/AdminCompanies.css` | Companies panel styles + company detail page styles |
| `src/pages/AdminMusicPanel.tsx` | Music catalog management |
| `src/pages/StoreOnboarding.tsx` | New company onboarding wizard (multi-step form) |
| `src/pages/Workspaces.css` | Shared workspace layout, sidebar, metric card, table, action button styles |

## Order Status Lifecycle

```
CREATED → IN_PROGRESS → READY
                      ↘ REJECTED
REJECTED → IN_PROGRESS  (reopen)
```

- `CREATED` — submitted by client, not yet reviewed.
- `IN_PROGRESS` — admin is processing.
- `READY` — published; `published_path`, `published_url`, `published_at` are set.
- `REJECTED` — admin rejected with a reason shown to the client.

## Slug Generation (publish flow)

Slugs are generated from couple names via `slugVariants(groom, bride, brideFirst)` in `model.ts`. The database's UNIQUE constraint on `published_path` arbitrates concurrent claims — the admin dashboard tries each variant in order and falls back to `{slug}/{id}` if all are taken.

## Real-time Updates

The `orders` table subscribes via `supabase.channel('admin-order-updates')` on `postgres_changes` for the `orders` table. Any insert or update triggers a full `refresh()` call.

## Revenue Calculation

There is no separate platform fee column. Revenue shown in the Companies panel is:
- **Platform revenue** = sum of `orders.price` (sale price snapshot per order) where available, otherwise `order_count × ₹499`.
- **Per-order average** = total revenue ÷ total orders.
- **Monthly estimate** = `month_orders × ₹499`.

The ₹499 constant (`ORDER_PRICE`) is defined at the top of `AdminCompaniesPanel.tsx`.

## Design Tokens (admin workspace)

Defined in `AdminDashboard.css` as overrides on `.admin-workspace`:

| Token | Value | Use |
|-------|-------|-----|
| Sidebar bg | `#17181d` | Left nav |
| Content bg | `#f7f8fa` | Main area |
| Active nav accent | `#48d5a2` | Inset shadow on active tab |
| Primary action | `#202126` | Publish / save buttons |
| Status: new | `#fff3db` / `#bd851d` | CREATED pill |
| Status: in progress | `#e9efff` / `#5874bd` | IN_PROGRESS pill |
| Status: published | `#e5f5ec` / `#308b5d` | READY pill |
| Status: rejected | `#fceaea` / `#c55454` | REJECTED pill |

Stat card backgrounds in the company detail page:
- Total orders: `#fcf0e4` (amber)
- Platform revenue: `#edf5e9` (green)
- This month: `#edf1ff` (blue)
- Uploads: `#fdf4fd` (purple)

## Adding a New Admin Tab

1. Add the tab name to the `AdminTab` union type in `AdminDashboard.tsx`.
2. Add its nav button in both `AdminWorkspace` and `AdminSettingsWorkspace` nav lists.
3. If it needs a full-width workspace (like Companies/Music), add it to the `AdminSettingsWorkspace` render branch and create a panel component.
4. If it is an order-style panel, add its render branch inside `AdminWorkspace` alongside Overview and Orders.
