# File System Map

## Root Configuration

| File | Purpose | Status |
|------|---------|--------|
| `package.json` | Dependencies and scripts (dev, build, lint, preview) | Active |
| `vite.config.ts` | Build config, MPA entry points, dev server API plugins | Active |
| `vercel.json` | Vercel rewrites, redirects, immutable asset caching headers | Active |
| `middleware.ts` | Vercel Edge Middleware — social crawler OG tags for subdomains | Active |
| `tsconfig.json` | Root TypeScript config (references app + node) | Active |
| `tsconfig.app.json` | App TypeScript config | Active |
| `tsconfig.node.json` | Node/Vite TypeScript config | Active |
| `index.html` | Main SPA entry point | Active |
| `arjunbhavana.html` | Dedicated entry for `/arjunbhavana` with sharing metadata | Active |
| `.env.example` | Environment variable names (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) | Active |
| `.oxlintrc.json` | Linter configuration | Active |
| `.vercelignore` | Vercel deploy exclusions | Active |
| `PROJECT_CONTEXT.md` | Design decisions and project context for AI sessions | Active |
| `TEMPLATE_ARCHITECTURE.md` | Shared native template component architecture | Active |
| `AGENTS.md` | Claude Code working instructions | Active |

## `src/` — Application Source

### Entry Points

| File | Purpose |
|------|---------|
| `main.tsx` | React root mount, desktop invitation portrait frame detection |
| `App.tsx` | All route definitions, subdomain resolver, lazy imports |
| `index.css` | Global styles, shared font imports |
| `SiteFonts.tsx` | Google Fonts loader for site pages/legacy templates; `lazySitePage` wrapper |
| `arjunbhavana.tsx` | Dedicated entry for the A Timeless Union named invitation |

### `src/lib/` — Shared Libraries

| File | Purpose |
|------|---------|
| `supabase.ts` | Supabase client singleton, `isSupabaseConfigured` guard |
| `orderPricing.ts` | Template pricing helpers, `templateSellingPrice` |
| `slugify.ts` | URL slug generation |
| `templateCardData.ts` | Template card intro videos/images/thumbnail overrides for dashboard |

### `src/invitations/` — Invitation Engine (Critical)

| File | Purpose | Impact |
|------|---------|--------|
| `model.ts` | **Core data model**: `InvitationData`, `Celebration`, `designs[]`, validation, slug generation, URL helpers | Very High |
| `InvitationRenderer.tsx` | **Template router**: maps template ID → component, wraps with context/SiteFonts/TextLayoutLayer | Very High |
| `AnimatedInvitation.tsx` | Iframe-based renderer for Embroidered Garden (6) with DOM personalization — Bloom migrated to native React | High |
| `context.tsx` | `InvitationContext` React context for passing invitation data | High |
| `TextLayoutLayer.tsx` | DOM text overlay editor for iframe-based templates (legacy text adapters) | High |
| `OrderFrameInvitation.tsx` | Iframe renderer for templates 9–14 with order personalization | High |
| `templateCatalog.ts` | Loads template catalog from Supabase `invitation_templates` table | High |
| `templateData.ts` | Sample/example invitation data per template | Medium |
| `textLayout.ts` | Text override schema reading/validation (version 1 format) | High |
| `textLayoutDom.ts` | DOM utilities for text layout editing | Medium |
| `legacyTextAdapters.ts` | Semantic text ID mappings for iframe templates 3–11 | Medium |
| `orderFrameAdapter.ts` | Order data → iframe DOM adapter for templates 9–14 | Medium |
| `cardContentFit.ts` | Card content fitting algorithm (font sizing, wrapping, growth) | Medium |
| `bloomRules.ts` | Bloom-specific name fitting and layout rules | Medium |
| `personalizeBloom.ts` | Bloom DOM personalization logic | Medium |
| `personalizeEG.ts` | Embroidered Garden DOM personalization logic | Medium |
| `installOpeningNamesFit.ts` | Shared opening names fitting for iframe templates | Medium |
| `installRsvpForm.ts` | RSVP form injection into iframe templates | Medium |
| `rsvp.ts` | RSVP submission via `submit_order_rsvp` RPC | Medium |
| `calendar.ts` | ICS calendar download generation | Low |
| `musicCatalog.ts` | Music catalog entries for song picker | Low |
| `showcase.ts` | Showcase/sample invitation data | Low |
| `newOrderTemplates.ts` | Template registration for order creation | Low |
| `templateFrame.ts` | Template iframe utilities | Low |
| `editorDocument.ts` | Editor ↔ preview document communication | Medium |
| `royalGraceLayout.ts` | Royal Grace stationery placement defaults | Low |

