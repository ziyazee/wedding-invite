# Database Schema

Source: `supabase/migrations/202610150001_dashboard_orders.sql` and subsequent migrations.

## Tables

### `companies`

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | bigint | PK, generated identity |
| `company_name` | text | NOT NULL |
| `contact_name` | text | nullable |
| `email` | text | nullable, unique lower index |
| `phone` | text | nullable |
| `slug` | text | nullable (store subdomain) |
| `tagline` | text | nullable |
| `brand_color` | text | nullable |
| `hero_image_path` | text | nullable |
| `logo_path` | text | nullable |
| `created_at` | timestamptz | NOT NULL, default now() |
| `updated_at` | timestamptz | NOT NULL, auto-updated |

**RLS:** Visible to own company member + admins.

### `invitation_templates`

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | integer | PK |
| `template_code` | text | NOT NULL, unique |
| `name` | text | NOT NULL |
| `category` | text | NOT NULL, default 'Wedding' |
| `thumbnail_url` | text | NOT NULL |
| `preview_url` | text | NOT NULL |
| `is_active` | boolean | NOT NULL, default true |
| `created_at` | timestamptz | NOT NULL, default now() |
| `updated_at` | timestamptz | NOT NULL, auto-updated |

**RLS:** Active templates visible to authenticated; all visible to admins. Anon can read active rows (after `202610280001` migration).

### `orders`

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | bigint | PK, generated identity |
| `company_id` | bigint | FK → companies, NOT NULL |
| `created_by` | uuid | FK → auth.users, NOT NULL |
| `template_code` | text | NOT NULL |
| `groom_name` | text | NOT NULL |
| `bride_name` | text | NOT NULL |
| `phone_number` | text | NOT NULL |
| `form_data` | jsonb | NOT NULL, default '{}' |
| `status` | text | NOT NULL, CHECK in (CREATED, IN_PROGRESS, READY, REJECTED) |
| `published_path` | text | UNIQUE, nullable, format check |
| `published_url` | text | nullable |
| `published_at` | timestamptz | nullable |
| `expires_at` | timestamptz | nullable, must be after published_at |
| `rejection_reason` | text | nullable |
| `admin_notes` | text | nullable |
| `management_id` | text | 16-char random code |
| `price` | numeric | nullable (sale price snapshot) |
| `created_at` | timestamptz | NOT NULL, default now() |
| `updated_at` | timestamptz | NOT NULL, auto-updated |

**Indexes:** `company_id`, `status`, `created_at DESC`, `expires_at`

**Constraints:**
- `published_path_format`: path must match `^([a-z0-9]{1,80}|[0-9]+/[a-z0-9]{1,80})$`
- `published_order_has_path`: READY status requires path + url + published_at
- `valid_expiry_date`: expires_at must be after published_at

**Triggers:**
- `validate_order_payload`: Validates form_data structure, template activity, event count, dates, venues
- `orders_touch_updated_at`: Auto-update timestamp

**RLS:**
- Select: company members + admins
- Insert: clients for own company (CREATED status only)
- Update: admins only

### `company_template_settings`

| Column | Type | Constraints |
|--------|------|-------------|
| `company_id` | bigint | FK → companies |
| `template_id` | integer | FK → invitation_templates |
| `price` | numeric | template price |
| `sale_type` | text | 'none', 'percentage', 'fixed' |
| `sale_value` | numeric | discount value |
| `is_premium` | boolean | premium badge flag |

Source: `202610180001_company_template_settings.sql`

### `order_rsvps`

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | bigint | PK |
| `order_id` | bigint | FK → orders |
| `submission_token` | uuid | Per-browser token |
| `full_name` | text | NOT NULL |
| `attendance` | text | 'yes' or 'no' |
| `guest_count` | integer | |
| `additional_guests` | text[] | Guest name array |
| `message` | text | |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | |

Source: `202610180003_order_rsvps.sql`

**RLS:** Owning company + admins can read. Public can submit via RPC.

## Key RPC Functions

