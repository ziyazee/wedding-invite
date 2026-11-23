# Page Dependency Trees

## /client/dashboard (Client Dashboard)
Entry: `src/pages/ClientDashboard.tsx` (1096 lines, all 4 tabs inline)

Dependencies:
- `src/invitations/model.ts` — InvitationData type, designs[], validation, URL helpers
- `src/invitations/InvitationPreviewFrame.tsx` — Phone preview iframe wrapper
- `src/invitations/templateCatalog.ts` — Loads templates from Supabase
- `src/invitations/templateData.ts` — Sample invitation data per template
- `src/invitations/textLayout.ts` — Text override schema (TextLayout type)
- `src/lib/templateCardData.ts` — Template card intro videos/images/thumbnails
- `src/lib/supabase.ts` — Supabase client singleton
- `src/lib/companyAssets.ts` — Company asset URL helper
- `src/lib/companyPreview.ts` — Preview error helper
- `src/lib/invitationUpload.ts` — Upload accept/MIME helpers
- `src/pages/DashboardAccess.tsx` — Auth guard (CLIENT role)
- `src/pages/EventLocationPicker.tsx` — Google Maps place search
- `src/pages/OrderPreviewStep.tsx` — Event location/map step
  - `src/pages/OrderPreviewStep.css`
- `src/pages/OrderProgressBar.tsx` — Step indicator dots + fill bar
- `src/pages/InvitationSetupPanel.tsx` — Multi-invitation plan setup
  - `src/pages/InvitationSetupPanel.css`
- `src/pages/OrderTextEditor.tsx` (lazy) — Text editing panel
  - `src/pages/OrderTextEditor.css`
- `src/pages/Workspaces.css` — Shared workspace base styles (sidebar, table, form, dialog)
- `src/pages/ClientDashboard.css` — All dashboard styles (2780 lines)

### Tab Structure (all rendered inline)
- **Overview** — Welcome hero, 4 metric cards, status donut chart, recent orders table, popular templates grid
- **Templates** — Category filter chips, template card grid, order form (stepped wizard), phone preview panel
- **Orders** — Summary stats, search/date filters, orders table with pagination, order detail dialog
- **Settings** — Template pricing cards (3-col grid), price/discount/premium fields per template

## /login (Login)
Entry: `src/pages/Login.tsx`
- `src/pages/Login.css`
- `src/lib/supabase.ts`

## /admin/dashboard (Admin Dashboard)
Entry: `src/pages/AdminDashboard.tsx`
- `src/pages/Workspaces.css`
- `src/lib/supabase.ts`
- `src/invitations/model.ts`

## / (Landing Page)
Entry: `src/pages/Landing.tsx`
- `src/pages/Landing.css`
- `src/invitations/templateCatalog.ts`
- `src/lib/templateCardData.ts`