### `src/invitations/components/` — Shared Native Template Components

| File | Purpose |
|------|---------|
| `InvitationSection.tsx` | Section wrapper with dimension observation |
| `EditableText.tsx` / `.css` | Text element with saved override support; also exports `InvitationLayoutProvider` |
| `InvitationMedia.tsx` | Optimized image/video component with priority hints |
| `InvitationRsvp.tsx` | Shared RSVP envelope form for native templates |
| `DesignedByFooter.tsx` / `.css` | "Designed by Shaadi Invites" footer |

### `src/invitations/textRules/` — Text Fitting Engine

| File | Purpose |
|------|---------|
| `engine.ts` | Core text measurement and fitting algorithm |
| `index.ts` | Rule exports |
| `templates/majestic.ts` | Majestic-specific text rules |

### `src/pages/` — Page Components

#### Application Pages

| File | Purpose |
|------|---------|
| `Landing.tsx` / `.css` | Public landing page — template showcase, phone preview |
| `Login.tsx` / `.css` | Authentication page (email/password via Supabase) |
| `AccountSetup.tsx` | New account onboarding (`/account/setup`) |
| `CompanyPreview.tsx` | Store/company preview component (served via `?invite=slug`) |
| `ClientDashboard.tsx` / `.css` | Client workspace — orders, templates, settings, overview |
| `AdminDashboard.tsx` | Admin workspace — cross-company order management |
| `DashboardAccess.tsx` | Auth guard component for dashboards |
| `OrderManagement.tsx` / `.css` | Private order management via management link |
| `ClientLivePreview.tsx` | Live invitation preview for dashboard/management |
| `GeneratedInvitation.tsx` | Public invitation page — Supabase lookup + renderer |
| `StoreLanding.tsx` / `.css` | Per-company store landing on subdomains |
| `Create.tsx` / `.css` | Original invitation creation flow |
| `Preview.tsx` | Invitation preview page |
| `PublicInvite.tsx` | Public invite wrapper |
| `Privacy.tsx` | Privacy policy page |
| `Edits.tsx` / `.css` | Invitation editor page |
| `InvitationReview.tsx` / `.css` | Order review step before submission |
| `InvitationLayoutEditor.tsx` / `.css` | Legacy layout editor (lazy-loaded for standalone routes) |
| `OrderTextEditor.tsx` / `.css` | Dashboard text selection/editing (lazy-loaded) |
| `PhonePreviewResize.tsx` / `.css` | Phone preview resize handle |
| `MusicPicker.tsx` | Music selection component for forms |
| `CopyLinkButton.tsx` | Copy link utility component |
| `textResizeHandle.ts` | Text resize handle in preview |

#### Active Template Pages