| Function | Access | Purpose |
|----------|--------|---------|
| `get_published_invitation(p_path)` | anon, authenticated | Returns published order by path (security definer) |
| `submit_order_rsvp(...)` | anon | Submit/update RSVP with token |
| `resolve_subdomain(p_slug)` | anon | Determine if slug is store or invitation |
| `current_user_is_admin()` | authenticated | Check admin role from JWT |
| `current_user_company_id()` | authenticated | Get company ID from JWT email |
| `touch_updated_at()` | trigger | Auto-update timestamp |
| `validate_order_payload()` | trigger | Validate order form_data |

## `form_data` JSON Structure

The `orders.form_data` column stores an `InvitationData` object:

```typescript
{
  template: number,          // Template ID (1-14)
  groom: string,             // Must match groom_name
  bride: string,             // Must match bride_name
  date: string,              // YYYY-MM-DD
  time: string,              // HH:MM
  offset: string,            // +HH:MM or -HH:MM
  venue: string,
  address: string,
  map: string,               // URL
  message: string,           // Welcome message
  groomFamily: string,
  brideFamily: string,
  dressCode: string,
  giftNote: string,
  music: string,             // Music URL or catalog path
  gallery: string,           // Gallery URL
  showCoupleIllustrations: boolean,
  textOverrides?: {          // Version 1 text layout
    version: 1,
    elements: {
      "t{template}.{section}.{field}": {
        fontSize?: number,   // 8-160 CSS px
        x?: number,          // -1 to 1 section fraction
        y?: number,          // -1 to 1 section fraction
        fontFamily?: string,
        color?: string
      }
    }
  },
  events: [{
    id?: string,             // Persistent celebration ID
    title: string,
    date: string,
    time: string,
    venue: string,
    address: string,
    map: string,
    schedule?: [{            // Wedding day moments
      id: string,
      time: string,
      title: string,
      description: string,
      location: string
    }]
  }]
}
```

## Realtime

The `orders` table is published to `supabase_realtime`. The admin dashboard subscribes to `postgres_changes` on `public.orders` for live updates.

---

## Additional Tables (Post-October 2024 Migrations)

### `company_pdf_uploads` (`202611010001`)

Logs PDF uploads per company for admin activity tracking.

| Column | Type |
|--------|------|
| `id` | bigint PK |
| `company_id` | bigint FK → companies |
| `uploaded_by` | uuid FK → auth.users |
| `filename` | text NOT NULL |
| `created_at` | timestamptz |

**RLS:** Clients insert own; admins select all.

### `company_template_access` (`202611030003`)

Restricts which templates a company can offer (when `catalog_restricted = true`).

| Column | Type |
|--------|------|
| `company_id` | bigint FK → companies |
| `template_id` | integer FK → invitation_templates |

PK: `(company_id, template_id)`. **RLS:** Members read own; admins read all.

### `store_onboarding_requests` (`202611030003`)

One-time onboarding form submitted by admin for a new store.

| Column | Type |
|--------|------|
| `id` | uuid PK |
| `company_id` | bigint FK → companies (unique) |
| `created_by` | uuid FK → auth.users |
| `details` | jsonb |
| `templates` | jsonb |
| `logo_uploaded` | boolean |
| `banner_uploaded` | boolean |
| `completed_at` | timestamptz nullable |
| `created_at` | timestamptz |

**RLS:** Admins read only. Writes via service_role.

### `music_tracks` (`202611070006`)

Curated music catalogue (global) and per-company uploaded tracks.

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK |
| `name` | text NOT NULL | 1–120 chars, trimmed |
| `category` | text | `Classic`, `Hindu`, `Muslim` |
| `storage_path` | text unique nullable | `tracks/{id}.mp3` (global) or `companies/{company_id}/{id}.mp3` |
| `local_path` | text unique nullable | `/audios/…` (bundled tracks) |
| `company_id` | bigint nullable FK → companies | NULL = global; non-NULL = store-owned |
| `created_at` | timestamptz |

**Constraint:** Exactly one of `storage_path` / `local_path` must be set.

**RLS:** Anon reads global (company_id IS NULL); authenticated reads global + own company. Admins read all.

**Storage bucket:** `invitation-music` (public, 20 MB limit, MP3 only).

### `company_music_tags` (`202611100003`)

Per-company tag labels for organizing music tracks.

| Column | Type |
|--------|------|
| `id` | uuid PK |
| `company_id` | bigint FK → companies |
| `name` | text NOT NULL | 1–40 chars, trimmed |
| `created_at` | timestamptz |

