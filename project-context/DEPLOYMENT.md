# Deployment

## Hosting

| Service | Purpose |
|---------|---------|
| **Vercel** | SPA hosting, edge middleware, edge functions, asset CDN |
| **Supabase** | Auth, PostgreSQL, Edge Functions, Realtime, Storage |

## Domain Configuration

- **Production:** `shaadiinvites.in`
- **WWW:** `www.shaadiinvites.in` → landing page
- **Subdomains:** `*.shaadiinvites.in` → wildcard DNS to Vercel
  - Company stores: `{company-slug}.shaadiinvites.in`
  - Published invitations: `{couple-slug}.shaadiinvites.in`

## Vercel Configuration

### Build
```json
{
  "scripts": {
    "build": "tsc -b && vite build"
  }
}
```

### Entry Points
Two Vite build inputs:
- `index.html` — main SPA
- `arjunbhavana.html` — dedicated A Timeless Union entry

### Edge Middleware (`middleware.ts`)
- Intercepts subdomain requests from social crawlers (WhatsApp, Facebook, Twitter, etc.)
- Generates HTML with OG meta tags by calling `get_published_invitation` RPC
- Regular browsers get the SPA and resolve in React

### Edge Function (`api/og.tsx`)
- Generates 1200×630 OG images per invitation
- Template-aware themes (colors, background images)
- Loads Playfair Display font from production CDN
- Cached: `max-age=3600, s-maxage=86400, stale-while-revalidate=3600`

### Rewrites & Redirects (vercel.json)
- `/arjunbhavana` → `/arjunbhavana.html` (rewrite)
- `/design14` → `/arjunbhavana` (301 redirect)
- `/*` → `/index.html` (SPA fallback rewrite)

### Asset Caching Headers
- Immutable: JS, CSS, fonts, `/assets/` (1 year)
- Long-lived: images, video, audio (30 days)

## Supabase Configuration

### Tables
- `companies` — client companies
- `invitation_templates` — template catalog
- `orders` — order data with JSONB form_data
- `company_template_settings` — per-company pricing
- `order_rsvps` — RSVP responses

### Edge Functions
| Function | Secrets Required |
|----------|-----------------|
| `send-whatsapp` | `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID` |
| `extract-pdf` | — |
| `openai-extract` | OpenAI API key (implied) |

### Realtime
`orders` table published to `supabase_realtime` for admin dashboard live updates.

## Environment Variables

**Names only — never commit values.**

| Variable | Where | Purpose |
|----------|-------|---------|
| `VITE_SUPABASE_URL` | Client + Edge | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Client + Edge | Supabase anonymous/publishable key |
| `WHATSAPP_ACCESS_TOKEN` | Supabase secret | Meta WhatsApp Business API token |
| `WHATSAPP_PHONE_NUMBER_ID` | Supabase secret | Meta WABA phone number ID |
| `WHATSAPP_GRAPH_API_VERSION` | Supabase secret (optional) | Graph API version override (default: v21.0) |

## Migration Application Order

Migrations must be applied in sequence. Key dependencies:

1. `202610150001_dashboard_orders.sql` — **Base schema** (must be first)
2. `202610150002_order_number_paths.sql`
3. `202610170001_selected_order_templates.sql`
4. `202610180001_company_template_settings.sql`
5. `202610180002_client_order_publishing.sql`
6. `202610180003_order_rsvps.sql`
7. `202610190001_compact_active_template_ids.sql` — **After** dashboard + company template settings
8. `202610190002_royal_grace_catalog_metadata.sql`
9. `202610190003_named_template_preview_urls.sql`
10. `202610200001_order_management_links.sql` — **After** order_rsvps
11. `202610200002_order_sale_price.sql`
12. `202610200003_custom_order_sale_price.sql` — **After** sale_price
13. `202610210001_new_order_templates.sql` — **After** compact-ID migration
14. `202610220001_complete_order_template_catalog.sql`
15. `202610220002_subdomain_slugs.sql`
16. `202610230001_order_subdomain_fallbacks.sql`
17. `202610270001_restore_mandap_at_dusk.sql`
18. `202610280001_template_catalog_read_access.sql`
19. Later migrations as needed

## Build and Deploy Process

1. `tsc -b` — TypeScript type checking
2. `vite build` — Production bundle with code splitting
3. Vercel deployment — automatic from git push (when configured)
4. Database migrations — manual application via Supabase dashboard/CLI

**Important:** Many recent migrations have NOT been applied. The workspace has only public Supabase credentials. Apply migrations in order before deploying new dashboard code.