| File | Purpose |
|------|---------|
| `MohadRahma.tsx` / `.css` | Royal Grace (template 1) — native React |
| `majestic/Majestic.tsx` / `.css` | Majestic (template 2) — native React |
| `majestic/useMajesticFit.ts` | Majestic names fitting hook |
| `majestic/defaultLayout.ts` | Majestic default text layout |
| `ATimelessUnion.tsx` | A Timeless Union (template 3) entry |
| `ATimelessUnionPreview.tsx` | A Timeless Union preview route |
| `a-timeless-union/` | A Timeless Union implementation (10 files) |
| `MandapAtDusk.tsx` | Mandap at Dusk (template 4) wrapper |
| `MandapAtDuskPreview.tsx` | Mandap at Dusk preview route |
| `secret-garden/SecretGarden.tsx` / `.css` | Secret Garden (template 5) — native React |
| `secret-garden/PearlClock.tsx` | Pearl clock countdown component |
| `secret-garden/useSecretGardenFit.ts` | Secret Garden names fitting |
| `EmbroideredGarden.tsx` | Embroidered Garden (template 6) wrapper |
| `EmbroideredGardenPreview.tsx` | Preview route |
| `bloom/Bloom.tsx` / `.css` | Bloom (template 7) — native React (migrated af6e8d7) |
| `bloom/useBloomCardFit.ts` | Bloom card content fitting |
| `bloom/useBloomCardVideo.ts` | Bloom background video hook |
| `bloom/useBloomCountdown.ts` | Bloom countdown timer |
| `bloom/useBloomGate.ts` | Bloom gate/opening animation |
| `bloom/useBloomMusic.ts` | Bloom music playback |
| `bloom/useBloomNameFit.ts` | Bloom names fitting |
| `bloom/useBloomReveal.ts` | Bloom scroll reveal |
| `BloomPreview.tsx` | Bloom (template 7) preview route — re-exports `bloom/Bloom.tsx` |
| `ArtfulLoveStory.tsx` | The Artful Love Story (template 8) |
| `ArtfulLoveStoryPreview.tsx` | Preview route |
| `MajesticPage.tsx` / `MajesticPreview.tsx` | Majestic page/preview routes |
| `SecretGardenPreview.tsx` | Secret Garden preview route |

#### Testing/Iframe Templates (9–14)

| File | Purpose |
|------|---------|
| `maroon-letter/MaroonLetter.tsx` | Template 9 wrapper |
| `emerald-parchment/EmeraldParchment.tsx` | Template 10 wrapper |
| `royal-jodhpur/RoyalJodhpur.tsx` | Template 11 (Royal Jodhpur) wrapper |
| `destination-wedding/DestinationWedding.tsx` | Template 12 wrapper — multi-file directory |
| `raabta/Raabta.tsx` | Template 13 wrapper |
| `qubool/Qubool.tsx` | Template 14 wrapper |
| `mangal/Mangal.tsx` | Mangal template wrapper (`/mangal` route) |
| `viah/Viah.tsx` | Viah template wrapper (`/viah` route) |

#### Experimental Templates

| Directory | Purpose |
|-----------|---------|
| `src/experimental-template/` | 10 experimental templates (dev preview only — not in production catalog) |
| `→ punjabi-premium/` | Punjabi Premium concept |
| `→ kerala-dawn/` | Kerala Dawn concept |
| `→ taj/` | Taj concept |
| `→ jaipur-theme/` | Jaipur Theme concept |
| `→ amrit-glow/` | Amrit Glow concept |
| `→ nikah-noor/` | Nikah Noor concept |
| `→ ivory-nikah/` | Ivory Nikah concept |
| `→ couple/` | Couple concept |
| `→ hawa-mahal/` | Hawa Mahal concept |
| `→ muslim-couple/` | Muslim Couple concept |

#### Deprecated Templates

| File | Purpose | Status |
|------|---------|--------|
| `Design4.tsx` / `.css` | Blossom and Oud | Deprecated, route active |
| `Design8.tsx` / `.css` | Noor | Deprecated, route active |
| `Design9.tsx` / `.css` | Sunehri | Deprecated, route active |
| `Design10.tsx` / `.css` | Yasmin | Deprecated, route active |
| `Design11.tsx` / `.css` | Maitri | Deprecated, route active |
| `Design12.tsx` / `.css` | Kiran | Deprecated, route active |
| `Design15.tsx` / `.css` | Ivory Arch | Deprecated, route active |
| `Design16.tsx` / `.css` | Sacred Mandap | Deprecated, route active |
| `Design17.tsx` / `.css` | Gulabi Mandap | Deprecated, route active |
| `Design18.css` | Mandap at Dusk styles | Active |
| `Design2.tsx` / `.css` | Original Royal Grace/Design 2 | Legacy |
| `Design3D.tsx` / `.css` | 3D experiment | Legacy |
| `NewDesign.tsx` | Original new design page | Legacy |
| `FlowerTrail.tsx` | Flower trail animation | Legacy |
| `HeartDateReveal.tsx` | Scratch-to-reveal date component | Active (used by Mandap at Dusk) |

