# Layout Components

## Dashboard Layout Structure

There is no separate layout component. The entire dashboard layout — sidebar, topbar, main content — is rendered inside `ClientWorkspace` in `src/pages/ClientDashboard.tsx`. Layout is controlled via CSS Grid in `ClientDashboard.css`.

### Desktop Layout (`.client-workspace`)
```
┌──────────┬────────────────────────────────────────┐
│ Sidebar  │ Topbar (search, account)               │
│ 206px    ├────────────────────────────────────────┤
│          │ Main content area                       │
│ Brand    │                                         │
│ Nav tabs │ (varies by tab: Overview, Templates,    │
│ Support  │  Orders, Settings)                      │
│ Logout   │                                         │
└──────────┴────────────────────────────────────────┘
```

With preview panel (Templates tab):
```
┌──────────┬──────────────────────┬─────────────┐
│ Sidebar  │ Topbar               │             │
│ 206px    ├──────────────────────┤ Preview     │
│          │ Template cards / Form│ 376px       │
│          │                      │ Phone frame │
└──────────┴──────────────────────┴─────────────┘
```

### Mobile Layout (≤1024px)
Stacks vertically: sticky topbar → horizontal tab bar (was sidebar) → main content → preview (if active)

### CSS Grid Definition
```css
.client-workspace {
  min-height: 100svh;
  display: grid;
  grid-template-columns: 206px minmax(0, 1fr);
  grid-template-rows: 67px minmax(0, 1fr);
  background: #F8F6F1;
  color: var(--client-ink);
  font-family: Inter, Arial, sans-serif;
}
.client-workspace.has-client-preview {
  grid-template-columns: 206px minmax(0, 1fr) 376px;
}
```

### Tab State Classes
The workspace root element gets state classes that control layout:
- `.has-client-preview` — Templates tab with 3-column layout
- `.has-overview-page` — Overview tab with full-width dashboard
- `.has-orders-page` — Orders tab with viewport-height table
- `.show-client-details` — Form view within Templates tab
- `.reviewing-client-order` — Review step in order creation
- `.editing-order` — Editing an existing order
- `.last-form-step` — Last fieldset visible

## Sidebar (`.workspace-sidebar`)
- Sticky, full viewport height
- Contains: brand logo, section nav buttons (Overview/Templates/Orders/Settings), support note, logout
- On mobile: becomes horizontal tab bar, sticky at top

## Topbar (`.client-topbar`)
- Sticky at top, spans columns 2 to end
- Contains: search input, notification bell (pseudo-element), account avatar + name
- Height: 67px (desktop), 60px (mobile)

## Base Workspace Styles (`src/pages/Workspaces.css`)

This file provides the base CSS for both admin and client dashboards. Minified, ~82 lines. Key definitions:

```css
/* Loading state */
.dash-loading { min-height:100svh; display:grid; place-items:center; background:#f6f3ec; color:#59664f; font:italic 20px Georgia,serif }

/* Base workspace grid */
.workspace { --ink:#26372e; --muted:#74796f; --gold:#a68a50; --line:#e5dfd1; --paper:#fbfaf6;
  min-height:100svh; display:grid; grid-template-columns:248px minmax(0,1fr);
  background:var(--paper); color:var(--ink); font-family:Inter,Arial,sans-serif }

/* Sidebar */
.workspace-sidebar { position:sticky; top:0; height:100svh; display:flex; flex-direction:column;
  padding:22px 19px; border-right:1px solid var(--line); background:#f5f1e7 }

/* Main content */
.workspace-main { width:100%; max-width:1500px; margin:0 auto; padding:32px clamp(22px,4vw,60px) 60px }

/* Page header */
.workspace-top { display:flex; align-items:center; justify-content:space-between; gap:18px;
  padding-bottom:23px; border-bottom:1px solid var(--line) }

/* Metric cards grid */
.metric-grid { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:13px }

/* Table */
.table-wrap { overflow:auto; border:1px solid var(--line); background:#fffefa }
.orders-table { width:100%; border-collapse:collapse; min-width:760px; text-align:left }

/* Buttons */
.primary-action,.secondary-action,.danger-action { display:inline-flex; align-items:center; justify-content:center;
  gap:12px; min-height:42px; padding:0 17px; border:1px solid #3b523f; border-radius:4px;
  background:#3b523f; color:#fffdf4; font-size:12px; cursor:pointer }

/* Order dialog overlay */
.client-order-overlay { position:fixed; z-index:1000; inset:0; display:grid; place-items:center;
  padding:16px; background:#17221d99 }
.client-order-dialog { width:min(100%,620px); max-height:min(92svh,820px); padding:26px 30px;
  background:#fff; border:0; border-radius:0; box-shadow:0 16px 48px #17221d26 }
```

Responsive: at ≤760px sidebar becomes horizontal sticky nav at top, workspace stacks vertically.
