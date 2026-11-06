# Store Landing Page

Per-company storefront at `*.shaadiinvites.in`. Each company gets a branded page showing their available invitation templates with a live phone preview.

## Files

| File | Purpose |
|------|---------|
| `src/pages/StoreLanding.tsx` | Page component |
| `src/pages/StoreLanding.css` | All styles (desktop + responsive) |
| `src/invitations/InvitationPreviewFrame.tsx` | Phone preview iframe with Safari chrome |

## Route

Subdomain routing: `*.shaadiinvites.in` → `SubdomainResolver` → `StoreLanding` with `slug` prop.

## Data

Fetched via `supabase.rpc('get_store_landing', { p_slug })` → returns `{ company, templates[] }`.

### StoreCompany fields
`id`, `company_name`, `slug`, `tagline`, `brand_color`, `hero_image_path`, `logo_path`, `branding_base_url`, `phone`

### StoreTemplate fields
`id`, `template_code`, `name`, `category`, `thumbnail_url`, `preview_url`, `is_active`, `is_private`, `display_order`, `price`, `sale_type`, `sale_value`, `is_premium`, `demo_data`

## Page Layout

### Desktop (>760px)

Two-column grid: catalog (left) + sticky phone preview (right).

```
┌─────────────────────────────────────────┐
│  Header (empty, sticky, border-bottom)  │
├──────────────────────┬──────────────────┤
│  Hero (logo/name +   │                  │
│  tagline + banner)   │                  │
├──────────────────────┤  Phone preview   │
│  "Our Invitation     │  (sticky top:80) │
│   Collections"       │                  │
│  Category filters    │  Template name   │
│  4-col template grid │  Category        │
│                      │  WhatsApp button │
└──────────────────────┴──────────────────┘
```

- Grid: `grid-template-columns: minmax(0,1fr) 300px`
- Template grid: 4 columns (3 at ≤1100px)
- Preview: `position: sticky; top: 80px; margin-top: 48px`
- Preview shows template name + category below phone
- WhatsApp button shown below template info

### Mobile (≤760px)

Single column with **two-tab toggle** between Designs and Preview.

```
┌─────────────────────────┐
│  Header (empty)         │
├─────────────────────────┤
│  Hero (logo + tagline)  │
├─────────────────────────┤
│  "Our Invitation        │
│   Collections"          │
│  Category filters       │
│ [ Designs | Preview ]   │  ← toggle
├─────────────────────────┤
│  (active tab content)   │
│  Designs: 2-col grid    │
│  Preview: phone + btn   │
└─────────────────────────┘
```

- Tab state: `mobileTab: 'designs' | 'preview'` (defaults to `'designs'`)
- Inactive tab hidden via `.store-mobile-hidden` → `display: none !important`
- Tab switch animation: 1.2s fade + slide-up (`store-tab-in` keyframes)
- Toggle has sliding highlight with 380ms spring transition
- Template name/category hidden on mobile preview (only WhatsApp button shown)
- Phone max-width: `min(290px, 50vh)` to keep WhatsApp button in viewport

## Key Behaviors

### Template selection
`chooseTemplate(id)` sets `selected` state. On mobile, it also:
1. Switches to preview tab (`setMobileTab('preview')`)
2. After 60ms delay, scrolls to the toggle (`scrollIntoView`)

### Category filtering
Animated highlight slides between category buttons (ResizeObserver-measured). Grid gets a subtle opacity fade on category change.

### WhatsApp ordering
1. User taps "Order on WhatsApp" button (green `#25D366`, 12px font)
2. Name prompt overlay appears (fixed fullscreen, centered white card)
3. User enters name → submit opens `wa.me/{phone}` with pre-filled message:
   ```
   Hey!
   This is {name}.
   I'm looking to get a wedding invitation designed using the {template} design.
   ```
4. Phone number comes from `company.phone` (digits only, no formatting needed)
5. WhatsApp button only renders if `company.phone` exists

### Phone preview
- Uses `InvitationPreviewFrame` with Safari chrome mockup
- `addressText` prop shows company name in Safari URL bar (falls back to "shaadiinvites.in")
- Live preview via `postMessage` to iframe (`shaadi-preview-update`)
- Shows thumbnail as placeholder until iframe loads (`previewLoaded` state)
- Preview data cached in `sessionStorage` key `shaadi-client-live-preview`

### Hero banner
- Shows company logo if available (100px height), falls back to `<h1>` with company name
- Logo error handling: tracks `failedLogoSlug` to avoid retry loops
- Background image from `hero_image_path` with cream gradient overlay
- `margin-top: 24px` for space above banner

### Header
Currently empty (`<header className="store-header"/>`). Sticky with border-bottom. No content inside.

## Design Tokens (CSS custom properties)

| Token | Value | Usage |
|-------|-------|-------|
| `--gold` | `var(--store-accent, #754522)` | Accent color (overridden by company `brand_color`) |
| `--ink` | `#392619` | Primary text |
| `--cream` | `#faf7f1` | Background |
| `--muted` | `#8d7968` | Secondary text |
| `--border` | `#e8d9c7` | Borders |
| `--serif` | Cormorant Garamond | Headings, buttons |
| `--sans` | Inter | Body text, badges |

## Responsive Breakpoints

| Breakpoint | Changes |
|------------|---------|
| ≤1350px | Tighter spacing, narrower preview column (290px) |
| 761–1100px | 3-col grid, smaller headings |
| ≤760px | Mobile: single column, tab toggle, 2-col grid |

## CSS Caution

The ≤760px media query has many overrides. Always check the final applicable value at that breakpoint before changing anything. The mobile toggle (`.store-mobile-toggle`) is `display: none` by default and only shown inside the ≤760px query.

## Component Helpers (internal)

| Component | Purpose |
|-----------|---------|
| `StoreTemplatePrice` | Renders price badge with sale/discount |
| `StoreTemplateBadges` | Renders exclusive/premium/discount badges |
| `LineIcon` | SVG category icons (classic, lotus, moon, cross, etc.) |
| `categoryIconFor()` | Maps category name → icon name |
| `storeTemplatePricing()` | Calculates selling price + discount label |

## No Footer

Footer was removed. The page ends after the template grid / preview section.