#### Future Use Cases

| File | Purpose |
|------|---------|
| `BirthdayInvite.tsx` | Birthday invitation template |
| `HousewarmingInvite.tsx` | Housewarming invitation template |

### `src/components/` — Shared UI Components

| Directory | Contents | Status |
|-----------|----------|--------|
| `ui/` | Button, Card, Input, Textarea, LoadingSpinner, StepIndicator | Legacy (original flow) |
| `steps/` | BuilderStep, DetailsForm, EventTypeStep, TemplatePicker | Legacy (original flow) |
| `builder/` | SortableSection, SortableSectionList | Legacy (original flow) |
| `templates/` | ClassicElegant, FloralGarden, ModernMinimal, TemplateRenderer | Legacy |
| `templates/sacred-garden/` | SacredGarden components | Legacy |

### `src/types/index.ts` — Type Definitions

Legacy types from original create flow: `WeddingDetails`, `Invitation`, `TemplateProps`, `CreateFlowState`. Active invitation types are in `src/invitations/model.ts`.

### `src/constants/`

| File | Purpose |
|------|---------|
| `sections.ts` | Section type constants |
| `templates.ts` | Template constants |

### `src/hooks/`

| File | Purpose |
|------|---------|
| `useCreateFlow.ts` | Original creation flow state management |
| `useGoogleFonts.ts` | Google Fonts loading hook |
| `useInvitation.ts` | Invitation data fetching hook |

## `server/` — Vite Dev Server API Plugins

| File | Purpose |
|------|---------|
| `invitations.ts` | Local file-based invitation CRUD (dev only) |
| `applications.ts` / `.sql` | Application API plugin + SQL schema |
| `edits.ts` | Edits API plugin |
| `schema.sql` | Minimal local dev schema (`invitations` table) |

## `supabase/` — Database and Edge Functions

### Migrations (in chronological order)

| Migration | Purpose |
|-----------|---------|
| `202610150001_dashboard_orders.sql` | **Core schema**: companies, invitation_templates, orders tables, RLS, RPCs | 
| `202610150002_order_number_paths.sql` | Order number + slug paths |
| `202610150003_design13_png_thumbnail.sql` | Design 13 thumbnail update |
| `202610170001_selected_order_templates.sql` | Template selection for orders |
| `202610170002_company_logo_path.sql` | Company logo storage |
| `202610180001_company_template_settings.sql` | Per-company template pricing |
| `202610180002_client_order_publishing.sql` | Client-side order publishing RPC |
| `202610180003_order_rsvps.sql` | RSVP storage + `submit_order_rsvp` RPC |
| `202610190001_compact_active_template_ids.sql` | Remapped active template IDs (1–8) |
| `202610190002_royal_grace_catalog_metadata.sql` | Royal Grace catalog data |
| `202610190003_named_template_preview_urls.sql` | Named preview URLs |
| `202610200001_order_management_links.sql` | Private management link generation |
| `202610200002_order_sale_price.sql` | Order price snapshots |
| `202610200003_custom_order_sale_price.sql` | Custom pricing support |
| `202610210001_new_order_templates.sql` | Templates 9–11 catalog entries |
| `202610220001_complete_order_template_catalog.sql` | Full 14-template catalog |
| `202610220002_subdomain_slugs.sql` | Subdomain slug reservation |
| `202610230001_order_subdomain_fallbacks.sql` | Subdomain fallback candidates |
| `202610270001_restore_mandap_at_dusk.sql` | Mandap at Dusk activation |
| `202610270001_template_text_defaults.sql` | Template text default values |
| `202610280001_template_catalog_read_access.sql` | Anon read access for landing |
| `202610290001_template_folder_restructure.sql` | Template folder restructure |
| `202610300001_multi_store_landing.sql` | Multi-store landing support |

### Migrations (Post-October 2024)

