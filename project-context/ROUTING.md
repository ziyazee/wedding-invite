# Routing

Source: `src/App.tsx`

## Route Resolution Order

1. **Subdomain check** (`getInviteSlug`): If hostname is `*.shaadiinvites.in` (not `www`), extract slug → `SubdomainResolver` (resolves to store or invitation)
2. **Query param fallback**: `?invite=slug` parameter also triggers subdomain path
3. **SPA routes**: Standard React Router path matching

## Application Routes

| Route | Component | Auth | Purpose |
|-------|-----------|------|---------|
| `/` | `Landing` | Public | Template showcase landing page |
| `/privacy` | `Privacy` | Public | Privacy policy |
| `/login` | `Login` | Public | Email/password authentication |
| `/client/dashboard` | `ClientDashboard` | Client | Client workspace |
| `/testing567` | `ClientDashboardTesting` | Client | Testing dashboard (shows hidden templates) |
| `/edits` | `Edits` | Auth | Invitation editor |
| `/client/live-preview` | `ClientLivePreview` | — | Live preview iframe (no auth shell) |
| `/admin/dashboard` | `AdminDashboard` | Admin | Admin order management |
| `/dashboard` | Redirect → `/` | — | Legacy redirect |
| `/create` | `Create` | Public | Original creation flow |
| `/preview/:id` | `Preview` | Public | Invitation preview |
| `/invite/:slug` | `PublicInvite` | Public | Public invite wrapper |

## Active Template Preview Routes

| Route | Component | Template |
|-------|-----------|----------|
| `/embroidered-garden` | `EmbroideredGardenPreview` | Embroidered Garden |
| `/secret-garden` | `SecretGardenPreview` | Secret Garden |
| `/majestic` | `MajesticPreview` | Majestic |
| `/bloom` | `BloomPreview` | Bloom |
| `/the-artful-love-story` | `ArtfulLoveStoryPreview` | The Artful Love Story |
| `/a-timeless-union` | `ATimelessUnionPreview` | A Timeless Union |
| `/arjunbhavana` | `ATimelessUnion` | A Timeless Union (named) |
| `/mandap-at-dusk` | `MandapAtDuskPreview` | Mandap at Dusk |
| `/templates/a-timeless-union/celebrations` | `CelebrationsEmbed` | Celebrations carousel |

## Testing Template Routes

| Route | Component |
|-------|-----------|
| `/maroon-letter` | `MaroonLetter` |
| `/emerald-parchment` | `EmeraldParchment` |
| `/royal-jodhpur` | `ShaadiPathT02` |
| `/destination-wedding` | `DestinationWedding` |
| `/raabta` | `Raabta` |
| `/qubool` | `Qubool` |

## Future Routes

| Route | Component |
|-------|-----------|
| `/birthday` | `BirthdayInvite` |
| `/housewarming` | `HousewarmingInvite` |

## Deprecated Template Routes

| Route | Component | Original Name |
|-------|-----------|---------------|
| `/blossom-and-oud` | `Design4` | Design 4 |
| `/noor` | `Design8` | Design 8 |
| `/sunehri` | `Design9` | Design 9 |
| `/yasmin` | `Design10` | Design 10 |
| `/maitri` | `Design11` | Design 11 |
| `/kiran` | `Design12` | Design 12 |
| `/ivory-arch` | `Design15` | Design 15 |
| `/sacred-mandap` | `Design16` | Design 16 |
| `/gulabi-mandap` | `Design17` | Design 17 |
| `/royal-grace` | `MohadRahma` | Royal Grace alias |
| `/mohadrahma` | `MohadRahma` | Royal Grace named |
| `/mohadrahm` | Redirect → `/mohadrahma` | Typo redirect |

## Dynamic Routes

| Pattern | Component | Purpose |
|---------|-----------|---------|
| `/:orderNumber/:slug` | `GeneratedInvitation` | Published order invitation |
| `/:slug` | `SingleSegmentRoute` | Either order management or invitation |

`SingleSegmentRoute` checks if the slug matches `^\d+-[A-Za-z0-9_-]{16}$` — if so, it's an `OrderManagement` link; otherwise a `GeneratedInvitation`.

## Subdomain Routing

```
*.shaadiinvites.in (not www) → SubdomainResolver
  → resolve_subdomain RPC
    → 'store' → StoreLanding
    → 'invitation' → GeneratedInvitation
```

Session cache: `sessionStorage` key `si:subdomain:{slug}` caches resolution result.

## Redirects (vercel.json)

| Source | Destination | Type |
|--------|-------------|------|
| `/design14` | `/arjunbhavana` | 301 Permanent |
| `/arjunbhavana` | `/arjunbhavana.html` | Rewrite |
| `/*` | `/index.html` | Rewrite (SPA fallback) |

## Vite Dev Server Middleware

- `/design14` → 301 redirect to `/arjunbhavana`
- `/arjunbhavana` → rewrite to `/arjunbhavana.html`

## Auth Guards

`DashboardAccess` component:
- Checks Supabase auth session
- For `CLIENT`: Verifies user email matches a company
- For `ADMIN`: Verifies `app_metadata.role === 'ADMIN'`
- Unauthorized → redirect to `/login`

## Desktop Invitation Viewport

`main.tsx` pre-React check:
- `window.self === window.top` (not already in iframe)
- `min-width: 768px` (desktop)
- `isPublicInvitationRoute()` — excludes: `/`, app routes, management links, celebrations embed
- Excluded: subdomain routes (resolved inside React)
- Creates portrait iframe at 9:16 ratio with ivory surround
