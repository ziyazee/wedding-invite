# Routes

Source: `src/App.tsx` — React Router v6 with `lazySitePage()` for lazy-loaded site pages with shared Google Fonts.

## Route Resolution Order

1. **Subdomain check**: `*.shaadiinvites.in` (not `www`) → `SubdomainResolver` (resolves via RPC to store or invitation)
2. **Query param fallback**: `?invite=slug` also triggers subdomain path
3. **SPA routes**: Standard React Router matching below

## Application Routes

| Route | Component | Auth | Purpose |
|-------|-----------|------|---------|
| `/` | `Landing` | Public | Template showcase landing page |
| `/privacy` | `Privacy` | Public | Privacy policy |
| `/login` | `Login` | Public | Email/password authentication |
| `/account/setup` | `AccountSetup` | Auth | New account onboarding |
| `/client/dashboard` | `ClientDashboard` | Client | **Client workspace (4 tabs)** |
| `/testing567` | `ClientDashboardTesting` | Client | Testing dashboard (shows hidden templates) |
| `/edits` | `Edits` | Auth | Invitation editor |
| `/client/live-preview` | `ClientLivePreview` | — | Live preview iframe (no auth shell) |
| `/admin/dashboard` | `AdminDashboard` | Admin | Admin order management |
| `/dashboard` | Redirect → `/` | — | Legacy redirect |
| `/create` | `Create` | Public | Original creation flow |
| `/preview/:id` | `Preview` | Public | Invitation preview |
| `/invite/:slug` | `PublicInvite` | Public | Public invite wrapper |

## Active Template Preview Routes

| Route | Component |
|-------|-----------|
| `/embroidered-garden` | `EmbroideredGardenPreview` |
| `/secret-garden` | `SecretGardenPreview` |
| `/majestic` | `MajesticPreview` |
| `/bloom` | `BloomPreview` |
| `/the-artful-love-story` | `ArtfulLoveStoryPreview` |
| `/a-timeless-union` | `ATimelessUnionPreview` |
| `/arjunbhavana` | `ATimelessUnion` (named) |
| `/mandap-at-dusk` | `MandapAtDuskPreview` |
| `/mahal` | `Mahal` |
| `/tajmahal` | `Tajmahal` |
| `/kerala` | `Kerala` |
| `/templates/a-timeless-union/celebrations` | `CelebrationsEmbed` |

## Testing Template Routes

| Route | Component |
|-------|-----------|
| `/maroon-letter` | `MaroonLetter` |
| `/emerald-parchment` | `EmeraldParchment` |
| `/royal-jodhpur` | `ShaadiPathT02` |
| `/destination-wedding` | `DestinationWedding` |
| `/raabta` | `Raabta` |
| `/qubool` | `Qubool` |
| `/mangal` | `Mangal` |
| `/viah` | `Viah` |

## Experimental Routes

| Route | Component |
|-------|-----------|
| `/experimental/punjabi-premium` | `PunjabiPremium` |
| `/experimental/kerala-dawn` | `KeralaDawn` |
| `/experimental/taj` | `Taj` |
| `/experimental/jaipur-theme` | `JaipurTheme` |

## Deprecated Template Routes

| Route | Component |
|-------|-----------|
| `/blossom-and-oud` | `Design4` |
| `/noor` | `Design8` |
| `/sunehri` | `Design9` |
| `/yasmin` | `Design10` |
| `/maitri` | `Design11` |
| `/kiran` | `Design12` |
| `/ivory-arch` | `Design15` |
| `/sacred-mandap` | `Design16` |
| `/gulabi-mandap` | `Design17` |
| `/royal-grace` | `RoyalGrace` |

## Dynamic Routes

| Pattern | Component | Purpose |
|---------|-----------|---------|
| `/:orderNumber/:slug` | `GeneratedInvitation` | Published order invitation |
| `/:slug` | `SingleSegmentRoute` | Order management (if matching `^\d+-[A-Za-z0-9_-]{16}$`) or invitation |

## Subdomain Routing

```
*.shaadiinvites.in (not www) → SubdomainResolver
  → resolve_subdomain RPC
    → 'store' → StoreLanding
    → 'invitation' → GeneratedInvitation
  /preview → CompanyPreview
```

## Auth Guards

`DashboardAccess` component (used by `/client/dashboard` and `/admin/dashboard`):
- Checks Supabase auth session
- CLIENT: Verifies user email matches a company
- ADMIN: Verifies `app_metadata.role === 'ADMIN'`
- Unauthorized → redirect to `/login`

## Router Config (full source)
```tsx
// src/App.tsx
export default function App() {
  const { pathname } = useLocation()
  const invitationRoute = pathname === '/client/live-preview' || (
    pathname !== '/' &&
    !/^\/(?:client|admin|login|account|dashboard|create|newDesign|testing567|edits|privacy|experimental)(?:\/|$)/.test(pathname) &&
    !/^\/(?:test-)?\d+-[A-Za-z0-9_-]{16}\/?$/.test(pathname)
  )
  const inviteSlug = pathname === '/client/live-preview' ? null : getInviteSlug()
  if (inviteSlug) {
    return <InvitationViewport><Suspense fallback={<InvitationLoading />}>
      <SubdomainResolver slug={inviteSlug} />
    </Suspense></InvitationViewport>
  }
  return (
    <InvitationViewport><Suspense fallback={invitationRoute ? <InvitationLoading /> : null}>
    <InvitationLoadingBoundary key={pathname} enabled={invitationRoute && pathname !== '/client/live-preview'}><Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/login" element={<Login />} />
      <Route path="/account/setup" element={<AccountSetup />} />
      <Route path="/client/dashboard" element={<ClientDashboard />} />
      <Route path="/testing567" element={<ClientDashboardTesting />} />
      <Route path="/edits" element={<Edits />} />
      <Route path="/client/live-preview" element={<ClientLivePreview />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/dashboard" element={<Navigate to="/" replace />} />
      <Route path="/create" element={<Create />} />
      <Route path="/preview/:id" element={<Preview />} />
      <Route path="/invite/:slug" element={<PublicInvite />} />
      {/* Active templates */}
      <Route path="/embroidered-garden" element={<EmbroideredGardenPreview />} />
      <Route path="/secret-garden" element={<SecretGardenPreview />} />
      <Route path="/majestic" element={<MajesticPreview />} />
      <Route path="/bloom" element={<BloomPreview />} />
      <Route path="/the-artful-love-story" element={<ArtfulLoveStoryPreview />} />
      <Route path="/templates/a-timeless-union/celebrations" element={<CelebrationsEmbed />} />
      <Route path="/arjunbhavana" element={<ATimelessUnion />} />
      <Route path="/a-timeless-union" element={<ATimelessUnionPreview />} />
      <Route path="/mandap-at-dusk" element={<MandapAtDuskPreview />} />
      <Route path="/mahal" element={<Mahal />} />
      <Route path="/tajmahal" element={<Tajmahal />} />
      <Route path="/kerala" element={<Kerala />} />
      {/* Testing, deprecated, dynamic routes... */}
      <Route path="/:orderNumber/:slug" element={<GeneratedInvitation />} />
      <Route path="/:slug" element={<SingleSegmentRoute />} />
    </Routes></InvitationLoadingBoundary></Suspense></InvitationViewport>
  )
}
```