| Migration | Purpose |
|-----------|---------|
| `202611010001_admin_company_activity.sql` | `company_pdf_uploads` table; `admin_company_activity` RPC |
| `202611010001_celebration_time_optional.sql` | Make celebration time optional |
| `202611020001_public_invitation_company_phone.sql` | Include company phone in `get_published_invitation` |
| `202611030001_public_invitation_company_logo.sql` | Include company logo in public invitation |
| `202611030002_public_invitation_company_branding.sql` | Include branding in public invitation |
| `202611030003_store_onboarding.sql` | `company_template_access`, `store_onboarding_requests` tables; store branding bucket |
| `202611030004_company_preview.sql` | Company preview feature |
| `202611030005_path_based_invite_urls.sql` | Switch invitation URLs to path-based (www.shaadiinvites.in/slug) |
| `202611030006_client_update_order.sql` | `update_company_order` RPC for clients |
| `202611040001_add_viah_template.sql` | Viah template catalog entry |
| `202611040002_add_tajmahal_template.sql` | Taj Mahal template catalog entry |
| `202611070001_test_order.sql` | Test order infrastructure |
| `202611070002_seven_order_url_options.sql` | `reserve_company_order_path` RPC with 7 candidate URLs |
| `202611070003_order_url_id_fallback.sql` | URL path fallback to order ID |
| `202611070004_test_order_couple_order.sql` | Test couple order |
| `202611070005_admin_delete_order.sql` | Admin delete order policy |
| `202611070006_music_library.sql` | `music_tracks` table; `invitation-music` storage bucket |
| `202611070007_store_existing_music.sql` | Migrate existing music to library |
| `202611070008_embroidered_rsvp_count_only.sql` | RSVP guest count constraint update |
| `202611070009_embroidered_rsvp_guest_count.sql` | RSVP guest count follow-up |
| `202611080001_music_upload_staging.sql` | Music upload staging (placeholder) |
| `202611100001_couple_invitation_foundation.sql` | `couple_orders`, `invitations` tables — couple architecture foundation |
| `202611100001_venue_images.sql` | `venue-images` storage bucket for Embroidered Garden footer |
| `202611100002_couple_rsvp_management_board.sql` | `management_id` on `couple_orders` |
| `202611100002_store_music_ownership.sql` | Per-company music tracks (company_id on music_tracks) |
| `202611100003_company_music_tags.sql` | `company_music_tags` table |
| `202611100003_multi_invitation_plans.sql` | `invitation_name`, `selected_event_ids` on `invitations`; `configure_order_invitations` RPC |
| `202611110001_fix_couple_order_publishing.sql` | `publish_couple_order_with_candidates` RPC fix |

### Edge Functions

| Function | Purpose |
|----------|---------|
| `send-whatsapp/index.ts` | WhatsApp invitation delivery via Meta API |
| `extract-pdf/index.ts` | PDF invitation detail extraction |
| `openai-extract/index.ts` | OpenAI-based PDF extraction |
| `openai-translate-invitation/index.ts` | Translate invitation fields (Hindi / Kannada / Malayalam) |
| `card-image/index.ts` | Generate invitation card image/thumbnail |
| `generate-illustration/index.ts` | AI-generated couple illustration |
| `google-places/index.ts` | Venue autocomplete via Google Places API |
| `onboard-store/index.ts` | Admin: set up a new store (branding, templates, slug) |
| `_shared/` | Shared utilities (CORS headers, Supabase client) |

## `api/` — Vercel Edge Functions

| File | Purpose |
|------|---------|
| `og.tsx` | Dynamic OG image generation per invitation template |
| `tsconfig.json` | Edge function TypeScript config |

## `public/` — Static Assets

| Directory | Contents |
|-----------|----------|
| `audios/` | Music catalog MP3 files (categorized by religion) |
| `templates/` | Template assets organized by name (18 subdirectories) |
| `templates/deprecated/` | Deprecated template assets |
| `landing/` | Landing page artwork and thumbnails |
| `images/` | Shared images |
| `company-logos/` | Company logo files |
| `edits/` | Editor assets |
| `auditoriams/` | Venue images |
