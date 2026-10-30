# Dependency Map

## Critical Files (High Impact — Used by Multiple Features)

### `src/invitations/model.ts`
**Imported by:** InvitationRenderer, AnimatedInvitation, ClientDashboard, AdminDashboard, OrderManagement, GeneratedInvitation, server/invitations, templateData, rsvp, all template components, all forms
**Exports:** `InvitationData`, `Celebration`, `designs[]`, `validateDetails`, `nameSlug`, `slugVariants`, `inviteUrl`, `formatDate`, `formatTime`, `mapURL`, `displayName`, `nameTextLimit`, `cardTextLimit`, `reservedSlugs`
**Impact:** Changing validation rules, data types, or designs array affects every feature. **Inspect before modifying.**

### `src/invitations/InvitationRenderer.tsx`
**Imported by:** GeneratedInvitation, ClientLivePreview, OrderManagement (via preview iframe)
**Imports:** All template components (lazy), model, context, SiteFonts, TextLayoutLayer, AnimatedInvitation, OrderFrameInvitation, DesignedByFooter
**Impact:** Template routing changes affect all published invitations and previews. **Inspect before modifying.**

### `src/App.tsx`
**Imported by:** main.tsx (root)
**Imports:** All page components (lazy), InvitationViewport, supabase
**Impact:** Route changes affect all navigation. Adding/removing routes is isolated but renaming breaks bookmarks.

### `src/lib/supabase.ts`
**Imported by:** Every file that touches Supabase — ClientDashboard, AdminDashboard, OrderManagement, Login, DashboardAccess, GeneratedInvitation, StoreLanding, templateCatalog, rsvp
**Exports:** `supabase`, `isSupabaseConfigured`
**Impact:** Config changes break all Supabase features.

### `src/pages/ClientDashboard.tsx`
**Imported by:** App.tsx (lazy)
**Imports:** model, textLayout, templateData, templateCatalog, templateCardData, supabase, DashboardAccess, InvitationReview, orderPricing, OrderTextEditor (lazy)
**Impact:** Self-contained but very large. Changes risk unintended side effects within the dashboard.

### `src/invitations/context.tsx`
**Imported by:** InvitationRenderer, AnimatedInvitation, all native template components that use `useInvitationDetails()`
**Impact:** Context shape changes affect all templates.

### `src/invitations/textLayout.ts`
**Imported by:** model.ts (validation), InvitationRenderer, TextLayoutLayer, ClientDashboard, all native template components via InvitationLayoutProvider
**Impact:** Schema changes affect all text editing and saved overrides.

## Module Dependency Clusters

### Invitation Engine Cluster
```
model.ts ← templateData.ts, templateCatalog.ts, showcase.ts
model.ts ← InvitationRenderer.tsx ← GeneratedInvitation.tsx
model.ts ← AnimatedInvitation.tsx ← bloomRules.ts, cardContentFit.ts, personalizeBloom.ts, personalizeEG.ts
model.ts ← OrderFrameInvitation.tsx ← orderFrameAdapter.ts, newOrderTemplates.ts
textLayout.ts ← TextLayoutLayer.tsx ← legacyTextAdapters.ts, textLayoutDom.ts
context.tsx ← InvitationRenderer.tsx, template components
rsvp.ts ← InvitationRsvp.tsx, installRsvpForm.ts
calendar.ts ← AnimatedInvitation.tsx, native templates
```

### Dashboard Cluster
```
ClientDashboard.tsx ← model.ts, templateCatalog.ts, templateData.ts, orderPricing.ts
ClientDashboard.tsx ← DashboardAccess.tsx ← supabase.ts
ClientDashboard.tsx ← InvitationReview.tsx
ClientDashboard.tsx ← OrderTextEditor.tsx (lazy)
ClientDashboard.tsx ← MusicPicker.tsx
```

### Template Rendering Cluster (per native template)
```
Majestic.tsx ← model.ts, context.tsx, InvitationLayoutProvider, InvitationSection, EditableText, InvitationMedia, InvitationRsvp
Majestic.tsx ← useMajesticFit.ts, defaultLayout.ts
Majestic.tsx ← calendar.ts, rsvp.ts, cardContentFit.ts
```

## Files That Should Not Be Modified Without Investigation

| File | Reason |
|------|--------|
| `src/invitations/model.ts` | Core types + validation used everywhere |
| `src/invitations/InvitationRenderer.tsx` | Template routing for all invitations |
| `src/invitations/textLayout.ts` | Text override schema — backward compatibility required |
| `src/App.tsx` | All routes — affects bookmarks and published URLs |
| `src/main.tsx` | Entry point with desktop viewport detection |
| `src/lib/supabase.ts` | All Supabase connectivity |
| `src/pages/DashboardAccess.tsx` | All auth guards |
| `middleware.ts` | Social crawler OG tags |
| `supabase/migrations/202610150001_dashboard_orders.sql` | Base schema definition |
| `src/invitations/legacyTextAdapters.ts` | Text ID mappings for iframe templates |
| `src/invitations/rsvp.ts` | RSVP submission for all templates |

## Import Graph — Key Relationships

### What imports `model.ts`?
Nearly everything in the application. It is the single source of truth for invitation data types and validation.

### What imports `supabase.ts`?
Every page/service that communicates with the backend: ClientDashboard, AdminDashboard, Login, DashboardAccess, GeneratedInvitation, StoreLanding, OrderManagement, templateCatalog, rsvp.

### What imports `InvitationRenderer`?
- `GeneratedInvitation.tsx` — public invitation page
- `ClientLivePreview.tsx` — dashboard preview iframe
- `AdminDashboard.tsx` — order preview

### What imports native components (`InvitationLayoutProvider`, etc.)?
- `Majestic.tsx`
- `SecretGarden.tsx`
- `MohadRahma.tsx` (Royal Grace)
- Future native template migrations

### What does `AnimatedInvitation.tsx` import?
model, calendar, rsvp, editorDocument, cardContentFit, bloomRules, personalizeBloom, personalizeEG, installOpeningNamesFit, installRsvpForm

### What does `TextLayoutLayer.tsx` import?
textLayout, textLayoutDom, legacyTextAdapters