Unique index: `(company_id, lower(name))`. **RLS:** Members read own.

### `couple_orders` (`202611100001`)

Parent record grouping one or more invitation variants for a couple.

| Column | Type | Notes |
|--------|------|-------|
| `id` | bigint PK |
| `legacy_order_id` | bigint FK → orders unique nullable | Links to migrated original order |
| `company_id` | bigint FK → companies |
| `created_by` | uuid FK → auth.users |
| `groom_name` | text NOT NULL |
| `bride_name` | text NOT NULL |
| `bride_first` | boolean default false |
| `phone_number` | text NOT NULL |
| `status` | text | CREATED / IN_PROGRESS / READY / REJECTED |
| `price` | numeric nullable |
| `management_id` | text NOT NULL unique | Couple's shared RSVP management link |
| `shared_form_data` | jsonb nullable | Shared overrides across invitations |
| `created_at` | timestamptz |
| `updated_at` | timestamptz |

### `invitations` (`202611100001`)

Individual invitation variant within a couple order.

| Column | Type | Notes |
|--------|------|-------|
| `id` | bigint PK |
| `couple_order_id` | bigint FK → couple_orders |
| `legacy_order_id` | bigint FK → orders unique nullable |
| `template_code` | text NOT NULL |
| `form_data` | jsonb NOT NULL |
| `invitation_name` | text default 'Wedding' | e.g. "Nikah", "Reception" |
| `selected_event_ids` | text[] default '{}' | Which events from couple's pool |
| `uses_snapshot` | boolean default false |
| `status` | text | CREATED / IN_PROGRESS / READY / REJECTED |
| `published_path` | text unique nullable |
| `published_url` | text nullable |
| `management_id` | text unique nullable |
| `published_at` | timestamptz nullable |
| `expires_at` | timestamptz nullable |
| `rejection_reason` | text nullable |
| `admin_notes` | text nullable |
| `price` | numeric nullable |

### `venue_images` (`202611100001`)

Per-company library of hall/venue photos (used as footer illustrations in Embroidered Garden).

**Storage bucket:** `venue-images` (private, 10 MB, webp/jpeg/png). Path format: `{company_id}/filename`.

No separate table — references are via storage bucket with RLS scoped to company folder.

---

## Companies Table Additions (Post-October 2024)

Additional columns added to `companies` via migrations:

| Column | Migration | Purpose |
|--------|-----------|---------|
| `is_active` | `202611010001` | Enable/disable company |
| `branding_base_url` | `202611030003` | CDN base for store branding assets |
| `storefront_enabled` | `202611030003` | Toggle public store page |
| `catalog_restricted` | `202611030003` | If true, only `company_template_access` rows are shown |

---

## Additional RPC Functions (Post-October 2024)

| Function | Migration | Access | Purpose |
|----------|-----------|--------|---------|
| `admin_company_activity(start, end)` | `202611010001` | Admin | Monthly company activity report |
| `store_slug_reserved(slug)` | `202611030003` | — | Check if store slug is taken |
| `publish_company_order_with_candidates(order_id, paths[])` | `202611030005` | Authenticated | Publish order, path-based URL format |
| `update_company_order(order_id, form_data, phone)` | `202611030006` | Authenticated | Update CREATED order (client) |
| `reserve_company_order_path(order_id, paths[])` | `202611070002` | Authenticated | Reserve URL path pre-publish |
| `register_music_track(id, name, category)` | `202611070006` | Admin/service_role | Add global music track |
| `register_company_music_track(…)` | `202611100002` | Authenticated | Add per-company music track |
| `create_company_music_tag(name)` | `202611100003` | Authenticated | Create music tag for own company |
| `configure_order_invitations(order_id, plans)` | `202611100003` | Authenticated | Set named invitation variants (1–10) |
| `publish_couple_order_with_candidates(order_id, candidates, expires_at, admin_notes)` | `202611110001` | Admin | Publish couple order invitations |

---

## Storage Buckets

| Bucket | Public | Max Size | Types | Migration |
|--------|--------|----------|-------|-----------|
| `invitation-music` | Yes | 20 MB | MP3 | `202611070006` |
| `store-branding` | Yes | 5 MB | PNG | `202611030003` |
| `venue-images` | No | 10 MB | webp/jpeg/png | `202611100001` |
