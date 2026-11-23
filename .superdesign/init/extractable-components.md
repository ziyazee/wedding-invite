# Extractable Components

All components below are currently rendered inline within `src/pages/ClientDashboard.tsx`. None exist as separate files. These are candidates for extraction as reusable DraftComponent entities.

## Sidebar
- Source: `src/pages/ClientDashboard.tsx` (inline JSX)
- Category: layout
- Description: Left navigation panel with company logo, 4 tab buttons (Overview/Templates/Orders/Settings), support note, and logout button
- Extractable props: `activeTab` (string: 'Overview'|'Templates'|'Orders'|'Settings'), `companyLogo` (string URL), `companyName` (string)
- Hardcoded: nav icon SVGs, tab labels, logout icon, CSS classes `.workspace-sidebar`, `.client-section-nav`, `.workspace-logout`

## TopBar
- Source: `src/pages/ClientDashboard.tsx` (inline JSX)
- Category: layout
- Description: Top header bar with search input, notification bell, company name + avatar
- Extractable props: `searchValue` (string), `companyName` (string), `contactName` (string)
- Hardcoded: search icon, notification bell pseudo-element, avatar SVG, CSS classes `.client-topbar`, `.client-top-search`

## MetricCard
- Source: `src/pages/ClientDashboard.tsx` (inline JSX, rendered 4x in Overview)
- Category: basic
- Description: Stats card with icon, label, large number value, and change indicator
- Extractable props: `icon` (ReactNode), `label` (string), `value` (string), `change` (string), `changeDirection` ('up'|'down'|'neutral'), `colorClass` (string: 'metric-blue'|'metric-green'|'metric-purple'|'metric-gold')
- Hardcoded: CSS classes `.metric-card`, `.metric-change-up`, `.metric-change-down`

## OrdersTable
- Source: `src/pages/ClientDashboard.tsx` (inline JSX, used in Overview + Orders tab)
- Category: basic
- Description: Data table with sticky header, status pills, row actions (view/preview/copy link)
- Extractable props: `rows` (CoupleTableRow[]), `onView` (callback), `onPreview` (callback), `showPagination` (boolean)
- Hardcoded: column headers, status pill colors, action button SVGs, CSS classes `.orders-table`, `.status-pill`

## TemplateCard
- Source: `src/pages/ClientDashboard.tsx` (inline JSX, rendered in Templates tab grid)
- Category: basic
- Description: Template browsing card with image/video thumbnail, name, category, price, premium badge, and order button
- Extractable props: `template` (Template), `settings` (TemplateSettings), `isActive` (boolean), `onPreview` (callback), `onOrder` (callback)
- Hardcoded: premium badge, sale badge, crown SVG, CSS classes `.client-selected-card`, `.client-selected-thumb`, `.client-template-premium-badge`

## FilterChips
- Source: `src/pages/ClientDashboard.tsx` (inline JSX)
- Category: basic
- Description: Horizontal scrollable category filter pills with icon and count badge
- Extractable props: `categories` (string[]), `activeCategory` (string), `onSelect` (callback), `templateCounts` (Record<string, number>)
- Hardcoded: category icons, CSS classes `.client-filter-chips`, `.category-chip-icon`, `.category-chip-count`

## DeviceFrame
- Source: `src/pages/ClientDashboard.tsx` (inline JSX) + `src/invitations/InvitationPreviewFrame.tsx`
- Category: layout
- Description: Realistic phone device bezel frame wrapping an iframe for live invitation preview
- Extractable props: `src` (string URL), `iframeRef` (ref)
- Hardcoded: complex CSS bezel (borders, gradients, pseudo-elements), dynamic island, power button, CSS classes `.client-device-frame`, `.client-device-screen`

## CelebrationEditor
- Source: `src/pages/ClientDashboard.tsx` (inline JSX, rendered N times in order form)
- Category: basic
- Description: Colored event card with header (icon, number, title, remove button) and form fields (title, date, time, venue, address, map)
- Extractable props: `index` (number), `celebration` (Celebration), `onChange` (callback), `onRemove` (callback), `palette` (color set)
- Hardcoded: CSS classes `.celebration-editor`, `.celebration-header`, `.celebration-icon`, `.celebration-remove`, color palette array `CEL_PALETTE`
