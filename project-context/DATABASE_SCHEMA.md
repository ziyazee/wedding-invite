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
