# Known Issues & Technical Debt

## Architectural Limitations

### 1. Monolithic ClientDashboard
`src/pages/ClientDashboard.tsx` is a single very large file (~2000+ lines) containing the entire client workspace: overview, templates, orders, settings, form, preview, PDF import, WhatsApp sending. This makes it difficult to maintain and contributes to a large chunk.

**Risk:** Any change to the dashboard touches this file.

### 2. Dual Template Systems
Two coexisting template architectures: native React components (target) and iframe-based HTML (legacy). Three templates have been migrated to native React; nine remain as iframe adapters.

**Risk:** Changes to shared invitation features must work across both systems.

### 3. Unverified Source Changes
Multiple recent features have NOT been built, tested, or browser-verified. The project context explicitly notes this for: Majestic migration, text editing, card content fit, name fitting, RSVP, and more.

**Risk:** Source code may not match running behavior.

### 4. Unapplied Database Migrations
Many migrations (`202610150001` through `202610300001`) have been prepared but not applied to the production Supabase instance. The workspace has only public credentials.

**Risk:** Dashboard features depending on these migrations will not work until applied in order.

## Legacy Components

### Unused Original Create Flow
`src/components/` contains the original invitation builder (steps, builder, templates, UI) that is **not used by the current dashboard workflow**. The current flow lives entirely in `ClientDashboard.tsx`.

Files: `src/components/builder/`, `src/components/steps/`, `src/components/templates/`, `src/components/ui/`

### Legacy Type Definitions
`src/types/index.ts` defines types (`WeddingDetails`, `Invitation`, `TemplateProps`, `CreateFlowState`) from the original flow. Active invitation types are in `src/invitations/model.ts`.

### Legacy Hooks
`src/hooks/useCreateFlow.ts`, `useGoogleFonts.ts`, `useInvitation.ts` — from the original flow.

### Deprecated Template Code
Design files for deprecated templates (4, 8, 9, 10, 11, 12, 15, 16, 17) and their CSS remain in `src/pages/`. Routes are active but templates are not offered for new orders.

## Duplicate Implementations

### Template ID Systems
Two ID systems coexist:
- **Active template IDs** (1–14): Used in `model.ts`, database, order forms
- **Legacy design IDs** (101–117): Used in deprecated `templateComponent` map in `InvitationRenderer.tsx`

### Font Loading
- `SiteFonts.tsx` — shared Google Fonts for legacy templates
- Individual CSS `@font-face` — for native templates
- Both can be active in the same session after route transitions

### Invitation Data Sources
- `templateData.ts` — hardcoded sample data for templates
- `templateCatalog.ts` — Supabase-based catalog
- `model.ts` `designs[]` — code-level template registry
- These must be kept in sync manually

## Known Performance Issues

1. **Large PNG assets** (2–2.5 MiB) in Royal Grace — no WebP/AVIF conversion
2. **No production bundle analysis** — chunk sizes unmeasured
3. **AnimatedInvitation runtime HTML parsing** — fetches and parses full HTML documents
4. **TextLayoutLayer DOM scanning** — walks iframe DOM trees for text mapping
5. **No LCP/CLS/interaction latency measurements**
6. **Full Google Fonts set loaded for legacy templates** even when only one font is needed

## Risky Areas

### High-Risk Files (break multiple features if changed)
- `src/invitations/model.ts` — all validation, slugs, URLs, data types
- `src/invitations/InvitationRenderer.tsx` — all template routing
- `src/App.tsx` — all route definitions
- `src/pages/ClientDashboard.tsx` — entire client experience
- `src/lib/supabase.ts` — all Supabase operations
- `supabase/migrations/202610150001_dashboard_orders.sql` — base schema

### Medium-Risk Files
- `src/invitations/textLayout.ts` — text override validation
- `src/invitations/TextLayoutLayer.tsx` — text editing for iframe templates
- `src/pages/DashboardAccess.tsx` — all auth guards
- `middleware.ts` — all subdomain OG tags

## Potential Security Considerations

- Management links (`/{orderId}-{16-char-code}`) provide full edit access to anyone with the URL
- RSVP submission uses browser-generated UUID tokens (no auth required)
- `get_published_invitation` is accessible to anonymous users (by design)
- PDF extraction sends content to external AI services

## Missing Features

- Cross-device draft sync (currently localStorage only)
- Existing-order dashboard layout editing/autosaving
- Font family/color controls in text editor (temporarily hidden)
- Numeric fallback when all 7 subdomain candidates are occupied
- Client-side caching for published invitations
- Production build analysis
